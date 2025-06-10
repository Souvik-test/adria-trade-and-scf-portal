
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
            className="bg-gray-500 hover:bg-gray-600 text-white"
          >
            Go Back
          </Button>
        )}
      </div>

      {/* Right aligned buttons */}
      <div className="flex gap-3">
        <Button
          onClick={onDiscard}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          Discard
        </Button>
        
        <Button
          onClick={onSaveAsDraft}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          Save as Draft
        </Button>
        
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
