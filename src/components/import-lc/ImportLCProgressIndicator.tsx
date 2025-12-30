
import React from 'react';
import { ImportLCFormData, ImportLCFormStep, CLIENT_STEPS, BANK_STEPS } from '@/types/importLC';

interface ImportLCProgressIndicatorProps {
  currentStep: ImportLCFormStep;
  onStepClick: (step: ImportLCFormStep) => void;
  formData: ImportLCFormData;
  isBankContext?: boolean;
}

const STEP_LABELS: Record<ImportLCFormStep, string> = {
  basic: 'Basic LC Information',
  parties: 'Party Details',
  amount: 'LC Amount & Terms',
  shipment: 'Shipment Details',
  documents: 'Document Requirements',
  limits: 'Limit Details',
  sanctions: 'Sanction Details',
  accounting: 'Accounting Entries',
  release: 'Release Documents'
};

const ImportLCProgressIndicator: React.FC<ImportLCProgressIndicatorProps> = ({
  currentStep,
  onStepClick,
  formData,
  isBankContext = false
}) => {
  const activeSteps = isBankContext ? BANK_STEPS : CLIENT_STEPS;

  const getStepStatus = (stepKey: ImportLCFormStep) => {
    if (stepKey === currentStep) return 'current';

    switch (stepKey) {
      case 'basic':
        return formData.corporateReference && formData.formOfDocumentaryCredit ? 'completed' : 'pending';
      case 'parties': {
        const applicantComplete = Array.isArray(formData.parties)
          ? formData.parties.some(p => p.role === 'applicant' && p.name && p.address)
          : (formData.applicantName && formData.applicantAddress);
        const beneficiaryComplete = Array.isArray(formData.parties)
          ? formData.parties.some(p => p.role === 'beneficiary' && p.name && p.address)
          : (formData.beneficiaryName && formData.beneficiaryAddress);
        return (applicantComplete && beneficiaryComplete) ? 'completed' : 'pending';
      }
      case 'amount':
        return formData.lcAmount > 0 && formData.currency ? 'completed' : 'pending';
      case 'shipment':
        return formData.descriptionOfGoods && formData.latestShipmentDate ? 'completed' : 'pending';
      case 'documents':
        return formData.requiredDocuments.length > 0 ? 'completed' : 'pending';
      case 'limits':
        // Limits are auto-fetched, consider completed if we reached this step
        return 'pending';
      case 'sanctions':
        // Sanctions are auto-screened
        return 'pending';
      case 'accounting':
        // Accounting entries are auto-generated
        return 'pending';
      case 'release':
        // Release is final step
        return 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {activeSteps.map((stepKey, index) => {
          const status = getStepStatus(stepKey);
          const isClickable = status === 'completed' || status === 'current';

          return (
            <React.Fragment key={stepKey}>
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => isClickable && onStepClick(stepKey)}
                  disabled={!isClickable}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                    ${status === 'current'
                      ? 'bg-corporate-teal-500 text-white'
                      : status === 'completed'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-400 dark:bg-gray-600'
                    }
                    ${isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'}
                  `}
                  aria-current={status === 'current' ? "step" : undefined}
                >
                  {status === 'completed' ? '✓' : index + 1}
                </button>
                <span className={`text-xs mt-2 text-center max-w-20 leading-tight
                  ${status === 'current'
                    ? 'text-corporate-teal-600 font-medium'
                    : status === 'completed'
                      ? 'text-green-600'
                      : 'text-gray-400'
                  }
                `}>
                  {STEP_LABELS[stepKey]}
                </span>
              </div>

              {index < activeSteps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 mt-3
                  ${getStepStatus(activeSteps[index + 1]) === 'completed' || status === 'completed'
                    ? 'bg-green-500'
                    : 'bg-gray-200 dark:bg-gray-600'
                  }
                `} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ImportLCProgressIndicator;
