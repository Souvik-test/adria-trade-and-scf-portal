import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { OutwardBGFormData } from '@/types/outwardBankGuarantee';

interface GuaranteeInformationPaneProps {
  formData: OutwardBGFormData;
  onFieldChange: (field: string, value: any) => void;
  isAmendment?: boolean;
}

const GuaranteeInformationPane: React.FC<GuaranteeInformationPaneProps> = ({
  formData,
  onFieldChange,
  isAmendment = false
}) => {
  if (isAmendment) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Amendment Information (MT 767 Tags: 20, 21, 26E)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guaranteeReferenceNo">Guarantee Reference No. (Tag 21) *</Label>
                <div className="relative">
                  <Input
                    id="guaranteeReferenceNo"
                    value={formData.guaranteeReferenceNo || ''}
                    onChange={(e) => onFieldChange('guaranteeReferenceNo', e.target.value)}
                    placeholder="Enter guarantee reference number"
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div>
                <Label htmlFor="amendmentNumber">Amendment Number (Tag 26E) *</Label>
                <Input
                  id="amendmentNumber"
                  value={formData.amendmentNumber || ''}
                  onChange={(e) => onFieldChange('amendmentNumber', e.target.value)}
                  placeholder="Enter amendment number"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfExpiry">Date of Expiry (Tag 31D)</Label>
                <Input
                  id="dateOfExpiry"
                  type="date"
                  value={formData.dateOfExpiry || ''}
                  onChange={(e) => onFieldChange('dateOfExpiry', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="guaranteeAmount">Guarantee Amount (Tag 32B)</Label>
                <Input
                  id="guaranteeAmount"
                  type="number"
                  value={formData.guaranteeAmount || ''}
                  onChange={(e) => onFieldChange('guaranteeAmount', parseFloat(e.target.value) || 0)}
                  placeholder="Enter guarantee amount"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="guaranteeText">Guarantee Text/Purpose (Tag 45A)</Label>
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
  }

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
              <Select value={formData.guaranteeType} onValueChange={(value) => onFieldChange('guaranteeType', value)}>
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
