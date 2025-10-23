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
    // Fetch disbursement
    const { data: disbursement, error } = await supabase
      .from('invoice_disbursements')
      .select('*')
      .eq('loan_reference', loanReference)
      .maybeSingle();

    if (error) throw error;
    if (!disbursement) return null;

    // Fetch related invoice
    const { data: invoice } = await supabase
      .from('scf_invoices')
      .select('*')
      .eq('id', disbursement.scf_invoice_id)
      .maybeSingle();

    // Fetch related program
    const { data: program } = await supabase
      .from('scf_program_configurations')
      .select('*')
      .eq('program_id', disbursement.program_id)
      .maybeSingle();

    return {
      ...disbursement,
      invoice,
      program,
    };
  } catch (error) {
    console.error('Error fetching disbursement details:', error);
    throw error;
  }
};

export const fetchRepaymentDetails = async (repaymentReference: string) => {
  try {
    // Fetch repayment
    const { data: repayment, error } = await supabase
      .from('invoice_repayments')
      .select('*')
      .eq('repayment_reference', repaymentReference)
      .maybeSingle();

    if (error) throw error;
    if (!repayment) return null;

    // Fetch related invoice
    const { data: invoice } = await supabase
      .from('scf_invoices')
      .select('*')
      .eq('id', repayment.scf_invoice_id)
      .maybeSingle();

    // Fetch related program
    const { data: program } = await supabase
      .from('scf_program_configurations')
      .select('*')
      .eq('program_id', repayment.program_id)
      .maybeSingle();

    return {
      ...repayment,
      invoice,
      program,
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
