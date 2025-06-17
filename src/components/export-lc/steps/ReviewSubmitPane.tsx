
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AssignmentFormData } from '@/types/exportLCAssignment';

interface ReviewSubmitPaneProps {
  form: AssignmentFormData;
}

const ReviewSubmitPane: React.FC<ReviewSubmitPaneProps> = ({ form }) => {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
              Review Assignment Request
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">LC Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">LC Reference:</span> {form.lcReference}</p>
                  <p><span className="font-medium">Issuing Bank:</span> {form.issuingBank}</p>
                  <p><span className="font-medium">Amount:</span> {form.currency} {form.amount}</p>
                  <p><span className="font-medium">Expiry Date:</span> {form.expiryDate}</p>
                  <p><span className="font-medium">Current Beneficiary:</span> {form.currentBeneficiary}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Assignment Details</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Assignment Type:</span> {form.assignmentType}</p>
                  <p><span className="font-medium">Assignment Amount:</span> {form.currency} {form.assignmentAmount}</p>
                  <p><span className="font-medium">Assignment Percentage:</span> {form.assignmentPercentage}%</p>
                  <p><span className="font-medium">Purpose:</span> {form.assignmentPurpose}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Assignee Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {form.assignee.name}</p>
                  <p><span className="font-medium">Country:</span> {form.assignee.country}</p>
                  <p><span className="font-medium">Bank:</span> {form.assignee.bankName}</p>
                  <p><span className="font-medium">SWIFT Code:</span> {form.assignee.swiftCode}</p>
                  <p><span className="font-medium">Account Number:</span> {form.assignee.accountNumber}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Documents</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Required Documents Checked:</span></p>
                  <ul className="list-disc list-inside ml-2">
                    {Object.entries(form.requiredDocumentsChecked)
                      .filter(([_, checked]) => checked)
                      .map(([doc, _]) => (
                        <li key={doc}>{doc}</li>
                      ))}
                  </ul>
                  <p><span className="font-medium">Supporting Documents:</span> {form.supportingDocuments.length} files uploaded</p>
                </div>
              </div>
            </div>

            {form.assignmentConditions && (
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Assignment Conditions</h3>
                <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded">
                  {form.assignmentConditions}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default ReviewSubmitPane;
