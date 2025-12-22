import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Save, Send, FileSignature, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  TransferFormData,
  TransferDirection,
  TransferType,
  ExecutionType,
  AdhocBeneficiary,
  initialTransferFormData,
  initialAdhocBeneficiary,
  CURRENCY_OPTIONS,
  MOCK_ACCOUNTS,
  MOCK_BENEFICIARIES,
  FREQUENCY_OPTIONS,
} from '@/types/remittance';
import MultipleRecipientsSection from './MultipleRecipientsSection';
import AdhocBeneficiarySection from './AdhocBeneficiarySection';

const TransferFormSection: React.FC = () => {
  const [formData, setFormData] = useState<TransferFormData>(initialTransferFormData);

  const updateField = <K extends keyof TransferFormData>(field: K, value: TransferFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAdhocChange = (field: keyof AdhocBeneficiary, value: string) => {
    setFormData((prev) => ({
      ...prev,
      adhocBeneficiary: {
        ...prev.adhocBeneficiary,
        [field]: value,
      },
    }));
  };

  const handleToggleAdhoc = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isAdhocBeneficiary: checked,
      beneficiary: checked ? '' : prev.beneficiary,
      adhocBeneficiary: checked ? prev.adhocBeneficiary : initialAdhocBeneficiary,
    }));
  };

  const handleDiscard = () => {
    setFormData(initialTransferFormData);
    toast.info('Form discarded');
  };

  const handleSaveDraft = () => {
    toast.success('Transfer saved as draft');
  };

  const handleSubmit = () => {
    if (!formData.debitAccount && formData.direction === 'outward') {
      toast.error('Please select a debit account');
      return;
    }
    if (!formData.creditAccount && formData.direction === 'inward') {
      toast.error('Please select a credit account');
      return;
    }
    if (formData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    toast.success('Transfer submitted successfully');
  };

  const handleSignConfirm = () => {
    if (!formData.debitAccount && formData.direction === 'outward') {
      toast.error('Please select a debit account');
      return;
    }
    if (!formData.creditAccount && formData.direction === 'inward') {
      toast.error('Please select a credit account');
      return;
    }
    if (formData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    toast.success('Transfer signed and confirmed');
  };

  const showMultipleRecipients = formData.direction === 'outward' && formData.outwardType === 'multiple';
  const showAdhocBeneficiary = formData.direction === 'outward' && 
    (formData.outwardType === 'beneficiary' || formData.outwardType === 'international');

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-6 overflow-y-auto pb-4">
        {/* Transfer Direction */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Transfer Direction</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.direction}
              onValueChange={(value: TransferDirection) => updateField('direction', value)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outward" id="outward" />
                <Label htmlFor="outward" className="cursor-pointer">
                  Outward Transaction
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inward" id="inward" />
                <Label htmlFor="inward" className="cursor-pointer">
                  Inward Transaction
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Transfer Type (Outward Only) */}
        {formData.direction === 'outward' && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Transfer Type</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.outwardType}
                onValueChange={(value: TransferType) => updateField('outwardType', value)}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="a2a" id="a2a" />
                  <Label htmlFor="a2a" className="cursor-pointer">A2A (Own Account)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beneficiary" id="beneficiary" />
                  <Label htmlFor="beneficiary" className="cursor-pointer">Beneficiary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multiple" id="multiple" />
                  <Label htmlFor="multiple" className="cursor-pointer">Multiple Recipients</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="international" id="international" />
                  <Label htmlFor="international" className="cursor-pointer">International</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Account & Amount Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Account & Amount</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.direction === 'outward' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="debitAccount">Debit Account *</Label>
                    <Select
                      value={formData.debitAccount}
                      onValueChange={(value) => updateField('debitAccount', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select debit account" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_ACCOUNTS.map((acc) => (
                          <SelectItem key={acc.value} value={acc.value}>
                            {acc.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.outwardType === 'a2a' && (
                    <div className="space-y-2">
                      <Label htmlFor="creditAccount">Credit Account *</Label>
                      <Select
                        value={formData.creditAccount}
                        onValueChange={(value) => updateField('creditAccount', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select credit account" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_ACCOUNTS.map((acc) => (
                            <SelectItem key={acc.value} value={acc.value}>
                              {acc.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(formData.outwardType === 'beneficiary' || formData.outwardType === 'international') && !formData.isAdhocBeneficiary && (
                    <div className="space-y-2">
                      <Label htmlFor="beneficiary">Beneficiary *</Label>
                      <Select
                        value={formData.beneficiary}
                        onValueChange={(value) => updateField('beneficiary', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select beneficiary" />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_BENEFICIARIES.map((ben) => (
                            <SelectItem key={ben.value} value={ben.value}>
                              {ben.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="creditAccount">Credit Account *</Label>
                    <Select
                      value={formData.creditAccount}
                      onValueChange={(value) => updateField('creditAccount', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select credit account" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOCK_ACCOUNTS.map((acc) => (
                          <SelectItem key={acc.value} value={acc.value}>
                            {acc.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="externalSender">Sender Name *</Label>
                    <Input
                      id="externalSender"
                      value={formData.externalSender}
                      onChange={(e) => updateField('externalSender', e.target.value)}
                      placeholder="Enter sender name"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="externalBank">Sender Bank *</Label>
                    <Input
                      id="externalBank"
                      value={formData.externalBank}
                      onChange={(e) => updateField('externalBank', e.target.value)}
                      placeholder="Enter sender bank name"
                    />
                  </div>
                </>
              )}
            </div>

            {!showMultipleRecipients && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount || ''}
                    onChange={(e) => updateField('amount', parseFloat(e.target.value) || 0)}
                    placeholder="Enter amount"
                    min={0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => updateField('currency', value)}
                  >
                    <SelectTrigger>
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Adhoc Beneficiary Section */}
        {showAdhocBeneficiary && (
          <AdhocBeneficiarySection
            isAdhocBeneficiary={formData.isAdhocBeneficiary}
            adhocBeneficiary={formData.adhocBeneficiary}
            onToggleAdhoc={handleToggleAdhoc}
            onAdhocChange={handleAdhocChange}
          />
        )}

        {/* Multiple Recipients Section */}
        {showMultipleRecipients && (
          <MultipleRecipientsSection
            recipients={formData.multipleRecipients}
            currency={formData.currency}
            onRecipientsChange={(recipients) => updateField('multipleRecipients', recipients)}
            onCurrencyChange={(currency) => updateField('currency', currency)}
          />
        )}

        {/* Execution Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Execution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={formData.executionType}
              onValueChange={(value: ExecutionType) => updateField('executionType', value)}
              className="flex flex-wrap gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="immediate" id="immediate" />
                <Label htmlFor="immediate" className="cursor-pointer">Immediate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deferred" id="deferred" />
                <Label htmlFor="deferred" className="cursor-pointer">Deferred</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standing" id="standing" />
                <Label htmlFor="standing" className="cursor-pointer">Standing Order</Label>
              </div>
            </RadioGroup>

            {(formData.executionType === 'deferred' || formData.executionType === 'standing') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="executionDate">
                    {formData.executionType === 'standing' ? 'Start Date *' : 'Execution Date *'}
                  </Label>
                  <Input
                    id="executionDate"
                    type="date"
                    value={formData.executionDate}
                    onChange={(e) => updateField('executionDate', e.target.value)}
                  />
                </div>

                {formData.executionType === 'standing' && (
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency *</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) => updateField('frequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        {FREQUENCY_OPTIONS.map((freq) => (
                          <SelectItem key={freq.value} value={freq.value}>
                            {freq.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reference Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="reference">Transaction Reference</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => updateField('reference', e.target.value)}
                placeholder="Enter reference or description"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="border-t bg-background pt-4 mt-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleDiscard}
          >
            <X className="h-4 w-4 mr-2" />
            Discard
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              variant="secondary"
              onClick={handleSubmit}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit
            </Button>
            <Button
              onClick={handleSignConfirm}
            >
              <FileSignature className="h-4 w-4 mr-2" />
              Sign & Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferFormSection;
