import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { generateMT700 } from "./generateMT700";

type ActionChoice = "accept" | "refuse" | null;

const AmendmentSidebarResponsePanel = ({
  action,
  setAction,
  comments,
  setComments,
  submitting,
  handleSubmit,
  commentsMandatory,
  commentsError,
  changesCount,
  onViewChanges,
  lcData,
}: {
  action: ActionChoice;
  setAction: (a: ActionChoice) => void;
  comments: string;
  setComments: (s: string) => void;
  submitting: boolean;
  handleSubmit: () => void;
  commentsMandatory: boolean;
  commentsError?: string | null;
  changesCount: number;
  onViewChanges: () => void;
  lcData: any;
}) => {
  const handleDownloadMT707 = () => {
    // Compose data as per generateMT700 schema
    const mt700Text = generateMT700({
      lcReference: lcData.lcReference,
      issueDate: lcData.issueDate,
      expiryDate: lcData.expiryDate,
      currency: "USD",
      amount: (lcData.lcAmount?.creditAmount ?? "")
        .replace(/[^0-9.]/g, ""),
      parties: lcData.parties,
      shipment: {
        shipmentFrom: lcData.shipment?.from,
        shipmentTo: lcData.shipment?.to,
        latestShipmentDate: lcData.shipment?.latestDate,
      },
      documents: lcData.documents,
      additionalConditions: lcData.additionalConditions,
    });
    const blob = new Blob([mt700Text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `draft-mt707-${lcData.lcReference || "lc"}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm flex flex-col gap-3 sticky top-0">
      {/* Status + changes */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-block w-2 h-2 rounded-full bg-yellow-400"></span>
          <span className="font-semibold text-yellow-700 dark:text-yellow-100 text-xs uppercase">
            Amendment Pending
          </span>
          <Button
            variant="outline"
            className="ml-auto px-4 py-2 text-xs font-bold rounded-md border-2 border-yellow-500 text-yellow-900 dark:text-yellow-100 bg-yellow-100 hover:bg-yellow-200 hover:border-yellow-600 transition-all duration-200 shadow-sm"
            onClick={onViewChanges}
            style={{ minWidth: "120px" }}
          >
            <span className="font-semibold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z" /></svg>
              View Changes
            </span>
          </Button>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Carefully review each modified field in the LC, then record your consent below.
        </div>
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-100 font-semibold text-sm mt-2">
          {changesCount} Changes Detected
        </div>
      </div>
      {/* Radio: Accept or Refuse */}
      <div className="my-2">
        <label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
          Your Response
        </label>
        <RadioGroup
          value={action || undefined}
          onValueChange={(v) => setAction(v as ActionChoice)}
          className="flex gap-4"
        >
          <RadioGroupItem value="accept" id="accept-choice" />
          <label
            htmlFor="accept-choice"
            className="cursor-pointer text-green-800 dark:text-green-200 text-sm ml-1 mr-4"
          >
            Accept Amendment
          </label>
          <RadioGroupItem value="refuse" id="refuse-choice" />
          <label
            htmlFor="refuse-choice"
            className="cursor-pointer text-red-800 dark:text-red-300 text-sm ml-1"
          >
            Refuse
          </label>
        </RadioGroup>
      </div>
      {/* Comments */}
      <div>
        <Textarea
          placeholder="Add comments (required if refusing)"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="min-h-[80px]"
        />
        {commentsMandatory && commentsError && (
          <div className="text-red-600 text-xs mt-1">{commentsError}</div>
        )}
      </div>
      <Button
        size="lg"
        className="w-full mt-2"
        onClick={handleSubmit}
        disabled={submitting}
      >
        {action === "refuse" ? "Refuse Amendment" : "Submit Response"}
      </Button>
      {/* Quick Actions */}
      <div className="mt-5 flex flex-col gap-3">
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleDownloadMT707}
        >
          Download Draft MT 707
        </Button>
      </div>
    </div>
  );
};

export default AmendmentSidebarResponsePanel;
