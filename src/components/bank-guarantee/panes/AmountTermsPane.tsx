
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AmountTermsPaneProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

const AmountTermsPane: React.FC<AmountTermsPaneProps> = ({
  formData,
  onFieldChange
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Amount Details (MT 760 Tag: 32B)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="currency">Currency *</Label>
              <Select onValueChange={(value) => onFieldChange('currency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="SGD">SGD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="amount">Guarantee Amount *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount || ''}
                onChange={(e) => onFieldChange('amount', e.target.value)}
                placeholder="Enter amount"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Amount Information (MT 760 Tags: 39A, 39B, 39C)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="percentageCreditAmount">Percentage Credit Amount (Tag 39A)</Label>
              <Input
                id="percentageCreditAmount"
                value={formData.percentageCreditAmount || ''}
                onChange={(e) => onFieldChange('percentageCreditAmount', e.target.value)}
                placeholder="Enter percentage (e.g., 100)"
              />
            </div>
            <div>
              <Label htmlFor="maximumCreditAmount">Maximum Credit Amount (Tag 39B)</Label>
              <Input
                id="maximumCreditAmount"
                value={formData.maximumCreditAmount || ''}
                onChange={(e) => onFieldChange('maximumCreditAmount', e.target.value)}
                placeholder="Enter maximum amount"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="additionalAmounts">Additional Amounts (Tag 39C)</Label>
            <Input
              id="additionalAmounts"
              value={formData.additionalAmounts || ''}
              onChange={(e) => onFieldChange('additionalAmounts', e.target.value)}
              placeholder="Enter additional amount details"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AmountTermsPane;
