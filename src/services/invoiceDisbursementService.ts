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
      .select('available_limit')
      .eq('program_id', programId)
      .single();

    if (program) {
      await supabase
        .from('scf_program_configurations')
        .update({
          available_limit: Number(program.available_limit) - disbursedAmount
        })
        .eq('program_id', programId);
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
