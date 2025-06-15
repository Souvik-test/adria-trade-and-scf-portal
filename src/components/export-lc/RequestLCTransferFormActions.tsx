
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
  // Import LC button grouping: Discard left, then Save Draft, then Go Back, then Primary (Next/Submit) right
  return (
    <div className="flex flex-wrap gap-2 border-t bg-white/80 p-4 md:p-6 justify-between items-center">
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="min-w-[110px] border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500"
          onClick={discard}
          disabled={isSubmitting}
        >
          Discard
        </Button>
        <Button
          variant="outline"
          className="min-w-[130px] border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500"
          onClick={saveDraft}
          disabled={isSubmitting}
        >
          Save as Draft
        </Button>
      </div>
      <div className="flex gap-2">
        {isFinal ? (
          <>
            <Button
              variant="outline"
              className="min-w-[110px] border-gray-400 text-gray-600 hover:bg-gray-50"
              onClick={goBack}
              disabled={isSubmitting}
            >
              Go Back
            </Button>
            <Button
              variant="default"
              className="min-w-[110px] bg-green-600 hover:bg-green-700 text-white"
              onClick={submitForm}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="min-w-[110px] border-gray-400 text-gray-600 hover:bg-gray-50"
              onClick={goBack}
            >
              Go Back
            </Button>
            <Button
              variant="default"
              className="min-w-[110px] bg-corporate-blue hover:bg-corporate-blue/90 text-white"
              onClick={goNext}
            >
              Next
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestLCTransferFormActions;
