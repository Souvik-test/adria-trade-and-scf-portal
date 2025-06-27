
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReviewSubmitPaneProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

const ReviewSubmitPane: React.FC<ReviewSubmitPaneProps> = ({ formData }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Review Your Guarantee Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Reference Number</h4>
              <p className="text-sm">{formData.referenceNumber || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Guarantee Type</h4>
              <p className="text-sm">{formData.guaranteeType || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Amount</h4>
              <p className="text-sm">{formData.currency || 'USD'} {formData.amount || '0'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Expiry Date</h4>
              <p className="text-sm">{formData.dateOfExpiry || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Applicant</h4>
              <p className="text-sm">{formData.applicantName || 'Not specified'}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Beneficiary</h4>
              <p className="text-sm">{formData.beneficiaryName || 'Not specified'}</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Please review all information carefully before submitting. Once submitted, 
              this guarantee request will be processed by the trade finance team.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewSubmitPane;
