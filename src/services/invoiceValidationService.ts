import { supabase } from '@/integrations/supabase/client';
import { ParsedInvoiceData, ValidationResult } from '@/types/invoiceUpload';

export const validateAgainstProgram = async (
  invoiceData: ParsedInvoiceData
): Promise<ValidationResult> => {
  try {
    // 1. Fetch program configuration BY PROGRAM_ID (not name)
    const { data: program, error: programError } = await supabase
      .from('scf_program_configurations')
      .select('*, override_limit_restrictions, override_tenor_calculation')
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

    // 2. Check for duplicate invoice number within same program (excluding rejected)
    const { data: existingInvoice } = await supabase
      .from('scf_invoices')
      .select('invoice_number, status')
      .eq('program_id', invoiceData.program_id)
      .eq('invoice_number', invoiceData.invoice_number)
      .neq('status', 'rejected')
      .maybeSingle();

    if (existingInvoice) {
      return {
        valid: false,
        reason: `Duplicate Invoice - Invoice number "${invoiceData.invoice_number}" already exists for program "${invoiceData.program_id}" with status "${existingInvoice.status}". Same invoice number can only be reused if previous invoice was rejected.`
      };
    }

    // 3. Validate Currency matches Program Currency
    if (invoiceData.currency !== program.program_currency) {
      return {
        valid: false,
        reason: `Currency Mismatch - Invoice currency "${invoiceData.currency}" does not match program currency "${program.program_currency}" for program "${program.program_name}"`
      };
    }

    // 4. Validate Tenor (days between invoice_date and due_date)
    const invoiceDate = new Date(invoiceData.invoice_date);
    const dueDate = new Date(invoiceData.due_date);
    
    // Validate dates are valid
    if (isNaN(invoiceDate.getTime())) {
      return {
        valid: false,
        reason: `Invalid Invoice Date - Cannot parse date "${invoiceData.invoice_date}"`
      };
    }
    
    if (isNaN(dueDate.getTime())) {
      return {
        valid: false,
        reason: `Invalid Due Date - Cannot parse date "${invoiceData.due_date}"`
      };
    }
    
    const tenorDays = Math.ceil((dueDate.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Check if due date is before invoice date
    if (tenorDays < 0) {
      return {
        valid: false,
        reason: `Invalid Tenor - Due Date (${dueDate.toLocaleDateString('en-GB')}) cannot be before Invoice Date (${invoiceDate.toLocaleDateString('en-GB')}). Tenor: ${tenorDays} days`
      };
    }

    const minTenor = Number(program.min_tenor_total_days || program.min_tenor || 0);
    const maxTenor = Number(program.max_tenor_total_days || program.max_tenor || 999999);

    // Check override flag for tenor validation
    if (!program.override_tenor_calculation) {
      if (tenorDays < minTenor || tenorDays > maxTenor) {
        return {
          valid: false,
          reason: `Tenor Out of Range - Invoice tenor is ${tenorDays} days (Invoice Date: ${invoiceDate.toLocaleDateString('en-GB')}, Due Date: ${dueDate.toLocaleDateString('en-GB')}), but program "${program.program_name}" requires ${minTenor}-${maxTenor} days`
        };
      }
    }

    // 5. Anchor-based Party Validation
    const anchorParty = program.anchor_party?.toUpperCase() || '';
    const counterparties = (program.counter_parties as any[]) || [];
    
    const isAnchorBuyer = anchorParty.includes('BUYER');
    const isAnchorSeller = anchorParty.includes('SELLER');

    if (isAnchorBuyer) {
      // Buyer is anchor - validate SELLER only
      if (!invoiceData.seller_id || invoiceData.seller_id.trim() === '') {
        return {
          valid: false,
          reason: 'Seller ID is required - Buyer is the anchor in this program'
        };
      }
      
      // Validate Seller against counterparties
      const sellerCounterparty = counterparties.find(
        cp => cp.counter_party_name === invoiceData.seller_name
      );
      
      if (!sellerCounterparty) {
        const availableCounterparties = counterparties.map(cp => cp.counter_party_name).join(', ');
        return { 
          valid: false, 
          reason: `Invalid Seller - "${invoiceData.seller_name}" not registered in program "${program.program_name}". Available counterparties: ${availableCounterparties || 'None'}` 
        };
      }
      
      // Validate Seller ID matches
      if (sellerCounterparty.counter_party_id !== invoiceData.seller_id) {
        return {
          valid: false,
          reason: `Seller ID Mismatch - "${invoiceData.seller_id}" does not match registered ID "${sellerCounterparty.counter_party_id}" for seller "${invoiceData.seller_name}"`
        };
      }
      
    } else if (isAnchorSeller) {
      // Seller is anchor - validate BUYER only
      if (!invoiceData.buyer_id || invoiceData.buyer_id.trim() === '') {
        return {
          valid: false,
          reason: 'Buyer ID is required - Seller is the anchor in this program'
        };
      }
      
      // Validate Buyer against counterparties
      const buyerCounterparty = counterparties.find(
        cp => cp.counter_party_name === invoiceData.buyer_name
      );
      
      if (!buyerCounterparty) {
        const availableCounterparties = counterparties.map(cp => cp.counter_party_name).join(', ');
        return { 
          valid: false, 
          reason: `Invalid Buyer - "${invoiceData.buyer_name}" not registered in program "${program.program_name}". Available counterparties: ${availableCounterparties || 'None'}` 
        };
      }
      
      // Validate Buyer ID matches
      if (buyerCounterparty.counter_party_id !== invoiceData.buyer_id) {
        return {
          valid: false,
          reason: `Buyer ID Mismatch - "${invoiceData.buyer_id}" does not match registered ID "${buyerCounterparty.counter_party_id}" for buyer "${invoiceData.buyer_name}"`
        };
      }
    }

    // 6. Check program limit (skip if override enabled)
    if (!program.override_limit_restrictions) {
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

      // 7. Check anchor limit (buyer limit)
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
    }

    // 8. All validations passed
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
