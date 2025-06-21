
import { useState, useCallback, useMemo } from 'react';
import { ImportLCFormData, ImportLCFormStep } from '@/types/importLC';
import { saveImportLCAmendment } from '@/services/importLCAmendmentService';

// Mock original LC data - in real app, this would come from API
const MOCK_ORIGINAL_LC: ImportLCFormData = {
  popiNumber: 'PO-2024-001',
  popiType: 'PO',
  formOfDocumentaryCredit: 'IRREVOCABLE',
  corporateReference: 'LC-2024-IMP-001',
  applicableRules: 'UCP Latest Version',
  lcType: 'At Sight',
  issueDate: '2024-01-15',
  expiryDate: '2024-04-15',
  placeOfExpiry: 'Mumbai, India',
  confirmation: 'Without',
  issuing_bank: 'HDFC Bank Ltd',
  parties: [],
  applicantName: 'ABC Importers Ltd',
  applicantAddress: '123 Business Street, Mumbai, India',
  applicantAccountNumber: '50200012345678',
  beneficiaryName: 'XYZ Exporters Inc',
  beneficiaryAddress: '456 Export Avenue, New York, USA',
  beneficiaryBankName: 'Citibank N.A.',
  beneficiaryBankAddress: '789 Wall Street, New York, USA',
  beneficiaryBankSwiftCode: 'CITIUS33',
  advisingBankSwiftCode: 'HDFCINBB',
  lcAmount: 250000,
  currency: 'USD',
  tolerance: '+/- 10%',
  additionalAmount: 0,
  availableWith: 'Any Bank',
  availableBy: 'Negotiation',
  partialShipmentsAllowed: true,
  transshipmentAllowed: false,
  isTransferable: false,
  descriptionOfGoods: 'Cotton Textiles as per Proforma Invoice',
  portOfLoading: 'New York',
  portOfDischarge: 'JNPT Mumbai',
  latestShipmentDate: '2024-03-30',
  presentationPeriod: '21 days after shipment date',
  documentRequirements: [],
  requiredDocuments: ['Commercial Invoice', 'Packing List', 'Bill of Lading'],
  additionalConditions: 'Insurance to be covered by beneficiary',
  supportingDocuments: []
};

const useImportLCAmendmentForm = () => {
  const [originalData] = useState<ImportLCFormData>(MOCK_ORIGINAL_LC);
  const [formData, setFormData] = useState<ImportLCFormData>({ ...MOCK_ORIGINAL_LC });
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
  }, []);

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
    setFormData({ ...originalData });
    setCurrentStep('basic');
  }, [originalData]);

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
