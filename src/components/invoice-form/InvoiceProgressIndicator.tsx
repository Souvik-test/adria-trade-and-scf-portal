
import React from 'react';
import { InvoiceFormStep, InvoiceFormData } from '@/hooks/useInvoiceForm';

interface InvoiceProgressIndicatorProps {
  currentStep: InvoiceFormStep;
  invoiceType: InvoiceFormData['invoiceType'];
}

const InvoiceProgressIndicator: React.FC<InvoiceProgressIndicatorProps> = ({
  currentStep,
  invoiceType
}) => {
  const getStepTitle = (step: InvoiceFormStep) => {
    switch (step) {
      case 'general':
        return 'General Details';
      case 'items':
        return 'Line Items';
      case 'summary':
        return 'Summary';
      default:
        return '';
    }
  };

  const steps: InvoiceFormStep[] = ['general', 'items', 'summary'];
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  index <= currentStepIndex
                    ? 'bg-corporate-teal-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                }`}
              >
                {index + 1}
              </div>
              <span 
                className={`mt-2 text-sm font-medium ${
                  index <= currentStepIndex
                    ? 'text-corporate-teal-600 dark:text-corporate-teal-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {getStepTitle(step)}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`flex-1 h-0.5 mx-4 transition-colors ${
                  index < currentStepIndex
                    ? 'bg-corporate-teal-600'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}
                style={{ minWidth: '60px' }}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default InvoiceProgressIndicator;
