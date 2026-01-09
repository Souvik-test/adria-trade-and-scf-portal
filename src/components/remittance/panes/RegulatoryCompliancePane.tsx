import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RegulatoryCompliance, PURPOSE_CODE_OPTIONS, SOURCE_OF_FUNDS_OPTIONS, initialRegulatoryCompliance } from '@/types/internationalRemittance';

interface RegulatoryCompliancePaneProps {
  data?: RegulatoryCompliance;
  onChange?: (field: keyof RegulatoryCompliance, value: string | boolean) => void;
  readOnly?: boolean;
}

const RegulatoryCompliancePane: React.FC<RegulatoryCompliancePaneProps> = ({
  data,
  onChange,
  readOnly = false,
}) => {
  // Merge with defaults to ensure all fields exist
  const safeData = { ...initialRegulatoryCompliance, ...data };
  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';

  const handleChange = (field: keyof RegulatoryCompliance, value: string | boolean) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Regulatory & Compliance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Purpose Code */}
          <div className="space-y-2">
            <Label htmlFor="purpCd" className="text-sm">
              Purpose Code <span className="text-destructive">*</span>
            </Label>
            <Select
              value={safeData.purpCd || ''}
              onValueChange={(value) => handleChange('purpCd', value)}
              disabled={readOnly}
            >
              <SelectTrigger className={inputClassName}>
                <SelectValue placeholder="Select purpose of payment" />
              </SelectTrigger>
              <SelectContent>
                {PURPOSE_CODE_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Source of Funds */}
          <div className="space-y-2">
            <Label htmlFor="srcFunds" className="text-sm">
              Source of Funds <span className="text-destructive">*</span>
            </Label>
            <Select
              value={safeData.srcFunds || ''}
              onValueChange={(value) => handleChange('srcFunds', value)}
              disabled={readOnly}
            >
              <SelectTrigger className={inputClassName}>
                <SelectValue placeholder="Select source of funds" />
              </SelectTrigger>
              <SelectContent>
                {SOURCE_OF_FUNDS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Declaration Checkbox */}
        <div className="flex items-start space-x-3 pt-4 p-4 border rounded-lg bg-muted/30">
          <Checkbox
            id="declFlg"
            checked={safeData.declFlg ?? false}
            onCheckedChange={(checked) => handleChange('declFlg', checked === true)}
            disabled={readOnly}
            className="mt-1"
          />
          <div className="space-y-1">
            <Label
              htmlFor="declFlg"
              className={`text-sm font-medium cursor-pointer ${readOnly ? 'text-muted-foreground' : ''}`}
            >
              Declaration Accepted <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              I confirm that the information provided is accurate and complete. I understand that this transaction 
              is subject to applicable laws and regulations regarding international money transfers, including 
              anti-money laundering (AML) and counter-terrorism financing (CTF) requirements.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegulatoryCompliancePane;
