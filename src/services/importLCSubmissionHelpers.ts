
import { ImportLCFormData } from '@/types/importLC';

type InsertData = {
  user_id: string;
  popi_number: string;
  popi_type: string;
  form_of_documentary_credit: string;
  corporate_reference: string;
  applicable_rules: string;
  lc_type: string;
  issue_date: string | null;
  expiry_date: string | null;
  place_of_expiry: string;
  applicant_name: string;
  applicant_address: string;
  applicant_account_number: string;
  beneficiary_name: string;
  beneficiary_address: string;
  beneficiary_bank_name: string;
  beneficiary_bank_address: string;
  beneficiary_bank_swift_code: string;
  advising_bank_swift_code: string;
  lc_amount: number;
  currency: string;
  tolerance: string;
  additional_amount: number;
  available_with: string;
  available_by: string;
  partial_shipments_allowed: boolean;
  transshipment_allowed: boolean;
  description_of_goods: string;
  port_of_loading: string;
  port_of_discharge: string;
  latest_shipment_date: string | null;
  presentation_period: string;
  required_documents: string[];
  additional_conditions: string;
  status: string;
  is_transferable: boolean; // ADD this to insert type
};

export function getParties(formData: ImportLCFormData) {
  const applicantParty = formData.parties.find((p) => p.role === 'applicant');
  const beneficiaryParty = formData.parties.find((p) => p.role === 'beneficiary');
  const advisingBankParty = formData.parties.find((p) => p.role === 'advising_bank');
  return { applicantParty, beneficiaryParty, advisingBankParty };
}

export function getRequiredDocuments(formData: ImportLCFormData): string[] {
  if (formData.documentRequirements.length > 0) {
    return formData.documentRequirements.map(
      (doc) =>
        `${doc.name} - ${doc.original} Original${doc.original > 1 ? 's' : ''}, ${doc.copies} Cop${doc.copies === 1 ? 'y' : 'ies'}`
    );
  }
  if (Array.isArray(formData.requiredDocuments)) {
    // Defensive: ensure string[]
    return [...formData.requiredDocuments.filter((d): d is string => typeof d === "string")];
  }
  return [];
}

export function buildInsertData(
  user: { id: string; user_id?: string },
  formData: ImportLCFormData,
  status: 'submitted' | 'draft'
) {
  const { applicantParty, beneficiaryParty, advisingBankParty } = getParties(formData);
  const partialShipmentsAllowed = Boolean(formData.partialShipmentsAllowed);
  const transshipmentAllowed = Boolean(formData.transshipmentAllowed);
  const requiredDocuments = getRequiredDocuments(formData);

  return {
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
    tolerance: String(formData.tolerance ?? ''),
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
    required_documents: [...requiredDocuments],
    additional_conditions: formData.additionalConditions,
    status,
    is_transferable: formData.isTransferable ?? false // Include new field
  };
}
