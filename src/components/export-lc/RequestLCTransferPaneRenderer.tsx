
// All step panes imported and rendered by key
import { LCTransferFormStep } from "@/types/exportLCTransfer";
import LCInformationPane from "./steps/LCInformationPane";
import TransferDetailsPane from "./steps/TransferDetailsPane";
import NewBeneficiaryPane from "./steps/NewBeneficiaryPane";
import DocumentsPane from "./steps/DocumentsPane";
import ReviewSubmitPane from "./steps/ReviewSubmitPane";

const paneMap = {
  "lc-info": LCInformationPane,
  "transfer-details": TransferDetailsPane,
  "new-beneficiary": NewBeneficiaryPane,
  "documents": DocumentsPane,
  "review": ReviewSubmitPane,
} as const;

const RequestLCTransferPaneRenderer = ({ form }: { form: any }) => {
  const StepPane = paneMap[form.step as LCTransferFormStep];
  if (!StepPane) {
    // Debug output for visibility if step is missing/bad
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
  // Add debug to ensure we are rendering proper pane
  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Debug info */}
      <div className="mb-2 text-xs text-gray-400">
        Rendering step: <code>{form.step}</code>
      </div>
      <StepPane form={form} />
    </div>
  );
};

export default RequestLCTransferPaneRenderer;
