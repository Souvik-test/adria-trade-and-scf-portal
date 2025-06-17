
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AssignmentFormData } from '@/types/exportLCAssignment';

interface ReviewSubmitPaneProps {
  form: AssignmentFormData;
}

const ReviewSubmitPane: React.FC<ReviewSubmitPaneProps> = ({ form }) => {
  const checkedDocuments = Object.entries(form.requiredDocumentsChecked)
    .filter(([_, checked]) => checked)
    .map(([doc, _]) => doc);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Review Assignment Request
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* LC Information */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">LC Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">LC Reference:</span> {form.lcReference || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Issuing Bank:</span> {form.issuingBank || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Issuance Date:</span> {form.issuanceDate || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Expiry Date:</span> {form.expiryDate || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Applicant:</span> {form.applicant || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Current Beneficiary:</span> {form.currentBeneficiary || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Currency:</span> {form.currency}
              </div>
              <div>
                <span className="font-medium">Amount:</span> {form.amount || 'Not specified'}
              </div>
            </div>
          </div>

          <Separator />

          {/* Assignment Details */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Assignment Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Assignment Type:</span> {form.assignmentType}
              </div>
              <div>
                <span className="font-medium">Assignment Amount:</span> {form.assignmentAmount || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Assignment Percentage:</span> {form.assignmentPercentage || 'Not specified'}%
              </div>
              <div>
                <span className="font-medium">Purpose:</span> {form.assignmentPurpose || 'Not specified'}
              </div>
            </div>
            {form.assignmentConditions && (
              <div className="mt-4">
                <span className="font-medium">Conditions:</span>
                <p className="text-sm mt-1 text-gray-600 dark:text-gray-300">{form.assignmentConditions}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Assignee Information */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Assignee Information</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span> {form.assignee.name || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Country:</span> {form.assignee.country || 'Not specified'}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Address:</span> {form.assignee.address || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Bank Name:</span> {form.assignee.bankName || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">SWIFT Code:</span> {form.assignee.swiftCode || 'Not specified'}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Bank Address:</span> {form.assignee.bankAddress || 'Not specified'}
              </div>
              <div>
                <span className="font-medium">Account Number:</span> {form.assignee.accountNumber || 'Not specified'}
              </div>
            </div>
          </div>

          <Separator />

          {/* Documents */}
          <div>
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Documents</h3>
            {checkedDocuments.length > 0 && (
              <div className="mb-4">
                <span className="font-medium">Required Documents:</span>
                <ul className="list-disc list-inside mt-2 text-sm">
                  {checkedDocuments.map((doc) => (
                    <li key={doc}>{doc}</li>
                  ))}
                </ul>
              </div>
            )}
            {form.supportingDocuments.length > 0 && (
              <div>
                <span className="font-medium">Supporting Documents ({form.supportingDocuments.length}):</span>
                <ul className="list-disc list-inside mt-2 text-sm">
                  {form.supportingDocuments.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSubmitPane;
