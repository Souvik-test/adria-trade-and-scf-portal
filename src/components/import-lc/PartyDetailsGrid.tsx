
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { PartyDetail } from '@/hooks/useImportLCForm';

interface PartyDetailsGridProps {
  parties: PartyDetail[];
  onUpdateParties: (parties: PartyDetail[]) => void;
}

const PartyDetailsGrid: React.FC<PartyDetailsGridProps> = ({ parties, onUpdateParties }) => {
  const addParty = () => {
    const newParty: PartyDetail = {
      id: Date.now().toString(),
      role: 'applicant',
      name: '',
      address: '',
      swiftCode: '',
      accountNumber: ''
    };
    onUpdateParties([...parties, newParty]);
  };

  const removeParty = (id: string) => {
    onUpdateParties(parties.filter(party => party.id !== id));
  };

  const updateParty = (id: string, field: keyof PartyDetail, value: string) => {
    onUpdateParties(parties.map(party => 
      party.id === id ? { ...party, [field]: value } : party
    ));
  };

  const roleOptions = [
    { value: 'applicant', label: 'Applicant' },
    { value: 'beneficiary', label: 'Beneficiary' },
    { value: 'advising_bank', label: 'Advising Bank' },
    { value: 'issuing_bank', label: 'Issuing Bank' },
    { value: 'confirming_bank', label: 'Confirming Bank' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Party Details</h3>
        <Button onClick={addParty} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Party
        </Button>
      </div>

      {parties.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No parties added yet. Click "Add Party" to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {parties.map((party) => (
            <div key={party.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                  <div>
                    <Label htmlFor={`role-${party.id}`}>Party Role *</Label>
                    <Select
                      value={party.role}
                      onValueChange={(value) => updateParty(party.id, 'role', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`name-${party.id}`}>Name *</Label>
                    <Input
                      id={`name-${party.id}`}
                      value={party.name}
                      onChange={(e) => updateParty(party.id, 'name', e.target.value)}
                      placeholder="Enter party name"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`swift-${party.id}`}>SWIFT Code</Label>
                    <Input
                      id={`swift-${party.id}`}
                      value={party.swiftCode || ''}
                      onChange={(e) => updateParty(party.id, 'swiftCode', e.target.value)}
                      placeholder="Enter SWIFT code"
                    />
                  </div>
                </div>
                <Button
                  onClick={() => removeParty(party.id)}
                  variant="outline"
                  size="sm"
                  className="ml-4 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`address-${party.id}`}>Address *</Label>
                  <Textarea
                    id={`address-${party.id}`}
                    value={party.address}
                    onChange={(e) => updateParty(party.id, 'address', e.target.value)}
                    placeholder="Enter complete address"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor={`account-${party.id}`}>Account Number</Label>
                  <Input
                    id={`account-${party.id}`}
                    value={party.accountNumber || ''}
                    onChange={(e) => updateParty(party.id, 'accountNumber', e.target.value)}
                    placeholder="Enter account number"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PartyDetailsGrid;
