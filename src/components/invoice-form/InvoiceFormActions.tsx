
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { InvoiceFormStep } from '@/hooks/useInvoiceForm';

interface InvoiceFormActionsProps {
  currentStep: InvoiceFormStep;
  onDiscard: () => void;
  onSaveAsDraft: () => void;
  onGoBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canProceed: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const InvoiceFormActions: React.FC<InvoiceFormActionsProps> = ({
  currentStep,
  onDiscard,
  onSaveAsDraft,
  onGoBack,
  onNext,
  onSubmit,
  canProceed,
  isFirstStep,
  isLastStep
}) => {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
      <div className="flex justify-between items-center">
        {/* Left aligned - Go Back button */}
        <div className="flex">
          {!isFirstStep && (
            <Button
              onClick={onGoBack}
              variant="outline"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          )}
        </div>
        
        {/* Right aligned - Action buttons */}
        <div className="flex gap-3">
          <Button
            onClick={onDiscard}
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
          >
            Discard
          </Button>
          
          <Button
            onClick={onSaveAsDraft}
            variant="outline"
            className="text-amber-600 border-amber-300 hover:bg-amber-50 hover:border-amber-400 dark:text-amber-400 dark:border-amber-600 dark:hover:bg-amber-900/20"
          >
            Save as Draft
          </Button>
          
          {!isLastStep ? (
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className="flex items-center gap-2 bg-corporate-teal-600 hover:bg-corporate-teal-700 text-white disabled:opacity-50"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={onSubmit}
              disabled={!canProceed}
              className="bg-corporate-teal-600 hover:bg-corporate-teal-700 text-white px-8 disabled:opacity-50"
            >
              Submit Invoice
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceFormActions;
