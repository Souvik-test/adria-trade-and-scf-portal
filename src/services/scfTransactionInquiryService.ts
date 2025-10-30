import { supabase } from '@/integrations/supabase/client';
import { SCFTransactionRow, TransactionFilters, FinanceEligibility } from '@/types/scfTransaction';
import { format, subMonths } from 'date-fns';

export const fetchSCFTransactions = async (
  filters: TransactionFilters
): Promise<SCFTransactionRow[]> => {
  try {
    const transactions: SCFTransactionRow[] = [];

    // Set default date range to last 6 months if no dates provided
    const fromDate = filters.fromDate || format(subMonths(new Date(), 6), 'yyyy-MM-dd');
    const toDate = filters.toDate || format(new Date(), 'yyyy-MM-dd');

    // Fetch invoices (Invoice, Credit Note, Debit Note)
    let invoiceQuery = supabase
      .from('scf_invoices')
      .select('*')
      .gte('invoice_date', fromDate)
      .lte('invoice_date', toDate);

    // Wildcard search across multiple columns
    if (filters.wildcardSearch && filters.wildcardSearch.trim() !== '') {
      const searchTerm = `%${filters.wildcardSearch}%`;
      invoiceQuery = invoiceQuery.or(`invoice_number.ilike.${searchTerm},program_id.ilike.${searchTerm},program_name.ilike.${searchTerm},buyer_name.ilike.${searchTerm},seller_name.ilike.${searchTerm},status.ilike.${searchTerm}`);
    } else {
      // Apply individual filters only if wildcardSearch is empty
      if (filters.programId) invoiceQuery = invoiceQuery.eq('program_id', filters.programId);
      if (filters.programName) invoiceQuery = invoiceQuery.ilike('program_name', `%${filters.programName}%`);
      if (filters.transactionReference) {
        invoiceQuery = invoiceQuery.ilike('invoice_number', `%${filters.transactionReference}%`);
      }
      if (filters.productType) {
        invoiceQuery = invoiceQuery.eq('invoice_type', filters.productType);
      }
      if (filters.status) {
        invoiceQuery = invoiceQuery.eq('status', filters.status);
      }
      if (filters.anchorId) invoiceQuery = invoiceQuery.eq('buyer_id', filters.anchorId);
      if (filters.anchorName) invoiceQuery = invoiceQuery.ilike('buyer_name', `%${filters.anchorName}%`);
      if (filters.counterPartyId) invoiceQuery = invoiceQuery.eq('seller_id', filters.counterPartyId);
      if (filters.counterPartyName) invoiceQuery = invoiceQuery.ilike('seller_name', `%${filters.counterPartyName}%`);
      if (filters.currency) invoiceQuery = invoiceQuery.eq('currency', filters.currency);
      if (filters.minAmount) invoiceQuery = invoiceQuery.gte('total_amount', filters.minAmount);
      if (filters.maxAmount) invoiceQuery = invoiceQuery.lte('total_amount', filters.maxAmount);
    }

    const { data: invoices, error: invoiceError } = await invoiceQuery;
    if (invoiceError) throw invoiceError;

    // Collect invoice IDs for fetching related disbursements/repayments
    const invoiceIds = (invoices || []).map(inv => inv.id);

    // Fetch ALL disbursements related to the found invoices (ignore date filters for related records)
    let disbursementQuery = supabase
      .from('invoice_disbursements')
      .select('*, scf_invoices!inner(*)');

    // If we have invoices, fetch their disbursements OR fetch by explicit filters
    if (invoiceIds.length > 0) {
      disbursementQuery = disbursementQuery.or(
        `scf_invoice_id.in.(${invoiceIds.join(',')}),and(disbursed_at.gte.${fromDate},disbursed_at.lte.${toDate})`
      );
    } else {
      disbursementQuery = disbursementQuery
        .gte('disbursed_at', fromDate)
        .lte('disbursed_at', toDate);
    }

    if (filters.programId) disbursementQuery = disbursementQuery.eq('program_id', filters.programId);
    if (filters.transactionReference) {
      disbursementQuery = disbursementQuery.ilike('loan_reference', `%${filters.transactionReference}%`);
    }

    const { data: disbursements, error: disbursementError } = await disbursementQuery;
    if (disbursementError) throw disbursementError;

    // Fetch ALL repayments related to the found invoices (ignore date filters for related records)
    let repaymentQuery = supabase
      .from('invoice_repayments')
      .select('*, scf_invoices!inner(*)');

    if (invoiceIds.length > 0) {
      repaymentQuery = repaymentQuery.or(
        `scf_invoice_id.in.(${invoiceIds.join(',')}),and(repayment_date.gte.${fromDate},repayment_date.lte.${toDate})`
      );
    } else {
      repaymentQuery = repaymentQuery
        .gte('repayment_date', fromDate)
        .lte('repayment_date', toDate);
    }

    if (filters.programId) repaymentQuery = repaymentQuery.eq('program_id', filters.programId);
    if (filters.transactionReference) {
      repaymentQuery = repaymentQuery.ilike('repayment_reference', `%${filters.transactionReference}%`);
    }

    const { data: repayments, error: repaymentError } = await repaymentQuery;
    if (repaymentError) throw repaymentError;

    // Fetch all unique program IDs
    const programIds = new Set<string>();
    invoices?.forEach(inv => programIds.add(inv.program_id));
    disbursements?.forEach(dis => programIds.add(dis.program_id));
    repayments?.forEach(rep => programIds.add(rep.program_id));

    // Fetch program configurations
    const { data: programs } = await supabase
      .from('scf_program_configurations')
      .select('*')
      .in('program_id', Array.from(programIds));

    const programMap = new Map(programs?.map(p => [p.program_id, p]) || []);

    // Transform invoices to transaction rows
    if (invoices) {
      for (const invoice of invoices) {
        const program = programMap.get(invoice.program_id);
        
        // Determine counter party based on anchor role
        let counterPartyId = '';
        let counterPartyName = '';
        
        if (program?.counter_parties && Array.isArray(program.counter_parties) && program.counter_parties.length > 0) {
          const counterParty = program.counter_parties[0] as any;
          counterPartyId = counterParty.counter_party_id || '';
          counterPartyName = counterParty.counter_party_name || '';
        }

        // Calculate finance eligibility
        const eligibility = await calculateFinanceEligibility(invoice, program);

        // Find related disbursements
        const relatedDisbursements = (disbursements || [])
          .filter(d => d.scf_invoice_id === invoice.id)
          .map(d => d.loan_reference);

        // Find related repayments
        const relatedRepayments = (repayments || [])
          .filter(r => r.scf_invoice_id === invoice.id)
          .map(r => r.repayment_reference);

        transactions.push({
          id: invoice.id,
          productType: invoice.invoice_type as any,
          transactionReference: invoice.invoice_number,
          programId: invoice.program_id,
          programName: invoice.program_name,
          anchorId: program?.anchor_id || '',
          anchorName: program?.anchor_name || '',
          counterPartyId,
          counterPartyName,
          transactionDate: invoice.invoice_date || '',
          dueDate: invoice.due_date || null,
          currency: invoice.currency || 'USD',
          amount: Number(invoice.total_amount) || 0,
          financeEligible: eligibility.eligible,
          financeEligibleReason: eligibility.reason,
          relatedTransactionRefs: [...relatedDisbursements, ...relatedRepayments],
          status: invoice.status || 'draft',
          rawData: { 
            ...invoice,
            early_payment_discount_enabled: program?.early_payment_discount_enabled || false,
            default_discount_percentage: program?.default_discount_percentage || 0
          },
        });
      }
    }

    // Transform disbursements to transaction rows
    if (disbursements) {
      for (const disbursement of disbursements) {
        const invoice = disbursement.scf_invoices;
        const program = programMap.get(disbursement.program_id);

        let counterPartyId = '';
        let counterPartyName = '';
        
        if (program?.counter_parties && Array.isArray(program.counter_parties) && program.counter_parties.length > 0) {
          const counterParty = program.counter_parties[0] as any;
          counterPartyId = counterParty.counter_party_id || '';
          counterPartyName = counterParty.counter_party_name || '';
        }

        // Calculate due date (disbursed_at + tenor)
        const dueDate = invoice?.due_date || null;

        transactions.push({
          id: disbursement.id,
          productType: 'Finance Disbursement',
          transactionReference: disbursement.loan_reference,
          programId: disbursement.program_id,
          programName: program?.program_name || '',
          anchorId: program?.anchor_id || '',
          anchorName: program?.anchor_name || '',
          counterPartyId,
          counterPartyName,
          transactionDate: disbursement.disbursed_at ? format(new Date(disbursement.disbursed_at), 'yyyy-MM-dd') : '',
          dueDate,
          currency: invoice?.currency || 'USD',
          amount: Number(disbursement.disbursed_amount) || 0,
          financeEligible: false,
          relatedTransactionRefs: [invoice?.invoice_number || ''],
          status: disbursement.disbursement_status || 'pending',
          rawData: disbursement,
        });
      }
    }

    // Transform repayments to transaction rows
    if (repayments) {
      for (const repayment of repayments) {
        const invoice = repayment.scf_invoices;
        const program = programMap.get(repayment.program_id);

        let counterPartyId = '';
        let counterPartyName = '';
        
        if (program?.counter_parties && Array.isArray(program.counter_parties) && program.counter_parties.length > 0) {
          const counterParty = program.counter_parties[0] as any;
          counterPartyId = counterParty.counter_party_id || '';
          counterPartyName = counterParty.counter_party_name || '';
        }

        transactions.push({
          id: repayment.id,
          productType: 'Finance Repayment',
          transactionReference: repayment.repayment_reference,
          programId: repayment.program_id,
          programName: program?.program_name || '',
          anchorId: program?.anchor_id || '',
          anchorName: program?.anchor_name || '',
          counterPartyId,
          counterPartyName,
          transactionDate: repayment.repayment_date || '',
          dueDate: null,
          currency: repayment.currency || 'USD',
          amount: Number(repayment.repayment_amount) || 0,
          financeEligible: false,
          relatedTransactionRefs: [repayment.loan_reference, invoice?.invoice_number || ''],
          status: repayment.repayment_status || 'completed',
          rawData: repayment,
        });
      }
    }

    // Sort by transaction date descending
    transactions.sort((a, b) => {
      const dateA = new Date(a.transactionDate);
      const dateB = new Date(b.transactionDate);
      return dateB.getTime() - dateA.getTime();
    });

    return transactions;
  } catch (error) {
    console.error('Error fetching SCF transactions:', error);
    throw error;
  }
};

