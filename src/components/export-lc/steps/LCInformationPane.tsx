
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const LCInformationPane = ({ form }: { form: any }) => (
  <div className="bg-card border rounded-lg p-6 md:p-8 max-w-3xl mx-auto">
    <h2 className="text-lg font-semibold mb-6">LC Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label className="mb-1 block">LC Reference</Label>
        <Input value={form.form.lcReference} onChange={e => form.updateField({ lcReference: e.target.value })} />
      </div>
      <div>
        <Label className="mb-1 block">Issuing Bank</Label>
        <Input value={form.form.issuingBank} onChange={e => form.updateField({ issuingBank: e.target.value })} />
      </div>
      <div>
        <Label className="mb-1 block">Applicant</Label>
        <Input value={form.form.applicant} onChange={e => form.updateField({ applicant: e.target.value })} />
      </div>
      <div>
        <Label className="mb-1 block">Current Beneficiary</Label>
        <Input value={form.form.currentBeneficiary} onChange={e => form.updateField({ currentBeneficiary: e.target.value })} />
      </div>
      <div>
        <Label className="mb-1 block">Currency</Label>
        <Input value={form.form.currency} onChange={e => form.updateField({ currency: e.target.value })} />
      </div>
      <div>
        <Label className="mb-1 block">Amount</Label>
        <Input type="number" value={form.form.amount} onChange={e => form.updateField({ amount: e.target.value })} />
      </div>
      <div>
        <Label className="mb-1 block">Expiry Date</Label>
        <Input type="date" value={form.form.expiryDate} onChange={e => form.updateField({ expiryDate: e.target.value })} />
      </div>
    </div>
  </div>
);

export default LCInformationPane;
