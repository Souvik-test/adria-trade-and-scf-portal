
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CreditCard, User, Building, Calendar } from 'lucide-react';

interface GuaranteeDetailsProps {
  guaranteeData: any;
}

const GuaranteeDetailsCard: React.FC<GuaranteeDetailsProps> = ({ guaranteeData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Guarantee/SBLC Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Guarantee/SBLC Reference
            </Label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {guaranteeData.guaranteeReference}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <User className="w-4 h-4" />
              Applicant
            </Label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {guaranteeData.applicantName}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Building className="w-4 h-4" />
              Issuing Bank
            </Label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {guaranteeData.issuingBank}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Issue Date
            </Label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {guaranteeData.issueDate}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Expiry Date
            </Label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {guaranteeData.expiryDate}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Guarantee/SBLC Amount
            </Label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {guaranteeData.guaranteeAmount}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuaranteeDetailsCard;
