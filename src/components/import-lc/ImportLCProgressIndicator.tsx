
import React from 'react';
import { ImportLCFormData, ImportLCFormStep } from '@/hooks/useImportLCForm';

interface ImportLCProgressIndicatorProps {
  currentStep: ImportLCFormStep;
  onStepClick: (step: ImportLCFormStep) => void;
  formData: ImportLCFormData;
}

const ImportLCProgressIndicator: React.FC<ImportLCProgressIndicatorProps> = ({
  currentStep,
  onStepClick,
  formData
}) => {
  const steps = [
    { key: 'basic', label: 'Basic LC Information', required: true },
    { key: 'applicant', label: 'Applicant Information', required: true },
    { key: 'beneficiary', label: 'Beneficiary Information', required: true },
    { key: 'amount', label: 'LC Amount & Terms', required: true },
    { key: 'shipment', label: 'Shipment Details', required: true },
    { key: 'documents', label: 'Document Requirements', required: true }
  ] as const;

  const getStepStatus = (stepKey: ImportLCFormStep) => {
    if (stepKey === currentStep) return 'current';
    
    // Check if step is completed based on form data
    switch (stepKey) {
      case 'basic':
        return formData.corporateReference && formData.formOfDocumentaryCredit ? 'completed' : 'pending';
      case 'applicant':
        return formData.applicantName && formData.applicantAddress ? 'completed' : 'pending';
      case 'beneficiary':
        return formData.beneficiaryName && formData.beneficiaryAddress ? 'completed' : 'pending';
      case 'amount':
        return formData.lcAmount > 0 && formData.currency ? 'completed' : 'pending';
      case 'shipment':
        return formData.descriptionOfGoods && formData.latestShipmentDate ? 'completed' : 'pending';
      case 'documents':
        return formData.requiredDocuments.length > 0 ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const status = getStepStatus(step.key);
          const isClickable = status === 'completed' || status === 'current';
          
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => isClickable && onStepClick(step.key)}
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
                  {step.label}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-2 mt-3
                  ${getStepStatus(steps[index + 1].key) === 'completed' || status === 'completed'
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
