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
    isTransferable: false, // new default value
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

  // Update form field (BOOLEAN explicit for isTransferable)
  const updateField = useCallback((field: keyof ImportLCFormData, value: any) => {
    setFormData(prev => {
      if (
        field === 'partialShipmentsAllowed' ||
        field === 'transshipmentAllowed' ||
        field === 'isTransferable'
      ) {
        // Ensure proper boolean
        const boolValue = typeof value === 'boolean' ? value : value === 'true' || value === true;
        return { ...prev, [field]: boolValue };
      }
      return { ...prev, [field]: value };
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
      isTransferable: false, // new default value
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
