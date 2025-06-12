
import React from 'react';
import { Button } from '@/components/ui/button';
import { ImportLCFormStep } from '@/hooks/useImportLCForm';

interface ImportLCFormActionsProps {
  currentStep: ImportLCFormStep;
  isValid: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
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
  onSubmit,
  onDiscard,
  onClose,
  onBack
}) => {
  const steps: ImportLCFormStep[] = ['basic', 'applicant', 'beneficiary', 'amount', 'shipment', 'documents', 'preview'];
  const currentStepIndex = steps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-600">
      {/* Left side - Go Back button */}
      <div className="flex gap-3">
        {isFirstStep ? (
          <Button
            variant="ghost"
            onClick={onBack}
            className="px-6 text-corporate-blue hover:bg-corporate-blue/10"
          >
            ← Go Back
          </Button>
        ) : (
          <Button
            variant="ghost"
            onClick={onPrevious}
            className="px-6 text-corporate-blue hover:bg-corporate-blue/10"
          >
            ← Go Back
          </Button>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onDiscard}
          className="px-6 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
        >
          Discard
        </Button>
        
        <Button
          variant="outline"
          onClick={onSaveDraft}
          className="px-6 text-amber-600 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
        >
          Save as Draft
        </Button>

        {isLastStep ? (
          <Button
            onClick={onSubmit}
            disabled={!isValid}
            className="px-8 bg-corporate-blue text-white hover:bg-corporate-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Request
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!isValid}
            className="px-8 bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImportLCFormActions;
