
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImportLCFormData } from '@/types/importLC';
import AmendmentFieldWrapper from './AmendmentFieldWrapper';

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

          <AmendmentFieldWrapper
            fieldName="tolerance"
            label="Tolerance"
            hasChanged={!!changes.tolerance}
            originalValue={originalData.tolerance}
          >
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
