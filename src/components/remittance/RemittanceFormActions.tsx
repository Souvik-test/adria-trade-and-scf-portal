import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, CheckCircle, XCircle } from 'lucide-react';

interface RemittanceFormActionsProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isValid: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  onDiscard: () => void;
  readOnly?: boolean;
  isApprovalStage?: boolean;
  onApprove?: () => void;
  onReject?: () => void;
}

const RemittanceFormActions: React.FC<RemittanceFormActionsProps> = ({
  isFirstStep,
  isLastStep,
  isValid,
  onPrevious,
  onNext,
  onSaveDraft,
  onSubmit,
  onDiscard,
  readOnly = false,
  isApprovalStage = false,
  onApprove,
  onReject,
}) => {
  if (isApprovalStage) {
    return (
      <div className="flex justify-between items-center pt-6 border-t border-border bg-card">
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

        <div className="flex gap-3">
          {!isLastStep ? (
            <Button
              onClick={onNext}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 shadow-lg"
            >
              Next
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={onReject}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={onApprove}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center pt-6 border-t border-border bg-card">
      {/* Left side - Go Back and Discard buttons */}
      <div className="flex gap-3">
        {!isFirstStep && (
          <Button
            onClick={onPrevious}
            variant="outline"
            className="border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
            disabled={readOnly}
          >
            Go Back
          </Button>
        )}
        <Button
          onClick={onDiscard}
          variant="outline"
          className="border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
          disabled={readOnly}
        >
          Discard
        </Button>
      </div>

      {/* Right side - Actions */}
      <div className="flex gap-3">
        <Button
          onClick={onSaveDraft}
          variant="outline"
          className="border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
          disabled={readOnly}
        >
          <Save className="w-4 h-4 mr-2" />
          Save as Draft
        </Button>

        {isLastStep ? (
          <Button
            onClick={onSubmit}
            disabled={!isValid || readOnly}
            className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed px-8 shadow-lg"
          >
            Submit Request
          </Button>
        ) : (
          <Button
            onClick={onNext}
            disabled={!isValid || readOnly}
            className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed px-8 shadow-lg"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default RemittanceFormActions;
