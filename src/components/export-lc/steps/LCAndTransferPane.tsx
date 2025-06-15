
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import TransferableLCSearchSelect from "../TransferableLCSearchSelect";

const InfoRow = ({ label, value, forceReadOnly = true }) => (
  <div className="flex items-center gap-3 mb-2">
    <Label className="text-foreground w-[170px] min-w-[130px]">{label}</Label>
    <Input
      value={value || ""}
      readOnly={forceReadOnly}
      className="flex-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 cursor-not-allowed"
      tabIndex={-1}
    />
  </div>
);

const LCAndTransferPane = ({ form }: { form: any }) => {
  const { form: formData, updateField, updateLCReferenceFromImportLC } = form;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <section className="mb-6">
        <h3 className="font-semibold text-lg mb-4 text-corporate-blue dark:text-corporate-blue">LC Information</h3>
        {/* Transferable LC Reference */}
        <Label className="block mb-2 text-foreground font-medium">LC Number / Corporate Reference <span className="text-red-500">*</span></Label>
        <TransferableLCSearchSelect
          value={formData.lcReference}
          onChange={(lcObj) => {
            updateLCReferenceFromImportLC(lcObj);
          }}
        />

        <div className="mt-6 space-y-2">
          <InfoRow label="Issuing Bank" value={formData.issuingBank} />
          <InfoRow label="Applicant Name" value={formData.applicant} />
          <InfoRow label="Currency" value={formData.currency} />
          <InfoRow label="LC Amount" value={formData.amount} />
          <InfoRow label="Expiry Date" value={formData.expiryDate} />
          <InfoRow label="Current Beneficiary" value={formData.currentBeneficiary} />
          <InfoRow label="Issue Date" value={formData.issueDate} />
          <InfoRow label="Place of Expiry" value={formData.placeOfExpiry} />
        </div>
      </section>

      <section>
        <h3 className="font-semibold text-lg mb-4 text-corporate-blue dark:text-corporate-blue">Transfer Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Transfer Type</Label>
            <Select
              value={formData.transferType}
              onValueChange={val => updateField({ transferType: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Full">Full Transfer</SelectItem>
                <SelectItem value="Partial">Partial Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Transfer Amount</Label>
            <Input
              type="number"
              min={0}
              placeholder="Amount"
              value={formData.transferAmount}
              onChange={e => updateField({ transferAmount: e.target.value ? Number(e.target.value) : "" })}
            />
          </div>
          <div className="md:col-span-2">
            <Label>Transfer Conditions</Label>
            <Textarea
              value={formData.transferConditions}
              onChange={e => updateField({ transferConditions: e.target.value })}
              placeholder="Add any special transfer conditions..."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LCAndTransferPane;
