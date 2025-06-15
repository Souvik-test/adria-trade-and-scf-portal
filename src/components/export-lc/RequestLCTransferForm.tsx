import React, { useState } from "react";
import RequestLCTransferLayout from "./RequestLCTransferLayout";
import RequestLCTransferPaneRenderer from "./RequestLCTransferPaneRenderer";
import RequestLCTransferFormActions from "./RequestLCTransferFormActions";
import { useRequestLCTransferForm } from "@/hooks/useRequestLCTransferForm";

interface Props {
  onClose: () => void;
}

const RequestLCTransferForm: React.FC<Props> = ({ onClose }) => {
  const form = useRequestLCTransferForm(onClose);
  // Editable request ID: initialize with string or keep "" initially.
  const [requestId, setRequestId] = useState("TRF-2025-00123");

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col w-full h-full min-h-screen">
      <RequestLCTransferLayout stepIdx={form.stepIdx} requestId={requestId} setRequestId={setRequestId}>
        <div className="w-full flex-grow flex flex-col">
          <RequestLCTransferPaneRenderer form={form} />
        </div>
        <div className="w-full max-w-5xl mx-auto mt-6 px-2 sticky bottom-0 z-10">
          <RequestLCTransferFormActions {...form} />
        </div>
      </RequestLCTransferLayout>
    </div>
  );
};

export default RequestLCTransferForm;
