import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

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
      className={`transition-transform duration-150 ${
        open ? "rotate-180" : ""
      }`}
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

        {/* Main body - left: details; right: action (on wide screens) */}
        <div className="flex-1 flex flex-col md:flex-row gap-4 mt-2">
          <div className="flex-1 mt-2">
            <div className="space-y-4">

              {/* Parties Information Pane */}
              <section className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                <button
                  className="flex items-center gap-2 w-full px-6 py-4 text-left"
                  onClick={() => togglePane("parties")}
                  aria-expanded={expanded.includes("parties")}
                  type="button"
                >
                  <span className="text-blue-600 dark:text-blue-400 text-lg">🧾</span>
                  <span className="font-semibold text-lg text-gray-800 dark:text-white">
                    Parties Information
                  </span>
                  <div className="ml-auto"><PaneChevron open={expanded.includes("parties")} /></div>
                </button>
                {expanded.includes("parties") && (
                  <div className="px-6 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {initialLcData.parties.map((party) => (
                        <div
                          className={`rounded-xl p-4 ${party.accent}`}
                          key={party.role}
                        >
                          <div className="font-medium text-sm text-gray-600 dark:text-gray-300 mb-1">
                            {party.role}
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white text-base leading-snug">
                            {party.name}
                          </div>
                          <div className="text-gray-700 dark:text-gray-400 whitespace-pre-line text-sm">
                            {party.address}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* LC Amount Pane */}
              <section className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                <button
                  className="flex items-center gap-2 w-full px-6 py-4 text-left"
                  onClick={() => togglePane("amount")}
                  aria-expanded={expanded.includes("amount")}
                  type="button"
                >
                  <span className="text-green-600 dark:text-green-400 text-lg">💲</span>
                  <span className="font-semibold text-lg text-gray-800 dark:text-white">LC Amount</span>
                  <div className="ml-auto"><PaneChevron open={expanded.includes("amount")} /></div>
                </button>
                {expanded.includes("amount") && (
                  <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 flex flex-col">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">Credit Amount</span>
                      <span className="text-2xl font-bold text-green-700 dark:text-green-300">{initialLcData.lcAmount.creditAmount}</span>
                    </div>
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 flex flex-col">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">Tolerance</span>
                      <span className="text-xl font-semibold text-gray-900 dark:text-gray-200">{initialLcData.lcAmount.tolerance}</span>
                    </div>
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4 flex flex-col">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">Available With</span>
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-200">{initialLcData.lcAmount.availableWith}</span>
                    </div>
                    <div className="col-span-1 md:col-span-3 rounded-lg bg-gray-50 dark:bg-gray-800 p-4 mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">Available By</span>
                      <span className="font-medium text-gray-900 dark:text-gray-200">{initialLcData.lcAmount.availableBy}</span>
                    </div>
                  </div>
                )}
              </section>

              {/* Shipment & Delivery Pane */}
              <section className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                <button
                  className="flex items-center gap-2 w-full px-6 py-4 text-left"
                  onClick={() => togglePane("shipment")}
                  aria-expanded={expanded.includes("shipment")}
                  type="button"
                >
                  <span className="text-blue-600 dark:text-blue-400 text-lg">🌐</span>
                  <span className="font-semibold text-lg text-gray-800 dark:text-white">Shipment & Delivery</span>
                  <div className="ml-auto"><PaneChevron open={expanded.includes("shipment")} /></div>
                </button>
                {expanded.includes("shipment") && (
                  <div className="px-6 pb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="font-medium text-gray-500 dark:text-gray-400 mb-1">Shipment From</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{initialLcData.shipment.shipmentFrom}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-500 dark:text-gray-400 mb-1">Shipment To</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{initialLcData.shipment.shipmentTo}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-500 dark:text-gray-400 mb-1">Partial Shipments</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{initialLcData.shipment.partialShipments}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-500 dark:text-gray-400 mb-1">Transshipment</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{initialLcData.shipment.transshipment}</div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-500 dark:text-gray-400 mb-1">Latest Shipment Date</div>
                        <div className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                          <span role="img" aria-label="calendar">📅</span> {initialLcData.shipment.latestShipmentDate}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-500 dark:text-gray-400 mb-1">Presentation Period</div>
                        <div className="font-semibold text-gray-900 dark:text-white">{initialLcData.shipment.presentationPeriod}</div>
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 p-4">
                      <div className="font-medium text-sm text-blue-900 dark:text-blue-200 mb-1">
                        <span role="img" aria-label="cube">📦</span> Description of Goods/Services
                      </div>
                      <div className="text-gray-900 dark:text-gray-200">
                        {initialLcData.shipment.description}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* Documents Required Pane */}
              <section className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                <button
                  className="flex items-center gap-2 w-full px-6 py-4 text-left"
                  onClick={() => togglePane("documents")}
                  aria-expanded={expanded.includes("documents")}
                  type="button"
                >
                  <span className="text-purple-600 dark:text-purple-300 text-lg">📄</span>
                  <span className="font-semibold text-lg text-gray-800 dark:text-white">Documents Required</span>
                  <div className="ml-auto"><PaneChevron open={expanded.includes("documents")} /></div>
                </button>
                {expanded.includes("documents") && (
                  <div className="px-6 pb-4 space-y-2">
                    {initialLcData.documents.map((doc, i) => (
                      <div
                        key={doc}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 bg-gray-50 dark:bg-gray-800 text-base font-medium text-gray-900 dark:text-gray-100"
                      >
                        <span className="w-6 h-6 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-sm">{i+1}</span>
                        {doc}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Additional Conditions Pane */}
              <section className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800">
                <button
                  className="flex items-center gap-2 w-full px-6 py-4 text-left"
                  onClick={() => togglePane("additional")}
                  aria-expanded={expanded.includes("additional")}
                  type="button"
                >
                  <span className="text-amber-600 dark:text-amber-300 text-lg">⚠️</span>
                  <span className="font-semibold text-lg text-gray-800 dark:text-white">Additional Conditions</span>
                  <div className="ml-auto"><PaneChevron open={expanded.includes("additional")} /></div>
                </button>
                {expanded.includes("additional") && (
                  <div className="px-6 pb-4 space-y-3">
                    <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4">
                      <div className="text-xs font-medium text-gray-600 dark:text-amber-100 mb-1">
                        Additional Conditions
                      </div>
                      <div className="text-gray-900 dark:text-white">{initialLcData.additionalConditions}</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                      <div className="text-xs font-medium text-gray-600 dark:text-amber-100 mb-1">
                        Special Instructions
                      </div>
                      <div className="text-gray-900 dark:text-white">{initialLcData.specialInstructions}</div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* Right-side Action Pane (wide screens) */}
          <div className="mt-4 md:mt-2 md:ml-6 md:w-[360px]">
            <div className="rounded-2xl border bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 px-6 py-6">
              <div className="font-semibold text-lg text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <span role="img" aria-label="msg">💬</span> Action Required
              </div>
              <div className="mb-4">
                <div className="text-xs font-medium text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 rounded p-2">
                  Review Status<br />
                  <span className="font-normal">Please review the LC details and select your response</span>
                </div>
              </div>
              <div className="mb-4">
                <div className="font-medium text-gray-700 dark:text-gray-200 mb-2">Select Action:</div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-green-600 accent-green-600"
                      checked={action === "accept"}
                      onChange={() => setAction("accept")}
                    />
                    <span className="text-green-700 dark:text-green-400 font-semibold">✔ Accept LC</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      className="form-radio text-red-500 accent-red-500"
                      checked={action === "refuse"}
                      onChange={() => setAction("refuse")}
                    />
                    <span className="text-red-600 dark:text-red-400 font-semibold">✖ Refuse LC</span>
                  </label>
                </div>
              </div>
              <div className="mb-4">
                <div className="font-medium text-gray-700 dark:text-gray-200 mb-1">Comments</div>
                <textarea
                  className="w-full border rounded p-2 min-h-[72px] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white resize-y"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Add any comments or notes..."
                />
              </div>
              <Button
                className="w-full bg-corporate-blue hover:bg-corporate-blue/90 text-white font-semibold py-2 mt-2 disabled:opacity-40"
                disabled={!action}
                onClick={handleSubmit}
              >
                Select Action
              </Button>
              <div className="mt-6">
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Quick Actions</div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => { /* fake download */ }}
                  >
                    <span role="img" aria-label="download">⬇</span> Download PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => { /* fake email */ }}
                  >
                    <span role="img" aria-label="mail">✉️</span> Email Copy
                  </Button>
                </div>
              </div>
            </div>
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
