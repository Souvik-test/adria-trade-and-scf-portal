import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AmountCharges, CURRENCY_OPTIONS, CHARGE_BEARER_OPTIONS } from '@/types/internationalRemittance';
import CollapsiblePane from './CollapsiblePane';

interface AmountChargesPaneProps {
  data: AmountCharges;
  onChange: (field: keyof AmountCharges, value: string | number) => void;
  readOnly?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const AmountChargesPane: React.FC<AmountChargesPaneProps> = ({
  data,
  onChange,
  readOnly = false,
  isOpen = true,
  onToggle = () => {},
}) => {
  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';
  const readOnlyClassName = 'bg-muted cursor-not-allowed';

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onChange('instAmt', '');
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onChange('instAmt', numValue);
      }
    }
  };

  return (
    <CollapsiblePane title="Amount & Charges" isOpen={isOpen} onToggle={onToggle}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Instructed Amount */}
        <div className="space-y-2">
          <Label htmlFor="instAmt" className="text-sm">
            Instructed Amount <span className="text-destructive">*</span>
          </Label>
          <Input
            id="instAmt"
            type="number"
            value={data.instAmt}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            min={0}
            step="0.01"
            disabled={readOnly}
            className={inputClassName}
          />
          <span className="text-xs text-muted-foreground">Decimal 18,2</span>
        </div>

        {/* Currency */}
        <div className="space-y-2">
          <Label htmlFor="ccy" className="text-sm">
            Currency <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.ccy}
            onValueChange={(value) => onChange('ccy', value)}
            disabled={readOnly}
          >
            <SelectTrigger className={inputClassName}>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_OPTIONS.map((cur) => (
                <SelectItem key={cur.value} value={cur.value}>
                  {cur.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Charge Bearer */}
        <div className="space-y-2">
          <Label htmlFor="chgBr" className="text-sm">
            Charge Bearer <span className="text-destructive">*</span>
          </Label>
          <Select
            value={data.chgBr}
            onValueChange={(value) => onChange('chgBr', value)}
            disabled={readOnly}
          >
            <SelectTrigger className={inputClassName}>
              <SelectValue placeholder="Select charge bearer" />
            </SelectTrigger>
            <SelectContent>
              {CHARGE_BEARER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* FX Rate - Read Only */}
        <div className="space-y-2">
          <Label htmlFor="fxRate" className="text-sm">
            FX Rate
          </Label>
          <Input
            id="fxRate"
            type="text"
            value={data.fxRate !== '' ? data.fxRate : '—'}
            readOnly
            disabled
            className={readOnlyClassName}
            placeholder="Auto-calculated"
          />
          <span className="text-xs text-muted-foreground">Read-only (Decimal 10,6)</span>
        </div>
      </div>
    </CollapsiblePane>
  );
};

export default AmountChargesPane;
