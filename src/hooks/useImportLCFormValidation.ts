
import { useCallback } from 'react';
import { ImportLCFormData, ImportLCFormStep } from '@/types/importLC';

const useImportLCFormValidation = (formData: ImportLCFormData, currentStep: ImportLCFormStep) => {
  // Form validation
  const validateCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 'basic':
        // PO/PI is fully optional now, submission should not be blocked by empty popiNumber/type
        return !!(formData.corporateReference && formData.formOfDocumentaryCredit);
      case 'parties':
        // Only require applicant & beneficiary (from parties array OR legacy fields)
        const hasApplicant = Array.isArray(formData.parties)
          ? formData.parties.some(p => p.role === 'applicant' && p.name && p.address)
          : (formData.applicantName && formData.applicantAddress);
        const hasBeneficiary = Array.isArray(formData.parties)
          ? formData.parties.some(p => p.role === 'beneficiary' && p.name && p.address)
          : (formData.beneficiaryName && formData.beneficiaryAddress);
        return hasApplicant && hasBeneficiary;
      case 'amount':
        return !!(formData.lcAmount > 0 && formData.currency);
      case 'shipment':
        return !!(formData.descriptionOfGoods && formData.latestShipmentDate);
      case 'documents':
        return (Array.isArray(formData.documentRequirements) && formData.documentRequirements.length > 0)
          || (Array.isArray(formData.requiredDocuments) && formData.requiredDocuments.length > 0);
      default:
        return false;
    }
  }, [currentStep, formData]);

  return {
    validateCurrentStep
  };
};

export default useImportLCFormValidation;
