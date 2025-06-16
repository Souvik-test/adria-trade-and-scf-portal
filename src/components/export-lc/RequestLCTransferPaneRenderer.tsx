
import React from "react";
import { LCTransferFormStep } from "@/types/exportLCTransfer";
import LCAndTransferPane from "./steps/LCAndTransferPane";
import NewBeneficiariesPane from "./steps/NewBeneficiariesPane";
import DocumentsRequiredPane from "./steps/DocumentsRequiredPane";

const paneMap: Record<LCTransferFormStep, React.ComponentType<{ form: any }>> = {
  "lc-and-transfer": LCAndTransferPane,
  "beneficiary": NewBeneficiariesPane,
  "documents": DocumentsRequiredPane,
};

const RequestLCTransferPaneRenderer = ({ form }: { form: any }) => {
  const StepPane = paneMap[form.step as LCTransferFormStep];
  if (!StepPane) {
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
