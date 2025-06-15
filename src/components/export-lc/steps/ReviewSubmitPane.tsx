
import React from "react";

const ReviewSubmitPane = ({ form }: { form: any }) => (
  <div>
    <h2 className="text-lg font-semibold mb-6">Review and Submit</h2>
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h4 className="font-semibold mb-2">LC Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <div><span className="font-medium">LC Ref:</span> {form.form.lcReference}</div>
        <div><span className="font-medium">Issuing Bank:</span> {form.form.issuingBank}</div>
        <div><span className="font-medium">Applicant:</span> {form.form.applicant}</div>
        <div><span className="font-medium">Current Beneficiary:</span> {form.form.currentBeneficiary}</div>
        <div><span className="font-medium">Currency:</span> {form.form.currency}</div>
        <div><span className="font-medium">Amount:</span> {form.form.amount}</div>
        <div><span className="font-medium">Expiry Date:</span> {form.form.expiryDate}</div>
      </div>
      <h4 className="font-semibold mb-2 mt-4">Transfer Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <div><span className="font-medium">Type:</span> {form.form.transferType}</div>
        <div><span className="font-medium">Amount:</span> {form.form.transferAmount}</div>
        <div className="md:col-span-2"><span className="font-medium">Conditions:</span> {form.form.transferConditions}</div>
      </div>
      <h4 className="font-semibold mb-2 mt-4">New Beneficiary</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <div><span className="font-medium">Name:</span> {form.form.newBeneficiary.name}</div>
        <div><span className="font-medium">Address:</span> {form.form.newBeneficiary.address}</div>
        <div><span className="font-medium">SWIFT Code:</span> {form.form.newBeneficiary.swiftCode}</div>
        <div><span className="font-medium">Account:</span> {form.form.newBeneficiary.accountNumber}</div>
      </div>
      <h4 className="font-semibold mb-2 mt-4">Documents</h4>
      <ul>
        {form.form.supportingDocuments && form.form.supportingDocuments.length > 0 ? (
          form.form.supportingDocuments.map((file: File, idx: number) => (
            <li key={idx}>{file.name}</li>
          ))
        ) : (
          <li>No files uploaded</li>
        )}
      </ul>
    </div>
    <div className="text-corporate-blue font-semibold my-4">Ready to submit your request?</div>
  </div>
);

export default ReviewSubmitPane;
