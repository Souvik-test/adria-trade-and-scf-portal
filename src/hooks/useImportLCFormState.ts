
import { useState, useCallback } from 'react';
import { ImportLCFormData, ImportLCFormStep, PartyDetail, DocumentRequirement } from '@/types/importLC';

const useImportLCFormState = () => {
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
    issuingBank: '',
    parties: [],
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
    documentRequirements: [],
    requiredDocuments: [],
    additionalConditions: '',
    supportingDocuments: []
  });

  // Update form field with proper type handling and explicit boolean conversion
  const updateField = useCallback((field: keyof ImportLCFormData, value: string | number | boolean | File[] | PartyDetail[] | DocumentRequirement[]) => {
    setFormData(prev => {
      // Handle boolean fields explicitly to ensure type safety
      if (field === 'partialShipmentsAllowed' || field === 'transshipmentAllowed') {
        // Ensure we always get a proper boolean value
        const boolValue = typeof value === 'boolean' ? value : Boolean(value);
        return {
          ...prev,
          [field]: boolValue
        };
      }
      return {
        ...prev,
        [field]: value
      };
    });
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
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
      issuingBank: '',
      parties: [],
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
      documentRequirements: [],
      requiredDocuments: [],
      additionalConditions: '',
      supportingDocuments: []
    });
    setCurrentStep('basic');
  }, []);

  return {
    formData,
    currentStep,
    setCurrentStep,
    updateField,
    resetForm
  };
};

export default useImportLCFormState;
