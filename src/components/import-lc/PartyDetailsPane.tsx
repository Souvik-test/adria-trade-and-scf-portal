
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { ImportLCFormData } from '@/hooks/useImportLCForm';

interface Party {
  id: string;
  role: string;
  name: string;
  address: string;
  accountNumber?: string;
  bankName?: string;
  bankAddress?: string;
  swiftCode?: string;
}

interface PartyDetailsPaneProps {
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

const PartyDetailsPane: React.FC<PartyDetailsPaneProps> = ({
  formData,
  updateField
}) => {
  const [parties, setParties] = useState<Party[]>([
    {
      id: '1',
      role: 'Applicant',
      name: formData.applicantName || '',
      address: formData.applicantAddress || '',
      accountNumber: formData.applicantAccountNumber || ''
    },
    {
      id: '2',
      role: 'Beneficiary',
      name: formData.beneficiaryName || '',
      address: formData.beneficiaryAddress || '',
      bankName: formData.beneficiaryBankName || '',
      bankAddress: formData.beneficiaryBankAddress || '',
      swiftCode: formData.beneficiaryBankSwiftCode || ''
    }
  ]);

  const partyRoles = [
    'Applicant',
    'Beneficiary',
    'Advising Bank',
    'Advise Through Bank',
    'Reimbursing Bank'
  ];

  const addParty = () => {
    const newParty: Party = {
      id: Date.now().toString(),
      role: '',
      name: '',
      address: ''
    };
    setParties([...parties, newParty]);
  };

  const removeParty = (id: string) => {
    if (parties.length > 1) {
      setParties(parties.filter(party => party.id !== id));
    }
  };

  const updateParty = (id: string, field: keyof Party, value: string) => {
    const updatedParties = parties.map(party => 
      party.id === id ? { ...party, [field]: value } : party
    );
    setParties(updatedParties);

    // Update form data based on party role
    const updatedParty = updatedParties.find(p => p.id === id);
    if (updatedParty) {
      if (updatedParty.role === 'Applicant') {
        updateField('applicantName', updatedParty.name);
        updateField('applicantAddress', updatedParty.address);
        updateField('applicantAccountNumber', updatedParty.accountNumber || '');
      } else if (updatedParty.role === 'Beneficiary') {
        updateField('beneficiaryName', updatedParty.name);
        updateField('beneficiaryAddress', updatedParty.address);
        updateField('beneficiaryBankName', updatedParty.bankName || '');
        updateField('beneficiaryBankAddress', updatedParty.bankAddress || '');
        updateField('beneficiaryBankSwiftCode', updatedParty.swiftCode || '');
      }
    }
  };

  const renderPartyFields = (party: Party) => {
    const isBank = party.role?.includes('Bank');
    const isBeneficiary = party.role === 'Beneficiary';

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {isBank ? 'Bank Name' : 'Name'} {party.role === 'Applicant' || party.role === 'Beneficiary' ? <span className="text-red-500">*</span> : ''}
            </Label>
            <Input
              value={party.name}
              onChange={(e) => updateParty(party.id, 'name', e.target.value)}
              placeholder={`Enter ${isBank ? 'bank name' : 'name'}`}
              className="mt-1"
            />
          </div>

          {party.role === 'Applicant' && (
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Account Number (50)
              </Label>
              <Input
                value={party.accountNumber || ''}
                onChange={(e) => updateParty(party.id, 'accountNumber', e.target.value)}
                placeholder="Enter account number"
                className="mt-1"
              />
            </div>
          )}

          {(isBeneficiary || isBank) && (
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                SWIFT Code {isBeneficiary ? '(57A)' : ''}
              </Label>
              <Input
                value={party.swiftCode || ''}
                onChange={(e) => updateParty(party.id, 'swiftCode', e.target.value)}
                placeholder="Enter SWIFT code"
                className="mt-1"
              />
            </div>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Address {party.role === 'Applicant' || party.role === 'Beneficiary' ? <span className="text-red-500">*</span> : ''}
          </Label>
          <Textarea
            value={party.address}
            onChange={(e) => updateParty(party.id, 'address', e.target.value)}
            placeholder="Enter address"
            className="mt-1"
            rows={3}
          />
        </div>

        {isBeneficiary && (
          <>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bank Name (57A)
              </Label>
              <Input
                value={party.bankName || ''}
                onChange={(e) => updateParty(party.id, 'bankName', e.target.value)}
                placeholder="Enter bank name"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Bank Address (57A)
              </Label>
              <Textarea
                value={party.bankAddress || ''}
                onChange={(e) => updateParty(party.id, 'bankAddress', e.target.value)}
                placeholder="Enter bank address"
                className="mt-1"
                rows={2}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
        <Card className="border border-gray-200 dark:border-gray-600">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-corporate-teal-600 dark:text-corporate-teal-400">
              Party Details
            </CardTitle>
            <Button
              type="button"
              onClick={addParty}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Party
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {parties.map((party, index) => (
              <div key={party.id} className="border rounded-lg p-4 relative">
                {parties.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeParty(party.id)}
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Party Role <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={party.role} 
                      onValueChange={(value) => updateParty(party.id, 'role', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select party role" />
                      </SelectTrigger>
                      <SelectContent>
                        {partyRoles.map((role) => (
                          <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {party.role && renderPartyFields(party)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartyDetailsPane;
