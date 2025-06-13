
import { useCallback } from 'react';
import { ImportLCFormData, ImportLCFormStep } from '@/types/importLC';

const useImportLCFormValidation = (formData: ImportLCFormData, currentStep: ImportLCFormStep) => {
  // Form validation
  const validateCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 'basic':
        return !!(formData.corporateReference && formData.formOfDocumentaryCredit);
      case 'parties':
        const hasApplicant = formData.parties.some(p => p.role === 'applicant') || 
                           (formData.applicantName && formData.applicantAddress);
        const hasBeneficiary = formData.parties.some(p => p.role === 'beneficiary') || 
                             (formData.beneficiaryName && formData.beneficiaryAddress);
        return hasApplicant && hasBeneficiary;
      case 'amount':
        return !!(formData.lcAmount > 0 && formData.currency);
      case 'shipment':
        return !!(formData.descriptionOfGoods && formData.latestShipmentDate);
      case 'documents':
        return formData.documentRequirements.length > 0 || formData.requiredDocuments.length > 0;
      default:
        return false;
    }
  }, [currentStep, formData]);

  return {
    validateCurrentStep
  };
};

export default useImportLCFormValidation;
