
import React from "react";

const TransferDetailsPane = ({ form }: { form: any }) => (
  <div>
    <h2 className="text-lg font-semibold mb-6">Transfer Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-gray-700 text-sm mb-1">Transfer Type</label>
        <select
          className="input input-bordered w-full"
          value={form.form.transferType}
          onChange={e => form.updateField({ transferType: e.target.value })}
        >
          <option value="Full">Full Transfer</option>
          <option value="Partial">Partial Transfer</option>
        </select>
      </div>
      <div>
        <label className="block text-gray-700 text-sm mb-1">Transfer Amount</label>
        <input
          type="number"
          className="input input-bordered w-full"
          value={form.form.transferAmount}
          onChange={e => form.updateField({ transferAmount: e.target.value })}
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-gray-700 text-sm mb-1">Transfer Conditions (if any)</label>
        <textarea
          className="input input-bordered w-full"
          value={form.form.transferConditions}
          onChange={e => form.updateField({ transferConditions: e.target.value })}
        />
      </div>
    </div>
  </div>
);

export default TransferDetailsPane;
