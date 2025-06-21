
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
  const [isLCSelected, setIsLCSelected] = useState(false);

  // Calculate changes between original and current data
  const changes = useMemo(() => {
    if (!isLCSelected) return {};
    
    const changeMap: Record<string, { original: any; current: any }> = {};
    
    Object.keys(formData).forEach((key) => {
      const originalValue = originalData[key as keyof ImportLCFormData];
      const currentValue = formData[key as keyof ImportLCFormData];
      
      // Only show as changed if values are actually different
      if (JSON.stringify(originalValue) !== JSON.stringify(currentValue)) {
        changeMap[key] = {
          original: originalValue,
          current: currentValue
        };
      }
    });
    
    return changeMap;
  }, [formData, originalData, isLCSelected]);

  const updateField = useCallback((field: keyof ImportLCFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Function to populate data when LC is selected - Updated with correct field mapping
  const populateFromLC = useCallback((lcData: any) => {
    const populatedData = {
      ...EMPTY_FORM_DATA,
      corporateReference: lcData.corporate_reference || '',
      formOfDocumentaryCredit: lcData.form_of_documentary_credit || '',
      applicableRules: lcData.applicable_rules || '',
      lcType: lcData.lc_type || '',
      placeOfExpiry: lcData.place_of_expiry || '',
      issueDate: lcData.issue_date || '',
      expiryDate: lcData.expiry_date || '',
      issuingBank: lcData.issuing_bank || '',
      applicantName: lcData.applicant_name || '',
      applicantAddress: lcData.applicant_address || '',
      applicantAccountNumber: lcData.applicant_account_number || '',
      beneficiaryName: lcData.beneficiary_name || '',
      beneficiaryAddress: lcData.beneficiary_address || '',
      beneficiaryBankName: lcData.beneficiary_bank_name || '',
      beneficiaryBankAddress: lcData.beneficiary_bank_address || '',
      beneficiaryBankSwiftCode: lcData.beneficiary_bank_swift_code || '',
      advisingBankSwiftCode: lcData.advising_bank_swift_code || '',
      lcAmount: lcData.lc_amount || 0,
      currency: lcData.currency || '',
      tolerance: lcData.tolerance || '',
      availableWith: lcData.available_with || '',
      availableBy: lcData.available_by || '',
      partialShipmentsAllowed: lcData.partial_shipments_allowed || false,
      transshipmentAllowed: lcData.transshipment_allowed || false,
      isTransferable: lcData.is_transferable || false,
      descriptionOfGoods: lcData.description_of_goods || '',
      portOfLoading: lcData.port_of_loading || '',
      portOfDischarge: lcData.port_of_discharge || '',
      latestShipmentDate: lcData.latest_shipment_date || '',
      presentationPeriod: lcData.presentation_period || '',
      requiredDocuments: lcData.required_documents || [],
      additionalConditions: lcData.additional_conditions || ''
    };

    setOriginalData(populatedData);
    setFormData(populatedData);
    setIsLCSelected(true);
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
    return Promise.resolve();
  }, [changes, formData]);

  const resetForm = useCallback(() => {
    setFormData(EMPTY_FORM_DATA);
    setOriginalData(EMPTY_FORM_DATA);
    setCurrentStep('basic');
    setIsLCSelected(false);
  }, []);

  return {
    formData,
    originalData,
    currentStep,
    changes,
    isLCSelected,
    updateField,
    populateFromLC,
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
