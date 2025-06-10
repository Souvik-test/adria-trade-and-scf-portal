
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
    <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
      {/* Left aligned buttons */}
      <div className="flex gap-3">
        {!isFirstStep && (
          <Button
            onClick={onGoBack}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Go Back
          </Button>
        )}
      </div>

      {/* Right aligned buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onDiscard}
          variant="destructive"
          className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
        >
          Discard
        </Button>
        
        <Button
          onClick={onSaveAsDraft}
          variant="outline"
          className="border-amber-400 dark:border-amber-500 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
        >
          Save as Draft
        </Button>
        
        {!isLastStep ? (
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!canProceed}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default POPIFormActions;
