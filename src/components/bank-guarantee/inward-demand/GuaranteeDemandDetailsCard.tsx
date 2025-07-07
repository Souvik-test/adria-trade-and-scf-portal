
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CreditCard, User, Building, Calendar, DollarSign } from 'lucide-react';

interface GuaranteeDemandDetailsProps {
  guaranteeData: any;
}

const GuaranteeDemandDetailsCard: React.FC<GuaranteeDemandDetailsProps> = ({ guaranteeData }) => {
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
              Guarantee/SBLC Reference (Tag: 20)
            </Label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {guaranteeData.guaranteeReference}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <User className="w-4 h-4" />
              Applicant (Tag: 50)
            </Label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {guaranteeData.applicantName}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Building className="w-4 h-4" />
              Issuing Bank (Tag: 52A)
            </Label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {guaranteeData.issuingBank}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Issue Date (Tag: 31C)
            </Label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {guaranteeData.issueDate}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Expiry Date (Tag: 31D)
            </Label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {guaranteeData.expiryDate}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              Guarantee Amount (Tag: 32B)
            </Label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {guaranteeData.currency} {guaranteeData.guaranteeAmount}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Beneficiary (Tag: 59)
            </Label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {guaranteeData.beneficiaryName}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Guarantee Type
            </Label>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {guaranteeData.guaranteeType}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuaranteeDemandDetailsCard;
