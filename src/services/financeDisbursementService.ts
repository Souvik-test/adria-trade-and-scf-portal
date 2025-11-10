import { supabase } from '@/integrations/supabase/client';

export interface EligibleInvoice {
  id: string;
  invoice_number: string;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  seller_name: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  currency: string;
  status: string;
  disbursed_amount?: number;
  remaining_finance_amount?: number;
  disbursement_count?: number;
  is_fully_financed?: boolean;
}

export interface FinanceDisbursementData {
  programId: string;
  programName: string;
  productCode: string;
  productName: string;
  selectedInvoices: Array<{
    invoice_id: string;
    invoice_number: string;
    amount: number;
    currency: string;
    due_date: string;
  }>;
  invoiceCurrency: string;
  financeDate: Date;
  financeCurrency: string;
  exchangeRate?: number;
  financeAmount: number;
  financeTenorDays: number;
  financeDueDate: Date;
  interestRateType: 'manual' | 'reference_rate';
  interestRate: number;
  referenceRateCode?: string;
  referenceRateMargin?: number;
  interestAmount: number;
  totalRepaymentAmount: number;
  autoRepaymentEnabled: boolean;
  repaymentMode: 'auto' | 'manual';
  repaymentParty: string;
  repaymentAccount?: string;
  accountingEntries: Array<{
    entryType: 'Dr' | 'Cr';
    account: string;
    glCode: string;
    amount: number;
  }>;
  accountingReference: string;
}

/**
 * Fetch eligible invoices for finance disbursement with multiple disbursement support
 */
export const fetchEligibleInvoices = async (
  programId: string
): Promise<EligibleInvoice[]> => {
  // Get program config for multiple disbursement check
  const { data: programData } = await supabase
    .from('scf_program_configurations')
    .select('multiple_disbursement, max_disbursements_allowed, finance_percentage')
    .eq('program_id', programId)
    .maybeSingle();

  const multipleDisbursementAllowed = programData?.multiple_disbursement || false;
  const maxDisbursements = programData?.max_disbursements_allowed || 1;
  const financePercentage = programData?.finance_percentage || 100;

  // Fetch eligible invoices
  const { data, error } = await supabase
    .from('scf_invoices')
    .select('*')
    .eq('program_id', programId)
    .in('status', ['submitted', 'lodged'])
    .gte('due_date', new Date().toISOString())
    .order('due_date', { ascending: true });

  if (error) {
    console.error('Error fetching eligible invoices:', error);
    throw new Error('Failed to fetch eligible invoices');
  }

  const invoiceIds = (data || []).map(inv => inv.id);

  if (invoiceIds.length === 0) {
    return [];
  }

  // Get all disbursements for these invoices
  const { data: existingDisbursements } = await supabase
    .from('invoice_disbursements')
    .select('scf_invoice_id, disbursed_amount, disbursement_status')
    .in('scf_invoice_id', invoiceIds);

  // Calculate disbursed amounts and counts per invoice
  const disbursementMap = new Map();
  (existingDisbursements || []).forEach(d => {
    if (!disbursementMap.has(d.scf_invoice_id)) {
      disbursementMap.set(d.scf_invoice_id, { totalDisbursed: 0, count: 0 });
    }
    const current = disbursementMap.get(d.scf_invoice_id);
    if (d.disbursement_status === 'completed' || d.disbursement_status === 'pending') {
      current.totalDisbursed += Number(d.disbursed_amount);
      current.count += 1;
    }
  });

  // Filter and transform invoices
  return (data || [])
    .map(invoice => {
      const totalAmount = Number(invoice.total_amount);
      const maxFinanceAmount = totalAmount * (financePercentage / 100);
      const disbursementInfo = disbursementMap.get(invoice.id) || { totalDisbursed: 0, count: 0 };
      const remainingAmount = maxFinanceAmount - disbursementInfo.totalDisbursed;
      
      return {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        buyer_id: invoice.buyer_id,
        buyer_name: invoice.buyer_name,
        seller_id: invoice.seller_id,
        seller_name: invoice.seller_name,
        invoice_date: invoice.invoice_date,
        due_date: invoice.due_date,
        total_amount: totalAmount,
        currency: invoice.currency || 'USD',
        status: invoice.status || 'draft',
        disbursed_amount: disbursementInfo.totalDisbursed,
        remaining_finance_amount: remainingAmount,
        disbursement_count: disbursementInfo.count,
        is_fully_financed: remainingAmount <= 0 || disbursementInfo.count >= maxDisbursements
      };
    })
    .filter(invoice => {
      // If multiple disbursement is NOT allowed, exclude any invoice with existing disbursement
      if (!multipleDisbursementAllowed) {
        return invoice.disbursement_count === 0;
      }
      
      // If multiple disbursement IS allowed:
      // - Include if not fully financed
      // - Include if disbursement count < max allowed
      // - Include if remaining amount > 0
      return !invoice.is_fully_financed && invoice.remaining_finance_amount! > 0;
    });
};

/**
 * Calculate finance tenor based on selected invoices and program limits
 */
