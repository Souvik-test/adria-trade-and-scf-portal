
import { useCallback } from 'react';
import { ImportLCFormStep } from '@/types/importLC';
import useImportLCFormState from './useImportLCFormState';
import useImportLCFormValidation from './useImportLCFormValidation';
import { submitImportLCRequest, saveDraftImportLCRequest } from '@/services/importLCSubmission';

const useImportLCForm = () => {
  const {
    formData,
    currentStep,
    setCurrentStep,
    updateField,
    resetForm
  } = useImportLCFormState();

  const { validateCurrentStep } = useImportLCFormValidation(formData, currentStep);

  // Navigation
  const goToStep = useCallback((step: ImportLCFormStep) => {
    setCurrentStep(step);
  }, [setCurrentStep]);

  const nextStep = useCallback(() => {
    const steps: ImportLCFormStep[] = ['basic', 'parties', 'amount', 'shipment', 'documents'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep, setCurrentStep]);

  const previousStep = useCallback(() => {
    const steps: ImportLCFormStep[] = ['basic', 'parties', 'amount', 'shipment', 'documents'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep, setCurrentStep]);

  // Submit form
  const submitForm = useCallback(async () => {
    return await submitImportLCRequest(formData);
  }, [formData]);

  // Save draft
  const saveDraft = useCallback(async () => {
    return await saveDraftImportLCRequest(formData);
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
    submitForm,
    saveDraft,
    resetForm
  };
};

export default useImportLCForm;
