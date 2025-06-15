import React, { useState } from "react";
import AmendmentResponseDetailsAccordion from "./AmendmentResponseDetailsAccordion";
import AmendmentSidebarResponsePanel from "./AmendmentSidebarResponsePanel";
import AmendmentChangesSummaryModal from "./AmendmentChangesSummaryModal";
import AmendmentResponseActionsBar from "./AmendmentResponseActionsBar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { saveAmendmentResponse } from "@/services/transactionService";

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
  ],
  parties: [
    { role: "Applicant", name: "Acme Importers LLC", address: "100 Wall St, New York, USA" },
    { role: "Beneficiary", name: "Sunrise Textiles Ltd.", address: "22 Mahatma Gandhi Rd, Mumbai, India" },
    { role: "Advising Bank", name: "State Bank of India", address: "SBIN000123, Mumbai" },
    { role: "Issuing Bank", name: "Citibank NA", address: "CITIUS33XXX, New York" }
  ],
  lcAmount: {
    creditAmount: "USD 270,000.00",
    tolerance: "+/- 5%",
    availableWith: "Any Bank in India",
    availableBy: "Negotiation"
  },
  shipment: {
    from: "Mumbai, India",
    to: "New York, USA",
    latestDate: "10/04/2024"
  },
  documents: [
    "Signed Commercial Invoice (3 copies)",
    "Packing List (3 copies)",
    "Certificate of Origin",
    "Bill of Lading"
  ],
  additionalConditions: "Shipment under this LC must not be made via sanctioned countries.",
  specialInstructions: "Partial shipment allowed. Transshipment not allowed."
};

type ActionChoice = "accept" | "refuse" | null;

interface AmendmentResponseFormProps {
  onClose: () => void;
}

const AmendmentResponseForm: React.FC<AmendmentResponseFormProps> = ({
  onClose,
}) => {
  const [lcReference, setLcReference] = useState(MOCK_AMEND_DATA.lcReference);
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
    try {
      await saveAmendmentResponse({
        lcReference,
        amendmentNumber: MOCK_AMEND_DATA.amendmentNumber,
        action: action as "accept" | "refuse",
        comments,
        parties: MOCK_AMEND_DATA.parties,
        lcAmount: MOCK_AMEND_DATA.lcAmount,
        shipment: MOCK_AMEND_DATA.shipment,
        documents: MOCK_AMEND_DATA.documents,
        additionalConditions: MOCK_AMEND_DATA.additionalConditions,
        specialInstructions: MOCK_AMEND_DATA.specialInstructions,
      });
      toast({
        title: "Success",
        description: "Your amendment response has been submitted.",
        variant: "default",
      });
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err?.message || "Failed to submit amendment response. Please try again."
      );
      toast({
        title: "Error",
        description: err?.message || "Failed to submit amendment response.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDiscard = () => {
    if (
      window.confirm(
        "Are you sure you want to discard all changes? This action cannot be undone."
      )
    ) {
      onClose();
    }
  };

  const handleSaveDraft = () => {
    toast({
      title: "Saved as Draft",
      description: "Your amendment response has been saved as a draft.",
      variant: "default",
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 w-full h-full overflow-y-auto flex">
      <div className="max-w-6xl w-full mx-auto p-0 md:p-8 flex flex-col min-h-screen">
        {/* Top Bar & Header */}
        <div className="w-full border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-0 md:px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-2 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span role="img" aria-label="amendment">
                📝
              </span>{" "}
              Record Amendment Response
            </span>
          </div>
        </div>
        {/* Main content */}
        <div className="flex-1 flex flex-col md:flex-row justify-center gap-5 pb-10 md:pb-6 px-2 md:px-10 py-5">
          {/* LEFT: Accordions/details */}
          <div className="flex-1 max-w-2xl">
            <AmendmentResponseDetailsAccordion
              lcReference={lcReference}
              onLcReferenceChange={setLcReference}
              issueDate={MOCK_AMEND_DATA.issueDate}
              expiryDate={MOCK_AMEND_DATA.expiryDate}
              amendmentNumber={MOCK_AMEND_DATA.amendmentNumber}
              amendmentDate={MOCK_AMEND_DATA.amendmentDate}
              changes={MOCK_AMEND_DATA.changes}
              parties={MOCK_AMEND_DATA.parties}
              lcAmount={MOCK_AMEND_DATA.lcAmount}
              shipment={MOCK_AMEND_DATA.shipment}
              documents={MOCK_AMEND_DATA.documents}
              additionalConditions={MOCK_AMEND_DATA.additionalConditions}
              specialInstructions={MOCK_AMEND_DATA.specialInstructions}
            />
          </div>
          {/* RIGHT: Sticky panel actions */}
          <div className="w-full md:max-w-xs mt-10 md:mt-0">
            <AmendmentSidebarResponsePanel
              action={action}
              setAction={setAction}
              comments={comments}
              setComments={setComments}
              submitting={submitting}
              handleSubmit={handleSubmit}
              commentsMandatory={action === "refuse"}
              commentsError={errorMsg}
              changesCount={MOCK_AMEND_DATA.changes.length}
              onViewChanges={() => setShowChanges(true)}
              lcData={{
                lcReference,
                issueDate: MOCK_AMEND_DATA.issueDate,
                expiryDate: MOCK_AMEND_DATA.expiryDate,
                lcAmount: MOCK_AMEND_DATA.lcAmount,
                parties: MOCK_AMEND_DATA.parties,
                shipment: MOCK_AMEND_DATA.shipment,
                documents: MOCK_AMEND_DATA.documents,
                additionalConditions: MOCK_AMEND_DATA.additionalConditions,
              }}
            />
          </div>
        </div>
        {/* Bottom sticky bar */}
        <AmendmentResponseActionsBar
          handleDiscard={handleDiscard}
          handleSaveDraft={handleSaveDraft}
        />
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