export const calculateFinanceEligibility = async (
  invoice: any,
  program: any
): Promise<FinanceEligibility> => {
  if (!invoice || !program) {
    return { eligible: false, reason: 'Missing invoice or program data' };
  }

  // Check if already financed
  if (invoice.status === 'Financed' || invoice.status === 'financed') {
    return { eligible: false, reason: 'Invoice already financed' };
  }

  // Check currency match
  if (invoice.currency !== program.program_currency) {
    return {
      eligible: false,
      reason: `Currency mismatch: Invoice ${invoice.currency} vs Program ${program.program_currency}`,
    };
  }

  // Check tenor range (calculate days between invoice_date and due_date)
  if (invoice.invoice_date && invoice.due_date) {
    const invoiceDate = new Date(invoice.invoice_date);
    const dueDate = new Date(invoice.due_date);
    const tenorDays = Math.ceil((dueDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));

    const minTenor = program.min_tenor || 0;
    const maxTenor = program.max_tenor || 999999;

    if (tenorDays < minTenor || tenorDays > maxTenor) {
      return {
        eligible: false,
        reason: `Tenor ${tenorDays} days outside program range (${minTenor}-${maxTenor} days)`,
      };
    }
  }

  // Check amount against limits
  const invoiceAmount = Number(invoice.total_amount) || 0;

  if (program.available_limit && invoiceAmount > program.available_limit) {
    return {
      eligible: false,
      reason: 'Amount exceeds program available limit',
    };
  }

  if (program.anchor_available_limit && invoiceAmount > program.anchor_available_limit) {
    return {
      eligible: false,
      reason: 'Amount exceeds anchor available limit',
    };
  }

  // Check counter party limit
  if (program.counter_parties && Array.isArray(program.counter_parties)) {
    const counterParty = program.counter_parties.find(
      (cp: any) => cp.counter_party_id === invoice.seller_id || cp.counter_party_id === invoice.buyer_id
    );

    if (counterParty?.available_limit && invoiceAmount > counterParty.available_limit) {
      return {
        eligible: false,
        reason: 'Amount exceeds counter party limit',
      };
    }
  }

  return { eligible: true };
};

