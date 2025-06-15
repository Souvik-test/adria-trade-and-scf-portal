
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
  return <div className="max-w-3xl mx-auto py-8"><StepPane form={form} /></div>;
};

export default RequestLCTransferPaneRenderer;
