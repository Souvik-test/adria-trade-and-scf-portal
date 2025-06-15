
import React from "react";
import RequestLCTransferProgressIndicator from "./RequestLCTransferProgressIndicator";
import RequestLCTransferPaneRenderer from "./RequestLCTransferPaneRenderer";
import RequestLCTransferFormActions from "./RequestLCTransferFormActions";
import { useRequestLCTransferForm } from "@/hooks/useRequestLCTransferForm";

interface Props {
  onClose: () => void;
}

const RequestLCTransferForm: React.FC<Props> = ({ onClose }) => {
  const form = useRequestLCTransferForm(onClose);

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col w-full h-full min-h-screen">
      <div className="w-full flex flex-col sm:flex-row items-center border-b px-6 py-4 gap-4 bg-card rounded-t-lg">
        <h1 className="text-xl font-bold text-corporate-blue mr-auto">Request Transfer: Export Letter of Credit</h1>
        <RequestLCTransferProgressIndicator step={form.step} />
      </div>
      <div className="flex-1 overflow-y-auto w-full">
        <RequestLCTransferPaneRenderer form={form} />
      </div>
      <div className="w-full flex-shrink-0">
        <RequestLCTransferFormActions {...form} />
      </div>
    </div>
  );
};

export default RequestLCTransferForm;
