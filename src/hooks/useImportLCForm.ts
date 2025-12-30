
import { useCallback } from 'react';
import { ImportLCFormStep, CLIENT_STEPS, BANK_STEPS } from '@/types/importLC';
import useImportLCFormState from './useImportLCFormState';
import useImportLCFormValidation from './useImportLCFormValidation';
import { submitImportLCRequest, saveDraftImportLCRequest } from '@/services/importLCSubmission';

const useImportLCForm = (isBankContext: boolean = false) => {
  const {
    formData,
    currentStep,
    setCurrentStep,
    updateField,
    resetForm
  } = useImportLCFormState();

  const { validateCurrentStep } = useImportLCFormValidation(formData, currentStep);

  const steps = isBankContext ? BANK_STEPS : CLIENT_STEPS;

  // Navigation
  const goToStep = useCallback((step: ImportLCFormStep) => {
    setCurrentStep(step);
  }, [setCurrentStep]);

  const nextStep = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep, setCurrentStep, steps]);

  const previousStep = useCallback(() => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep, setCurrentStep, steps]);

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
