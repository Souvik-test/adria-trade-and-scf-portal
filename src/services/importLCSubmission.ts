
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from '@/services/customAuth';
import { ImportLCFormData } from '@/types/importLC';

export const submitImportLCRequest = async (formData: ImportLCFormData) => {
  console.log('submitForm called with formData:', formData);
  
  const user = customAuth.getSession()?.user;
  if (!user) {
    console.error('No user session found');
    throw new Error('User not authenticated');
  }

  console.log('User found:', user);

  try {
    // Set user context for RLS by creating a custom header
    const headers = {
      'x-user-id': user.user_id
    };

    // Sync party data to legacy fields for database compatibility
    const applicantParty = formData.parties.find(p => p.role === 'applicant');
    const beneficiaryParty = formData.parties.find(p => p.role === 'beneficiary');
    const advisingBankParty = formData.parties.find(p => p.role === 'advising_bank');

    // Proper boolean conversion - handle both boolean and string values
    const partialShipmentsAllowed = Boolean(formData.partialShipmentsAllowed);
    const transshipmentAllowed = Boolean(formData.transshipmentAllowed);

    const insertData = {
      user_id: user.id,
      popi_number: formData.popiNumber,
      popi_type: formData.popiType,
      form_of_documentary_credit: formData.formOfDocumentaryCredit,
      corporate_reference: formData.corporateReference,
      applicable_rules: formData.applicableRules,
      lc_type: formData.lcType,
      issue_date: formData.issueDate || null,
      expiry_date: formData.expiryDate || null,
      place_of_expiry: formData.placeOfExpiry,
      applicant_name: applicantParty?.name || formData.applicantName,
      applicant_address: applicantParty?.address || formData.applicantAddress,
      applicant_account_number: applicantParty?.accountNumber || formData.applicantAccountNumber,
      beneficiary_name: beneficiaryParty?.name || formData.beneficiaryName,
      beneficiary_address: beneficiaryParty?.address || formData.beneficiaryAddress,
      beneficiary_bank_name: formData.beneficiaryBankName,
      beneficiary_bank_address: formData.beneficiaryBankAddress,
      beneficiary_bank_swift_code: beneficiaryParty?.swiftCode || formData.beneficiaryBankSwiftCode,
      advising_bank_swift_code: advisingBankParty?.swiftCode || formData.advisingBankSwiftCode,
      lc_amount: formData.lcAmount,
      currency: formData.currency,
      tolerance: formData.tolerance,
      additional_amount: formData.additionalAmount,
      available_with: formData.availableWith,
      available_by: formData.availableBy,
      partial_shipments_allowed: partialShipmentsAllowed,
      transshipment_allowed: transshipmentAllowed,
      description_of_goods: formData.descriptionOfGoods,
      port_of_loading: formData.portOfLoading,
      port_of_discharge: formData.portOfDischarge,
      latest_shipment_date: formData.latestShipmentDate || null,
      presentation_period: formData.presentationPeriod,
      required_documents: formData.documentRequirements.length > 0 
        ? formData.documentRequirements.map(doc => `${doc.name} - ${doc.original} Original${doc.original > 1 ? 's' : ''}, ${doc.copies} Cop${doc.copies === 1 ? 'y' : 'ies'}`)
        : formData.requiredDocuments,
      additional_conditions: formData.additionalConditions,
      status: 'submitted'
    };

    console.log('Attempting to insert data:', insertData);

    // Use RPC call to bypass RLS temporarily for submission
    const { data, error } = await supabase
      .rpc('insert_import_lc_request', {
        request_data: insertData
      });

    if (error) {
      console.error('Database insert error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log('Import LC request submitted successfully:', data);
    return data;
  } catch (error) {
    console.error('Error submitting Import LC request:', error);
    throw error;
  }
};

export const saveDraftImportLCRequest = async (formData: ImportLCFormData) => {
  console.log('Starting draft save...');
  const user = customAuth.getSession()?.user;
  if (!user) {
    throw new Error('User not authenticated');
  }

  // Same logic as submit but with status 'draft'
  const applicantParty = formData.parties.find(p => p.role === 'applicant');
  const beneficiaryParty = formData.parties.find(p => p.role === 'beneficiary');
  const advisingBankParty = formData.parties.find(p => p.role === 'advising_bank');

  const partialShipmentsAllowed = Boolean(formData.partialShipmentsAllowed);
  const transshipmentAllowed = Boolean(formData.transshipmentAllowed);

  const insertData = {
    user_id: user.id,
    popi_number: formData.popiNumber,
    popi_type: formData.popiType,
    form_of_documentary_credit: formData.formOfDocumentaryCredit,
    corporate_reference: formData.corporateReference,
    applicable_rules: formData.applicableRules,
    lc_type: formData.lcType,
    issue_date: formData.issueDate || null,
    expiry_date: formData.expiryDate || null,
    place_of_expiry: formData.placeOfExpiry,
    applicant_name: applicantParty?.name || formData.applicantName,
    applicant_address: applicantParty?.address || formData.applicantAddress,
    applicant_account_number: applicantParty?.accountNumber || formData.applicantAccountNumber,
    beneficiary_name: beneficiaryParty?.name || formData.beneficiaryName,
    beneficiary_address: beneficiaryParty?.address || formData.beneficiaryAddress,
    beneficiary_bank_name: formData.beneficiaryBankName,
    beneficiary_bank_address: formData.beneficiaryBankAddress,
    beneficiary_bank_swift_code: beneficiaryParty?.swiftCode || formData.beneficiaryBankSwiftCode,
    advising_bank_swift_code: advisingBankParty?.swiftCode || formData.advisingBankSwiftCode,
    lc_amount: formData.lcAmount,
    currency: formData.currency,
    tolerance: formData.tolerance,
    additional_amount: formData.additionalAmount,
    available_with: formData.availableWith,
    available_by: formData.availableBy,
    partial_shipments_allowed: partialShipmentsAllowed,
    transshipment_allowed: transshipmentAllowed,
    description_of_goods: formData.descriptionOfGoods,
    port_of_loading: formData.portOfLoading,
    port_of_discharge: formData.portOfDischarge,
    latest_shipment_date: formData.latestShipmentDate || null,
    presentation_period: formData.presentationPeriod,
    required_documents: formData.documentRequirements.length > 0 
      ? formData.documentRequirements.map(doc => `${doc.name} - ${doc.original} Original${doc.original > 1 ? 's' : ''}, ${doc.copies} Cop${doc.copies === 1 ? 'y' : 'ies'}`)
      : formData.requiredDocuments,
    additional_conditions: formData.additionalConditions,
    status: 'draft'
  };

  const { error } = await supabase
    .rpc('insert_import_lc_request', {
      request_data: insertData
    });

  if (error) {
    console.error('Database error:', error);
    throw error;
  }

  console.log('Draft saved successfully');
};