export const exportToCSV = (transactions: SCFTransactionRow[]): void => {
  const headers = [
    'Product Type',
    'Transaction Reference',
    'Program ID',
    'Program Name',
    'Anchor ID',
    'Anchor Name',
    'Counter Party ID',
    'Counter Party Name',
    'Transaction Date',
    'Due Date',
    'Currency',
    'Amount',
    'Finance Eligible',
    'Related Transaction Refs',
    'Status',
  ];

  const rows = transactions.map(t => [
    t.productType,
    t.transactionReference,
    t.programId,
    t.programName,
    t.anchorId,
    t.anchorName,
    t.counterPartyId,
    t.counterPartyName,
    t.transactionDate,
    t.dueDate || '',
    t.currency,
    t.amount,
    t.financeEligible ? 'Yes' : 'No',
    t.relatedTransactionRefs.join('; '),
    t.status,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `SCF_Transactions_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToExcel = async (transactions: SCFTransactionRow[]): Promise<void> => {
  const XLSX = await import('xlsx');
  
  const worksheetData = transactions.map(t => ({
    'Product Type': t.productType,
    'Transaction Reference': t.transactionReference,
    'Program ID': t.programId,
    'Program Name': t.programName,
    'Anchor ID': t.anchorId,
    'Anchor Name': t.anchorName,
    'Counter Party ID': t.counterPartyId,
    'Counter Party Name': t.counterPartyName,
    'Transaction Date': t.transactionDate,
    'Due Date': t.dueDate || '',
    'Currency': t.currency,
    'Amount': t.amount,
    'Finance Eligible': t.financeEligible ? 'Yes' : 'No',
    'Related Transaction Refs': t.relatedTransactionRefs.join('; '),
    'Status': t.status,
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Transactions');

  XLSX.writeFile(workbook, `SCF_Transactions_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);
};
