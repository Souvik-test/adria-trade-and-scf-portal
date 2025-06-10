
import React from 'react';
import { POPIFormStep } from '@/hooks/usePOPIForm';

interface POPIProgressIndicatorProps {
  currentStep: POPIFormStep;
  instrumentType: 'purchase-order' | 'proforma-invoice';
}

const POPIProgressIndicator: React.FC<POPIProgressIndicatorProps> = ({ 
  currentStep, 
  instrumentType 
}) => {
  const steps = [
    { 
      key: 'general' as POPIFormStep, 
      label: 'General Details',
      description: instrumentType === 'purchase-order' ? 'PO Information' : 'PI Information'
    },
    { 
      key: 'items' as POPIFormStep, 
      label: 'Item Details',
      description: 'Products & Services'
    },
    { 
      key: 'summary' as POPIFormStep, 
      label: 'Summary',
      description: 'Review & Submit'
    }
  ];

  const currentIndex = steps.findIndex(step => step.key === currentStep);

  return (
    <div className="flex items-center justify-between mb-8 px-4">
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                index <= currentIndex
                  ? 'bg-corporate-teal text-white border-corporate-teal'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border-gray-300 dark:border-gray-600'
              }`}
            >
              {index + 1}
            </div>
            <div className="mt-2 text-center">
              <div
                className={`text-sm font-medium ${
                  index <= currentIndex
                    ? 'text-corporate-teal'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {step.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {step.description}
              </div>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-4 ${
                index < currentIndex
                  ? 'bg-corporate-teal'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default POPIProgressIndicator;
