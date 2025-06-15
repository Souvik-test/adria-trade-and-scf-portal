
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const NewBeneficiaryPane = ({ form }: { form: any }) => (
  <div className="bg-card border rounded-lg p-6 md:p-8 max-w-3xl mx-auto">
    <h2 className="text-lg font-semibold mb-6">New Beneficiary Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label className="mb-1 block">Beneficiary Name</Label>
        <Input
          value={form.form.newBeneficiary.name}
          onChange={e => form.updateNewBeneficiary({ name: e.target.value })}
        />
      </div>
      <div>
        <Label className="mb-1 block">Address</Label>
        <Input
          value={form.form.newBeneficiary.address}
          onChange={e => form.updateNewBeneficiary({ address: e.target.value })}
        />
      </div>
      <div>
        <Label className="mb-1 block">SWIFT Code</Label>
        <Input
          value={form.form.newBeneficiary.swiftCode}
          onChange={e => form.updateNewBeneficiary({ swiftCode: e.target.value })}
        />
      </div>
      <div>
        <Label className="mb-1 block">Account Number</Label>
        <Input
          value={form.form.newBeneficiary.accountNumber}
          onChange={e => form.updateNewBeneficiary({ accountNumber: e.target.value })}
        />
      </div>
    </div>
  </div>
);

export default NewBeneficiaryPane;
