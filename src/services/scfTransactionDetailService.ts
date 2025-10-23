import { supabase } from '@/integrations/supabase/client';

export const fetchInvoiceDetails = async (invoiceNumber: string) => {
  try {
    const { data, error } = await supabase
      .from('scf_invoices')
      .select('*')
      .eq('invoice_number', invoiceNumber)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching invoice details:', error);
    throw error;
  }
};

export const fetchDisbursementDetails = async (loanReference: string) => {
  try {
    const { data, error } = await supabase
      .from('invoice_disbursements')
      .select(`
        *,
        invoice:scf_invoices!invoice_disbursements_scf_invoice_id_fkey(*),
        program:scf_program_configurations!invoice_disbursements_program_id_fkey(*)
      `)
      .eq('loan_reference', loanReference)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching disbursement details:', error);
    throw error;
  }
};

export const fetchRepaymentDetails = async (repaymentReference: string) => {
  try {
    const { data, error } = await supabase
      .from('invoice_repayments')
      .select(`
        *,
        invoice:scf_invoices!invoice_repayments_scf_invoice_id_fkey(*),
        program:scf_program_configurations!invoice_repayments_program_id_fkey(*)
      `)
      .eq('repayment_reference', repaymentReference)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching repayment details:', error);
    throw error;
  }
};

export const determineReferenceType = (reference: string): 'invoice' | 'loan' | 'repayment' | 'unknown' => {
  if (reference.startsWith('LOAN-')) {
    return 'loan';
  }
  if (reference.startsWith('REPAY-')) {
    return 'repayment';
  }
  // Assume invoice if it doesn't match known patterns
  return 'invoice';
};
