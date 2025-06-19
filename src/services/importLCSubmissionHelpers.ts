
import { ImportLCFormData } from '@/types/importLC';
import { User } from '@supabase/supabase-js';

export const buildInsertData = (user: User, formData: ImportLCFormData, status: 'submitted' | 'draft') => {
  return {
    user_id: user.id,
    popi_number: formData.popiNumber || null,
    popi_type: formData.popiType || null,
    form_of_documentary_credit: formData.formOfDocumentaryCredit,
    corporate_reference: formData.corporateReference,
    applicable_rules: formData.applicableRules,
    lc_type: formData.lcType || null,
    issue_date: formData.issueDate || null,
    expiry_date: formData.expiryDate || null,
    place_of_expiry: formData.placeOfExpiry || null,
    applicant_name: formData.applicantName || null,
    applicant_address: formData.applicantAddress || null,
    applicant_account_number: formData.applicantAccountNumber || null,
    beneficiary_name: formData.beneficiaryName || null,
    beneficiary_address: formData.beneficiaryAddress || null,
    beneficiary_bank_name: formData.beneficiaryBankName || null,
    beneficiary_bank_address: formData.beneficiaryBankAddress || null,
    beneficiary_bank_swift_code: formData.beneficiaryBankSwiftCode || null,
    advising_bank_swift_code: formData.advisingBankSwiftCode || null,
    lc_amount: formData.lcAmount || 0,
    currency: formData.currency || 'USD',
    tolerance: formData.tolerance || null,
    additional_amount: formData.additionalAmount || 0,
    available_with: formData.availableWith || null,
    available_by: formData.availableBy || null,
    partial_shipments_allowed: formData.partialShipmentsAllowed || false,
    transshipment_allowed: formData.transshipmentAllowed || false,
    is_transferable: formData.isTransferable || false,
    description_of_goods: formData.descriptionOfGoods || null,
    port_of_loading: formData.portOfLoading || null,
    port_of_discharge: formData.portOfDischarge || null,
    latest_shipment_date: formData.latestShipmentDate || null,
    presentation_period: formData.presentationPeriod || null,
    required_documents: formData.requiredDocuments || [],
    additional_conditions: formData.additionalConditions || null,
    status: status
  };
};
