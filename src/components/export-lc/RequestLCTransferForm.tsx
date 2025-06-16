
import React from "react";
import RequestLCTransferLayout from "./RequestLCTransferLayout";
import RequestLCTransferPaneRenderer from "./RequestLCTransferPaneRenderer";
import RequestLCTransferFormActions from "./RequestLCTransferFormActions";
import { useRequestLCTransferForm } from "@/hooks/useRequestLCTransferForm";
import { Checkbox } from "@/components/ui/checkbox";

// Cohesive Summary Bar for both light/dark
const SummaryBar = ({ form }: any) => (
  <aside className="w-[350px] min-w-[290px] h-fit max-h-[90vh] shadow-xl bg-card border border-border rounded-2xl p-6 animate-fade-in overflow-auto mx-4 transition-colors">
    <div className="font-bold mb-4 text-corporate-blue dark:text-corporate-blue text-lg flex items-center gap-2">
      Summary
    </div>
    <section className="mb-6">
      <h4 className="font-bold mb-3 text-corporate-blue dark:text-corporate-blue">
        LC Information
      </h4>
      <div className="grid grid-cols-[130px_1fr] gap-x-2 gap-y-2">
        <span className="text-muted-foreground text-sm">Reference:</span>
        <span className="text-foreground text-sm font-medium break-all">
          {form.form.lcReference || <span className="text-muted-foreground">-</span>}
        </span>
        <span className="text-muted-foreground text-sm">Issuance Date:</span>
        <span className="text-foreground text-sm font-medium break-all">
          {form.form.issuanceDate || <span className="text-muted-foreground">-</span>}
        </span>
        <span className="text-muted-foreground text-sm">Applicant:</span>
        <span className="text-foreground text-sm font-medium break-all">
          {form.form.applicant || <span className="text-muted-foreground">-</span>}
        </span>
        <span className="text-muted-foreground text-sm">Current Beneficiary:</span>
        <span className="text-foreground text-sm font-medium break-all">
          {form.form.currentBeneficiary || <span className="text-muted-foreground">-</span>}
        </span>
        <span className="text-muted-foreground text-sm">Currency:</span>
        <span className="text-foreground text-sm font-medium break-all">
          {form.form.currency || <span className="text-muted-foreground">-</span>}
        </span>
        <span className="text-muted-foreground text-sm">Amount:</span>
        <span className="text-foreground text-sm font-medium break-all">
          {form.form.amount
            ? `${form.form.currency || ""} ${form.form.amount}`
            : <span className="text-muted-foreground">-</span>}
        </span>
        <span className="text-muted-foreground text-sm">Expiry Date:</span>
        <span className="text-foreground text-sm font-medium break-all">
          {form.form.expiryDate || <span className="text-muted-foreground">-</span>}
        </span>
      </div>
    </section>
    <section className="mb-6">
      <h4 className="font-bold mb-3 text-corporate-blue dark:text-corporate-blue">
        Transfer
      </h4>
      <div className="grid grid-cols-[130px_1fr] gap-x-2 gap-y-2">
        <span className="text-muted-foreground text-sm">Type:</span>
        <span className="text-foreground text-sm font-medium break-all">
          {form.form.transferType || <span className="text-muted-foreground">-</span>}
        </span>
      </div>
    </section>
    <section>
      <h4 className="font-bold mb-3 text-corporate-blue dark:text-corporate-blue">
        New Beneficiaries
      </h4>
      <div className="space-y-3">
        {form.form.newBeneficiaries?.map((beneficiary: any, index: number) => (
          <div key={index} className="border border-border rounded p-2">
            <div className="text-xs font-medium text-foreground mb-1">Beneficiary {index + 1}</div>
            <div className="grid grid-cols-[60px_1fr] gap-x-2 gap-y-1 text-xs">
              <span className="text-muted-foreground">Name:</span>
              <span className="text-foreground font-medium break-all">
                {beneficiary.name || <span className="text-muted-foreground">-</span>}
              </span>
              <span className="text-muted-foreground">Amount:</span>
              <span className="text-foreground font-medium break-all">
                {beneficiary.transferAmount
                  ? `${form.form.currency || ""} ${beneficiary.transferAmount}`
                  : <span className="text-muted-foreground">-</span>}
              </span>
              <span className="text-muted-foreground">Country:</span>
              <span className="text-foreground font-medium break-all">
                {beneficiary.country || <span className="text-muted-foreground">-</span>}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  </aside>
);

interface Props {
  onClose: () => void;
}

const RequestLCTransferForm: React.FC<Props> = ({ onClose }) => {
  const form = useRequestLCTransferForm(onClose);
  const [requestId, setRequestId] = React.useState("TRF-2025-00123");
  const [agree, setAgree] = React.useState(false);

  const isFinalStep = form.step === "documents";
  const canSubmit = !isFinalStep || agree;

  return (
    <div className="fixed inset-0 z-50 bg-background flex w-full h-full min-h-screen overflow-auto transition-colors">
      <div className="flex-1 flex flex-row items-stretch w-full h-full max-w-full justify-center">
        {/* Main form section and button bar */}
        <div className="flex-1 flex flex-col overflow-y-auto px-0 md:px-0 pt-0 pb-0" style={{ maxWidth: "calc(100vw - 390px)" }}>
          <RequestLCTransferLayout stepIdx={form.stepIdx} requestId={requestId} setRequestId={setRequestId}>
            <div className="flex-grow flex flex-col w-full">
              <RequestLCTransferPaneRenderer form={form} />
            </div>
            {isFinalStep && (
              <div className="w-full max-w-5xl mx-auto mt-2 px-2 z-10 relative mb-2">
                <div className="flex items-center gap-2 bg-muted border border-border rounded-md px-4 py-3 mb-3 shadow-sm">
                  <Checkbox
                    id="agree"
                    checked={agree}
                    onCheckedChange={(checked) => setAgree(Boolean(checked))}
                  />
                  <label htmlFor="agree" className="text-sm text-muted-foreground select-none cursor-pointer">
                    I confirm that all information provided is accurate and complete
                  </label>
                </div>
              </div>
            )}
            <div className="w-full max-w-5xl mx-auto mt-6 px-2 z-10 relative">
              <RequestLCTransferFormActions {...form} canSubmit={canSubmit} />
            </div>
          </RequestLCTransferLayout>
        </div>
        {/* Summary Bar */}
        <div className="flex flex-col justify-end pb-6">
          <SummaryBar form={form} />
        </div>
      </div>
    </div>
  );
};

export default RequestLCTransferForm;
