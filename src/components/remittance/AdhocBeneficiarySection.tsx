import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AdhocBeneficiary, MOCK_COUNTRIES } from '@/types/remittance';
import { UserPlus } from 'lucide-react';

interface AdhocBeneficiarySectionProps {
  isAdhocBeneficiary: boolean;
  adhocBeneficiary: AdhocBeneficiary;
  onToggleAdhoc: (checked: boolean) => void;
  onAdhocChange: (field: keyof AdhocBeneficiary, value: string) => void;
}

const AdhocBeneficiarySection: React.FC<AdhocBeneficiarySectionProps> = ({
  isAdhocBeneficiary,
  adhocBeneficiary,
  onToggleAdhoc,
  onAdhocChange,
}) => {
  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-medium">Adhoc Beneficiary</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="adhocBeneficiary"
              checked={isAdhocBeneficiary}
              onCheckedChange={onToggleAdhoc}
            />
            <Label htmlFor="adhocBeneficiary" className="text-sm cursor-pointer">
              Enter new beneficiary details
            </Label>
          </div>
        </div>
      </CardHeader>

      {isAdhocBeneficiary && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="beneficiaryName">Beneficiary Name *</Label>
              <Input
                id="beneficiaryName"
                value={adhocBeneficiary.beneficiaryName}
                onChange={(e) => onAdhocChange('beneficiaryName', e.target.value)}
                placeholder="Enter beneficiary name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountOrIban">Account Number / IBAN *</Label>
              <Input
                id="accountOrIban"
                value={adhocBeneficiary.accountOrIban}
                onChange={(e) => onAdhocChange('accountOrIban', e.target.value)}
                placeholder="Enter account number or IBAN"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                value={adhocBeneficiary.bankName}
                onChange={(e) => onAdhocChange('bankName', e.target.value)}
                placeholder="Enter bank name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bicSwiftCode">BIC / SWIFT Code *</Label>
              <Input
                id="bicSwiftCode"
                value={adhocBeneficiary.bicSwiftCode}
                onChange={(e) => onAdhocChange('bicSwiftCode', e.target.value)}
                placeholder="Enter BIC or SWIFT code"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={adhocBeneficiary.country}
                onValueChange={(value) => onAdhocChange('country', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_COUNTRIES.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bankAddress">Bank Address</Label>
              <Textarea
                id="bankAddress"
                value={adhocBeneficiary.bankAddress}
                onChange={(e) => onAdhocChange('bankAddress', e.target.value)}
                placeholder="Enter bank address"
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AdhocBeneficiarySection;
