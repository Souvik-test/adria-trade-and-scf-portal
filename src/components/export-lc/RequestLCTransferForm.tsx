
import React, { useState } from "react";
import RequestLCTransferLayout from "./RequestLCTransferLayout";
import RequestLCTransferPaneRenderer from "./RequestLCTransferPaneRenderer";
import RequestLCTransferFormActions from "./RequestLCTransferFormActions";
import { useRequestLCTransferForm } from "@/hooks/useRequestLCTransferForm";

// Improved summary bar with aligned fields and better side spacing
const SummaryBar = ({ form }: any) => (
  <aside className="w-[350px] min-w-[290px] h-fit max-h-[90vh] shadow-lg bg-white border border-gray-200 rounded-xl p-6 animate-fade-in overflow-auto mx-4">
    <div className="font-bold mb-4 text-corporate-blue text-lg flex items-center gap-2">
      Summary
    </div>
    <section className="mb-6">
      <h4 className="font-bold mb-3 text-corporate-blue">LC Information</h4>
      <div className="grid grid-cols-[130px_1fr] gap-x-2 gap-y-2">
        <span className="text-gray-500 text-sm">Reference:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.lcReference || <span className="text-gray-300">-</span>}</span>
        <span className="text-gray-500 text-sm">Issuance Date:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.issuanceDate || <span className="text-gray-300">-</span>}</span>
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
      <div className="grid grid-cols-[130px_1fr] gap-x-2 gap-y-2">
        <span className="text-gray-500 text-sm">Type:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.transferType || <span className="text-gray-300">-</span>}</span>
        <span className="text-gray-500 text-sm">Amount:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.transferAmount ? `${form.form.currency || ""} ${form.form.transferAmount}` : <span className="text-gray-300">-</span>}</span>
      </div>
    </section>
    <section>
      <h4 className="font-bold mb-3 text-corporate-blue">New Beneficiary</h4>
      <div className="grid grid-cols-[130px_1fr] gap-x-2 gap-y-2">
        <span className="text-gray-500 text-sm">Name:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.newBeneficiary?.name || <span className="text-gray-300">-</span>}</span>
        <span className="text-gray-500 text-sm">Country:</span>
        <span className="text-gray-900 text-sm font-medium break-all">{form.form.newBeneficiary?.country || <span className="text-gray-300">-</span>}</span>
      </div>
    </section>
  </aside>
);

const RequestLCTransferForm: React.FC<Props> = ({ onClose }) => {
  const form = useRequestLCTransferForm(onClose);
  const [requestId, setRequestId] = React.useState("TRF-2025-00123");
  const [agree, setAgree] = React.useState(false);

  const canSubmit = form.stepIdx === 1 ? agree : true;

  return (
    <div className="fixed inset-0 z-50 bg-[#F8FAFC] flex w-full h-full min-h-screen overflow-auto">
      <div className="flex-1 flex flex-row items-stretch w-full h-full max-w-full justify-center">
        {/* Main form section and button bar */}
        <div className="flex-1 flex flex-col overflow-y-auto px-2 md:px-5 pt-2 pb-6" style={{ maxWidth: "calc(100vw - 390px)" }}>
          <RequestLCTransferLayout stepIdx={form.stepIdx} requestId={requestId} setRequestId={setRequestId}>
            <div className="flex-grow flex flex-col w-full">
              <RequestLCTransferPaneRenderer form={form} />
            </div>
            <div className="w-full max-w-5xl mx-auto mt-6 px-2 z-10 relative">
              <RequestLCTransferFormActions {...form} canSubmit={canSubmit} />
            </div>
          </RequestLCTransferLayout>
        </div>
        {/* Summary Bar - now aligned with the button bar, not at top */}
        <div className="flex flex-col justify-end pb-6">
          <SummaryBar form={form} />
        </div>
      </div>
    </div>
  );
};

export default RequestLCTransferForm;

