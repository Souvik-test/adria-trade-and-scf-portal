
import React, { useState } from "react";
import RequestLCTransferLayout from "./RequestLCTransferLayout";
import RequestLCTransferPaneRenderer from "./RequestLCTransferPaneRenderer";
import RequestLCTransferFormActions from "./RequestLCTransferFormActions";
import { useRequestLCTransferForm } from "@/hooks/useRequestLCTransferForm";

// Improved summary bar with aligned fields
const SummaryBar = ({ form }: any) => (
  <aside className="hidden lg:block w-[340px] h-fit max-h-[90vh] sticky top-8 shadow-lg bg-white border border-gray-200 rounded-xl ml-auto p-6 animate-fade-in overflow-auto">
    <div className="font-bold mb-4 text-corporate-blue text-lg flex items-center gap-2">
      Summary
    </div>
    <section className="mb-6">
      <h4 className="font-bold mb-3 text-corporate-blue">LC Information</h4>
      <div className="grid grid-cols-2 gap-x-2 gap-y-2">
        <span className="text-gray-500 text-sm">Reference:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.lcReference || <span className="text-gray-300">-</span>}</span>
        <span className="text-gray-500 text-sm">Advising Bank:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.advisingBank || <span className="text-gray-300">-</span>}</span>
        <span className="text-gray-500 text-sm">Issuing Bank:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.issuingBank || <span className="text-gray-300">-</span>}</span>
        <span className="text-gray-500 text-sm">Applicant:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.applicant || <span className="text-gray-300">-</span>}</span>
        <span className="text-gray-500 text-sm">Beneficiary:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.currentBeneficiary || <span className="text-gray-300">-</span>}</span>
        <span className="text-gray-500 text-sm">Currency:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.currency || <span className="text-gray-300">-</span>}</span>
        <span className="text-gray-500 text-sm">Amount:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.amount ? `${form.form.currency || ""} ${form.form.amount}` : <span className="text-gray-300">-</span>}</span>
        <span className="text-gray-500 text-sm">Expiry Date:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.expiryDate || <span className="text-gray-300">-</span>}</span>
      </div>
    </section>
    <section className="mb-6">
      <h4 className="font-bold mb-3 text-corporate-blue">Transfer</h4>
      <div className="grid grid-cols-2 gap-x-2 gap-y-2">
        <span className="text-gray-500 text-sm">Type:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.transferType || <span className="text-gray-300">-</span>}</span>
        <span className="text-gray-500 text-sm">Amount:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.transferAmount ? `${form.form.currency || ""} ${form.form.transferAmount}` : <span className="text-gray-300">-</span>}</span>
      </div>
    </section>
    <section>
      <h4 className="font-bold mb-3 text-corporate-blue">New Beneficiary</h4>
      <div className="grid grid-cols-2 gap-x-2 gap-y-2">
        <span className="text-gray-500 text-sm">Name:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.newBeneficiary?.name || <span className="text-gray-300">-</span>}</span>
        <span className="text-gray-500 text-sm">Country:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.newBeneficiary?.country || <span className="text-gray-300">-</span>}</span>
      </div>
    </section>
  </aside>
);

interface Props {
  onClose: () => void;
}

const RequestLCTransferForm: React.FC<Props> = ({ onClose }) => {
  const form = useRequestLCTransferForm(onClose);
  const [requestId, setRequestId] = useState("TRF-2025-00123");
  const [agree, setAgree] = useState(false);

  // Only enable submit if on 'review' and agreed
  const canSubmit = form.step === "review" ? agree : true;

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex w-full h-full min-h-screen overflow-auto">
      <div className="flex-1 flex flex-col lg:flex-row w-full h-full">
        {/* Main form section */}
        <div className="flex-1 flex flex-col overflow-y-auto px-2 md:px-5 pt-2 pb-6 max-w-4xl mx-auto">
          <RequestLCTransferLayout stepIdx={form.stepIdx} requestId={requestId} setRequestId={setRequestId}>
            <div className="flex-grow flex flex-col w-full">
              <RequestLCTransferPaneRenderer form={form} />
            </div>
            {/* Button bar outside of content flow, not overlapping */}
            <div className="w-full max-w-5xl mx-auto mt-6 px-2 z-10 relative">
              <RequestLCTransferFormActions {...form} canSubmit={canSubmit} />
            </div>
          </RequestLCTransferLayout>
        </div>
        {/* Right-hand Summary Bar */}
        <SummaryBar form={form} />
      </div>
    </div>
  );
};

export default RequestLCTransferForm;
