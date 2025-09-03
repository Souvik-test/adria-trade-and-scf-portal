import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShippingGuaranteeFormData, ShippingGuaranteeActionType } from '@/types/shippingGuarantee';

interface BasicInformationPaneProps {
  formData: ShippingGuaranteeFormData;
  onFieldChange: (field: string, value: any) => void;
  action: ShippingGuaranteeActionType;
}

const BasicInformationPane: React.FC<BasicInformationPaneProps> = ({
  formData,
  onFieldChange,
  action
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guaranteeReference">Guarantee Reference *</Label>
              <Input
                id="guaranteeReference"
                value={formData.guaranteeReference || ''}
                onChange={(e) => onFieldChange('guaranteeReference', e.target.value)}
                placeholder="Enter guarantee reference"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="corporateReference">Corporate Reference</Label>
              <Input
                id="corporateReference"
                value={formData.corporateReference || ''}
                onChange={(e) => onFieldChange('corporateReference', e.target.value)}
                placeholder="Enter corporate reference"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Issue Date *</Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate || ''}
                onChange={(e) => onFieldChange('issueDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate || ''}
                onChange={(e) => onFieldChange('expiryDate', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guaranteeAmount">Guarantee Amount *</Label>
              <Input
                id="guaranteeAmount"
                type="number"
                value={formData.guaranteeAmount || ''}
                onChange={(e) => onFieldChange('guaranteeAmount', parseFloat(e.target.value))}
                placeholder="Enter amount"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency *</Label>
              <Select 
                value={formData.currency || 'USD'} 
                onValueChange={(value) => onFieldChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guaranteeType">Guarantee Type</Label>
            <Select 
              value={formData.guaranteeType || ''} 
              onValueChange={(value) => onFieldChange('guaranteeType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select guarantee type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shipping">Shipping Guarantee</SelectItem>
                <SelectItem value="delivery">Delivery Guarantee</SelectItem>
                <SelectItem value="cargo">Cargo Release Guarantee</SelectItem>
                <SelectItem value="vessel">Vessel Guarantee</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BasicInformationPane;