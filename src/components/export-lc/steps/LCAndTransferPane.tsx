import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import TransferableLCSearchSelect from "../TransferableLCSearchSelect";

const InfoField = ({ label, value, className = "" }: { label: string; value?: string | number; className?: string }) => (
  <div className={`flex flex-col ${className}`}>
    <Label className="text-xs text-muted-foreground font-semibold mb-1">{label}</Label>
    <Input
      value={value ?? ""}
      readOnly
      className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-0 ring-1 ring-corporate-blue/5 focus:ring-corporate-blue/70 shadow-sm cursor-not-allowed font-medium"
      tabIndex={-1}
      style={{ color: "#15699E" }}
    />
  </div>
);

const LCAndTransferPane = ({ form }: { form: any }) => {
  const { form: formData, updateField, updateLCReferenceFromImportLC } = form;

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-8">
      {/* LC Information */}
      <section>
        <h3 className="font-semibold text-lg mb-4 text-corporate-blue dark:text-corporate-blue">LC Information</h3>
        <div className="mb-3">
          <Label className="block mb-2 text-foreground font-medium">LC Number / Corporate Reference <span className="text-red-500">*</span></Label>
          <TransferableLCSearchSelect
            value={formData.lcReference}
            onChange={lcObj => updateLCReferenceFromImportLC(lcObj)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6">
          <InfoField label="Issuing Bank" value={formData.issuingBank} />
          <InfoField label="Applicant Name" value={formData.applicant} />
          <InfoField label="Currency" value={formData.currency} />

          <InfoField label="LC Amount" value={formData.amount} />
          <InfoField label="Expiry Date" value={formData.expiryDate} />
          <InfoField label="Current Beneficiary" value={formData.currentBeneficiary} />

          <InfoField label="Issue Date" value={formData.issueDate} />
          <InfoField label="Place of Expiry" value={formData.placeOfExpiry} />
          {/* Beneficiary Bank Name input */}
          <div className="flex flex-col">
            <Label className="text-xs text-muted-foreground font-semibold mb-1">Beneficiary Bank Name</Label>
            <Input
              value={formData.beneficiaryBankName || ""}
              onChange={e => updateField({ beneficiaryBankName: e.target.value })}
              placeholder="Enter Beneficiary Bank Name"
              className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border-0 ring-1 ring-corporate-blue/5 focus:ring-corporate-blue/70 shadow-sm font-medium"
            />
          </div>
        </div>
      </section>

      {/* Transfer Details */}
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
