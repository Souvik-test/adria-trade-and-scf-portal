
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ImportLCSearchDropdown from '../ImportLCSearchDropdown';
import { ImportLCRequest } from '@/services/importLCRequestService';
import { AssignmentFormData } from '@/types/exportLCAssignment';

interface LCInformationPaneProps {
  form: AssignmentFormData;
  updateField: (updates: Partial<AssignmentFormData>) => void;
}

const LCInformationPane: React.FC<LCInformationPaneProps> = ({ form, updateField }) => {
  const handleLCSelection = (lcReference: string, lcData?: ImportLCRequest) => {
    console.log('LC selected in LCInformationPane:', lcReference, lcData);
    
    if (lcData) {
      updateField({
        lcReference,
        issuingBank: lcData.issuing_bank || '',
        issuanceDate: lcData.issue_date || '',
        applicant: lcData.applicant_name || '',
        currency: lcData.currency || 'USD',
        amount: lcData.lc_amount?.toString() || '',
        expiryDate: lcData.expiry_date || '',
        currentBeneficiary: lcData.beneficiary_name || '' // Map beneficiary_name to currentBeneficiary
      });
      console.log('Assignment form updated with LC data:', {
        lcReference,
        issuingBank: lcData.issuing_bank,
        applicant: lcData.applicant_name,
        currentBeneficiary: lcData.beneficiary_name
      });
    } else {
      updateField({ lcReference });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle>LC Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="lcReference">LC Reference *</Label>
              <ImportLCSearchDropdown
                value={form.lcReference}
                onValueChange={handleLCSelection}
                placeholder="Search LCs..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuingBank">Issuing Bank</Label>
              <Input
                id="issuingBank"
                value={form.issuingBank || ''}
                onChange={(e) => updateField({ issuingBank: e.target.value })}
                placeholder="Enter issuing bank"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuanceDate">Issuance Date</Label>
              <Input
                id="issuanceDate"
                type="date"
                value={form.issuanceDate || ''}
                onChange={(e) => updateField({ issuanceDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="applicant">Applicant</Label>
              <Input
                id="applicant"
                value={form.applicant || ''}
                onChange={(e) => updateField({ applicant: e.target.value })}
                placeholder="Enter applicant name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={form.currency || 'USD'} onValueChange={(value) => updateField({ currency: value })}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={form.amount || ''}
                onChange={(e) => updateField({ amount: e.target.value })}
                placeholder="Enter LC amount"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={form.expiryDate || ''}
                onChange={(e) => updateField({ expiryDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentBeneficiary">Current Beneficiary</Label>
              <Input
                id="currentBeneficiary"
                value={form.currentBeneficiary || ''}
                onChange={(e) => updateField({ currentBeneficiary: e.target.value })}
                placeholder="Enter current beneficiary"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LCInformationPane;
