
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
    <div className="border-t border-border pt-6">
      <div className="flex justify-between items-center">
        {/* Left aligned - Go Back button */}
        <div className="flex">
          {!isFirstStep && (
            <Button
              onClick={onGoBack}
              variant="outline"
              className="flex items-center gap-2 border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
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
            className="text-red-600 border-red-400 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
          >
            Discard
          </Button>
          
          <Button
            onClick={onSaveAsDraft}
            variant="outline"
            className="text-amber-600 border-amber-400 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
          >
            Save as Draft
          </Button>
          
          {!isLastStep ? (
            <Button
              onClick={onNext}
              disabled={!canProceed}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 shadow-lg"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={onSubmit}
              disabled={!canProceed}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 disabled:opacity-50 shadow-lg"
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
