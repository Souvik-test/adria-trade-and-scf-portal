
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LCAndTransferPane = ({ form }: { form: any }) => {
  // Compute values for transfer logic as before
  const lcAmount = (form.form.amount !== '' && !isNaN(Number(form.form.amount))) ? Number(form.form.amount) : '';
  const isFull = form.form.transferType === "Full";

  return (
    <div className="w-full bg-card border border-border rounded-2xl shadow-md p-8 max-w-none transition-colors">
      {/* LC Information Section */}
      <div>
        <h2 className="text-lg font-semibold text-corporate-blue mb-4">LC Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <Label className="font-medium mb-1 block text-foreground">LC Number</Label>
            <Input
              value={form.form.lcReference}
              onChange={e => form.updateField({ lcReference: e.target.value })}
              placeholder="LC-xxxxxxx"
            />
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Issuance Date</Label>
            <Input
              type="date"
              value={form.form.issuanceDate || ""}
              onChange={e => form.updateField({ issuanceDate: e.target.value })}
              placeholder="LC Issuance Date"
            />
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Advising Bank</Label>
            <Input
              value={form.form.advisingBank}
              onChange={e => form.updateField({ advisingBank: e.target.value })}
              placeholder="Advising bank"
            />
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Issuing Bank</Label>
            <Input
              value={form.form.issuingBank}
              onChange={e => form.updateField({ issuingBank: e.target.value })}
              placeholder="Bank name"
            />
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Applicant</Label>
            <Input
              value={form.form.applicant}
              onChange={e => form.updateField({ applicant: e.target.value })}
            />
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Current Beneficiary</Label>
            <Input
              value={form.form.currentBeneficiary}
              onChange={e => form.updateField({ currentBeneficiary: e.target.value })}
            />
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Currency</Label>
            <select className="block w-full border border-border rounded-md px-3 py-2 mt-1 bg-background text-foreground"
              value={form.form.currency}
              onChange={e => form.updateField({ currency: e.target.value })}>
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
                className="pl-8"
                placeholder="Amount"
                value={form.form.amount}
                onChange={e => form.updateField({ amount: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Expiry Date</Label>
            <Input
              type="date"
              value={form.form.expiryDate}
              onChange={e => form.updateField({ expiryDate: e.target.value })}
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
            <div className="flex items-center gap-4 mt-1">
              <label className="inline-flex items-center gap-2 text-foreground">
                <input
                  type="radio"
                  value="Full"
                  checked={form.form.transferType === "Full"}
                  onChange={() => {
                    form.updateField({
                      transferType: "Full",
                      transferAmount: lcAmount, // set to full LC amount on selecting Full
                    });
                  }}
                />
                Full Transfer
              </label>
              <label className="inline-flex items-center gap-2 text-foreground">
                <input
                  type="radio"
                  value="Partial"
                  checked={form.form.transferType === "Partial"}
                  onChange={() => {
                    form.updateField({
                      transferType: "Partial"
                    });
                  }}
                />
                Partial Transfer
              </label>
            </div>
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
            />
            <div className="text-xs text-muted-foreground mt-1">
              {typeof lcAmount === "number" && !isNaN(lcAmount)
                ? <>LC Amount: <span className="font-semibold text-corporate-blue">{form.form.currency || "..." } {lcAmount.toLocaleString()}</span></>
                : null}
            </div>
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
