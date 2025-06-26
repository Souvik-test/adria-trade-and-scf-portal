
import React from 'react';
import { Button } from '@/components/ui/button';
import { POPIFormStep } from '@/hooks/usePOPIForm';

interface POPIFormActionsProps {
  currentStep: POPIFormStep;
  onDiscard: () => void;
  onSaveAsDraft: () => void;
  onGoBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canProceed: boolean;
  isFirstStep: boolean;
  isLastStep: boolean;
}

const POPIFormActions: React.FC<POPIFormActionsProps> = ({
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
    <div className="flex justify-between items-center pt-6 border-t border-border">
      {/* Left aligned buttons */}
      <div className="flex gap-3">
        {!isFirstStep && (
          <Button
            onClick={onGoBack}
            variant="outline"
            className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
          >
            Go Back
          </Button>
        )}
      </div>

      {/* Right aligned buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onDiscard}
          variant="outline"
          className="border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20 px-6 py-2 text-sm font-medium"
        >
          Discard
        </Button>
        
        <Button
          onClick={onSaveAsDraft}
          variant="outline"
          className="border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
        >
          Save as Draft
        </Button>
        
        {!isLastStep ? (
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!canProceed}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default POPIFormActions;
