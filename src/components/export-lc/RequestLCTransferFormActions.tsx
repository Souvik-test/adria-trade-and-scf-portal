
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
}

const RequestLCTransferFormActions: React.FC<Props> = ({ step, stepIdx, goBack, goNext, saveDraft, discard, submitForm, isSubmitting }) => {
  const isFinal = step === "review";
  return (
    <div className="flex flex-row-reverse gap-2 border-t bg-white/80 p-6">
      {isFinal ? (
        <>
          <Button variant="default" className="min-w-[112px]" onClick={submitForm} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
          <Button variant="outline" className="min-w-[112px]" onClick={goBack} disabled={isSubmitting}>
            Go Back
          </Button>
          <Button variant="outline" className="min-w-[140px]" onClick={saveDraft} disabled={isSubmitting}>
            Save as Draft
          </Button>
          <Button variant="destructive" className="min-w-[112px] ml-auto" onClick={discard} disabled={isSubmitting}>
            Discard
          </Button>
        </>
      ) : (
        <>
          <Button variant="default" className="min-w-[112px]" onClick={goNext}>
            Next
          </Button>
          <Button variant="outline" className="min-w-[112px]" onClick={goBack}>
            Go Back
          </Button>
          <Button variant="outline" className="min-w-[140px]" onClick={saveDraft}>
            Save as Draft
          </Button>
          <Button variant="destructive" className="min-w-[112px] ml-auto" onClick={discard}>
            Discard
          </Button>
        </>
      )}
    </div>
  );
};

export default RequestLCTransferFormActions;
