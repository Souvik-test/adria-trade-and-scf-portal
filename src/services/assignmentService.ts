
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserAsync } from './database';
import { getProductAndProcessType } from './processTypeMapping';
import { AssignmentFormData } from '@/types/exportLCAssignment';

export const saveAssignmentRequest = async (formData: AssignmentFormData) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');

  try {
    // Generate assignment reference
    const { data: refData, error: refError } = await supabase
      .rpc('generate_assignment_ref');
    
    if (refError) throw refError;
    const assignmentRef = refData;

    // Save assignment request
    const { data: assignment, error: assignmentError } = await supabase
      .from('assignment_requests')
      .insert({
        user_id: user.id,
        request_reference: assignmentRef,
        lc_reference: formData.lcReference,
        issuing_bank: formData.issuingBank,
        issuance_date: formData.issuanceDate || null,
        applicant: formData.applicant,
        currency: formData.currency,
        amount: parseFloat(formData.amount) || null,
        expiry_date: formData.expiryDate || null,
        current_beneficiary: formData.currentBeneficiary,
        assignment_type: formData.assignmentType,
        assignment_amount: parseFloat(formData.assignmentAmount) || null,
        assignment_percentage: parseFloat(formData.assignmentPercentage) || null,
        assignment_conditions: formData.assignmentConditions,
        assignment_purpose: formData.assignmentPurpose,
        assignee_name: formData.assignee.name,
        assignee_address: formData.assignee.address,
        assignee_country: formData.assignee.country,
        assignee_bank_name: formData.assignee.bankName,
        assignee_bank_address: formData.assignee.bankAddress,
        assignee_swift_code: formData.assignee.swiftCode,
        assignee_account_number: formData.assignee.accountNumber,
        required_documents: Object.keys(formData.requiredDocumentsChecked).filter(
          doc => formData.requiredDocumentsChecked[doc]
        ),
        supporting_documents: formData.supportingDocuments.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        })),
        required_documents_checked: formData.requiredDocumentsChecked,
        status: 'Submitted'
      })
      .select()
      .single();

    if (assignmentError) throw assignmentError;

    return assignment;
  } catch (error) {
    console.error('Error saving assignment request:', error);
    throw error;
  }
};
