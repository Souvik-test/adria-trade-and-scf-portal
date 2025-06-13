
import { useState, useCallback } from 'react';

export interface ImportLCFormData {
  // Basic LC Information
  popiNumber: string;
  popiType: 'PO' | 'PI' | '';
  formOfDocumentaryCredit: string;
  corporateReference: string;
  applicableRules: string;
  lcType: string;
  issueDate: string;
  expiryDate: string;
  placeOfExpiry: string;
  confirmation: string;

  // Applicant Information
  applicantName: string;
  applicantAddress: string;
  applicantAccountNumber: string;

  // Beneficiary Information
  beneficiaryName: string;
  beneficiaryAddress: string;
  beneficiaryBankName: string;
  beneficiaryBankAddress: string;
  beneficiaryBankSwiftCode: string;
  advisingBankSwiftCode: string;

  // LC Amount and Terms
  lcAmount: number;
  currency: string;
  tolerance: string;
  additionalAmount: number;
  availableWith: string;
  availableBy: string;
  partialShipmentsAllowed: boolean;
  transshipmentAllowed: boolean;

  // Shipment Details
  descriptionOfGoods: string;
  portOfLoading: string;
  portOfDischarge: string;
  latestShipmentDate: string;
  presentationPeriod: string;

  // Document Requirements
  requiredDocuments: string[];
  additionalConditions: string;
  supportingDocuments: File[];
}

export type ImportLCFormStep = 'basic' | 'parties' | 'amount' | 'shipment' | 'documents';

const useImportLCForm = () => {
  const [currentStep, setCurrentStep] = useState<ImportLCFormStep>('basic');
  const [formData, setFormData] = useState<ImportLCFormData>({
    popiNumber: '',
    popiType: '',
    formOfDocumentaryCredit: '',
    corporateReference: '',
    applicableRules: 'UCP Latest Version',
    lcType: '',
    issueDate: '',
    expiryDate: '',
    placeOfExpiry: '',
    confirmation: '',
    applicantName: '',
    applicantAddress: '',
    applicantAccountNumber: '',
    beneficiaryName: '',
    beneficiaryAddress: '',
    beneficiaryBankName: '',
    beneficiaryBankAddress: '',
    beneficiaryBankSwiftCode: '',
    advisingBankSwiftCode: '',
    lcAmount: 0,
    currency: 'USD',
    tolerance: '',
    additionalAmount: 0,
    availableWith: '',
    availableBy: '',
    partialShipmentsAllowed: false,
    transshipmentAllowed: false,
    descriptionOfGoods: '',
    portOfLoading: '',
    portOfDischarge: '',
    latestShipmentDate: '',
    presentationPeriod: '',
    requiredDocuments: [],
    additionalConditions: '',
    supportingDocuments: []
  });

  // Update form field
  const updateField = useCallback((field: keyof ImportLCFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Navigation
  const goToStep = useCallback((step: ImportLCFormStep) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    const steps: ImportLCFormStep[] = ['basic', 'parties', 'amount', 'shipment', 'documents'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    const steps: ImportLCFormStep[] = ['basic', 'parties', 'amount', 'shipment', 'documents'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  // Form validation
  const validateCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 'basic':
        return !!(formData.corporateReference && formData.formOfDocumentaryCredit);
      case 'parties':
        return !!(formData.applicantName && formData.applicantAddress && 
                 formData.beneficiaryName && formData.beneficiaryAddress);
      case 'amount':
        return !!(formData.lcAmount > 0 && formData.currency);
      case 'shipment':
        return !!(formData.descriptionOfGoods && formData.latestShipmentDate);
      case 'documents':
        return formData.requiredDocuments.length > 0;
      default:
        return false;
    }
  }, [currentStep, formData]);

  // Submit form
  const submitForm = useCallback(async () => {
    const user = customAuth.getSession()?.user;
    if (!user) {
      throw new Error('User not authenticated');
    }

    try {
      const { data, error } = await supabase
        .from('import_lc_requests')
        .insert({
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
          applicant_name: formData.applicantName,
          applicant_address: formData.applicantAddress,
          applicant_account_number: formData.applicantAccountNumber,
          beneficiary_name: formData.beneficiaryName,
          beneficiary_address: formData.beneficiaryAddress,
          beneficiary_bank_name: formData.beneficiaryBankName,
          beneficiary_bank_address: formData.beneficiaryBankAddress,
          beneficiary_bank_swift_code: formData.beneficiaryBankSwiftCode,
          advising_bank_swift_code: formData.advisingBankSwiftCode,
          lc_amount: formData.lcAmount,
          currency: formData.currency,
          tolerance: formData.tolerance,
          additional_amount: formData.additionalAmount,
          available_with: formData.availableWith,
          available_by: formData.availableBy,
          partial_shipments_allowed: formData.partialShipmentsAllowed,
          transshipment_allowed: formData.transshipmentAllowed,
          description_of_goods: formData.descriptionOfGoods,
          port_of_loading: formData.portOfLoading,
          port_of_discharge: formData.portOfDischarge,
          latest_shipment_date: formData.latestShipmentDate || null,
          presentation_period: formData.presentationPeriod,
          required_documents: formData.requiredDocuments,
          additional_conditions: formData.additionalConditions,
          status: 'submitted'
        })
        .select()
        .single();

      if (error) throw error;

      console.log('Import LC request submitted successfully:', data);
      return data;
    } catch (error) {
      console.error('Error submitting Import LC request:', error);
      throw error;
    }
  }, [formData]);

  return {
    formData,
    currentStep,
    setCurrentStep,
    updateField,
    goToStep,
    nextStep,
    previousStep,
    validateCurrentStep,
    submitForm
  };
};

export default useImportLCForm;
