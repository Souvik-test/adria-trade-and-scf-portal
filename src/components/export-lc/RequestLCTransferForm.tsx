
import React from "react";
import RequestLCTransferLayout from "./RequestLCTransferLayout";
import RequestLCTransferPaneRenderer from "./RequestLCTransferPaneRenderer";
import RequestLCTransferFormActions from "./RequestLCTransferFormActions";
import { useRequestLCTransferForm } from "@/hooks/useRequestLCTransferForm";

interface Props {
  onClose: () => void;
}

const RequestLCTransferForm: React.FC<Props> = ({ onClose }) => {
  const form = useRequestLCTransferForm(onClose);

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex flex-col w-full h-full min-h-screen">
      <RequestLCTransferLayout stepIdx={form.stepIdx} onBack={form.goBack}>
        <RequestLCTransferPaneRenderer form={form} />
        <div className="w-full max-w-2xl mx-auto mt-8">
          <RequestLCTransferFormActions {...form} />
        </div>
      </RequestLCTransferLayout>
    </div>
  );
};

export default RequestLCTransferForm;
