
import React, { useState } from "react";
import AmendmentResponseHeader from "./AmendmentResponseHeader";
import AmendmentResponseActionPane from "./AmendmentResponseActionPane";
import AmendmentChangesSummaryModal from "./AmendmentChangesSummaryModal";
import { useToast } from "@/hooks/use-toast";

const MOCK_AMEND_DATA = {
  lcReference: "LC/2024/EXP/001234",
  issueDate: "15/01/2024",
  expiryDate: "15/04/2024",
  amendmentNumber: "01",
  amendmentDate: "20/02/2024",
  changes: [
    { field: "Expiry Date", previous: "15/04/2024", updated: "30/04/2024" },
    { field: "Credit Amount", previous: "USD 250,000.00", updated: "USD 270,000.00" },
    { field: "Tolerance", previous: "+/- 10%", updated: "+/- 5%" }
  ]
};

type ActionChoice = "accept" | "refuse" | null;

interface AmendmentResponseFormProps {
  onClose: () => void;
}

const AmendmentResponseForm: React.FC<AmendmentResponseFormProps> = ({
  onClose
}) => {
  const [action, setAction] = useState<ActionChoice>(null);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showChanges, setShowChanges] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (action === "refuse" && !comments.trim()) {
      setErrorMsg("Comments are required when refusing the amendment.");
      return;
    }
    if (!action) {
      setErrorMsg("Please select an action.");
      return;
    }
    setSubmitting(true);
    // Simulate backend
    setTimeout(() => {
      setSubmitting(false);
      toast({
        title: "Success",
        description: "Your amendment response has been submitted.",
        variant: "default"
      });
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 w-full h-full overflow-y-auto flex flex-col animate-fade-in">
      <div className="max-w-4xl w-full mx-auto p-0 md:p-8 flex flex-col min-h-screen">
        {/* Header */}
        <AmendmentResponseHeader
          lcReference={MOCK_AMEND_DATA.lcReference}
          issueDate={MOCK_AMEND_DATA.issueDate}
          expiryDate={MOCK_AMEND_DATA.expiryDate}
          amendmentNumber={MOCK_AMEND_DATA.amendmentNumber}
          amendmentDate={MOCK_AMEND_DATA.amendmentDate}
          onViewChanges={() => setShowChanges(true)}
          onBack={onClose}
        />
        {/* Content: center the action pane */}
        <div className="flex-1 flex justify-center items-center mt-4">
          <div className="w-full max-w-md">
            <AmendmentResponseActionPane
              action={action}
              setAction={setAction}
              comments={comments}
              setComments={setComments}
              handleSubmit={handleSubmit}
              submitting={submitting}
              commentsMandatory={action === "refuse"}
              commentsError={errorMsg}
            />
          </div>
        </div>
        {showChanges && (
          <AmendmentChangesSummaryModal
            open={showChanges}
            onClose={() => setShowChanges(false)}
            changes={MOCK_AMEND_DATA.changes}
          />
        )}
      </div>
    </div>
  );
};

export default AmendmentResponseForm;

