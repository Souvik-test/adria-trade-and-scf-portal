
import React from "react";

const NewBeneficiaryPane = ({ form }: { form: any }) => (
  <div>
    <h2 className="text-lg font-semibold mb-6">New Beneficiary Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-gray-700 text-sm mb-1">Beneficiary Name</label>
        <input
          className="input input-bordered w-full"
          value={form.form.newBeneficiary.name}
          onChange={e => form.updateNewBeneficiary({ name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm mb-1">Address</label>
        <input
          className="input input-bordered w-full"
          value={form.form.newBeneficiary.address}
          onChange={e => form.updateNewBeneficiary({ address: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm mb-1">SWIFT Code</label>
        <input
          className="input input-bordered w-full"
          value={form.form.newBeneficiary.swiftCode}
          onChange={e => form.updateNewBeneficiary({ swiftCode: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm mb-1">Account Number</label>
        <input
          className="input input-bordered w-full"
          value={form.form.newBeneficiary.accountNumber}
          onChange={e => form.updateNewBeneficiary({ accountNumber: e.target.value })}
        />
      </div>
    </div>
  </div>
);

export default NewBeneficiaryPane;
