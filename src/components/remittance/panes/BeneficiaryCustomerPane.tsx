import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BeneficiaryCustomer, COUNTRY_OPTIONS, validateBIC, initialBeneficiaryCustomer } from '@/types/internationalRemittance';

interface BeneficiaryCustomerPaneProps {
  data?: BeneficiaryCustomer;
  onChange?: (field: keyof BeneficiaryCustomer, value: string) => void;
  readOnly?: boolean;
}

const BeneficiaryCustomerPane: React.FC<BeneficiaryCustomerPaneProps> = ({
  data,
  onChange,
  readOnly = false,
}) => {
  // Merge with defaults to ensure all fields exist
  const safeData = { ...initialBeneficiaryCustomer, ...data };
  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';
  const isBicValid = (safeData.benBic || '').length === 0 || validateBIC(safeData.benBic || '');

  const handleChange = (field: keyof BeneficiaryCustomer, value: string) => {
    if (onChange) {
      onChange(field, value);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">Beneficiary Customer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Beneficiary Name */}
          <div className="space-y-2">
            <Label htmlFor="benName" className="text-sm">
              Beneficiary Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="benName"
              value={safeData.benName || ''}
              onChange={(e) => handleChange('benName', e.target.value.slice(0, 140))}
              placeholder="Enter beneficiary name"
              maxLength={140}
              disabled={readOnly}
              className={inputClassName}
            />
            <span className="text-xs text-muted-foreground">{(safeData.benName || '').length}/140</span>
          </div>

          {/* Beneficiary Account/IBAN */}
          <div className="space-y-2">
            <Label htmlFor="benAcct" className="text-sm">
              Beneficiary Account/IBAN <span className="text-destructive">*</span>
            </Label>
            <Input
              id="benAcct"
              value={safeData.benAcct || ''}
              onChange={(e) => handleChange('benAcct', e.target.value.toUpperCase().slice(0, 34))}
              placeholder="Enter IBAN or account number"
              maxLength={34}
              disabled={readOnly}
              className={inputClassName}
            />
            <span className="text-xs text-muted-foreground">{(safeData.benAcct || '').length}/34</span>
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
              value={safeData.benBic || ''}
              onChange={(e) => handleChange('benBic', e.target.value.toUpperCase().slice(0, 11))}
              placeholder="e.g., HSBCGB2LXXX"
              maxLength={11}
              disabled={readOnly}
              className={`${inputClassName} ${!isBicValid ? 'border-destructive' : ''}`}
            />
            {!isBicValid && (
              <span className="text-xs text-destructive">Invalid BIC format (8 or 11 characters)</span>
            )}
            {isBicValid && (
              <span className="text-xs text-muted-foreground">{(safeData.benBic || '').length}/11</span>
            )}
          </div>
        </div>

        {/* Address Section - Country, State/Region, City/Town */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Country */}
          <div className="space-y-2">
            <Label htmlFor="benCountry" className="text-sm">
              Country <span className="text-destructive">*</span>
            </Label>
            <Select
              value={safeData.benCountry || ''}
              onValueChange={(value) => handleChange('benCountry', value)}
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

          {/* State/Region */}
          <div className="space-y-2">
            <Label htmlFor="benState" className="text-sm">
              State/Region
            </Label>
            <Input
              id="benState"
              value={safeData.benState || ''}
              onChange={(e) => handleChange('benState', e.target.value.slice(0, 35))}
              placeholder="Enter state or region"
              maxLength={35}
              disabled={readOnly}
              className={inputClassName}
            />
          </div>

          {/* City/Town */}
          <div className="space-y-2">
            <Label htmlFor="benCity" className="text-sm">
              City/Town
            </Label>
            <Input
              id="benCity"
              value={safeData.benCity || ''}
              onChange={(e) => handleChange('benCity', e.target.value.slice(0, 35))}
              placeholder="Enter city or town"
              maxLength={35}
              disabled={readOnly}
              className={inputClassName}
            />
          </div>
        </div>

        {/* Address Line 1, Address Line 2, PIN/Post Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Address Line 1 */}
          <div className="space-y-2">
            <Label htmlFor="benAddr1" className="text-sm">
              Address Line-1
            </Label>
            <Input
              id="benAddr1"
              value={safeData.benAddr1 || ''}
              onChange={(e) => handleChange('benAddr1', e.target.value.slice(0, 70))}
              placeholder="Enter address line 1"
              maxLength={70}
              disabled={readOnly}
              className={inputClassName}
            />
            <span className="text-xs text-muted-foreground">{(safeData.benAddr1 || '').length}/70</span>
          </div>

          {/* Address Line 2 */}
          <div className="space-y-2">
            <Label htmlFor="benAddr2" className="text-sm">
              Address Line-2
            </Label>
            <Input
              id="benAddr2"
              value={safeData.benAddr2 || ''}
              onChange={(e) => handleChange('benAddr2', e.target.value.slice(0, 70))}
              placeholder="Enter address line 2"
              maxLength={70}
              disabled={readOnly}
              className={inputClassName}
            />
            <span className="text-xs text-muted-foreground">{(safeData.benAddr2 || '').length}/70</span>
          </div>

          {/* PIN/Post Code */}
          <div className="space-y-2">
            <Label htmlFor="benPostCode" className="text-sm">
              PIN/Post Code
            </Label>
            <Input
              id="benPostCode"
              value={safeData.benPostCode || ''}
              onChange={(e) => handleChange('benPostCode', e.target.value.slice(0, 16))}
              placeholder="Enter PIN or post code"
              maxLength={16}
              disabled={readOnly}
              className={inputClassName}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeneficiaryCustomerPane;
