import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BeneficiaryCustomer, COUNTRY_OPTIONS, validateBIC } from '@/types/internationalRemittance';
import CollapsiblePane from './CollapsiblePane';

interface BeneficiaryCustomerPaneProps {
  data: BeneficiaryCustomer;
  onChange: (field: keyof BeneficiaryCustomer, value: string) => void;
  readOnly?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const BeneficiaryCustomerPane: React.FC<BeneficiaryCustomerPaneProps> = ({
  data,
  onChange,
  readOnly = false,
  isOpen = true,
  onToggle = () => {},
}) => {
  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';
  const isBicValid = data.benBic.length === 0 || validateBIC(data.benBic);

  return (
    <CollapsiblePane title="Beneficiary Customer" isOpen={isOpen} onToggle={onToggle}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Beneficiary Name */}
          <div className="space-y-2">
            <Label htmlFor="benName" className="text-sm">
              Beneficiary Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="benName"
              value={data.benName}
              onChange={(e) => onChange('benName', e.target.value.slice(0, 140))}
              placeholder="Enter beneficiary name"
              maxLength={140}
              disabled={readOnly}
              className={inputClassName}
            />
            <span className="text-xs text-muted-foreground">{data.benName.length}/140</span>
          </div>

          {/* Beneficiary Account/IBAN */}
          <div className="space-y-2">
            <Label htmlFor="benAcct" className="text-sm">
              Beneficiary Account/IBAN <span className="text-destructive">*</span>
            </Label>
            <Input
              id="benAcct"
              value={data.benAcct}
              onChange={(e) => onChange('benAcct', e.target.value.toUpperCase().slice(0, 34))}
              placeholder="Enter IBAN or account number"
              maxLength={34}
              disabled={readOnly}
              className={inputClassName}
            />
            <span className="text-xs text-muted-foreground">{data.benAcct.length}/34</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Beneficiary BIC */}
          <div className="space-y-2">
            <Label htmlFor="benBic" className="text-sm">
              Beneficiary Bank BIC/SWIFT <span className="text-destructive">*</span>
            </Label>
            <Input
              id="benBic"
              value={data.benBic}
              onChange={(e) => onChange('benBic', e.target.value.toUpperCase().slice(0, 11))}
              placeholder="e.g., HSBCGB2LXXX"
              maxLength={11}
              disabled={readOnly}
              className={`${inputClassName} ${!isBicValid ? 'border-destructive' : ''}`}
            />
            {!isBicValid && (
              <span className="text-xs text-destructive">Invalid BIC format (8 or 11 characters)</span>
            )}
            {isBicValid && (
              <span className="text-xs text-muted-foreground">{data.benBic.length}/11</span>
            )}
          </div>

          {/* Beneficiary Country */}
          <div className="space-y-2">
            <Label htmlFor="benCountry" className="text-sm">
              Beneficiary Country <span className="text-destructive">*</span>
            </Label>
            <Select
              value={data.benCountry}
              onValueChange={(value) => onChange('benCountry', value)}
              disabled={readOnly}
            >
              <SelectTrigger className={inputClassName}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_OPTIONS.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    {country.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Address Line 1 */}
          <div className="space-y-2">
            <Label htmlFor="benAddr1" className="text-sm">
              Address Line 1
            </Label>
            <Input
              id="benAddr1"
              value={data.benAddr1}
              onChange={(e) => onChange('benAddr1', e.target.value.slice(0, 70))}
              placeholder="Enter address line 1"
              maxLength={70}
              disabled={readOnly}
              className={inputClassName}
            />
            <span className="text-xs text-muted-foreground">{data.benAddr1.length}/70</span>
          </div>

          {/* Address Line 2 */}
          <div className="space-y-2">
            <Label htmlFor="benAddr2" className="text-sm">
              Address Line 2
            </Label>
            <Input
              id="benAddr2"
              value={data.benAddr2}
              onChange={(e) => onChange('benAddr2', e.target.value.slice(0, 70))}
              placeholder="Enter address line 2"
              maxLength={70}
              disabled={readOnly}
              className={inputClassName}
            />
            <span className="text-xs text-muted-foreground">{data.benAddr2.length}/70</span>
          </div>
        </div>
      </div>
    </CollapsiblePane>
  );
};

export default BeneficiaryCustomerPane;
