
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from './customAuth';

export interface AmendmentData {
  originalLcReference: string;
  changes: Record<string, { original: any; current: any }>;
  formData: any;
  amendmentReason: string;
}

export const saveImportLCAmendment = async (amendmentData: AmendmentData) => {
  try {
    console.log('Saving Import LC amendment with data:', amendmentData);
    
    // Ensure user is authenticated
    const user = customAuth.getSession()?.user;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Generate amendment reference using existing function
    const { data: refData, error: refError } = await supabase
      .rpc('generate_transaction_ref', { product_type: 'Amendment' });
    
    if (refError) {
      console.error('Error generating amendment reference:', refError);
      throw refError;
    }
    const amendmentRef = refData;

    // Prepare the insert data
    const insertData = {
      user_id: user.id,
      amendment_reference: amendmentRef,
      original_lc_reference: amendmentData.originalLcReference,
      amendment_reason: amendmentData.amendmentReason,
      changes_summary: amendmentData.changes,
      amended_form_data: amendmentData.formData,
      status: 'submitted'
    };

    console.log('Insert data prepared:', insertData);

    // Save amendment request to import_lc_requests with amended status
    const { data: amendment, error: amendmentError } = await supabase
      .from('import_lc_requests')
      .insert({
        ...amendmentData.formData,
        user_id: user.id,
        status: 'amendment_submitted',
        corporate_reference: amendmentRef
      })
      .select()
      .single();

    if (amendmentError) {
      console.error('Error inserting amendment request:', amendmentError);
      throw amendmentError;
    }

    console.log('Amendment request saved successfully:', amendment);
    return amendment;
  } catch (error) {
    console.error('Error saving amendment request:', error);
    throw error;
  }
};
