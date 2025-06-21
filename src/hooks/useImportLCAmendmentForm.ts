
import { useState, useCallback, useMemo } from 'react';
import { ImportLCFormData, ImportLCFormStep } from '@/types/importLC';
import { saveImportLCAmendment } from '@/services/importLCAmendmentService';

// Empty initial form data - will be populated when LC is selected
const EMPTY_FORM_DATA: ImportLCFormData = {
  popiNumber: '',
  popiType: '',
  formOfDocumentaryCredit: '',
  corporateReference: '',
  applicableRules: '',
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
  currency: '',
  tolerance: '',
  additionalAmount: 0,
  availableWith: '',
  availableBy: '',
  partialShipmentsAllowed: false,
  transshipmentAllowed: false,
  isTransferable: false,
  descriptionOfGoods: '',
  portOfLoading: '',
  portOfDischarge: '',
  latestShipmentDate: '',
  presentationPeriod: '',
  documentRequirements: [],
  requiredDocuments: [],
  additionalConditions: '',
  supportingDocuments: []
};

const useImportLCAmendmentForm = () => {
  const [originalData, setOriginalData] = useState<ImportLCFormData>(EMPTY_FORM_DATA);
  const [formData, setFormData] = useState<ImportLCFormData>(EMPTY_FORM_DATA);
  const [currentStep, setCurrentStep] = useState<ImportLCFormStep>('basic');

  // Calculate changes between original and current data
  const changes = useMemo(() => {
    const changeMap: Record<string, { original: any; current: any }> = {};
    
    Object.keys(formData).forEach((key) => {
      const originalValue = originalData[key as keyof ImportLCFormData];
      const currentValue = formData[key as keyof ImportLCFormData];
      
      if (JSON.stringify(originalValue) !== JSON.stringify(currentValue)) {
        changeMap[key] = {
          original: originalValue,
          current: currentValue
        };
      }
    });
    
    return changeMap;
  }, [formData, originalData]);

  const updateField = useCallback((field: keyof ImportLCFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Set original data when LC is first selected (corporate reference)
    if (field === 'corporateReference' && value && !originalData.corporateReference) {
      setOriginalData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  }, [originalData.corporateReference]);

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

  const validateCurrentStep = useCallback(() => {
    // Basic validation - in real app, implement proper validation per step
    return Object.keys(changes).length > 0;
  }, [changes]);

  const submitAmendment = useCallback(async () => {
    if (Object.keys(changes).length === 0) {
      throw new Error('No changes detected to submit');
    }
    
    const amendmentData = {
      originalLcReference: originalData.corporateReference,
      changes,
      formData,
      amendmentReason: 'User requested amendment'
    };
    
    return await saveImportLCAmendment(amendmentData);
  }, [changes, formData, originalData.corporateReference]);

  const saveDraft = useCallback(async () => {
    console.log('Saving amendment draft...', { changes, formData });
    // Implementation for saving draft
    return Promise.resolve();
  }, [changes, formData]);

  const resetForm = useCallback(() => {
    setFormData(EMPTY_FORM_DATA);
    setOriginalData(EMPTY_FORM_DATA);
    setCurrentStep('basic');
  }, []);

  return {
    formData,
    originalData,
    currentStep,
    changes,
    updateField,
    goToStep,
    nextStep,
    previousStep,
    validateCurrentStep,
    submitAmendment,
    saveDraft,
    resetForm
  };
};

export default useImportLCAmendmentForm;
