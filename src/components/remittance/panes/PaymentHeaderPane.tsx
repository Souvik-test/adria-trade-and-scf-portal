import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaymentHeader, SETTLEMENT_METHOD_OPTIONS, initialPaymentHeader } from '@/types/internationalRemittance';

interface PaymentHeaderPaneProps {
  data?: PaymentHeader;
  onChange?: (field: keyof PaymentHeader, value: string) => void;
  readOnly?: boolean;
}

const PaymentHeaderPane: React.FC<PaymentHeaderPaneProps> = ({
  data,
  onChange,
  readOnly = false,
}) => {
  // Merge with defaults to ensure all fields exist
  const safeData = { ...initialPaymentHeader, ...data };
  const inputClassName = 'bg-muted cursor-not-allowed';
  
  const handleChange = (field: keyof PaymentHeader, value: string) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Payment Header</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Message Reference - Read Only */}
          <div className="space-y-2">
            <Label htmlFor="msgRef" className="text-sm">
              Message Reference
            </Label>
            <Input
              id="msgRef"
              value={safeData.msgRef || ''}
              readOnly
              disabled
              className={inputClassName}
              placeholder="Auto-generated"
            />
            <span className="text-xs text-muted-foreground">System generated</span>
          </div>

          {/* UETR - Read Only */}
          <div className="space-y-2">
            <Label htmlFor="uetr" className="text-sm">
              UETR
            </Label>
            <Input
              id="uetr"
              value={safeData.uetr || ''}
              readOnly
              disabled
              className={inputClassName}
              placeholder="Auto-generated UUID"
            />
            <span className="text-xs text-muted-foreground">Unique End-to-End Transaction Reference</span>
          </div>

          {/* Creation Date - Read Only */}
          <div className="space-y-2">
            <Label htmlFor="creDt" className="text-sm">
              Creation Date/Time
            </Label>
            <Input
              id="creDt"
              value={safeData.creDt || ''}
              readOnly
              disabled
              className={inputClassName}
              placeholder="Auto-generated"
            />
            <span className="text-xs text-muted-foreground">ISO DateTime format</span>
          </div>

          {/* Settlement Method - Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="sttlmMtd" className="text-sm">
              Settlement Method <span className="text-destructive">*</span>
            </Label>
            <Select
              value={safeData.sttlmMtd || ''}
              onValueChange={(value) => handleChange('sttlmMtd', value)}
              disabled={readOnly}
            >
              <SelectTrigger className={readOnly ? inputClassName : ''}>
                <SelectValue placeholder="Select settlement method" />
              </SelectTrigger>
              <SelectContent>
                {SETTLEMENT_METHOD_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHeaderPane;
