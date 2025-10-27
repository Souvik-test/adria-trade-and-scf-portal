import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface RepaymentDetailsPaneProps {
  formData: any;
  onFieldChange: (field: string, value: any) => void;
}

const RepaymentDetailsPane: React.FC<RepaymentDetailsPaneProps> = ({
  formData,
  onFieldChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Repayment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label>Auto Repayment Enabled</Label>
            <p className="text-sm text-muted-foreground">Enable automatic repayment on due date</p>
          </div>
          <Switch
            checked={formData.autoRepaymentEnabled}
            onCheckedChange={(checked) => {
              onFieldChange('autoRepaymentEnabled', checked);
              // If auto repayment is disabled, force repayment mode to manual
              if (!checked) {
                onFieldChange('repaymentMode', 'manual');
              }
            }}
          />
        </div>

        <div className="space-y-2">
          <Label>Repayment Mode *</Label>
          <Select 
            value={formData.repaymentMode} 
            onValueChange={(value) => onFieldChange('repaymentMode', value)}
            disabled={!formData.autoRepaymentEnabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto" disabled={!formData.autoRepaymentEnabled}>
                Auto {!formData.autoRepaymentEnabled && "(Disabled - Enable Auto Repayment first)"}
              </SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Repayment Party *</Label>
          <Select 
            value={formData.repaymentParty || formData.repaymentBy} 
            onValueChange={(value) => onFieldChange('repaymentParty', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={formData.repaymentBy ? `Default: ${formData.repaymentBy}` : "Select repayment party"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Buyer">Buyer</SelectItem>
              <SelectItem value="Seller">Seller</SelectItem>
              <SelectItem value="Supplier">Supplier</SelectItem>
              <SelectItem value="Third Party">Third Party</SelectItem>
            </SelectContent>
          </Select>
          {formData.repaymentBy && (
            <p className="text-xs text-muted-foreground">
              Program default: {formData.repaymentBy}
            </p>
          )}
        </div>

        {formData.repaymentMode === 'manual' && (
          <div className="space-y-2">
            <Label>Repayment Account</Label>
            <Input
              value={formData.repaymentAccount}
              onChange={(e) => onFieldChange('repaymentAccount', e.target.value)}
              placeholder="Enter account number"
            />
          </div>
        )}

        <div className="bg-muted p-4 rounded-lg space-y-2 mt-6">
          <h4 className="font-semibold">Repayment Summary</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Finance Amount:</span>
              <span className="font-medium">{formData.financeAmount.toFixed(2)} {formData.financeCurrency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interest Amount:</span>
              <span className="font-medium">{formData.interestAmount.toFixed(2)} {formData.financeCurrency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Finance Tenor:</span>
              <span className="font-medium">{formData.financeTenorDays} days</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="font-semibold">Total Repayment Amount:</span>
              <span className="font-semibold text-lg">{formData.totalRepaymentAmount.toFixed(2)} {formData.financeCurrency}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RepaymentDetailsPane;