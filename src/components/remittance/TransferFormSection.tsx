import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Save, Send, X, CheckCircle, XCircle } from 'lucide-react';
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
  MOCK_COUNTRIES,
} from '@/types/remittance';
import MultipleRecipientsSection from './MultipleRecipientsSection';
import AdhocBeneficiarySection from './AdhocBeneficiarySection';

// Mock data for states/regions (can be expanded)
const MOCK_STATES: Record<string, { value: string; label: string }[]> = {
  US: [
    { value: 'NY', label: 'New York' },
    { value: 'CA', label: 'California' },
    { value: 'TX', label: 'Texas' },
  ],
  GB: [
    { value: 'ENG', label: 'England' },
    { value: 'SCT', label: 'Scotland' },
    { value: 'WLS', label: 'Wales' },
  ],
  AE: [
    { value: 'DXB', label: 'Dubai' },
    { value: 'AUH', label: 'Abu Dhabi' },
    { value: 'SHJ', label: 'Sharjah' },
  ],
  IN: [
    { value: 'MH', label: 'Maharashtra' },
    { value: 'DL', label: 'Delhi' },
    { value: 'KA', label: 'Karnataka' },
  ],
};

// Mock data for cities (can be expanded)
const MOCK_CITIES: Record<string, { value: string; label: string }[]> = {
  NY: [{ value: 'NYC', label: 'New York City' }, { value: 'BUF', label: 'Buffalo' }],
  CA: [{ value: 'LA', label: 'Los Angeles' }, { value: 'SF', label: 'San Francisco' }],
  ENG: [{ value: 'LON', label: 'London' }, { value: 'MAN', label: 'Manchester' }],
  DXB: [{ value: 'DXB', label: 'Dubai City' }],
  MH: [{ value: 'MUM', label: 'Mumbai' }, { value: 'PUN', label: 'Pune' }],
};

interface OrderingCustomerAddress {
  country: string;
  stateRegion: string;
  city: string;
  town: string;
  addressLine1: string;
  addressLine2: string;
  pinPostCode: string;
}

const initialOrderingCustomerAddress: OrderingCustomerAddress = {
  country: '',
  stateRegion: '',
  city: '',
  town: '',
  addressLine1: '',
  addressLine2: '',
  pinPostCode: '',
};

interface TransferFormSectionProps {
  readOnly?: boolean;
  isApprovalStage?: boolean;
  onStageComplete?: () => void;
  onApprove?: () => void;
  onReject?: (reason?: string) => void;
}

