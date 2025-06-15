
import React from "react";
import { LCTransferFormStep } from "@/types/exportLCTransfer";
import LCInformationPaneV2 from "./steps/LCInformationPaneV2";
import TransferDetailsPaneV2 from "./steps/TransferDetailsPaneV2";
import NewBeneficiaryPaneV2 from "./steps/NewBeneficiaryPaneV2";
import DocumentsPaneV2 from "./steps/DocumentsPaneV2";
import ReviewSubmitPaneV2 from "./steps/ReviewSubmitPaneV2";

const paneMap = {
  "lc-info": LCInformationPaneV2,
  "transfer-details": TransferDetailsPaneV2,
  "new-beneficiary": NewBeneficiaryPaneV2,
  "documents": DocumentsPaneV2,
  "review": ReviewSubmitPaneV2,
} as const;

const RequestLCTransferPaneRenderer = ({ form }: { form: any }) => {
  const StepPane = paneMap[form.step as LCTransferFormStep];
  if (!StepPane) {
    // fallback for debugging
    return (
      <div className="max-w-3xl mx-auto py-8 flex flex-col items-center justify-center">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
          <strong>Error:</strong> Step pane not found for <code>{String(form.step)}</code>
        </div>
        <div className="mt-4 text-gray-500 text-sm">
          Debug: The form step is invalid or missing.<br />
          Check paneMap keys and ensure form.step is a valid step.
        </div>
      </div>
    );
  }
  return (
    <StepPane form={form} />
  );
};

export default RequestLCTransferPaneRenderer;
