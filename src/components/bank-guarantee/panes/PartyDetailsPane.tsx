
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { OutwardBGFormData } from '@/types/outwardBankGuarantee';

interface PartyDetailsPaneProps {
  formData: OutwardBGFormData;
  onFieldChange: (field: string, value: any) => void;
  isAmendment?: boolean;
}

interface AdditionalParty {
  id: string;
  name: string;
  address: string;
  role: string;
}

const PartyDetailsPane: React.FC<PartyDetailsPaneProps> = ({
  formData,
  onFieldChange,
  isAmendment = false
}) => {
  const [additionalParties, setAdditionalParties] = useState<AdditionalParty[]>([]);

  const addNewParty = () => {
    const newParty: AdditionalParty = {
      id: `party_${Date.now()}`,
      name: '',
      address: '',
      role: ''
    };
    setAdditionalParties([...additionalParties, newParty]);
  };

  const removeParty = (id: string) => {
    setAdditionalParties(additionalParties.filter(party => party.id !== id));
  };

  const updateParty = (id: string, field: keyof AdditionalParty, value: string) => {
    setAdditionalParties(additionalParties.map(party => 
      party.id === id ? { ...party, [field]: value } : party
    ));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Applicant Details (MT 767 Tag: 50)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="applicantName">Applicant Name *</Label>
            <Input
              id="applicantName"
              value={formData.applicantName || ''}
              onChange={(e) => onFieldChange('applicantName', e.target.value)}
              placeholder="Enter applicant name"
              readOnly={isAmendment}
              className={isAmendment ? "bg-gray-100" : ""}
            />
          </div>
          <div>
            <Label htmlFor="applicantAddress">Applicant Address *</Label>
            <Textarea
              id="applicantAddress"
              value={formData.applicantAddress || ''}
              onChange={(e) => onFieldChange('applicantAddress', e.target.value)}
              placeholder="Enter applicant address"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Beneficiary Details (MT 767 Tag: 59)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="beneficiaryName">Beneficiary Name *</Label>
            <Input
              id="beneficiaryName"
              value={formData.beneficiaryName || ''}
              onChange={(e) => onFieldChange('beneficiaryName', e.target.value)}
              placeholder="Enter beneficiary name"
              readOnly={isAmendment}
              className={isAmendment ? "bg-gray-100" : ""}
            />
          </div>
          <div>
            <Label htmlFor="beneficiaryAddress">Beneficiary Address *</Label>
            <Textarea
              id="beneficiaryAddress"
              value={formData.beneficiaryAddress || ''}
              onChange={(e) => onFieldChange('beneficiaryAddress', e.target.value)}
              placeholder="Enter beneficiary address"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {isAmendment && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Additional Parties</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewParty}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add New Party
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {additionalParties.length === 0 ? (
              <p className="text-gray-500 text-sm">No additional parties added yet.</p>
            ) : (
              additionalParties.map((party) => (
                <div key={party.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Party Details</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeParty(party.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`party_name_${party.id}`}>Party Name</Label>
                      <Input
                        id={`party_name_${party.id}`}
                        value={party.name}
                        onChange={(e) => updateParty(party.id, 'name', e.target.value)}
                        placeholder="Enter party name"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`party_role_${party.id}`}>Role</Label>
                      <Input
                        id={`party_role_${party.id}`}
                        value={party.role}
                        onChange={(e) => updateParty(party.id, 'role', e.target.value)}
                        placeholder="Enter party role (e.g., Co-applicant, Guarantor)"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`party_address_${party.id}`}>Party Address</Label>
                    <Textarea
                      id={`party_address_${party.id}`}
                      value={party.address}
                      onChange={(e) => updateParty(party.id, 'address', e.target.value)}
                      placeholder="Enter party address"
                      rows={2}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PartyDetailsPane;
