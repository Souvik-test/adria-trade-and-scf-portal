
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
      <div className="flex gap-3">
        <Button
          variant="destructive"
          onClick={onDiscard}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Discard
        </Button>
        <Button
          variant="outline"
          onClick={onSaveAsDraft}
          className="border-amber-400 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
        >
          Save as Draft
        </Button>
      </div>

      <div className="flex gap-3">
        {!isFirstStep && (
          <Button
            variant="outline"
            onClick={onGoBack}
            className="border-gray-400 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Go Back
          </Button>
        )}
        
        {!isLastStep ? (
          <Button
            onClick={onNext}
            disabled={!canProceed}
            className="bg-corporate-teal hover:bg-corporate-teal/90 text-white"
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={onSubmit}
            disabled={!canProceed}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default POPIFormActions;
