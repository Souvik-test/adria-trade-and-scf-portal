
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  goBack: () => void;
  goNext: () => void;
  saveDraft: () => void;
  submitForm: () => void;
  discard: () => void;
  isSubmitting: boolean;
  stepIdx: number;
  isLastStep: boolean;
}

const RequestLCAssignmentFormActions: React.FC<Props> = ({
  goBack,
  goNext,
  saveDraft,
  submitForm,
  discard,
  isSubmitting,
  stepIdx,
  isLastStep,
}) => {
  return (
    <div className="flex flex-col gap-4 bg-card border border-border rounded-2xl p-6 mt-6 transition-colors">
      <div className="flex flex-wrap justify-between gap-3">
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={goBack}
            className="min-w-[100px]"
          >
            {stepIdx === 0 ? "Cancel" : "Back"}
          </Button>
          {!isLastStep && (
            <Button
              type="button"
              onClick={goNext}
              className="min-w-[100px] bg-corporate-blue hover:bg-corporate-blue/90"
            >
              Next
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={saveDraft}
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            Save as Draft
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={discard}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            Discard
          </Button>
          {isLastStep && (
            <Button
              type="button"
              onClick={submitForm}
              disabled={isSubmitting}
              className="min-w-[100px] bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Submit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestLCAssignmentFormActions;
