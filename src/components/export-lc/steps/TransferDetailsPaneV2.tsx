
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TransferDetailsPaneV2 = ({ form }: { form: any }) => (
  <div className="w-full max-w-2xl p-8 bg-white border rounded-2xl shadow-md">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-corporate-blue rounded-full p-2 text-white">
        <svg width={22} height={22} fill="none" viewBox="0 0 24 24">
          <path d="M15 12H4m0 0l5.5 5.5M4 12l5.5-5.5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h2 className="text-lg font-semibold">Transfer Details</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label className="font-medium mb-2 block">Transfer Type</Label>
        <div className="flex items-center gap-4 mt-1">
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Full" checked={form.form.transferType === "Full"} onChange={() => form.updateField({ transferType: "Full" })} />
            Full Transfer
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="radio" value="Partial" checked={form.form.transferType === "Partial"} onChange={() => form.updateField({ transferType: "Partial" })} />
            Partial Transfer
          </label>
        </div>
      </div>
      <div>
        <Label className="font-medium mb-2 block">Transfer Amount</Label>
        <Input
          type="number"
          value={form.form.transferAmount}
          onChange={e => form.updateField({ transferAmount: e.target.value })}
          className="w-full"
        />
        <div className="text-xs text-gray-500 mt-1">Available: <span className="font-semibold text-corporate-blue">$250,000.00</span></div>
      </div>
      <div className="md:col-span-2">
        <Label className="font-medium block mb-2">Transfer Conditions</Label>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
          <ul className="list-disc ml-5">
            <li>Partial transfer allowed only if LC permits</li>
            <li>Beneficiary change should be validated</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

export default TransferDetailsPaneV2;
