
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserAsync } from './database';
import { AssignmentFormData } from '@/types/exportLCAssignment';

export const saveAssignmentRequest = async (formData: AssignmentFormData) => {
  // Get current authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('User not authenticated');

  // Get the user profile from custom_users table
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (profileError || !userProfile) {
    throw new Error('User profile not found');
  }

  try {
    console.log('Saving assignment request with data:', formData);
    
    // Generate assignment reference
    const { data: refData, error: refError } = await supabase
      .rpc('generate_assignment_ref');
    
    if (refError) {
      console.error('Error generating assignment reference:', refError);
      throw refError;
    }
    const assignmentRef = refData;

    // Prepare the insert data
    const insertData = {
      user_id: userProfile.id,
      request_reference: assignmentRef,
      lc_reference: formData.lcReference || '',
      issuing_bank: formData.issuingBank || '',
      issuance_date: formData.issuanceDate || null,
      applicant: formData.applicant || '',
      currency: formData.currency || 'USD',
      amount: formData.amount ? parseFloat(formData.amount.toString()) : null,
      expiry_date: formData.expiryDate || null,
      current_beneficiary: formData.currentBeneficiary || '',
      assignment_type: formData.assignmentType || 'Assignment of Proceeds',
      assignment_amount: formData.assignmentAmount ? parseFloat(formData.assignmentAmount.toString()) : null,
      assignment_percentage: formData.assignmentPercentage ? parseFloat(formData.assignmentPercentage.toString()) : null,
      assignment_conditions: formData.assignmentConditions || '',
      assignment_purpose: formData.assignmentPurpose || '',
      assignee_name: formData.assignee?.name || '',
      assignee_address: formData.assignee?.address || '',
      assignee_country: formData.assignee?.country || '',
      assignee_bank_name: formData.assignee?.bankName || '',
      assignee_bank_address: formData.assignee?.bankAddress || '',
      assignee_swift_code: formData.assignee?.swiftCode || '',
      assignee_account_number: formData.assignee?.accountNumber || '',
      required_documents: formData.requiredDocuments || [],
      supporting_documents: formData.supportingDocuments?.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      })) || [],
      required_documents_checked: formData.requiredDocumentsChecked || {},
      status: 'Submitted'
    };

    console.log('Insert data prepared:', insertData);

    // Save assignment request
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignment_requests')
      .insert(insertData)
      .select()
      .single();

    if (assignmentError) {
      console.error('Error inserting assignment request:', assignmentError);
      throw assignmentError;
    }

    console.log('Assignment request saved successfully:', assignment);
    return assignment;
  } catch (error) {
    console.error('Error saving assignment request:', error);
    throw error;
  }
};
