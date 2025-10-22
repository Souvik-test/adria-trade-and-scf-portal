import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { 
  InvoiceUploadData, 
  ParsedInvoiceData, 
  UploadResult,
  RejectedRow 
} from '@/types/invoiceUpload';
import { validateAgainstProgram } from './invoiceValidationService';
import { processDisbursement } from './invoiceDisbursementService';

const parseDate = (dateStr: string): Date => {
  // Handle DD/MM/YYYY format
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  }
  return new Date(dateStr);
};

export const parseExcelFile = async (file: File): Promise<InvoiceUploadData[]> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet) as InvoiceUploadData[];
  
  return jsonData;
};

const mapToInvoiceData = (row: InvoiceUploadData): ParsedInvoiceData => {
  // Normalize invoice type to lowercase and default to 'invoice'
  const invoiceType = (row['Invoice Type'] || 'invoice').toLowerCase().trim();
  
  return {
    invoice_number: row['Invoice No.'],
    invoice_type: invoiceType,
    currency: row['Currency'],
    total_amount: Number(row['Amount']),
    invoice_date: parseDate(row['Invoice Date']),
    due_date: parseDate(row['Due Date']),
    program_id: row['Program ID'],
    program_name: row['Program Name'],
    buyer_id: row['Buyer ID'],
    buyer_name: row['Buyer Name'],
    seller_id: row['Seller ID'],
    seller_name: row['Seller Name']
  };
};

export const processUpload = async (
  file: File,
  userId: string
): Promise<UploadResult> => {
  // Parse Excel file
  const rawData = await parseExcelFile(file);
  
  // Validate row count - always check 100 row limit
  if (rawData.length > 100) {
    throw new Error('Upload cannot exceed 100 rows');
  }

  // Create batch record
  const { data: batch, error: batchError } = await supabase
    .from('invoice_upload_batches')
    .insert({
      user_id: userId,
      upload_type: 'bulk',
      total_rows: rawData.length,
      status: 'processing'
    })
    .select()
    .single();

  if (batchError || !batch) {
    console.error('Batch creation error:', batchError);
    throw new Error(`Failed to create upload batch: ${batchError?.message || 'Unknown database error'}`);
  }

  const successfulInvoices: any[] = [];
  const rejections: RejectedRow[] = [];
  const disbursements: any[] = [];

  // Process each row
  for (let i = 0; i < rawData.length; i++) {
    const row = rawData[i];
    const rowNumber = i + 2; // Excel row number (accounting for header)

    try {
      // Enhanced basic validation
      if (!row['Invoice No.'] || 
          !row['Amount'] || 
          !row['Program ID'] ||
          !row['Program Name'] ||
          !row['Invoice Date'] ||
          !row['Due Date']) {
        rejections.push({
          id: crypto.randomUUID(),
          batch_id: batch.id,
          row_number: rowNumber,
          invoice_number: row['Invoice No.'] || 'N/A',
          rejection_reason: 'Missing required fields (Invoice No., Amount, Program ID, Program Name, Invoice Date, Due Date)',
          raw_data: row
        });
        continue;
      }

      // Validate invoice type
      const validInvoiceTypes = ['invoice', 'credit-note', 'debit-note'];
      const invoiceType = (row['Invoice Type'] || 'invoice').toLowerCase().trim();
      if (!validInvoiceTypes.includes(invoiceType)) {
        rejections.push({
          id: crypto.randomUUID(),
          batch_id: batch.id,
          row_number: rowNumber,
          invoice_number: row['Invoice No.'],
          rejection_reason: `Invalid Invoice Type "${row['Invoice Type']}" - Must be one of: invoice, credit-note, debit-note`,
          raw_data: row
        });
        continue;
      }

      // Map to invoice data
      const invoiceData = mapToInvoiceData(row);

      // Validate against program
      const validation = await validateAgainstProgram(invoiceData);

      if (!validation.valid) {
        rejections.push({
          id: crypto.randomUUID(),
          batch_id: batch.id,
          row_number: rowNumber,
          invoice_number: invoiceData.invoice_number,
          rejection_reason: validation.reason || 'Validation failed',
          raw_data: row
        });
        continue;
      }

      // Create invoice record
      const { data: invoice, error: invoiceError } = await supabase
        .from('scf_invoices')
        .insert({
          user_id: userId,
          invoice_type: invoiceData.invoice_type,
          program_id: invoiceData.program_id,
          program_name: invoiceData.program_name,
          invoice_number: invoiceData.invoice_number,
          currency: invoiceData.currency,
          total_amount: invoiceData.total_amount,
          invoice_date: invoiceData.invoice_date.toISOString(),
          due_date: invoiceData.due_date.toISOString(),
          buyer_name: invoiceData.buyer_name,
          buyer_id: invoiceData.buyer_id,
          seller_name: invoiceData.seller_name,
          seller_id: invoiceData.seller_id,
          status: 'submitted'
        })
        .select()
        .single();

      if (invoiceError || !invoice) {
        rejections.push({
          id: crypto.randomUUID(),
          batch_id: batch.id,
          row_number: rowNumber,
          invoice_number: invoiceData.invoice_number,
          rejection_reason: `Database Error - ${invoiceError?.message || 'Unknown'}`,
          raw_data: row
        });
        continue;
      }

      successfulInvoices.push(invoice);

      // Check for auto-disbursement
      const { data: program } = await supabase
        .from('scf_program_configurations')
        .select('auto_disbursement')
        .eq('program_id', validation.program_id)
        .single();

      if (program?.auto_disbursement) {
        const disbursementResult = await processDisbursement(
          invoice.id,
          validation.program_id!,
          invoiceData.total_amount,
          validation.finance_percentage!,
          true
        );

        if (disbursementResult.status === 'completed' && disbursementResult.disbursement) {
          disbursements.push(disbursementResult.disbursement);
          
          // Update invoice status to 'financed' after successful disbursement
          await supabase
            .from('scf_invoices')
            .update({ status: 'financed' })
            .eq('id', invoice.id);
        }
      }
    } catch (error) {
      rejections.push({
        id: crypto.randomUUID(),
        batch_id: batch.id,
        row_number: rowNumber,
        invoice_number: row['Invoice No.'] || 'N/A',
        rejection_reason: `Processing Error - ${error instanceof Error ? error.message : 'Unknown'}`,
        raw_data: row
      });
    }
  }

  // Save rejections to database
  if (rejections.length > 0) {
    await supabase.from('invoice_upload_rejections').insert(rejections);
  }

  // Update batch status
  await supabase
    .from('invoice_upload_batches')
    .update({
      successful_rows: successfulInvoices.length,
      rejected_rows: rejections.length,
      status: 'completed'
    })
    .eq('id', batch.id);

  return {
    batch: {
      ...batch,
      successful_rows: successfulInvoices.length,
      rejected_rows: rejections.length,
      status: 'completed' as const,
      upload_type: 'bulk'
    },
    invoices: successfulInvoices,
    rejections,
    disbursements
  };
};

export const generateRejectionReport = (rejections: RejectedRow[]): void => {
  const data = rejections.map(r => ({
    'Row Number': r.row_number,
    'Invoice No.': r.invoice_number,
    ...r.raw_data,
    'Rejection Reason': r.rejection_reason
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Rejected Invoices');

  const fileName = `Invoice_Rejection_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
