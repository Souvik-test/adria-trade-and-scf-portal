import { supabase } from '@/integrations/supabase/client';
import { Disbursement } from '@/types/invoiceUpload';

export const processDisbursement = async (
  invoiceId: string,
  programId: string,
  totalAmount: number,
  financePercentage: number,
  autoDisbursement: boolean
): Promise<{ status: string; disbursement?: Disbursement; error?: string }> => {
  if (!autoDisbursement) {
    return { status: 'skipped', error: 'Auto-disbursement not enabled' };
  }

  try {
    // Calculate disbursed amount
    const disbursedAmount = (totalAmount * financePercentage) / 100;
    
    // Generate loan reference
    const loanReference = `LOAN-${programId}-${Date.now()}`;

    // Create disbursement record
    const { data: disbursement, error: insertError } = await supabase
      .from('invoice_disbursements')
      .insert({
        scf_invoice_id: invoiceId,
        program_id: programId,
        loan_reference: loanReference,
        disbursed_amount: disbursedAmount,
        finance_percentage: financePercentage,
        disbursement_status: 'pending'
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Create accounting entry (simplified)
    const accountingRef = `ACC-${Date.now()}`;

    // Update disbursement status
    const { error: updateError } = await supabase
      .from('invoice_disbursements')
      .update({
        accounting_entry_ref: accountingRef,
        disbursement_status: 'completed',
        disbursed_at: new Date().toISOString()
      })
      .eq('id', disbursement.id);

    if (updateError) throw updateError;

    // Update program available limit
    const { data: program } = await supabase
      .from('scf_program_configurations')
      .select('available_limit, anchor_available_limit, counter_parties, anchor_party')
      .eq('program_id', programId)
      .single();

    if (program) {
      // Update program available limit
      await supabase
        .from('scf_program_configurations')
        .update({
          available_limit: Number(program.available_limit) - disbursedAmount
        })
        .eq('program_id', programId);

      // Update anchor available limit
      if (program.anchor_available_limit) {
        await supabase
          .from('scf_program_configurations')
          .update({
            anchor_available_limit: Number(program.anchor_available_limit) - disbursedAmount
          })
          .eq('program_id', programId);
      }

      // Update counter party available limit
      const { data: invoiceData } = await supabase
        .from('scf_invoices')
        .select('seller_id, buyer_id')
        .eq('id', invoiceId)
        .single();

      if (invoiceData && program.counter_parties) {
        const counterParties = program.counter_parties as any[];
        const anchorParty = (program.anchor_party || '').toUpperCase();
        
        // Determine which party is the counter party
        const counterPartyId = anchorParty.includes('BUYER') 
          ? invoiceData.seller_id 
          : invoiceData.buyer_id;
        
        // Find and update the counter party limit
        const updatedCounterParties = counterParties.map(cp => {
          if (cp.counter_party_id === counterPartyId) {
            return {
              ...cp,
              available_limit_amount: Number(cp.available_limit_amount || 0) - disbursedAmount
            };
          }
          return cp;
        });
        
        await supabase
          .from('scf_program_configurations')
          .update({ counter_parties: updatedCounterParties })
          .eq('program_id', programId);
      }
    }

    return {
      status: 'completed',
      disbursement: {
        ...disbursement,
        accounting_entry_ref: accountingRef,
        disbursement_status: 'completed' as const,
        disbursed_at: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Disbursement error:', error);
    
    // Mark as failed if record was created
    if (error instanceof Error && error.message.includes('duplicate')) {
      return { status: 'failed', error: 'Duplicate disbursement attempt' };
    }

    return { 
      status: 'failed', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};
