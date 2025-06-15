
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Import new panes
import PartyInfoPane from "./PartyInfoPane";
import LCAmtPane from "./LCAmtPane";
import ShipmentPane from "./ShipmentPane";
import DocumentsRequiredPane from "./DocumentsRequiredPane";
import AdditionalConditionsPane from "./AdditionalConditionsPane";
import ActionPane from "./ActionPane";

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

  // expand/collapse panes
  const togglePane = (pane: string) => {
    setExpanded((prev) =>
      prev.includes(pane) ? prev.filter((p) => p !== pane) : [...prev, pane]
    );
  };

  // Simulate submit/save/discard
  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onClose();
    }, 1000);
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

  // Pane open/close icons
  const PaneChevron = ({ open }: { open: boolean }) => (
    <span
      className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
    >
      ▼
    </span>
  );

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 w-full h-full overflow-y-auto flex">
      <div className="max-w-6xl w-full mx-auto p-0 md:p-8 flex flex-col min-h-screen">
        {/* Form Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between px-6 py-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                <span role="img" aria-label="doc">📄</span> Pre-Advised Letter of Credit
              </span>
              <span className="ml-3 px-3 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
                Pending Review
              </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Review and respond to LC pre-advice
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-end gap-2">
            <div className="flex items-end gap-1">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">LC Reference</div>
                <div className="font-medium tracking-wide">{initialLcData.lcReference}</div>
              </div>
            </div>
            <div className="flex gap-4 ml-0 md:ml-8">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Issue Date</div>
                <div className="font-medium">{initialLcData.issueDate}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Expiry Date</div>
                <div className="font-medium">{initialLcData.expiryDate}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Amount</div>
                <div className="font-bold text-green-600 dark:text-green-300">
                  {initialLcData.currency} {initialLcData.amount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main body - left: details; right: action */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 mt-2">
          <div className="flex-1 mt-2">
            <div className="space-y-4">
              <PartyInfoPane
                expanded={expanded.includes("parties")}
                togglePane={() => togglePane("parties")}
                parties={initialLcData.parties}
                PaneChevron={PaneChevron}
              />
              <LCAmtPane
                expanded={expanded.includes("amount")}
                togglePane={() => togglePane("amount")}
                lcAmount={initialLcData.lcAmount}
                PaneChevron={PaneChevron}
              />
              <ShipmentPane
                expanded={expanded.includes("shipment")}
                togglePane={() => togglePane("shipment")}
                shipment={initialLcData.shipment}
                PaneChevron={PaneChevron}
              />
              <DocumentsRequiredPane
                expanded={expanded.includes("documents")}
                togglePane={() => togglePane("documents")}
                documents={initialLcData.documents}
                PaneChevron={PaneChevron}
              />
              <AdditionalConditionsPane
                expanded={expanded.includes("additional")}
                togglePane={() => togglePane("additional")}
                additionalConditions={initialLcData.additionalConditions}
                specialInstructions={initialLcData.specialInstructions}
                PaneChevron={PaneChevron}
              />
            </div>
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
            />
          </div>
        </div>

        {/* Bottom Sticky Action Bar (for navigation/buttons) */}
        <div className="sticky bottom-0 z-10 mt-6 px-0 md:px-6 py-5 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <Button
              onClick={onBack}
              variant="outline"
              className="gap-2 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleDiscard}
              variant="outline"
              className="border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Discard
            </Button>
            <Button
              onClick={handleSaveDraft}
              variant="outline"
              className="border-amber-300 dark:border-amber-600 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              Save as Draft
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!action}
              className="bg-corporate-blue hover:bg-corporate-blue/90 text-white disabled:opacity-50 px-8"
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPreAdvicedLCForm;
