
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface GuaranteeInformationPaneProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

const GuaranteeInformationPane: React.FC<GuaranteeInformationPaneProps> = ({
  formData,
  onFieldChange
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Guarantee Information (MT 760 Tags: 20, 23, 31C, 31D)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="referenceNumber">Reference Number (Tag 20) *</Label>
              <Input
                id="referenceNumber"
                value={formData.referenceNumber || ''}
                onChange={(e) => onFieldChange('referenceNumber', e.target.value)}
                placeholder="Enter reference number"
              />
            </div>
            <div>
              <Label htmlFor="guaranteeType">Guarantee Type (Tag 23) *</Label>
              <Select onValueChange={(value) => onFieldChange('guaranteeType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select guarantee type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ISSU">Issuance</SelectItem>
                  <SelectItem value="AMND">Amendment</SelectItem>
                  <SelectItem value="CANC">Cancellation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfIssue">Date of Issue (Tag 31C) *</Label>
              <Input
                id="dateOfIssue"
                type="date"
                value={formData.dateOfIssue || ''}
                onChange={(e) => onFieldChange('dateOfIssue', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dateOfExpiry">Date of Expiry (Tag 31D) *</Label>
              <Input
                id="dateOfExpiry"
                type="date"
                value={formData.dateOfExpiry || ''}
                onChange={(e) => onFieldChange('dateOfExpiry', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="guaranteeText">Guarantee Text/Purpose</Label>
            <Textarea
              id="guaranteeText"
              value={formData.guaranteeText || ''}
              onChange={(e) => onFieldChange('guaranteeText', e.target.value)}
              placeholder="Enter the purpose and text of the guarantee"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuaranteeInformationPane;
