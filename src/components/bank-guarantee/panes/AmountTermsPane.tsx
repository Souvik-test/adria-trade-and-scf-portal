
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OutwardBGFormData } from '@/types/outwardBankGuarantee';

interface AmountTermsPaneProps {
  formData: OutwardBGFormData;
  onFieldChange: (field: string, value: any) => void;
  isAmendment?: boolean;
}

const AmountTermsPane: React.FC<AmountTermsPaneProps> = ({
  formData,
  onFieldChange,
  isAmendment = false
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {isAmendment ? 'Amount & Terms (MT 767 Tags: 32B, 39A, 39B, 39C)' : 'Amount & Terms (MT 760 Tags: 32B, 39A)'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Currency *</Label>
              <Select value={formData.currency} onValueChange={(value) => onFieldChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="SGD">SGD</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="guaranteeAmount">Guarantee Amount (Tag 32B) *</Label>
              <Input
                id="guaranteeAmount"
                type="number"
                value={formData.guaranteeAmount || ''}
                onChange={(e) => onFieldChange('guaranteeAmount', parseFloat(e.target.value) || 0)}
                placeholder="Enter guarantee amount"
              />
            </div>
          </div>

          {isAmendment && (
            <div>
              <Label htmlFor="increaseDecreaseAmount">Increase/Decrease Amount</Label>
              <Input
                id="increaseDecreaseAmount"
                value={formData.increaseDecreaseAmount || ''}
                onChange={(e) => onFieldChange('increaseDecreaseAmount', e.target.value)}
                placeholder="Enter increase/decrease amount (e.g., +100,000 or -50,000)"
                readOnly
                className="bg-gray-100"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="percentageCreditAmount">Percentage Credit Amount (Tag 39A)</Label>
              <Input
                id="percentageCreditAmount"
                value={formData.percentageCreditAmount || ''}
                onChange={(e) => onFieldChange('percentageCreditAmount', e.target.value)}
                placeholder="Enter percentage (e.g., 10%)"
              />
            </div>
            {isAmendment && (
              <div>
                <Label htmlFor="maximumCreditAmount">Maximum Credit Amount (Tag 39B)</Label>
                <Input
                  id="maximumCreditAmount"
                  type="number"
                  value={formData.maximumCreditAmount || ''}
                  onChange={(e) => onFieldChange('maximumCreditAmount', parseFloat(e.target.value) || 0)}
                  placeholder="Enter maximum credit amount"
                />
              </div>
            )}
          </div>

          {isAmendment && (
            <div>
              <Label htmlFor="additionalAmounts">Additional Amounts (Tag 39C)</Label>
              <Input
                id="additionalAmounts"
                value={formData.additionalAmounts || ''}
                onChange={(e) => onFieldChange('additionalAmounts', e.target.value)}
                placeholder="Enter additional amounts details"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AmountTermsPane;
