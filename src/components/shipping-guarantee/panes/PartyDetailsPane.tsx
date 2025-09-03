import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ShippingGuaranteeFormData, ShippingGuaranteeActionType } from '@/types/shippingGuarantee';

interface PartyDetailsPaneProps {
  formData: ShippingGuaranteeFormData;
  onFieldChange: (field: string, value: any) => void;
  action: ShippingGuaranteeActionType;
}

const PartyDetailsPane: React.FC<PartyDetailsPaneProps> = ({
  formData,
  onFieldChange,
  action
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Applicant Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="applicantName">Applicant Name *</Label>
            <Input
              id="applicantName"
              value={formData.applicantName || ''}
              onChange={(e) => onFieldChange('applicantName', e.target.value)}
              placeholder="Enter applicant name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="applicantAddress">Applicant Address *</Label>
            <Textarea
              id="applicantAddress"
              value={formData.applicantAddress || ''}
              onChange={(e) => onFieldChange('applicantAddress', e.target.value)}
              placeholder="Enter applicant address"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="applicantAccountNumber">Account Number</Label>
            <Input
              id="applicantAccountNumber"
              value={formData.applicantAccountNumber || ''}
              onChange={(e) => onFieldChange('applicantAccountNumber', e.target.value)}
              placeholder="Enter account number"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Beneficiary Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="beneficiaryName">Beneficiary Name *</Label>
            <Input
              id="beneficiaryName"
              value={formData.beneficiaryName || ''}
              onChange={(e) => onFieldChange('beneficiaryName', e.target.value)}
              placeholder="Enter beneficiary name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="beneficiaryAddress">Beneficiary Address *</Label>
            <Textarea
              id="beneficiaryAddress"
              value={formData.beneficiaryAddress || ''}
              onChange={(e) => onFieldChange('beneficiaryAddress', e.target.value)}
              placeholder="Enter beneficiary address"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="beneficiaryBankName">Beneficiary Bank Name</Label>
            <Input
              id="beneficiaryBankName"
              value={formData.beneficiaryBankName || ''}
              onChange={(e) => onFieldChange('beneficiaryBankName', e.target.value)}
              placeholder="Enter bank name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="beneficiaryBankAddress">Beneficiary Bank Address</Label>
            <Textarea
              id="beneficiaryBankAddress"
              value={formData.beneficiaryBankAddress || ''}
              onChange={(e) => onFieldChange('beneficiaryBankAddress', e.target.value)}
              placeholder="Enter bank address"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="beneficiaryBankSwiftCode">SWIFT Code</Label>
            <Input
              id="beneficiaryBankSwiftCode"
              value={formData.beneficiaryBankSwiftCode || ''}
              onChange={(e) => onFieldChange('beneficiaryBankSwiftCode', e.target.value)}
              placeholder="Enter SWIFT code"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartyDetailsPane;