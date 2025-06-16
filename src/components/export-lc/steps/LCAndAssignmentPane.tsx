
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import LCSearchDropdown from "../LCSearchDropdown";
import { TransferableLC } from "@/services/transferableLCService";

const LCAndAssignmentPane = ({ form }: { form: any }) => {
  // Compute values for assignment logic
  const lcAmount = (form.form.amount !== '' && !isNaN(Number(form.form.amount))) ? Number(form.form.amount) : 0;
  const isFull = form.form.assignmentType === "Full";

  // Validation for assignment amount
  const assignmentAmount = Number(form.form.assignmentAmount) || 0;
  const isAssignmentAmountValid = !form.form.assignmentType || form.form.assignmentType === "Full" || 
    (form.form.assignmentType === "Partial" && assignmentAmount <= lcAmount);

  const handleLCSelect = (lc: TransferableLC) => {
    form.updateField({
      lcReference: lc.corporate_reference,
      issuanceDate: lc.issue_date || '',
      applicant: lc.applicant_name || '',
      currentBeneficiary: lc.beneficiary_name || '',
      currency: lc.currency || '',
      amount: lc.lc_amount || '',
      expiryDate: lc.expiry_date || '',
      // Reset assignment amount when LC changes
      assignmentAmount: form.form.assignmentType === "Full" ? lc.lc_amount || '' : ''
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

      {/* Assignment Details Section */}
      <div>
        <h2 className="text-lg font-semibold text-corporate-blue mb-4">Assignment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label className="font-medium mb-1 block text-foreground">Assignment Type</Label>
            <RadioGroup
              className="flex items-center gap-6 mt-1"
              value={form.form.assignmentType}
              onValueChange={val => {
                if (val === "Full") {
                  form.updateField({
                    assignmentType: "Full",
                    assignmentAmount: lcAmount,
                  });
                } else {
                  form.updateField({
                    assignmentType: "Partial",
                  });
                }
              }}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Full" id="assignment-type-full" />
                <label htmlFor="assignment-type-full" className="text-sm text-foreground cursor-pointer">Full Assignment</label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Partial" id="assignment-type-partial" />
                <label htmlFor="assignment-type-partial" className="text-sm text-foreground cursor-pointer">Partial Assignment</label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Assignment Amount</Label>
            <Input
              type="number"
              value={
                isFull
                  ? lcAmount
                  : form.form.assignmentAmount
              }
              min={0}
              max={lcAmount || undefined}
              disabled={isFull}
              onChange={e => {
                // Only allow change if Partial
                if (!isFull) {
                  form.updateField({ assignmentAmount: e.target.value });
                }
              }}
              placeholder="Enter amount"
              className={!isAssignmentAmountValid ? "border-red-500" : ""}
            />
            <div className="text-xs text-muted-foreground mt-1">
              {lcAmount > 0
                ? <>LC Amount: <span className="font-semibold text-corporate-blue">{form.form.currency || "..." } {lcAmount.toLocaleString()}</span></>
                : null}
            </div>
            {!isAssignmentAmountValid && form.form.assignmentType === "Partial" && (
              <div className="text-xs text-red-500 mt-1">
                Assignment amount cannot exceed LC amount
              </div>
            )}
          </div>
          <div>
            <Label className="font-medium mb-1 block text-foreground">Assignment Reason</Label>
            <Input
              value={form.form.assignmentReason}
              onChange={e => form.updateField({ assignmentReason: e.target.value })}
              placeholder="Reason for assignment"
            />
          </div>
          <div className="col-span-full md:col-span-3">
            <Label className="font-medium mb-1 block text-foreground">Assignment Conditions</Label>
            <div className="bg-corporate-blue/10 border border-corporate-blue rounded-lg p-4 text-sm text-corporate-blue min-h-[104px] transition-colors">
              <ul className="list-disc ml-5">
                <li>
                  Assignment transfers only the right to receive proceeds as per Article 39 of UCP 600
                </li>
                <li>
                  Beneficiary retains responsibility for performing all LC obligations
                </li>
                <li>
                  Assignee has no direct claim against the issuing bank
                </li>
                <li>
                  Assignment is subject to terms and conditions of the original LC
                </li>
                <li>
                  Assignment fees will be charged as per tariff
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LCAndAssignmentPane;
