import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SettlementAmount, CURRENCY_OPTIONS } from '@/types/internationalRemittance';
import CollapsiblePane from './CollapsiblePane';

interface SettlementAmountPaneProps {
  data: SettlementAmount;
  onChange: (field: keyof SettlementAmount, value: string | number) => void;
  readOnly?: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

const SettlementAmountPane: React.FC<SettlementAmountPaneProps> = ({
  data,
  onChange,
  readOnly = false,
  isOpen,
  onToggle,
}) => {
  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onChange('sttlmAmt', '');
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        onChange('sttlmAmt', numValue);
      }
    }
  };

  return (
    <CollapsiblePane title="Settlement Amount" isOpen={isOpen} onToggle={onToggle}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Settlement Amount */}
        <div className="space-y-2">
          <Label htmlFor="sttlmAmt" className="text-sm">
            Settlement Amount <span className="text-destructive">*</span>
          </Label>
          <Input
            id="sttlmAmt"
            type="number"
            value={data.sttlmAmt}
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

        {/* Value Date */}
        <div className="space-y-2">
          <Label htmlFor="valDt" className="text-sm">
            Value Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="valDt"
            type="date"
            value={data.valDt}
            onChange={(e) => onChange('valDt', e.target.value)}
            disabled={readOnly}
            className={inputClassName}
          />
        </div>
      </div>
    </CollapsiblePane>
  );
};

export default SettlementAmountPane;
