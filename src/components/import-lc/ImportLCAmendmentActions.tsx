
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImportLCFormStep } from '@/types/importLC';

interface ImportLCAmendmentActionsProps {
  currentStep: ImportLCFormStep;
  isValid: boolean;
  changesCount: number;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  onDiscard: () => void;
  onClose: () => void;
  onBack: () => void;
}

const ImportLCAmendmentActions: React.FC<ImportLCAmendmentActionsProps> = ({
  currentStep,
  isValid,
  changesCount,
  onPrevious,
  onNext,
  onSaveDraft,
  onSubmit,
  onDiscard,
  onClose,
  onBack
}) => {
  const steps: ImportLCFormStep[] = ['basic', 'parties', 'amount', 'shipment', 'documents'];
  const currentStepIndex = steps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
      {/* Left side - Go Back button */}
      <div className="flex gap-3">
        {isFirstStep ? (
          <Button
            onClick={onBack}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Go Back
          </Button>
        ) : (
          <Button
            onClick={onPrevious}
            variant="outline"
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Previous
          </Button>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex gap-3 items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {changesCount} change{changesCount !== 1 ? 's' : ''}
        </span>
        
        <Button
          onClick={onDiscard}
          variant="outline"
          className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          Discard
        </Button>
        
        <Button
          onClick={onSaveDraft}
          variant="outline"
          className="border-amber-300 dark:border-amber-600 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
        >
          Save as Draft
        </Button>

        {isLastStep ? (
          <Button
            onClick={onSubmit}
            disabled={changesCount === 0}
            className="bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 disabled:cursor-not-allowed px-8"
          >
            Submit Amendment
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImportLCAmendmentActions;
