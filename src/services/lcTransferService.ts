
import { supabase } from '@/integrations/supabase/client';
import { getCurrentUserAsync } from './database';
import { LCTransferFormData } from '@/types/exportLCTransfer';

export const saveLCTransferRequest = async (formData: LCTransferFormData) => {
  // Get current authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('User not authenticated');

  // Get the user profile from user_profiles table
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (profileError || !userProfile) {
    throw new Error('User profile not found');
  }

  try {
    console.log('Saving LC transfer request with data:', formData);
    
    // Generate reference number
    const { data: refData, error: refError } = await supabase.rpc('generate_lc_transfer_ref');
    if (refError) {
      console.error('Error generating LC transfer reference:', refError);
      throw refError;
    }
    
    const requestReference = refData as string;

    // Prepare supporting documents data
    const supportingDocuments = formData.supportingDocuments?.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type
    })) || [];

    // Convert new beneficiaries to JSON-compatible format
    const newBeneficiariesJson = formData.newBeneficiaries?.map(beneficiary => ({
      name: beneficiary.name || '',
      address: beneficiary.address || '',
      country: beneficiary.country || '',
      bankName: beneficiary.bankName || '',
      bankAddress: beneficiary.bankAddress || '',
      swiftCode: beneficiary.swiftCode || '',
      accountNumber: beneficiary.accountNumber || '',
      transferAmount: beneficiary.transferAmount ? parseFloat(beneficiary.transferAmount.toString()) : 0
    })) || [];

    // Prepare the insert data
    const insertData = {
      user_id: userProfile.id,
      lc_reference: formData.lcReference || '',
      issuing_bank: formData.issuingBank || '',
      issuance_date: formData.issuanceDate || null,
      applicant: formData.applicant || '',
      currency: formData.currency || 'USD',
      amount: formData.amount ? parseFloat(formData.amount.toString()) : null,
      expiry_date: formData.expiryDate || null,
      current_beneficiary: formData.currentBeneficiary || '',
      transfer_type: formData.transferType || 'Full',
      transfer_conditions: formData.transferConditions || '',
      new_beneficiaries: newBeneficiariesJson,
      required_documents: formData.requiredDocuments || [],
      supporting_documents: supportingDocuments,
      required_documents_checked: formData.requiredDocumentsChecked || {},
      request_reference: requestReference,
      status: 'submitted'
    };

    console.log('Insert data prepared:', insertData);

    // Insert LC Transfer request
    const { data: request, error: requestError } = await supabase
      .from('lc_transfer_requests')
      .insert(insertData)
      .select()
      .single();

    if (requestError) {
      console.error('Error inserting LC transfer request:', requestError);
      throw requestError;
    }

    console.log('LC transfer request saved successfully:', request);
    return { ...request, request_reference: requestReference };
  } catch (error) {
    console.error('Error saving LC Transfer request:', error);
    throw error;
  }
};

export const fetchLCTransferRequests = async () => {
  // Get current authenticated user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error('User not authenticated');

  // Get the user profile from user_profiles table
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (profileError || !userProfile) {
    throw new Error('User profile not found');
  }

  try {
    const { data, error } = await supabase
      .from('lc_transfer_requests')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching LC Transfer requests:', error);
    throw error;
  }
};
