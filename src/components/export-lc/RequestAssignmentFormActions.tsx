
import React from 'react';
import { Button } from '@/components/ui/button';

interface RequestAssignmentFormActionsProps {
  stepIdx: number;
  canGoNext: boolean;
  canGoPrev: boolean;
  isLastStep: boolean;
  nextStep: () => void;
  prevStep: () => void;
  handleSubmit: () => Promise<void>;
  handleDiscard: () => void;
  handleSaveAsDraft: () => void;
}

const RequestAssignmentFormActions: React.FC<RequestAssignmentFormActionsProps> = ({
  stepIdx,
  canGoNext,
  canGoPrev,
  isLastStep,
  nextStep,
  prevStep,
  handleSubmit,
  handleDiscard,
  handleSaveAsDraft
}) => {
  if (stepIdx === 0) {
    return (
      <div className="flex justify-end items-center">
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleDiscard}
            className="px-6 py-2 text-sm font-medium border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
          >
            Discard
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSaveAsDraft}
            className="px-6 py-2 text-sm font-medium border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
          >
            Save as Draft
          </Button>
          <Button 
            onClick={nextStep}
            disabled={!canGoNext}
            className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            Next
          </Button>
        </div>
      </div>
    );
  }

  if (isLastStep) {
    return (
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={prevStep}
          disabled={!canGoPrev}
          className="px-6 py-2 text-sm font-medium border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
        >
          Go Back
        </Button>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleDiscard}
            className="px-6 py-2 text-sm font-medium border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
          >
            Discard
          </Button>
          <Button 
            variant="outline" 
            onClick={handleSaveAsDraft}
            className="px-6 py-2 text-sm font-medium border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
          >
            Save as Draft
          </Button>
          <Button 
            onClick={handleSubmit}
            className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            Submit
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <Button 
        variant="outline" 
        onClick={prevStep}
        disabled={!canGoPrev}
        className="px-6 py-2 text-sm font-medium border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
      >
        Go Back
      </Button>
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={handleDiscard}
          className="px-6 py-2 text-sm font-medium border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
        >
          Discard
        </Button>
        <Button 
          variant="outline" 
          onClick={handleSaveAsDraft}
          className="px-6 py-2 text-sm font-medium border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
        >
          Save as Draft
        </Button>
        <Button 
          onClick={nextStep}
          disabled={!canGoNext}
          className="px-6 py-2 text-sm font-medium bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default RequestAssignmentFormActions;