export const calculateFinanceTenor = (
  financeDate: Date,
  selectedInvoices: Array<{ due_date: string }>,
  programMinTenor: number,
  programMaxTenor: number
): { tenorDays: number; latestDueDate: Date; isValid: boolean; error?: string } => {
  // Find invoice with farthest due date
  const latestDueDate = new Date(
    Math.max(...selectedInvoices.map(inv => new Date(inv.due_date).getTime()))
  );

  const tenorDays = Math.ceil(
    (latestDueDate.getTime() - financeDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Validation
  if (tenorDays < programMinTenor) {
    return {
      tenorDays,
      latestDueDate,
      isValid: false,
      error: `Tenor (${tenorDays} days) is below program minimum (${programMinTenor} days)`
    };
  }

  if (tenorDays > programMaxTenor) {
    return {
      tenorDays,
      latestDueDate,
      isValid: false,
      error: `Tenor (${tenorDays} days) exceeds program maximum (${programMaxTenor} days)`
    };
  }

  return { tenorDays, latestDueDate, isValid: true };
};

/**
 * Convert currency amounts using exchange rate
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRate?: number
): { convertedAmount: number; exchangeRate: number } => {
  if (fromCurrency === toCurrency) {
    return { convertedAmount: amount, exchangeRate: 1 };
  }

  if (!exchangeRate) {
    throw new Error('Exchange rate is required for currency conversion');
  }

  return {
    convertedAmount: amount * exchangeRate,
    exchangeRate
  };
};

/**
 * Calculate finance due date with holiday adjustments
 */
export const calculateFinanceDueDate = (
  financeDate: Date,
  tenorDays: number,
  holidayCalculationMethod: 'Next Day' | 'Previous Day' | 'No Change' = 'No Change'
): Date => {
  const dueDate = new Date(financeDate);
  dueDate.setDate(dueDate.getDate() + tenorDays);

  // TODO: Implement holiday calendar check
  // For now, just return the calculated date
  return dueDate;
};

/**
 * Calculate interest amount
 */
export const calculateInterest = (
  financeAmount: number,
  interestRate: number,
  tenorDays: number
): number => {
  return (financeAmount * interestRate * tenorDays) / (365 * 100);
};

/**
 * Create finance disbursement record
 */
export const createFinanceDisbursement = async (
  data: FinanceDisbursementData,
  userId: string,
  corporateId: string
): Promise<{ success: boolean; disbursementReference?: string; error?: string; details?: any }> => {
  try {
    // Generate disbursement reference
    const disbursementRef = `FD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const { data: result, error } = await supabase
      .from('finance_disbursements')
      .insert({
        user_id: userId,
        corporate_id: corporateId,
        program_id: data.programId,
        program_name: data.programName,
        product_code: data.productCode,
        product_name: data.productName,
        selected_invoices: data.selectedInvoices,
        invoice_currency: data.invoiceCurrency,
        finance_date: data.financeDate.toISOString().split('T')[0],
        finance_currency: data.financeCurrency,
        exchange_rate: data.exchangeRate,
        finance_amount: data.financeAmount,
        finance_tenor_days: data.financeTenorDays,
        finance_due_date: data.financeDueDate.toISOString().split('T')[0],
        interest_rate_type: data.interestRateType,
        interest_rate: data.interestRate,
        reference_rate_code: data.referenceRateCode,
        reference_rate_margin: data.referenceRateMargin,
        interest_amount: data.interestAmount,
        total_repayment_amount: data.totalRepaymentAmount,
        auto_repayment_enabled: data.autoRepaymentEnabled,
        repayment_mode: data.repaymentMode,
        repayment_party: data.repaymentParty,
        repayment_account: data.repaymentAccount,
        accounting_entries: data.accountingEntries,
        accounting_reference: data.accountingReference,
        disbursement_reference: disbursementRef,
        status: 'draft'
      })
      .select();

    if (error) {
      console.error('Error creating finance disbursement:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to create finance disbursement',
        details: error.details || error.hint
      };
    }

    // Update selected invoices to 'financed' status
    const invoiceIds = data.selectedInvoices.map(inv => inv.invoice_id);
    console.log('Attempting to update invoice statuses to financed for IDs:', invoiceIds);
    
    if (invoiceIds.length > 0) {
      const { data: updatedInvoices, error: updateError } = await supabase
        .from('scf_invoices')
        .update({ status: 'financed' })
        .in('id', invoiceIds)
        .select('id, invoice_number, status');

      if (updateError) {
        console.error('Error updating invoice statuses to financed:', updateError);
        console.error('Update error details:', { message: updateError.message, details: updateError.details, hint: updateError.hint });
        // Don't throw - disbursement was created successfully
      } else if (!updatedInvoices || updatedInvoices.length === 0) {
        console.warn('No invoices were updated to financed status. Invoice IDs may not exist:', invoiceIds);
      } else {
        console.log('Successfully updated invoices to financed:', updatedInvoices);
      }
    }

    return { success: true, disbursementReference: disbursementRef };
  } catch (error: any) {
    console.error('Error creating finance disbursement:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create finance disbursement',
      details: error.toString()
    };
  }
};

/**
 * Update finance disbursement status
 */
export const updateDisbursementStatus = async (
  disbursementId: string,
  status: 'draft' | 'pending_approval' | 'approved' | 'disbursed' | 'rejected',
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('finance_disbursements')
      .update({ status })
      .eq('id', disbursementId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating disbursement status:', error);
      return { success: false, error: 'Failed to update status' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating disbursement status:', error);
    return { success: false, error: 'Failed to update status' };
  }
};