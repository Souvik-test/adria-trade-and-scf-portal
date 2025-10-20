import { supabase } from '@/integrations/supabase/client';
import { ParsedInvoiceData, ValidationResult } from '@/types/invoiceUpload';

export const validateAgainstProgram = async (
  invoiceData: ParsedInvoiceData
): Promise<ValidationResult> => {
  try {
    // 1. Fetch program configuration BY PROGRAM_ID (not name)
    const { data: program, error: programError } = await supabase
      .from('scf_program_configurations')
      .select('*')
      .eq('program_id', invoiceData.program_id)
      .eq('status', 'active')
      .maybeSingle();

    if (programError || !program) {
      return { 
        valid: false, 
        reason: `Invalid Program - Program ID "${invoiceData.program_id}" not found or inactive` 
      };
    }

    // 1a. Validate Program Name matches Program ID
    if (program.program_name !== invoiceData.program_name) {
      return {
        valid: false,
        reason: `Program Name Mismatch - "${invoiceData.program_name}" does not match Program ID "${invoiceData.program_id}" (expected: "${program.program_name}")`
      };
    }

    // 2. Anchor-based ID Validation
    const anchorParty = program.anchor_party; // "BUYER" or "SELLER"
    
    // If Buyer is anchor, Seller ID is REQUIRED
    if (anchorParty === 'BUYER' || anchorParty === 'BUYER ANCHOR') {
      if (!invoiceData.seller_id || invoiceData.seller_id.trim() === '') {
        return {
          valid: false,
          reason: 'Seller ID is required - Buyer is the anchor in this program'
        };
      }
    }
    
    // If Seller is anchor, Buyer ID is REQUIRED
    if (anchorParty === 'SELLER' || anchorParty === 'SELLER ANCHOR') {
      if (!invoiceData.buyer_id || invoiceData.buyer_id.trim() === '') {
        return {
          valid: false,
          reason: 'Buyer ID is required - Seller is the anchor in this program'
        };
      }
    }

    // 3. Check counterparties with ID validation
    const counterparties = (program.counter_parties as any[]) || [];
    
    // Validate Buyer
    const buyerCounterparty = counterparties.find(
      cp => cp.counter_party_name === invoiceData.buyer_name
    );
    
    if (!buyerCounterparty) {
      return { 
        valid: false, 
        reason: `Invalid Buyer - "${invoiceData.buyer_name}" not registered in program "${program.program_name}"` 
      };
    }
    
    // Validate Buyer ID matches if provided
    if (invoiceData.buyer_id && 
        buyerCounterparty.counter_party_id !== invoiceData.buyer_id) {
      return {
        valid: false,
        reason: `Buyer ID Mismatch - "${invoiceData.buyer_id}" does not match registered ID "${buyerCounterparty.counter_party_id}" for buyer "${invoiceData.buyer_name}"`
      };
    }

    // Validate Seller
    const sellerCounterparty = counterparties.find(
      cp => cp.counter_party_name === invoiceData.seller_name
    );
    
    if (!sellerCounterparty) {
      return { 
        valid: false, 
        reason: `Invalid Seller - "${invoiceData.seller_name}" not registered in program "${program.program_name}"` 
      };
    }
    
    // Validate Seller ID matches if provided
    if (invoiceData.seller_id && 
        sellerCounterparty.counter_party_id !== invoiceData.seller_id) {
      return {
        valid: false,
        reason: `Seller ID Mismatch - "${invoiceData.seller_id}" does not match registered ID "${sellerCounterparty.counter_party_id}" for seller "${invoiceData.seller_name}"`
      };
    }

    // 4. Check program limit
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

    // 5. Check anchor limit (buyer limit)
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

    // 6. All validations passed
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
