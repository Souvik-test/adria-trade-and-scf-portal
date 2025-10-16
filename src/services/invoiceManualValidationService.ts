import { supabase } from '@/integrations/supabase/client';
import { InvoiceFormData } from '@/hooks/useInvoiceForm';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ProgramConfiguration {
  program_id: string;
  program_name: string;
  currency: string;
  min_tenor_total_days: number;
  max_tenor_total_days: number;
  program_limit: number;
  anchor_limit: number;
  available_limit: number;
  anchor_available_limit: number;
  counter_parties: Array<{
    id: string;
    name: string;
    role: string;
    limit?: number;
    available_limit?: number;
  }>;
  finance_percentage: number;
}

export interface LimitUsage {
  counterPartyUsed: number;
  counterPartyLimit: number;
  anchorUsed: number;
  anchorLimit: number;
  programUsed: number;
  programLimit: number;
}

/**
 * Calculate invoice tenor in days (Due Date - Invoice Date)
 */
export const calculateInvoiceTenorInDays = (invoiceDate: string, dueDate: string): number => {
  if (!invoiceDate || !dueDate) return -1;
  
  const invoice = new Date(invoiceDate);
  const due = new Date(dueDate);
  
  if (isNaN(invoice.getTime()) || isNaN(due.getTime())) return -1;
  
  const diffTime = due.getTime() - invoice.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays >= 0 ? diffDays : -1;
};

/**
 * Fetch program configuration from database
 */
export const fetchProgramConfiguration = async (programId: string): Promise<ProgramConfiguration | null> => {
  try {
    const { data, error } = await supabase
      .from('scf_program_configurations')
      .select('*')
      .eq('program_id', programId)
      .maybeSingle();

    if (error || !data) {
      console.error('Error fetching program configuration:', error);
      return null;
    }

    return {
      program_id: data.program_id,
      program_name: data.program_name,
      currency: data.program_currency || 'USD',
      min_tenor_total_days: data.min_tenor_total_days || 0,
      max_tenor_total_days: data.max_tenor_total_days || 365,
      program_limit: Number(data.program_limit) || 0,
      anchor_limit: Number(data.anchor_limit) || 0,
      available_limit: Number(data.available_limit) || 0,
      anchor_available_limit: Number(data.anchor_available_limit) || 0,
      counter_parties: (data.counter_parties as any[]) || [],
      finance_percentage: Number(data.finance_percentage) || 100,
    };
  } catch (error) {
    console.error('Error fetching program configuration:', error);
    return null;
  }
};

/**
 * Validate invoice tenor against program range
 */
export const validateInvoiceTenor = (
  tenorDays: number,
  minTenor: number,
  maxTenor: number
): ValidationResult => {
  if (tenorDays < 0) {
    return {
      valid: false,
      errors: ['Invalid tenor calculation. Please check invoice date and due date.'],
    };
  }

  if (tenorDays < minTenor || tenorDays > maxTenor) {
    return {
      valid: false,
      errors: [
        `Invoice is not eligible for finance. Invoice tenor is ${tenorDays} days, but the program requires tenor between ${minTenor} and ${maxTenor} days.`,
      ],
    };
  }

  return { valid: true, errors: [] };
};

/**
 * Validate currency matches program currency
 */
export const validateCurrency = (
  invoiceCurrency: string,
  programCurrency: string
): ValidationResult => {
  if (invoiceCurrency !== programCurrency) {
    return {
      valid: false,
      errors: [
        `Currency mismatch. Invoice currency (${invoiceCurrency}) must match program currency (${programCurrency}).`,
      ],
    };
  }

  return { valid: true, errors: [] };
};

/**
 * Get seller information from program counter parties
 */
