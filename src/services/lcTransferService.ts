
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserAsync, createTransactionRecord } from './database';
import { getProductAndProcessType } from './processTypeMapping';
import { LCTransferFormData } from '@/types/exportLCTransfer';

export const saveLCTransferRequest = async (formData: LCTransferFormData) => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');

  try {
    // Generate reference number
    const { data: refData, error: refError } = await supabase.rpc('generate_lc_transfer_ref');
    if (refError) throw refError;
    
    const requestReference = refData as string;

    // Get user profile to get the correct user_id for the foreign key
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', user.id)
      .single();
    
    if (profileError) throw profileError;

    // Prepare supporting documents data
    const supportingDocuments = formData.supportingDocuments.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    }));

    // Convert new beneficiaries to JSON-compatible format
    const newBeneficiariesJson = formData.newBeneficiaries.map(beneficiary => ({
      name: beneficiary.name || '',
      address: beneficiary.address || '',
      country: beneficiary.country || '',
      bankName: beneficiary.bankName || '',
      bankAddress: beneficiary.bankAddress || '',
      swiftCode: beneficiary.swiftCode || '',
      accountNumber: beneficiary.accountNumber || '',
      transferAmount: beneficiary.transferAmount || ''
    }));

    // Insert LC Transfer request
    const { data: request, error: requestError } = await supabase
      .from('lc_transfer_requests')
      .insert({
        user_id: userProfile.id,
        lc_reference: formData.lcReference,
        issuing_bank: formData.issuingBank,
        issuance_date: formData.issuanceDate,
        applicant: formData.applicant,
        currency: formData.currency,
        amount: Number(formData.amount) || 0,
        expiry_date: formData.expiryDate,
        current_beneficiary: formData.currentBeneficiary,
        transfer_type: formData.transferType,
        transfer_conditions: formData.transferConditions,
        new_beneficiaries: newBeneficiariesJson as any,
        required_documents: formData.requiredDocuments,
        supporting_documents: supportingDocuments as any,
        required_documents_checked: formData.requiredDocumentsChecked as any,
        request_reference: requestReference,
        status: 'submitted'
      })
      .select()
      .single();

    if (requestError) throw requestError;

    return { ...request, request_reference: requestReference };
  } catch (error) {
    console.error('Error saving LC Transfer request:', error);
    throw error;
  }
};

export const fetchLCTransferRequests = async () => {
  const user = await getCurrentUserAsync();
  if (!user) throw new Error('User not authenticated');

  try {
    const { data, error } = await supabase
      .from('lc_transfer_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching LC Transfer requests:', error);
    throw error;
  }
};
