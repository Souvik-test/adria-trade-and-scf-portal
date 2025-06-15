
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const NewBeneficiaryPaneV2 = ({ form }: { form: any }) => (
  <div className="w-full max-w-2xl p-8 bg-white border rounded-2xl shadow-md">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-corporate-blue rounded-full p-2 text-white">
        <svg width={22} height={22} fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth={2} />
          <path d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth={2} />
        </svg>
      </div>
      <h2 className="text-lg font-semibold">New Beneficiary Information</h2>
    </div>
    <div className="space-y-6">
      <div>
        <Label className="font-medium">Beneficiary Name</Label>
        <Input
          value={form.form.newBeneficiary.name}
          onChange={e => form.updateNewBeneficiary({ name: e.target.value })}
        />
      </div>
      <div>
        <Label className="font-medium">Address</Label>
        <Textarea
          value={form.form.newBeneficiary.address}
          onChange={e => form.updateNewBeneficiary({ address: e.target.value })}
          className="min-h-[70px]"
        />
      </div>
      <div>
        <Label className="font-medium">Country</Label>
        <select className="block w-full border rounded-md px-3 py-2 mt-1"
          value={form.form.newBeneficiary.country || ""}
          onChange={e => form.updateNewBeneficiary({ country: e.target.value })}>
          <option value="">Select Country</option>
          <option>India</option>
          <option>United States</option>
          <option>UAE</option>
        </select>
      </div>
      <div className="mt-3 font-semibold text-gray-700">Banking Details</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        <div>
          <Label className="font-medium">Bank Name</Label>
          <Input
            value={form.form.newBeneficiary.bankName}
            onChange={e => form.updateNewBeneficiary({ bankName: e.target.value })}
          />
        </div>
        <div>
          <Label className="font-medium">Bank Address</Label>
          <Textarea
            value={form.form.newBeneficiary.bankAddress}
            onChange={e => form.updateNewBeneficiary({ bankAddress: e.target.value })}
            className="min-h-[50px]"
          />
        </div>
        <div>
          <Label className="font-medium">SWIFT Code</Label>
          <Input
            value={form.form.newBeneficiary.swiftCode}
            onChange={e => form.updateNewBeneficiary({ swiftCode: e.target.value })}
          />
        </div>
        <div>
          <Label className="font-medium">Account Number</Label>
          <Input
            value={form.form.newBeneficiary.accountNumber}
            onChange={e => form.updateNewBeneficiary({ accountNumber: e.target.value })}
          />
        </div>
      </div>
    </div>
  </div>
);

export default NewBeneficiaryPaneV2;
