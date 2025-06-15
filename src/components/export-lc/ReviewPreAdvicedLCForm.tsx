import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveExportLCReview } from "@/services/exportLCReviewService";

// Import new panes
import PartyInfoPane from "./PartyInfoPane";
import LCAmtPane from "./LCAmtPane";
import ShipmentPane from "./ShipmentPane";
import DocumentsRequiredPane from "./DocumentsRequiredPane";
import AdditionalConditionsPane from "./AdditionalConditionsPane";
import ActionPane from "./ActionPane";

import ReviewPreAdvicedLCHeader from "./ReviewPreAdvicedLCHeader";
import ReviewPreAdvicedLCContent from "./ReviewPreAdvicedLCContent";
import ReviewPreAdvicedLCActionsBar from "./ReviewPreAdvicedLCActionsBar";

interface ReviewPreAdvicedLCFormProps {
  onBack: () => void;
  onClose: () => void;
  onSaveDraft?: () => void;
}

const initialLcData = {
  lcReference: "LC/2024/EXP/001234",
  issueDate: "15/01/2024",
  expiryDate: "15/04/2024",
  amount: 250000,
  currency: "USD",
  status: "Pending Review",
  parties: [
    {
      role: "Applicant (Importer)",
      name: "Global Import Solutions Ltd.",
      address: "123 Trade Center, Business District, New York, NY 10001, United States",
      accent: "bg-blue-50 dark:bg-blue-900/30",
    },
    {
      role: "Beneficiary (Exporter) - You",
      name: "Premium Export Industries Pvt. Ltd.",
      address: "456 Export Plaza, Industrial Area, Mumbai, MH 400001, India",
      accent: "bg-green-50 dark:bg-green-900/40",
    },
    {
      role: "Issuing Bank",
      name: "First National Bank of Commerce",
      address: "789 Financial Street, New York, NY 10005\nSWIFT: FNBCUS33XXX",
      accent: "bg-purple-50 dark:bg-purple-900/30",
    },
    {
      role: "Advising Bank",
      name: "International Trade Bank Ltd.",
      address: "321 Banking Square, Mumbai, MH 400021\nSWIFT: ITBLIN22XXX",
      accent: "bg-orange-50 dark:bg-orange-900/30",
    },
  ],
  lcAmount: {
    creditAmount: "USD 250,000.00",
    tolerance: "+/- 10%",
    availableWith: "Any Bank by Negotiation",
    availableBy: "Documents complying with the terms of this credit"
  },
  shipment: {
    shipmentFrom: "Any Port in India",
    shipmentTo: "New York Port, USA",
    partialShipments: "Allowed",
    transshipment: "Allowed",
    latestShipmentDate: "30/03/2024",
    presentationPeriod: "21 days after shipment date",
    description: "High-quality cotton textiles and garments as per proforma invoice dated 2024-01-10. Total quantity: 10,000 pieces including shirts, trousers, and accessories."
  },
  documents: [
    "Commercial Invoice in triplicate",
    "Packing List in duplicate",
    "Full set of clean on board Bills of Lading",
    "Certificate of Origin issued by Chamber of Commerce",
    "Insurance Policy/Certificate covering Institute Cargo Clauses (A)",
    "Quality Certificate issued by authorized inspection agency"
  ],
  additionalConditions: "All documents must be presented in English. Insurance to be effected for 110% of invoice value. Goods must comply with US import regulations.",
  specialInstructions: "This LC is subject to UCP 600. All bank charges outside issuing bank are for beneficiary's account.",
};

type ActionChoice = "accept" | "refuse" | null;

const ReviewPreAdvicedLCForm: React.FC<ReviewPreAdvicedLCFormProps> = ({
  onBack,
  onClose,
  onSaveDraft,
}) => {
  const [expanded, setExpanded] = useState<string[]>(["parties"]);
  const [action, setAction] = useState<ActionChoice>(null);
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { toast } = useToast();

  // expand/collapse panes
  const togglePane = (pane: string) => {
    setExpanded((prev) =>
      prev.includes(pane) ? prev.filter((p) => p !== pane) : [...prev, pane]
    );
  };

  // Pane open/close icons
  const PaneChevron = ({ open }: { open: boolean }) => (
    <span
      className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
      ▼
    </span>
  );

  // Handle submission (validation + save)
  const handleSubmit = async () => {
    setErrorMsg(null);

    // Validation: require comments if refusing
    if (action === "refuse" && !comments.trim()) {
      setErrorMsg("Comments are required when refusing the LC.");
      return;
    }
    if (!action) {
      setErrorMsg("Please select an action.");
      return;
    }

    setSubmitting(true);
    try {
      await saveExportLCReview({
        action,
        comments,
        lcData: initialLcData,
      });

      toast({
        title: "Success",
        description: "Your Export LC review has been submitted and recorded.",
        variant: "default",
      });
      setSubmitting(false);
      onClose();
    } catch (error: any) {
      setSubmitting(false);
      setErrorMsg(error.message ?? "Submission failed. Please try again.");
      toast({
        title: "Error",
        description: "Failed to submit Export LC review.",
        variant: "destructive",
      });
    }
  };

  const handleSaveDraft = () => {
    if (onSaveDraft) onSaveDraft();
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

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 w-full h-full overflow-y-auto flex">
      <div className="max-w-6xl w-full mx-auto p-0 md:p-8 flex flex-col min-h-screen">
        {/* Form Header */}
        <ReviewPreAdvicedLCHeader
          lcReference={initialLcData.lcReference}
          issueDate={initialLcData.issueDate}
          expiryDate={initialLcData.expiryDate}
          amount={initialLcData.amount}
          currency={initialLcData.currency}
          onBack={onBack}
        />

        {/* Main body - left: details; right: action */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 mt-2">
          <div className="flex-1 mt-2">
            <ReviewPreAdvicedLCContent
              expanded={expanded}
              togglePane={togglePane}
              parties={initialLcData.parties}
              lcAmount={initialLcData.lcAmount}
              shipment={initialLcData.shipment}
              documents={initialLcData.documents}
              additionalConditions={initialLcData.additionalConditions}
              specialInstructions={initialLcData.specialInstructions}
              PaneChevron={PaneChevron}
            />
          </div>
          {/* Right-side Action Pane (wide screens) */}
          <div className="mt-4 md:mt-2 md:ml-6 md:w-[360px]">
            <ActionPane
              action={action}
              setAction={setAction}
              comments={comments}
              setComments={setComments}
              handleSubmit={handleSubmit}
              onSaveDraft={onSaveDraft}
              submitting={submitting}
              commentsMandatory={action === "refuse"}
              commentsError={errorMsg}
              lcData={initialLcData}
            />
          </div>
        </div>

        {/* Bottom Sticky Action Bar (for navigation/buttons) */}
        <ReviewPreAdvicedLCActionsBar
          handleDiscard={handleDiscard}
          handleSaveDraft={handleSaveDraft}
        />
      </div>
    </div>
  );
};

export default ReviewPreAdvicedLCForm;

// The Form has now been split into smaller focused files for maintainability!
