import { supabase } from '@/integrations/supabase/client';
import { ParsedInvoiceData, ValidationResult } from '@/types/invoiceUpload';

export const validateAgainstProgram = async (
  invoiceData: ParsedInvoiceData
): Promise<ValidationResult> => {
  try {
    // 1. Fetch program configuration
    const { data: program, error: programError } = await supabase
      .from('scf_program_configurations')
      .select('*')
      .eq('program_name', invoiceData.program_name)
      .eq('status', 'active')
      .maybeSingle();

    if (programError || !program) {
      return { 
        valid: false, 
        reason: 'Invalid Program - Not Found or Inactive' 
      };
    }

    // 2. Check if buyer/supplier are registered counterparties
    const counterparties = (program.counter_parties as any[]) || [];
    const isBuyerValid = counterparties.some(
      cp => cp.name === invoiceData.buyer_name
    );
    const isSellerValid = counterparties.some(
      cp => cp.name === invoiceData.seller_name
    );

    if (!isBuyerValid) {
      return { 
        valid: false, 
        reason: `Invalid Buyer - ${invoiceData.buyer_name} not registered in program` 
      };
    }

    if (!isSellerValid) {
      return { 
        valid: false, 
        reason: `Invalid Supplier - ${invoiceData.seller_name} not registered in program` 
      };
    }

    // 3. Check program limit
    const { data: totalInvoices } = await supabase
      .from('scf_invoices')
      .select('total_amount')
      .eq('program_id', program.program_id);

    const usedLimit = totalInvoices?.reduce(
      (sum, inv) => sum + (Number(inv.total_amount) || 0), 
      0
    ) || 0;

    if (usedLimit + invoiceData.total_amount > Number(program.program_limit)) {
      return { 
        valid: false, 
        reason: `Limit Breach - Program limit exceeded (Used: ${usedLimit}, Requested: ${invoiceData.total_amount}, Limit: ${program.program_limit})` 
      };
    }

    // 4. Check anchor limit (buyer limit)
    const { data: anchorInvoices } = await supabase
      .from('scf_invoices')
      .select('total_amount')
      .eq('program_id', program.program_id)
      .eq('buyer_name', invoiceData.buyer_name);

    const anchorUsedLimit = anchorInvoices?.reduce(
      (sum, inv) => sum + (Number(inv.total_amount) || 0), 
      0
    ) || 0;

    if (anchorUsedLimit + invoiceData.total_amount > Number(program.anchor_limit || 0)) {
      return { 
        valid: false, 
        reason: `Limit Breach - Anchor/Buyer limit exceeded (Used: ${anchorUsedLimit}, Requested: ${invoiceData.total_amount}, Limit: ${program.anchor_limit})` 
      };
    }

    // 5. All validations passed
    return { 
      valid: true, 
      program_id: program.program_id,
      finance_percentage: Number(program.finance_percentage) || 100
    };
  } catch (error) {
    console.error('Validation error:', error);
    return { 
      valid: false, 
      reason: `Validation Error - ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};