const TransferFormSection: React.FC<TransferFormSectionProps> = ({
  readOnly = false,
  isApprovalStage = false,
  onStageComplete,
  onApprove,
  onReject,
}) => {
  const [formData, setFormData] = useState<TransferFormData>(initialTransferFormData);
  const [orderingCustomer, setOrderingCustomer] = useState('');
  const [orderingCustomerAddress, setOrderingCustomerAddress] = useState<OrderingCustomerAddress>(initialOrderingCustomerAddress);
  const [orderingBankBic, setOrderingBankBic] = useState('');

  const updateField = <K extends keyof TransferFormData>(field: K, value: TransferFormData[K]) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateOrderingAddress = (field: keyof OrderingCustomerAddress, value: string) => {
    if (readOnly) return;
    setOrderingCustomerAddress((prev) => {
      const updated = { ...prev, [field]: value };
      // Reset dependent fields when parent changes
      if (field === 'country') {
        updated.stateRegion = '';
        updated.city = '';
      } else if (field === 'stateRegion') {
        updated.city = '';
      }
      return updated;
    });
  };

  const handleAdhocChange = (field: keyof AdhocBeneficiary, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      adhocBeneficiary: {
        ...prev.adhocBeneficiary,
        [field]: value,
      },
    }));
  };

  const handleToggleAdhoc = (checked: boolean) => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      isAdhocBeneficiary: checked,
      beneficiary: checked ? '' : prev.beneficiary,
      adhocBeneficiary: checked ? prev.adhocBeneficiary : initialAdhocBeneficiary,
    }));
  };

  const handleDiscard = () => {
    setFormData(initialTransferFormData);
    setOrderingCustomer('');
    setOrderingCustomerAddress(initialOrderingCustomerAddress);
    setOrderingBankBic('');
    toast.info('Form discarded');
  };

  const handleSaveDraft = () => {
    toast.success('Transfer saved as draft');
  };

  const handleSubmit = () => {
    if (!formData.debitAccount && formData.direction === 'outward') {
      toast.error('Please select a debit/ordering account');
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
    onStageComplete?.();
  };

  const handleApprove = () => {
    toast.success('Transfer approved');
    onApprove?.();
  };

  const handleReject = () => {
    toast.info('Transfer rejected');
    onReject?.('Rejected by approver');
  };

  const showMultipleRecipients = formData.direction === 'outward' && formData.outwardType === 'multiple';
  const showAdhocBeneficiary = formData.direction === 'outward' && 
    (formData.outwardType === 'beneficiary' || formData.outwardType === 'international');

  // Helper to apply readonly styles
  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';
  const selectDisabled = readOnly;

  // Get available states based on selected country
  const availableStates = orderingCustomerAddress.country ? MOCK_STATES[orderingCustomerAddress.country] || [] : [];
  // Get available cities based on selected state
  const availableCities = orderingCustomerAddress.stateRegion ? MOCK_CITIES[orderingCustomerAddress.stateRegion] || [] : [];

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
              disabled={readOnly}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="outward" id="outward" disabled={readOnly} />
                <Label htmlFor="outward" className={`cursor-pointer ${readOnly ? 'text-muted-foreground' : ''}`}>
                  Outward Transaction
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="inward" id="inward" disabled={readOnly} />
                <Label htmlFor="inward" className={`cursor-pointer ${readOnly ? 'text-muted-foreground' : ''}`}>
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
                disabled={readOnly}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="a2a" id="a2a" disabled={readOnly} />
                  <Label htmlFor="a2a" className={`cursor-pointer ${readOnly ? 'text-muted-foreground' : ''}`}>A2A (Own Account)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="beneficiary" id="beneficiary" disabled={readOnly} />
                  <Label htmlFor="beneficiary" className={`cursor-pointer ${readOnly ? 'text-muted-foreground' : ''}`}>Beneficiary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multiple" id="multiple" disabled={readOnly} />
                  <Label htmlFor="multiple" className={`cursor-pointer ${readOnly ? 'text-muted-foreground' : ''}`}>Multiple Recipients</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="international" id="international" disabled={readOnly} />
                  <Label htmlFor="international" className={`cursor-pointer ${readOnly ? 'text-muted-foreground' : ''}`}>International</Label>
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
            {/* Ordering Customer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderingCustomer">Ordering Customer *</Label>
                <Input
                  id="orderingCustomer"
                  value={orderingCustomer}
                  onChange={(e) => !readOnly && setOrderingCustomer(e.target.value.slice(0, 140))}
                  placeholder="Enter ordering customer name"
                  maxLength={140}
                  disabled={readOnly}
                  className={inputClassName}
                />
                <span className="text-xs text-muted-foreground">{orderingCustomer.length}/140</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderingBankBic">Ordering Bank BIC/SWIFT *</Label>
                <Input
                  id="orderingBankBic"
                  value={orderingBankBic}
                  onChange={(e) => !readOnly && setOrderingBankBic(e.target.value.toUpperCase())}
                  placeholder="e.g., HSBCGB2L"
                  maxLength={11}
                  disabled={readOnly}
                  className={inputClassName}
                />
              </div>
            </div>

            {/* Ordering Customer Address */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Ordering Customer Address</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="addressCountry" className="text-xs text-muted-foreground">Country *</Label>
                  <Select
                    value={orderingCustomerAddress.country}
                    onValueChange={(value) => updateOrderingAddress('country', value)}
                    disabled={selectDisabled}
                  >
                    <SelectTrigger className={inputClassName}>
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
                  <Label htmlFor="addressState" className="text-xs text-muted-foreground">State/Region</Label>
                  <Select
                    value={orderingCustomerAddress.stateRegion}
                    onValueChange={(value) => updateOrderingAddress('stateRegion', value)}
                    disabled={selectDisabled || !orderingCustomerAddress.country}
                  >
                    <SelectTrigger className={inputClassName}>
                      <SelectValue placeholder="Select state/region" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStates.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressCity" className="text-xs text-muted-foreground">City</Label>
                  <Select
                    value={orderingCustomerAddress.city}
                    onValueChange={(value) => updateOrderingAddress('city', value)}
                    disabled={selectDisabled || !orderingCustomerAddress.stateRegion}
                  >
                    <SelectTrigger className={inputClassName}>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((city) => (
                        <SelectItem key={city.value} value={city.value}>
                          {city.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="addressTown" className="text-xs text-muted-foreground">Town</Label>
                  <Input
                    id="addressTown"
                    value={orderingCustomerAddress.town}
                    onChange={(e) => updateOrderingAddress('town', e.target.value)}
                    placeholder="Enter town"
                    disabled={readOnly}
                    className={inputClassName}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="addressLine1" className="text-xs text-muted-foreground">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    value={orderingCustomerAddress.addressLine1}
                    onChange={(e) => updateOrderingAddress('addressLine1', e.target.value)}
                    placeholder="Enter address line 1"
                    disabled={readOnly}
                    className={inputClassName}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="addressLine2" className="text-xs text-muted-foreground">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    value={orderingCustomerAddress.addressLine2}
                    onChange={(e) => updateOrderingAddress('addressLine2', e.target.value)}
                    placeholder="Enter address line 2"
                    disabled={readOnly}
                    className={inputClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addressPin" className="text-xs text-muted-foreground">PIN/POST Code</Label>
                  <Input
                    id="addressPin"
                    value={orderingCustomerAddress.pinPostCode}
                    onChange={(e) => updateOrderingAddress('pinPostCode', e.target.value)}
                    placeholder="Enter PIN/POST code"
                    disabled={readOnly}
                    className={inputClassName}
                  />
                </div>
              </div>
            </div>

            {/* Account Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.direction === 'outward' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="debitAccount">Debit/Ordering Account/IBAN *</Label>
                    <Select
                      value={formData.debitAccount}
                      onValueChange={(value) => updateField('debitAccount', value)}
                      disabled={selectDisabled}
                    >
                      <SelectTrigger className={inputClassName}>
                        <SelectValue placeholder="Select debit/ordering account" />
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
                        disabled={selectDisabled}
                      >
                        <SelectTrigger className={inputClassName}>
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
                        disabled={selectDisabled}
                      >
                        <SelectTrigger className={inputClassName}>
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
                      disabled={selectDisabled}
                    >
                      <SelectTrigger className={inputClassName}>
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
                      disabled={readOnly}
                      className={inputClassName}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="externalBank">Sender Bank *</Label>
                    <Input
                      id="externalBank"
                      value={formData.externalBank}
                      onChange={(e) => updateField('externalBank', e.target.value)}
                      placeholder="Enter sender bank name"
                      disabled={readOnly}
                      className={inputClassName}
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
                    disabled={readOnly}
                    className={inputClassName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => updateField('currency', value)}
                    disabled={selectDisabled}
                  >
                    <SelectTrigger className={inputClassName}>
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
        {showAdhocBeneficiary && !readOnly && (
          <AdhocBeneficiarySection
            isAdhocBeneficiary={formData.isAdhocBeneficiary}
            adhocBeneficiary={formData.adhocBeneficiary}
            onToggleAdhoc={handleToggleAdhoc}
            onAdhocChange={handleAdhocChange}
          />
        )}

        {/* Multiple Recipients Section */}
        {showMultipleRecipients && !readOnly && (
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
              disabled={readOnly}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="immediate" id="immediate" disabled={readOnly} />
                <Label htmlFor="immediate" className={`cursor-pointer ${readOnly ? 'text-muted-foreground' : ''}`}>Immediate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deferred" id="deferred" disabled={readOnly} />
                <Label htmlFor="deferred" className={`cursor-pointer ${readOnly ? 'text-muted-foreground' : ''}`}>Deferred</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standing" id="standing" disabled={readOnly} />
                <Label htmlFor="standing" className={`cursor-pointer ${readOnly ? 'text-muted-foreground' : ''}`}>Standing Order</Label>
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
                    disabled={readOnly}
                    className={inputClassName}
                  />
                </div>

                {formData.executionType === 'standing' && (
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency *</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) => updateField('frequency', value)}
                      disabled={selectDisabled}
                    >
                      <SelectTrigger className={inputClassName}>
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
                disabled={readOnly}
                className={inputClassName}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="border-t bg-background pt-4 mt-4">
        <div className="flex items-center justify-between">
          {/* Left side - Discard (only for data entry) */}
          {!isApprovalStage ? (
            <Button
              variant="outline"
              onClick={handleDiscard}
              disabled={readOnly}
            >
              <X className="h-4 w-4 mr-2" />
              Discard
            </Button>
          ) : (
            <div /> // Empty div to maintain flex layout
          )}

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-3">
            {isApprovalStage ? (
              // Approval stage buttons
              <>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={handleReject}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleApprove}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            ) : (
              // Data entry stage buttons
              <>
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={readOnly}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={readOnly}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferFormSection;
