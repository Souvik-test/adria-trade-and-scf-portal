import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RemittanceInfo, initialRemittanceInfo } from '@/types/internationalRemittance';

interface RemittanceInfoPaneProps {
  data?: RemittanceInfo;
  onChange?: (field: keyof RemittanceInfo, value: string) => void;
  readOnly?: boolean;
}

const RemittanceInfoPane: React.FC<RemittanceInfoPaneProps> = ({
  data,
  onChange,
  readOnly = false,
}) => {
  // Merge with defaults to ensure all fields exist
  const safeData = { ...initialRemittanceInfo, ...data };
  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';

  const handleChange = (field: keyof RemittanceInfo, value: string) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Remittance Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Invoice Reference */}
          <div className="space-y-2">
            <Label htmlFor="invRef" className="text-sm">
              Invoice Reference
            </Label>
            <Input
              id="invRef"
              value={safeData.invRef || ''}
              onChange={(e) => handleChange('invRef', e.target.value.slice(0, 35))}
              placeholder="Enter invoice or reference number"
              maxLength={35}
              disabled={readOnly}
              className={inputClassName}
            />
            <span className="text-xs text-muted-foreground">{(safeData.invRef || '').length}/35</span>
          </div>
        </div>

        {/* Remittance Text */}
        <div className="space-y-2">
          <Label htmlFor="rmtInfo" className="text-sm">
            Remittance Information / Payment Details
          </Label>
          <Textarea
            id="rmtInfo"
            value={safeData.rmtInfo || ''}
            onChange={(e) => handleChange('rmtInfo', e.target.value.slice(0, 140))}
            placeholder="Enter additional payment information or instructions for the beneficiary"
            maxLength={140}
            disabled={readOnly}
            className={`min-h-[80px] resize-none ${inputClassName}`}
            rows={3}
          />
          <span className="text-xs text-muted-foreground">{(safeData.rmtInfo || '').length}/140</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default RemittanceInfoPane;
