
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const LCInformationPaneV2 = ({ form }: { form: any }) => (
  <div className="w-full max-w-2xl p-8 bg-white border rounded-2xl shadow-md">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-corporate-blue rounded-full p-2 text-white">
        <svg width={22} height={22} fill="none" viewBox="0 0 24 24">
          <path d="M4 19.5v-15A2.5 2.5 0 016.5 2h11A2.5 2.5 0 0120 4.5v15a.5.5 0 01-.5.5h-15a.5.5 0 01-.5-.5z" fill="currentColor"/>
        </svg>
      </div>
      <h2 className="text-lg font-semibold">Letter of Credit Information</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label className="font-medium">LC Number</Label>
        <div className="relative">
          <Input value={form.form.lcReference}
            onChange={e => form.updateField({ lcReference: e.target.value })}
            className="pr-10"
            placeholder="LC-xxxxxxx"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded" tabIndex={-1}>
            <svg width={20} height={20} fill="none" viewBox="0 0 24 24"><path d="M15 12H9M12 7.5v9" stroke="#475569" strokeWidth={2} strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>
      <div>
        <Label className="font-medium">Is Transferable?</Label>
        <select
          className="block w-full border rounded-md px-3 py-2 mt-1 bg-gray-100 cursor-not-allowed"
          value="Yes"
          disabled
        >
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>
      <div>
        <Label className="font-medium">Currency</Label>
        <select className="block w-full border rounded-md px-3 py-2 mt-1" value={form.form.currency}
          onChange={e => form.updateField({ currency: e.target.value })}>
          <option value="">Select Currency</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <div>
        <Label className="font-medium">LC Amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-gray-400">$</span>
          <Input
            type="number"
            className="pl-8"
            placeholder="Amount"
            value={form.form.amount}
            onChange={e => form.updateField({ amount: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label className="font-medium">Expiry Date</Label>
        <div className="relative">
          <Input
            type="date"
            value={form.form.expiryDate}
            onChange={e => form.updateField({ expiryDate: e.target.value })}
            className="pr-10"
          />
          <CalendarIcon className="absolute right-3 top-2.5 text-gray-400 h-5 w-5" />
        </div>
      </div>
      <div>
        <Label className="font-medium">Issuing Bank</Label>
        <Input
          value={form.form.issuingBank}
          onChange={e => form.updateField({ issuingBank: e.target.value })}
          placeholder="Bank name"
        />
      </div>
      <div>
        <Label className="font-medium">Applicant</Label>
        <Input
          value={form.form.applicant}
          onChange={e => form.updateField({ applicant: e.target.value })}
        />
      </div>
      <div>
        <Label className="font-medium">Current Beneficiary</Label>
        <Input
          value={form.form.currentBeneficiary}
          onChange={e => form.updateField({ currentBeneficiary: e.target.value })}
        />
      </div>
      <div>
        <Label className="font-medium">Advising Bank</Label>
        <Input
          value={form.form.advisingBank || ""}
          onChange={e => form.updateField({ advisingBank: e.target.value })}
          placeholder="Advising bank"
        />
      </div>
    </div>
  </div>
);

export default LCInformationPaneV2;
