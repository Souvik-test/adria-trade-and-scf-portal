
import React from "react";
import { Check } from "lucide-react";

const ReviewSubmitPaneV2 = ({ form }: { form: any }) => (
  <div className="w-full max-w-2xl p-8 bg-white border rounded-2xl shadow-md">
    <div className="flex items-center gap-3 mb-6">
      <div className="bg-corporate-blue rounded-full p-2 text-white">
        <Check className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-semibold">Review & Submit</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mb-6">
      <div>
        <h4 className="font-bold mb-2 text-corporate-blue">LC Information</h4>
        <div className="text-sm"><span className="font-medium">Reference:</span> {form.form.lcReference}</div>
        <div className="text-sm"><span className="font-medium">Issuing Bank:</span> {form.form.issuingBank}</div>
        <div className="text-sm"><span className="font-medium">Applicant:</span> {form.form.applicant}</div>
        <div className="text-sm"><span className="font-medium">Current Beneficiary:</span> {form.form.currentBeneficiary}</div>
        <div className="text-sm"><span className="font-medium">Currency:</span> {form.form.currency}</div>
        <div className="text-sm"><span className="font-medium">Amount:</span> {form.form.amount}</div>
        <div className="text-sm"><span className="font-medium">Expiry Date:</span> {form.form.expiryDate}</div>
      </div>
      <div>
        <h4 className="font-bold mb-2 text-corporate-blue">Transfer Details</h4>
        <div className="text-sm"><span className="font-medium">Type:</span> {form.form.transferType}</div>
        <div className="text-sm"><span className="font-medium">Amount:</span> {form.form.transferAmount}</div>
        <div className="text-sm"><span className="font-medium">Conditions:</span> {form.form.transferConditions}</div>
      </div>
    </div>
    <div className="flex items-center gap-2 mb-2">
      <input type="checkbox" id="agree" className="form-checkbox h-4 w-4" />
      <label htmlFor="agree" className="text-xs text-gray-600">I agree to the terms and conditions of LC Transfer.</label>
    </div>
    <div className="text-corporate-blue font-semibold my-4 text-center">
      Ready to submit your request?
    </div>
  </div>
);

export default ReviewSubmitPaneV2;