export const getSellerInfoFromProgram = async (
  programId: string,
  counterParties: any[]
): Promise<{ sellerId: string; sellerName: string } | null> => {
  try {
    // Get current user's corporate ID
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Get user profile to find corporate_id
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('corporate_id')
      .eq('id', user.id)
      .single();

    if (!profile?.corporate_id) return null;

    // Find seller in counter parties by matching counter_party_id with user's corporate_id
    const seller = counterParties.find(
      (cp) => cp.counter_party_id === profile.corporate_id
    );

    if (seller) {
      return {
        sellerId: seller.counter_party_id,
        sellerName: seller.counter_party_name,
      };
    }

    // Fallback: If no exact match, use the first counter party (supplier)
    // This handles cases where the user has access to the program
    if (counterParties.length > 0) {
      const firstCounterParty = counterParties[0];
      return {
        sellerId: firstCounterParty.counter_party_id,
        sellerName: firstCounterParty.counter_party_name,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting seller info:', error);
    return null;
  }
};

/**
 * Calculate limit usage for program, anchor, and counter party
 */
export const calculateLimitUsage = async (
  programId: string,
  buyerName: string,
  sellerName: string
): Promise<LimitUsage> => {
  try {
    // Fetch all invoices for this program
    const { data: allInvoices } = await supabase
      .from('scf_invoices')
      .select('total_amount, buyer_name, seller_name')
      .eq('program_id', programId)
      .eq('status', 'submitted');

    const invoices = allInvoices || [];

    // Calculate program usage
    const programUsed = invoices.reduce(
      (sum, inv) => sum + (Number(inv.total_amount) || 0),
      0
    );

    // Calculate anchor (buyer) usage
    const anchorUsed = invoices
      .filter((inv) => inv.buyer_name === buyerName)
      .reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0);

    // Calculate counter party (seller) usage
    const counterPartyUsed = invoices
      .filter((inv) => inv.seller_name === sellerName)
      .reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0);

    // Fetch program config for limits
    const programConfig = await fetchProgramConfiguration(programId);
    if (!programConfig) {
      return {
        counterPartyUsed: 0,
        counterPartyLimit: 0,
        anchorUsed: 0,
        anchorLimit: 0,
        programUsed: 0,
        programLimit: 0,
      };
    }

    // Find counter party limit
    const counterParty = programConfig.counter_parties.find(
      (cp) => cp.name === sellerName
    );
    const counterPartyLimit = counterParty?.limit || 0;

    return {
      counterPartyUsed,
      counterPartyLimit,
      anchorUsed,
      anchorLimit: programConfig.anchor_limit,
      programUsed,
      programLimit: programConfig.program_limit,
    };
  } catch (error) {
    console.error('Error calculating limit usage:', error);
    return {
      counterPartyUsed: 0,
      counterPartyLimit: 0,
      anchorUsed: 0,
      anchorLimit: 0,
      programUsed: 0,
      programLimit: 0,
    };
  }
};

/**
 * Validate amount against limits (Counter Party → Anchor → Program)
 */
export const validateAmountAgainstLimits = async (
  totalAmount: number,
  programId: string,
  buyerName: string,
  sellerName: string
): Promise<ValidationResult> => {
  const errors: string[] = [];
  
  const usage = await calculateLimitUsage(programId, buyerName, sellerName);

  // Check Counter Party limit (if set)
  if (usage.counterPartyLimit > 0) {
    const newCounterPartyTotal = usage.counterPartyUsed + totalAmount;
    if (newCounterPartyTotal > usage.counterPartyLimit) {
      const excess = newCounterPartyTotal - usage.counterPartyLimit;
      errors.push(
        `Counter Party limit exceeded. Current usage: ${usage.counterPartyUsed.toFixed(2)}, Requested: ${totalAmount.toFixed(2)}, Available limit: ${usage.counterPartyLimit.toFixed(2)}. Exceeds by: ${excess.toFixed(2)}.`
      );
    }
  }

  // Check Anchor limit
  if (usage.anchorLimit > 0) {
    const newAnchorTotal = usage.anchorUsed + totalAmount;
    if (newAnchorTotal > usage.anchorLimit) {
      const excess = newAnchorTotal - usage.anchorLimit;
      errors.push(
        `Anchor (Buyer) limit exceeded. Current usage: ${usage.anchorUsed.toFixed(2)}, Requested: ${totalAmount.toFixed(2)}, Available limit: ${usage.anchorLimit.toFixed(2)}. Exceeds by: ${excess.toFixed(2)}.`
      );
    }
  }

  // Check Program limit
  if (usage.programLimit > 0) {
    const newProgramTotal = usage.programUsed + totalAmount;
    if (newProgramTotal > usage.programLimit) {
      const excess = newProgramTotal - usage.programLimit;
      errors.push(
        `Program limit exceeded. Current usage: ${usage.programUsed.toFixed(2)}, Requested: ${totalAmount.toFixed(2)}, Available limit: ${usage.programLimit.toFixed(2)}. Exceeds by: ${excess.toFixed(2)}.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Main validation function - orchestrates all validations
 */
export const validateInvoiceManual = async (
  formData: InvoiceFormData,
  programConfig: ProgramConfiguration
): Promise<ValidationResult> => {
  const errors: string[] = [];

  // 1. Validate tenor
  const tenorDays = calculateInvoiceTenorInDays(formData.invoiceDate, formData.dueDate);
  const tenorValidation = validateInvoiceTenor(
    tenorDays,
    programConfig.min_tenor_total_days,
    programConfig.max_tenor_total_days
  );
  if (!tenorValidation.valid) {
    errors.push(...tenorValidation.errors);
  }

  // 2. Validate currency
  const currencyValidation = validateCurrency(formData.currency, programConfig.currency);
  if (!currencyValidation.valid) {
    errors.push(...currencyValidation.errors);
  }

  // 3. Validate seller info is populated
  if (!formData.sellerId || !formData.sellerName) {
    errors.push('Seller information could not be populated from the selected program. Please contact administrator.');
  }

  // 4. Validate amount against limits
  if (formData.totalAmount > 0) {
    const limitValidation = await validateAmountAgainstLimits(
      formData.totalAmount,
      formData.programId,
      formData.buyerName,
      formData.sellerName
    );
    if (!limitValidation.valid) {
      errors.push(...limitValidation.errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
