
import React from "react";

const LCInformationPane = ({ form }: { form: any }) => (
  <div>
    <h2 className="text-lg font-semibold mb-6">LC Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-gray-700 text-sm mb-1">LC Reference</label>
        <input className="input input-bordered w-full" value={form.form.lcReference} onChange={e => form.updateField({ lcReference: e.target.value })} />
      </div>
      <div>
        <label className="block text-gray-700 text-sm mb-1">Issuing Bank</label>
        <input className="input input-bordered w-full" value={form.form.issuingBank} onChange={e => form.updateField({ issuingBank: e.target.value })} />
      </div>
      <div>
        <label className="block text-gray-700 text-sm mb-1">Applicant</label>
        <input className="input input-bordered w-full" value={form.form.applicant} onChange={e => form.updateField({ applicant: e.target.value })} />
      </div>
      <div>
        <label className="block text-gray-700 text-sm mb-1">Current Beneficiary</label>
        <input className="input input-bordered w-full" value={form.form.currentBeneficiary} onChange={e => form.updateField({ currentBeneficiary: e.target.value })} />
      </div>
      <div>
        <label className="block text-gray-700 text-sm mb-1">Currency</label>
        <input className="input input-bordered w-full" value={form.form.currency} onChange={e => form.updateField({ currency: e.target.value })} />
      </div>
      <div>
        <label className="block text-gray-700 text-sm mb-1">Amount</label>
        <input type="number" className="input input-bordered w-full" value={form.form.amount} onChange={e => form.updateField({ amount: e.target.value })} />
      </div>
      <div>
        <label className="block text-gray-700 text-sm mb-1">Expiry Date</label>
        <input type="date" className="input input-bordered w-full" value={form.form.expiryDate} onChange={e => form.updateField({ expiryDate: e.target.value })} />
      </div>
    </div>
  </div>
);

export default LCInformationPane;
