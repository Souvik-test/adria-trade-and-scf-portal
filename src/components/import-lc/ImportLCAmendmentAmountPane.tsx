
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImportLCFormData } from '@/types/importLC';
import AmendmentFieldWrapper from './AmendmentFieldWrapper';
import SwiftTagLabel from './SwiftTagLabel';

interface ImportLCAmendmentAmountPaneProps {
  formData: ImportLCFormData;
  originalData: ImportLCFormData;
  changes: Record<string, { original: any; current: any }>;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const ImportLCAmendmentAmountPane: React.FC<ImportLCAmendmentAmountPaneProps> = ({
  formData,
  originalData,
  changes,
  updateField
}) => {
  // Calculate increase/decrease amount
  const calculateAmountChange = () => {
    if (!changes.lcAmount) return null;
    const originalAmount = originalData.lcAmount || 0;
    const currentAmount = formData.lcAmount || 0;
    const difference = currentAmount - originalAmount;
    
    if (difference === 0) return null;
    
    return {
      type: difference > 0 ? 'Increase' : 'Decrease',
      amount: Math.abs(difference),
      difference
    };
  };

  const amountChange = calculateAmountChange();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Amount & Terms - Amendment
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AmendmentFieldWrapper
            fieldName="lcAmount"
            label="LC Amount"
            hasChanged={!!changes.lcAmount}
            originalValue={originalData.lcAmount}
          >
            <SwiftTagLabel tag=":32B:" label="LC Amount" required />
            <Input
              type="number"
              value={formData.lcAmount}
              onChange={(e) => updateField('lcAmount', parseFloat(e.target.value) || 0)}
              placeholder="Enter LC amount"
            />
          </AmendmentFieldWrapper>

          <AmendmentFieldWrapper
            fieldName="currency"
            label="Currency"
            hasChanged={!!changes.currency}
            originalValue={originalData.currency}
          >
            <SwiftTagLabel tag=":32B:" label="Currency" required />
            <Select
              value={formData.currency}
              onValueChange={(value) => updateField('currency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="AED">AED</SelectItem>
              </SelectContent>
            </Select>
          </AmendmentFieldWrapper>

          {amountChange && (
            <div className="md:col-span-2">
              <SwiftTagLabel tag=":32B:" label={`${amountChange.type} Amount`} />
              <div className="relative">
                <Input
                  value={`${amountChange.type}: ${formData.currency} ${amountChange.amount.toLocaleString()}`}
                  readOnly
                  className={`bg-gray-50 dark:bg-gray-800 cursor-not-allowed ${
                    amountChange.type === 'Increase' 
                      ? 'border-green-300 text-green-700 dark:text-green-400' 
                      : 'border-red-300 text-red-700 dark:text-red-400'
                  }`}
                />
                <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-medium ${
                  amountChange.type === 'Increase' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {amountChange.difference > 0 ? '+' : ''}{amountChange.difference.toLocaleString()}
                </div>
              </div>
            </div>
          )}

          <AmendmentFieldWrapper
            fieldName="tolerance"
            label="Tolerance"
            hasChanged={!!changes.tolerance}
            originalValue={originalData.tolerance}
          >
            <SwiftTagLabel tag=":39A:" label="Tolerance" />
            <Input
              value={formData.tolerance}
              onChange={(e) => updateField('tolerance', e.target.value)}
              placeholder="e.g., +/- 10%"
            />
          </AmendmentFieldWrapper>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImportLCAmendmentAmountPane;
