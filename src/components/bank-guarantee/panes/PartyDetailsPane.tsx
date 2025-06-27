
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PartyDetailsPaneProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

const PartyDetailsPane: React.FC<PartyDetailsPaneProps> = ({
  formData,
  onFieldChange
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Applicant Details (MT 760 Tag: 50)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="applicantName">Applicant Name *</Label>
            <Input
              id="applicantName"
              value={formData.applicantName || ''}
              onChange={(e) => onFieldChange('applicantName', e.target.value)}
              placeholder="Enter applicant name"
            />
          </div>
          <div>
            <Label htmlFor="applicantAddress">Applicant Address *</Label>
            <Textarea
              id="applicantAddress"
              value={formData.applicantAddress || ''}
              onChange={(e) => onFieldChange('applicantAddress', e.target.value)}
              placeholder="Enter applicant address"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Beneficiary Details (MT 760 Tag: 59)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="beneficiaryName">Beneficiary Name *</Label>
            <Input
              id="beneficiaryName"
              value={formData.beneficiaryName || ''}
              onChange={(e) => onFieldChange('beneficiaryName', e.target.value)}
              placeholder="Enter beneficiary name"
            />
          </div>
          <div>
            <Label htmlFor="beneficiaryAddress">Beneficiary Address *</Label>
            <Textarea
              id="beneficiaryAddress"
              value={formData.beneficiaryAddress || ''}
              onChange={(e) => onFieldChange('beneficiaryAddress', e.target.value)}
              placeholder="Enter beneficiary address"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PartyDetailsPane;
