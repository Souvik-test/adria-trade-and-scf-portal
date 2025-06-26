
import React from "react";
import { Button } from "@/components/ui/button";
import { transferStepOrder, LCTransferFormStep } from "@/types/exportLCTransfer";

interface Props {
  step: LCTransferFormStep;
  stepIdx: number;
  goBack: () => void;
  goNext: () => void;
  saveDraft: () => void;
  discard: () => void;
  submitForm: () => void;
  isSubmitting: boolean;
  canSubmit?: boolean;
  validateTransferAmount?: () => boolean;
}

const RequestLCTransferFormActions: React.FC<Props> = ({
  step, stepIdx, goBack, goNext, saveDraft, discard, submitForm, isSubmitting, canSubmit, validateTransferAmount
}) => {
  const showGoBack = stepIdx > 0;
  const isFinal = step === "documents";
  
  // Check if current step is valid before allowing next
  const canProceedNext = step !== "lc-and-transfer" || (validateTransferAmount ? validateTransferAmount() : true);

  return (
    <div className="flex flex-wrap gap-2 border-t border-border bg-card p-4 md:p-6 justify-between items-center transition-colors shadow-sm">
      <div className="flex gap-2 flex-1">
        {showGoBack && (
          <Button
            variant="outline"
            className="min-w-[110px] border-muted-foreground/30 text-muted-foreground hover:bg-muted/50"
            onClick={goBack}
            disabled={isSubmitting}
          >
            Go Back
          </Button>
        )}
      </div>
      <div className="flex gap-2 ml-auto">
        <Button
          variant="outline"
          className="min-w-[110px] border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500 dark:text-red-400 dark:border-red-500 dark:hover:bg-red-900/20"
          onClick={discard}
          disabled={isSubmitting}
        >
          Discard
        </Button>
        <Button
          variant="outline"
          className="min-w-[130px] border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500 dark:text-amber-400 dark:border-amber-500 dark:hover:bg-amber-900/20"
          onClick={saveDraft}
          disabled={isSubmitting}
        >
          Save as Draft
        </Button>
        {isFinal ? (
          <Button
            variant="default"
            className="min-w-[110px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            onClick={submitForm}
            disabled={isSubmitting || !canSubmit}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        ) : (
          <Button
            variant="default"
            className="min-w-[110px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            onClick={goNext}
            disabled={isSubmitting || !canProceedNext}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default RequestLCTransferFormActions;
