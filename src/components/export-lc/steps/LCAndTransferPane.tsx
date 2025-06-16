
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LCSearchDropdown from "../LCSearchDropdown";
import { TransferableLC } from "@/services/transferableLCService";

const LCAndTransferPane = ({ form }: { form: any }) => {
  // Compute values for transfer logic as before
  const lcAmount = (form.form.amount !== '' && !isNaN(Number(form.form.amount))) ? Number(form.form.amount) : '';
  const isFull = form.form.transferType === "Full";

  // Validation for transfer amount
  const transferAmount = Number(form.form.transferAmount) || 0;
  const isTransferAmountValid = !form.form.transferType || form.form.transferType === "Full" || 
    (form.form.transferType === "Partial" && transferAmount <= lcAmount);

  const handleLCSelect = (lc: TransferableLC) => {
    form.updateField({
      lcReference: lc.corporate_reference,
      issuanceDate: lc.issue_date || '',
      applicant: lc.applicant_name || '',
      currentBeneficiary: lc.beneficiary_name || '',
      currency: lc.currency || '',
      amount: lc.lc_amount || '',
      expiryDate: lc.expiry_date || '',
      // Reset transfer amount when LC changes
      transferAmount: form.form.transferType === "Full" ? lc.lc_amount || '' : ''
    });
  };

  return (
    <div className="w-full bg-card border border-border rounded-2xl shadow-md p-8 max-w-none transition-colors">
      {/* LC Information Section */}
      <div>
        <h2 className="text-lg font-semibold text-corporate-blue mb-4">LC Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <Label className="font-medium mb-1 block text-foreground">LC Number</Label>
            <LCSearchDropdown
              value={form.form.lcReference}
              onSelect={handleLCSelect}
              placeholder="Search and select LC Number..."
            />
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Issuance Date</Label>
            <Input
              type="date"
              value={form.form.issuanceDate || ""}
              onChange={e => form.updateField({ issuanceDate: e.target.value })}
              placeholder="LC Issuance Date"
              readOnly
              className="bg-muted"
            />
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Applicant</Label>
            <Input
              value={form.form.applicant}
              onChange={e => form.updateField({ applicant: e.target.value })}
              readOnly
              className="bg-muted"
            />
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Current Beneficiary</Label>
            <Input
              value={form.form.currentBeneficiary}
              onChange={e => form.updateField({ currentBeneficiary: e.target.value })}
              readOnly
              className="bg-muted"
            />
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Currency</Label>
            <select className="block w-full border border-border rounded-md px-3 py-2 mt-1 bg-muted text-foreground cursor-not-allowed"
              value={form.form.currency}
              onChange={e => form.updateField({ currency: e.target.value })}
              disabled>
              <option value="">Select Currency</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">LC Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
              <Input
                type="number"
                className="pl-8 bg-muted cursor-not-allowed"
                placeholder="Amount"
                value={form.form.amount}
                onChange={e => form.updateField({ amount: e.target.value })}
                readOnly
              />
            </div>
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Expiry Date</Label>
            <Input
              type="date"
              value={form.form.expiryDate}
              onChange={e => form.updateField({ expiryDate: e.target.value })}
              readOnly
              className="bg-muted"
            />
          </div>
        </div>
      </div>
      {/* Transfer Details Section */}
      <div>
        <h2 className="text-lg font-semibold text-corporate-blue mb-4">Transfer Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label className="font-medium mb-1 block text-foreground">Transfer Type</Label>
            <RadioGroup
              className="flex items-center gap-6 mt-1"
              value={form.form.transferType}
              onValueChange={val => {
                if (val === "Full") {
                  form.updateField({
                    transferType: "Full",
                    transferAmount: lcAmount,
                  });
                } else {
                  form.updateField({
                    transferType: "Partial",
                  });
                }
              }}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Full" id="transfer-type-full" />
                <label htmlFor="transfer-type-full" className="text-sm text-foreground cursor-pointer">Full Transfer</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Partial" id="transfer-type-partial" />
                <label htmlFor="transfer-type-partial" className="text-sm text-foreground cursor-pointer">Partial Transfer</label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Transfer Amount</Label>
            <Input
              type="number"
              value={
                isFull
                  ? lcAmount
                  : form.form.transferAmount
              }
              min={0}
              max={lcAmount || undefined}
              disabled={isFull}
              onChange={e => {
                // Only allow change if Partial
                if (!isFull) {
                  form.updateField({ transferAmount: e.target.value });
                }
              }}
              placeholder="Enter amount"
              className={!isTransferAmountValid ? "border-red-500" : ""}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {typeof lcAmount === "number" && !isNaN(lcAmount)
                ? <>LC Amount: <span className="font-semibold text-corporate-blue">{form.form.currency || "..." } {lcAmount.toLocaleString()}</span></>
                : null}
            </div>
            {!isTransferAmountValid && form.form.transferType === "Partial" && (
              <div className="text-xs text-red-500 mt-1">
                Transfer amount cannot exceed LC amount
              </div>
            )}
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Is Transferable?</Label>
            <select
              className="block w-full border border-border rounded-md px-3 py-2 mt-1 bg-muted text-foreground cursor-not-allowed"
              value="Yes"
              disabled
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div className="col-span-full md:col-span-3">
            <Label className="font-medium mb-1 block text-foreground">Transfer Conditions</Label>
            <div className="bg-corporate-blue/10 border border-corporate-blue rounded-lg p-4 text-sm text-corporate-blue min-h-[104px] transition-colors">
              <ul className="list-disc ml-5">
                <li>
                  Transfer is subject to terms and conditions of the original LC
                </li>
                <li>
                  Transferring bank fees will be charged as per tariff
                </li>
                <li>
                  Original LC expiry date remains unchanged
                </li>
                <li>
                  Transfer is irrevocable once confirmed
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LCAndTransferPane;
