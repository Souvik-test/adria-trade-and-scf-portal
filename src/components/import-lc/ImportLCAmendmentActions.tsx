
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
    <div className="flex justify-between items-center pt-6 border-t border-border bg-card">
      {/* Left side - Only show Go Back button if not on first step */}
      <div className="flex gap-3">
        {!isFirstStep && (
          <Button
            onClick={onPrevious}
            variant="outline"
            className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
          >
            Go Back
          </Button>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex gap-3 items-center">
        <span className="text-sm text-muted-foreground">
          {changesCount} change{changesCount !== 1 ? 's' : ''}
        </span>
        
        <Button
          onClick={onDiscard}
          variant="outline"
          className="border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
        >
          Discard
        </Button>
        
        <Button
          onClick={onSaveDraft}
          variant="outline"
          className="border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
        >
          Save as Draft
        </Button>

        {isLastStep ? (
          <Button
            onClick={onSubmit}
            disabled={changesCount === 0}
            className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed px-8 shadow-lg"
          >
            Submit Amendment
          </Button>
        ) : (
          <Button
            onClick={onNext}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 shadow-lg"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImportLCAmendmentActions;
