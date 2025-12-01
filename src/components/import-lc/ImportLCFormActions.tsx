
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImportLCFormStep } from '@/types/importLC';
import { Save } from 'lucide-react';

interface ImportLCFormActionsProps {
  currentStep: ImportLCFormStep;
  isValid: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onSaveTemplate?: () => void;
  onSubmit: () => void;
  onDiscard: () => void;
  onClose: () => void;
  onBack: () => void;
}

const ImportLCFormActions: React.FC<ImportLCFormActionsProps> = ({
  currentStep,
  isValid,
  onPrevious,
  onNext,
  onSaveDraft,
  onSaveTemplate,
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
      {/* Left side - Go Back and Discard buttons */}
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
        <Button
          onClick={onDiscard}
          variant="outline"
          className="border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
        >
          Discard
        </Button>
      </div>

      {/* Right side - Actions */}
      <div className="flex gap-3">
        {onSaveTemplate && currentStep === 'documents' && (
          <Button
            onClick={onSaveTemplate}
            variant="outline"
            className="border-blue-400 text-blue-600 hover:bg-blue-50 hover:border-blue-500 dark:text-blue-400 dark:border-blue-500 dark:hover:bg-blue-900/20 gap-2"
          >
            <Save className="w-4 h-4" />
            Save as Template
          </Button>
        )}
        
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
            disabled={!isValid}
            className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed px-8 shadow-lg"
          >
            Submit Request
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!isValid}
            className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed px-8 shadow-lg"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImportLCFormActions;
