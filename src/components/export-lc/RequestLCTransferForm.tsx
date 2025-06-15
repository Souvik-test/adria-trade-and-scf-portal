
import React, { useState } from "react";
import RequestLCTransferLayout from "./RequestLCTransferLayout";
import RequestLCTransferPaneRenderer from "./RequestLCTransferPaneRenderer";
import RequestLCTransferFormActions from "./RequestLCTransferFormActions";
import { useRequestLCTransferForm } from "@/hooks/useRequestLCTransferForm";

// New summary bar
const SummaryBar = ({ form }: any) => (
  <aside className="hidden lg:block w-[330px] h-fit max-h-[90vh] sticky top-8 shadow-lg bg-white border border-gray-200 rounded-xl ml-auto p-5 animate-fade-in overflow-auto">
    <div className="font-bold mb-2 text-corporate-blue text-lg flex items-center gap-2">
      Summary
    </div>
    <div className="mb-4">
      <h4 className="font-bold mb-1 text-corporate-blue">LC Information</h4>
      <div className="text-sm"><span className="font-medium">Reference:</span> {form.form.lcReference}</div>
      <div className="text-sm"><span className="font-medium">Advising Bank:</span> {form.form.advisingBank}</div>
      <div className="text-sm"><span className="font-medium">Issuing Bank:</span> {form.form.issuingBank}</div>
      <div className="text-sm"><span className="font-medium">Applicant:</span> {form.form.applicant}</div>
      <div className="text-sm"><span className="font-medium">Beneficiary:</span> {form.form.currentBeneficiary}</div>
      <div className="text-sm"><span className="font-medium">Currency:</span> {form.form.currency}</div>
      <div className="text-sm"><span className="font-medium">Amount:</span> {form.form.amount}</div>
      <div className="text-sm"><span className="font-medium">Expiry Date:</span> {form.form.expiryDate}</div>
    </div>
    <div className="mb-4">
      <h4 className="font-bold mb-1 text-corporate-blue">Transfer</h4>
      <div className="text-sm"><span className="font-medium">Type:</span> {form.form.transferType}</div>
      <div className="text-sm"><span className="font-medium">Amount:</span> {form.form.transferAmount}</div>
    </div>
    <div className="mb-4">
      <h4 className="font-bold mb-1 text-corporate-blue">New Beneficiary</h4>
      <div className="text-sm"><span className="font-medium">Name:</span> {form.form.newBeneficiary?.name}</div>
      <div className="text-sm"><span className="font-medium">Country:</span> {form.form.newBeneficiary?.country}</div>
    </div>
  </aside>
);

interface Props {
  onClose: () => void;
}

const RequestLCTransferForm: React.FC<Props> = ({ onClose }) => {
  const form = useRequestLCTransferForm(onClose);
  const [requestId, setRequestId] = useState("TRF-2025-00123");

  // Track agree checkbox for enabling submit
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
            {/* Place button bar outside of content flow, no overlap */}
            <div className="w-full max-w-5xl mx-auto mt-6 px-2">
              <RequestLCTransferFormActions {...form} canSubmit={canSubmit} />
            </div>
          </RequestLCTransferLayout>
        </div>
        {/* Right Summary Bar, always visible */}
        <SummaryBar form={form} />
      </div>
    </div>
  );
};

export default RequestLCTransferForm;
