
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
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <Button
            onClick={onDiscard}
            variant="outline"
            className="text-gray-600 hover:text-gray-700 border-gray-300 hover:border-gray-400"
          >
            Discard
          </Button>
          <Button
            onClick={onSaveAsDraft}
            variant="outline"
            className="text-amber-600 hover:text-amber-700 border-amber-300 hover:border-amber-400"
          >
            Save as Draft
          </Button>
        </div>
        
        <div className="flex gap-2">
          {!isFirstStep && (
            <Button
              onClick={onGoBack}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          )}
          
          {!isLastStep ? (
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className="flex items-center gap-2 bg-corporate-teal-600 hover:bg-corporate-teal-700 text-white"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={onSubmit}
              disabled={!canProceed}
              className="bg-corporate-teal-600 hover:bg-corporate-teal-700 text-white px-8"
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
