
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TransferableLCSearchDropdown from '../TransferableLCSearchDropdown';
import { ImportLCRequest } from '@/services/importLCRequestService';

interface LCAndTransferPaneProps {
  form: any;
}

const LCAndTransferPane: React.FC<LCAndTransferPaneProps> = ({ form }) => {
  const handleLCSelection = (lcReference: string, lcData?: ImportLCRequest) => {
    console.log('LC selected in LCAndTransferPane:', lcReference, lcData);
    
    if (lcData) {
      form.updateField({
        lcReference,
        issuingBank: lcData.issuing_bank || '',
        issuanceDate: lcData.issue_date || '',
        applicant: lcData.applicant_name || '',
        currency: lcData.currency || 'USD',
        amount: lcData.lc_amount?.toString() || '',
        expiryDate: lcData.expiry_date || '',
        currentBeneficiary: lcData.beneficiary_name || '' // Map beneficiary_name to currentBeneficiary
      });
      console.log('Form updated with LC data:', {
        lcReference,
        issuingBank: lcData.issuing_bank,
        applicant: lcData.applicant_name,
        currentBeneficiary: lcData.beneficiary_name
      });
    } else {
      form.updateField({ lcReference });
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="space-y-8">
        {/* LC Information Section */}
        <Card>
          <CardHeader>
            <CardTitle>LC Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="lcReference">LC Reference *</Label>
                <TransferableLCSearchDropdown
                  value={form.form.lcReference}
                  onValueChange={handleLCSelection}
                  placeholder="Search transferable LCs..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuingBank">Issuing Bank</Label>
                <Input
                  id="issuingBank"
                  value={form.form.issuingBank || ''}
                  onChange={(e) => form.updateField({ issuingBank: e.target.value })}
                  placeholder="Enter issuing bank"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuanceDate">Issuance Date</Label>
                <Input
                  id="issuanceDate"
                  type="date"
                  value={form.form.issuanceDate || ''}
                  onChange={(e) => form.updateField({ issuanceDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicant">Applicant</Label>
                <Input
                  id="applicant"
                  value={form.form.applicant || ''}
                  onChange={(e) => form.updateField({ applicant: e.target.value })}
                  placeholder="Enter applicant name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={form.form.currency || 'USD'} onValueChange={(value) => form.updateField({ currency: value })}>
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
                  value={form.form.amount || ''}
                  onChange={(e) => form.updateField({ amount: e.target.value })}
                  placeholder="Enter LC amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={form.form.expiryDate || ''}
                  onChange={(e) => form.updateField({ expiryDate: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentBeneficiary">Current Beneficiary</Label>
                <Input
                  id="currentBeneficiary"
                  value={form.form.currentBeneficiary || ''}
                  onChange={(e) => form.updateField({ currentBeneficiary: e.target.value })}
                  placeholder="Enter current beneficiary"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfer Details Section */}
        <Card>
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="transferType">Transfer Type</Label>
                <Select value={form.form.transferType || 'Full'} onValueChange={(value) => form.updateField({ transferType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full">Full Transfer</SelectItem>
                    <SelectItem value="Partial">Partial Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transferConditions">Transfer Conditions</Label>
              <Textarea
                id="transferConditions"
                value={form.form.transferConditions || ''}
                onChange={(e) => form.updateField({ transferConditions: e.target.value })}
                placeholder="Enter any specific conditions for the transfer"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LCAndTransferPane;
