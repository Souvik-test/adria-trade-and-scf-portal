
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
}

const ImportLCFormActions: React.FC<ImportLCFormActionsProps> = ({
  currentStep,
  isValid,
  onPrevious,
  onNext,
  onSaveDraft,
  onSubmit,
  onDiscard,
  onClose
}) => {
  const steps: ImportLCFormStep[] = ['basic', 'applicant', 'beneficiary', 'amount', 'shipment', 'documents'];
  const currentStepIndex = steps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="flex justify-between items-center">
      {/* Left side - Navigation */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isFirstStep}
          className="px-6 text-gray-600 border-gray-300 hover:bg-gray-50"
        >
          Previous
        </Button>
        
        {!isLastStep && (
          <Button
            onClick={onNext}
            disabled={!isValid}
            className="px-6 bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white disabled:opacity-50"
          >
            Next
          </Button>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onDiscard}
          className="px-6 text-red-600 border-red-300 hover:bg-red-50"
        >
          Discard
        </Button>
        
        <Button
          variant="outline"
          onClick={onSaveDraft}
          className="px-6 text-amber-600 border-amber-300 hover:bg-amber-50"
        >
          Save as Draft
        </Button>

        {isLastStep && (
          <Button
            onClick={onSubmit}
            disabled={!isValid}
            className="px-6 bg-corporate-blue text-white hover:bg-corporate-blue/90 disabled:opacity-50"
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImportLCFormActions;
