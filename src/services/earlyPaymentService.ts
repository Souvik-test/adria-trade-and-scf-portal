import { supabase } from '@/integrations/supabase/client';

export interface EarlyPaymentInvoice {
  id: string;
  invoice_number: string;
  original_amount: number;
  due_date: string;
  currency: string;
  program_id: string;
}

export interface EarlyPaymentCalculation {
  invoice: EarlyPaymentInvoice;
  discount_percentage: number;
  discounted_amount: number;
  savings: number;
}

export const fetchProgramDiscountRate = async (programId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('scf_program_configurations')
    .select('default_discount_percentage')
    .eq('program_id', programId)
    .single();

  if (error) {
    console.error('Error fetching discount rate:', error);
    throw new Error(`Failed to fetch program discount rate: ${error.message}`);
  }

  return data?.default_discount_percentage || 0;
};

export const calculateEarlyPaymentSavings = (
  invoices: EarlyPaymentInvoice[],
  discountRate: number
): EarlyPaymentCalculation[] => {
  return invoices.map(invoice => {
    const savings = (invoice.original_amount * discountRate) / 100;
    const discounted_amount = invoice.original_amount - savings;

    return {
      invoice,
      discount_percentage: discountRate,
      discounted_amount,
      savings,
    };
  });
};

export const submitEarlyPaymentRequest = async (
  userId: string,
  programId: string,
  invoices: EarlyPaymentInvoice[],
  discountPercentage: number,
  totalOriginalAmount: number,
  totalDiscountedAmount: number,
  totalSavings: number,
  currency: string,
  estimatedPaymentDate: Date | null,
  remarks: string
) => {
  const { data, error } = await supabase
    .from('early_payment_requests')
    .insert({
      user_id: userId,
      program_id: programId,
      invoice_ids: invoices.map(inv => inv.id),
      total_original_amount: totalOriginalAmount,
      discount_percentage: discountPercentage,
      total_discounted_amount: totalDiscountedAmount,
      total_savings: totalSavings,
      currency,
      estimated_payment_date: estimatedPaymentDate ? estimatedPaymentDate.toISOString().split('T')[0] : null,
      remarks,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error submitting early payment request:', error);
    throw new Error(`Failed to submit early payment request: ${error.message}`);
  }

  return data;
};

export const fetchEarlyPaymentRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from('early_payment_requests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching early payment requests:', error);
    throw new Error(`Failed to fetch early payment requests: ${error.message}`);
  }

  return data;
};

export const updateEarlyPaymentStatus = async (requestId: string, status: string) => {
  const { data, error } = await supabase
    .from('early_payment_requests')
    .update({ status })
    .eq('id', requestId)
    .select()
    .single();

  if (error) {
    console.error('Error updating early payment status:', error);
    throw new Error(`Failed to update early payment status: ${error.message}`);
  }

  return data;
};
