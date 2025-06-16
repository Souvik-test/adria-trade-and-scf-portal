
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRequestLCAssignmentForm } from "@/hooks/useRequestLCAssignmentForm";
import { assignmentStepOrder } from "@/types/exportLCAssignment";
import RequestLCAssignmentLayout from "./RequestLCAssignmentLayout";
import RequestLCAssignmentPaneRenderer from "./RequestLCAssignmentPaneRenderer";
import RequestLCAssignmentFormActions from "./RequestLCAssignmentFormActions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const RequestLCAssignmentForm: React.FC<Props> = ({ isOpen, onClose }) => {
  const [requestId, setRequestId] = useState(`ASN-${Date.now()}`);
  const form = useRequestLCAssignmentForm(onClose);

  const isLastStep = form.stepIdx === assignmentStepOrder.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-full h-full max-h-full p-0 border-0 bg-background">
        <RequestLCAssignmentLayout
          stepIdx={form.stepIdx}
          requestId={requestId}
          setRequestId={setRequestId}
        >
          <RequestLCAssignmentPaneRenderer step={form.step} form={form} />
          <RequestLCAssignmentFormActions
            goBack={form.goBack}
            goNext={form.goNext}
            saveDraft={form.saveDraft}
            submitForm={form.submitForm}
            discard={form.discard}
            isSubmitting={form.isSubmitting}
            stepIdx={form.stepIdx}
            isLastStep={isLastStep}
          />
        </RequestLCAssignmentLayout>
      </DialogContent>
    </Dialog>
  );
};

export default RequestLCAssignmentForm;
