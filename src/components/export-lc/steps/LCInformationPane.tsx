
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AssignmentFormData } from '@/types/exportLCAssignment';
import ImportLCSearchDropdown from '../ImportLCSearchDropdown';
import { ImportLCRequest } from '@/services/importLCRequestService';

interface LCInformationPaneProps {
  form: AssignmentFormData;
  updateField: (updates: Partial<AssignmentFormData>) => void;
}

const LCInformationPane: React.FC<LCInformationPaneProps> = ({ form, updateField }) => {
  const handleLCSelection = (lc: ImportLCRequest) => {
    console.log('Auto-populating form with LC data:', lc);
    
    updateField({
      lcReference: lc.corporate_reference,
      issuanceDate: lc.issue_date || '',
      expiryDate: lc.expiry_date || '',
      applicant: lc.applicant_name || '',
      currentBeneficiary: lc.beneficiary_name || '',
      currency: lc.currency || 'USD',
      amount: lc.lc_amount ? lc.lc_amount.toString() : ''
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
            Letter of Credit Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="lcReference">LC Reference Number *</Label>
            <ImportLCSearchDropdown
              value={form.lcReference}
              onSelect={handleLCSelection}
              placeholder="Search and select LC reference"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuingBank">Issuing Bank</Label>
            <Input
              id="issuingBank"
              value={form.issuingBank}
              onChange={(e) => updateField({ issuingBank: e.target.value })}
              placeholder="Enter issuing bank name"
              readOnly
              className="bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuanceDate">Issuance Date *</Label>
            <Input
              id="issuanceDate"
              type="date"
              value={form.issuanceDate}
              onChange={(e) => updateField({ issuanceDate: e.target.value })}
              readOnly
              className="bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">Expiry Date *</Label>
            <Input
              id="expiryDate"
              type="date"
              value={form.expiryDate}
              onChange={(e) => updateField({ expiryDate: e.target.value })}
              readOnly
              className="bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="applicant">Applicant *</Label>
            <Input
              id="applicant"
              value={form.applicant}
              onChange={(e) => updateField({ applicant: e.target.value })}
              placeholder="Enter applicant name"
              readOnly
              className="bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentBeneficiary">Current Beneficiary *</Label>
            <Input
              id="currentBeneficiary"
              value={form.currentBeneficiary}
              onChange={(e) => updateField({ currentBeneficiary: e.target.value })}
              placeholder="Enter current beneficiary name"
              readOnly
              className="bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency *</Label>
            <Select value={form.currency} onValueChange={(value) => updateField({ currency: value })} disabled>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-700 cursor-not-allowed">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
                <SelectItem value="AED">AED</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">LC Amount *</Label>
            <Input
              id="amount"
              value={form.amount}
              onChange={(e) => updateField({ amount: e.target.value })}
              placeholder="Enter LC amount"
              readOnly
              className="bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LCInformationPane;
