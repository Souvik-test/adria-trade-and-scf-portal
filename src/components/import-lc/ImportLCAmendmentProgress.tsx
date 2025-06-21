
import React from 'react';
import { ImportLCFormStep, ImportLCFormData } from '@/types/importLC';

interface ImportLCAmendmentProgressProps {
  currentStep: ImportLCFormStep;
  onStepClick: (step: ImportLCFormStep) => void;
  formData: ImportLCFormData;
}

const ImportLCAmendmentProgress: React.FC<ImportLCAmendmentProgressProps> = ({
  currentStep,
  onStepClick,
  formData
}) => {
  const steps: { key: ImportLCFormStep; label: string; description: string }[] = [
    { key: 'basic', label: 'Basic Info', description: 'LC details and dates' },
    { key: 'parties', label: 'Parties', description: 'Applicant & beneficiary' },
    { key: 'amount', label: 'Amount & Terms', description: 'LC amount and conditions' },
    { key: 'shipment', label: 'Shipment', description: 'Goods and shipping details' },
    { key: 'documents', label: 'Documents', description: 'Required documentation' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex-1 relative">
            {/* Step Circle */}
            <div className="flex items-center">
              <button
                onClick={() => onStepClick(step.key)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  index <= currentStepIndex
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                } hover:bg-amber-700 hover:text-white`}
              >
                {index + 1}
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    index < currentStepIndex
                      ? 'bg-amber-600'
                      : 'bg-gray-200 dark:bg-gray-600'
                  }`}
                />
              )}
            </div>
            
            {/* Step Label */}
            <div className="mt-2 text-center">
              <div className={`text-sm font-medium ${
                index <= currentStepIndex
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step.label}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImportLCAmendmentProgress;
