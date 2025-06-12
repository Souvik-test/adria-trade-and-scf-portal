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

export type ImportLCFormStep = 'basic' | 'applicant' | 'beneficiary' | 'amount' | 'shipment' | 'documents' | 'preview';

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
    const steps: ImportLCFormStep[] = ['basic', 'applicant', 'beneficiary', 'amount', 'shipment', 'documents', 'preview'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    const steps: ImportLCFormStep[] = ['basic', 'applicant', 'beneficiary', 'amount', 'shipment', 'documents', 'preview'];
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
      case 'applicant':
        return !!(formData.applicantName && formData.applicantAddress);
      case 'beneficiary':
        return !!(formData.beneficiaryName && formData.beneficiaryAddress);
      case 'amount':
        return !!(formData.lcAmount > 0 && formData.currency);
      case 'shipment':
        return !!(formData.descriptionOfGoods && formData.latestShipmentDate);
      case 'documents':
        return formData.requiredDocuments.length > 0;
      case 'preview':
        return true; // Always valid for preview step
      default:
        return false;
    }
  }, [currentStep, formData]);

  return {
    formData,
    currentStep,
    setCurrentStep,
    updateField,
    goToStep,
    nextStep,
    previousStep,
    validateCurrentStep
  };
};

export default useImportLCForm;
