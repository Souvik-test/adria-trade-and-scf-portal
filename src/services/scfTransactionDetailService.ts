import { supabase } from '@/integrations/supabase/client';

export const fetchInvoiceDetails = async (invoiceNumber: string) => {
  try {
    // Use security definer RPC to bypass RLS for custom auth users
    const { data, error } = await supabase
      .rpc('get_invoice_by_number', { p_invoice_number: invoiceNumber });

    if (error) throw error;
    
    // RPC returns array, get first item
    const invoice = Array.isArray(data) && data.length > 0 ? data[0] : null;
    return invoice;
  } catch (error) {
    console.error('Error fetching invoice details:', error);
    throw error;
  }
};

export const fetchDisbursementDetails = async (loanReference: string) => {
  try {
    // Use security definer RPC to bypass RLS for custom auth users
    const { data, error } = await supabase
      .rpc('get_disbursement_by_loan_ref', { p_loan_reference: loanReference });

    if (error) throw error;
    
    // RPC returns array, get first item
    const disbursement = Array.isArray(data) && data.length > 0 ? data[0] : null;
    
    if (!disbursement) return null;

    // Map the flattened RPC response to the expected structure
    return {
      id: disbursement.id,
      scf_invoice_id: disbursement.scf_invoice_id,
      program_id: disbursement.program_id,
      loan_reference: disbursement.loan_reference,
      disbursed_amount: disbursement.disbursed_amount,
      finance_percentage: disbursement.finance_percentage,
      disbursement_status: disbursement.disbursement_status,
      disbursed_at: disbursement.disbursed_at,
      accounting_entry_ref: disbursement.accounting_entry_ref,
      created_at: disbursement.created_at,
      invoice: {
        invoice_number: disbursement.invoice_number,
        currency: disbursement.invoice_currency,
        total_amount: disbursement.invoice_total_amount,
        due_date: disbursement.invoice_due_date,
        buyer_id: disbursement.invoice_buyer_id,
        buyer_name: disbursement.invoice_buyer_name,
        seller_id: disbursement.invoice_seller_id,
        seller_name: disbursement.invoice_seller_name,
      },
      program: {
        program_name: disbursement.program_name,
      },
    };
  } catch (error) {
    console.error('Error fetching disbursement details:', error);
    throw error;
  }
};

export const fetchRepaymentDetails = async (repaymentReference: string) => {
  try {
    // Use security definer RPC to bypass RLS for custom auth users
    const { data, error } = await supabase
      .rpc('get_repayment_by_ref', { p_repayment_reference: repaymentReference });

    if (error) throw error;
    
    // RPC returns array, get first item
    const repayment = Array.isArray(data) && data.length > 0 ? data[0] : null;
    
    if (!repayment) return null;

    // Map the flattened RPC response to the expected structure
    return {
      id: repayment.id,
      scf_invoice_id: repayment.scf_invoice_id,
      program_id: repayment.program_id,
      loan_reference: repayment.loan_reference,
      repayment_reference: repayment.repayment_reference,
      repayment_amount: repayment.repayment_amount,
      principal_amount: repayment.principal_amount,
      interest_amount: repayment.interest_amount,
      penalty_amount: repayment.penalty_amount,
      repayment_date: repayment.repayment_date,
      repayment_status: repayment.repayment_status,
      repayment_mode: repayment.repayment_mode,
      currency: repayment.currency,
      accounting_entry_ref: repayment.accounting_entry_ref,
      remarks: repayment.remarks,
      created_at: repayment.created_at,
      invoice: {
        invoice_number: repayment.invoice_number,
        total_amount: repayment.invoice_total_amount,
        due_date: repayment.invoice_due_date,
      },
      program: {
        program_name: repayment.program_name,
      },
    };
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
