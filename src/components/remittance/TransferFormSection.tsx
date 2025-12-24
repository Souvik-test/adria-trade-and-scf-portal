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
  initialTransferFormData,
  CURRENCY_OPTIONS,
  MOCK_ACCOUNTS,
} from '@/types/remittance';
import OutwardRemittanceForm from './OutwardRemittanceForm';

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
  const [direction, setDirection] = useState<TransferDirection>('outward');
  const [inwardFormData, setInwardFormData] = useState<TransferFormData>(initialTransferFormData);

  const updateInwardField = <K extends keyof TransferFormData>(field: K, value: TransferFormData[K]) => {
    if (readOnly) return;
    setInwardFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDirectionChange = (value: TransferDirection) => {
    if (readOnly) return;
    setDirection(value);
  };

  // Inward form handlers
  const handleInwardDiscard = () => {
    setInwardFormData(initialTransferFormData);
    toast.info('Form discarded');
  };

  const handleInwardSaveDraft = () => {
    toast.success('Transfer saved as draft');
  };

  const handleInwardSubmit = () => {
    if (!inwardFormData.creditAccount) {
      toast.error('Please select a credit account');
      return;
    }
    if (!inwardFormData.externalSender.trim()) {
      toast.error('Please enter sender name');
      return;
    }
    if (inwardFormData.amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    toast.success('Inward remittance submitted successfully');
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

  const inputClassName = readOnly ? 'bg-muted cursor-not-allowed' : '';
  const selectDisabled = readOnly;

  return (
    <div className="flex flex-col h-full">
      {/* Transfer Direction Selection */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium">Transfer Direction</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={direction}
            onValueChange={(value: TransferDirection) => handleDirectionChange(value)}
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

      {/* Conditional Form Rendering */}
      {direction === 'outward' ? (
        // Outward International Remittance Form (pacs.008)
        <OutwardRemittanceForm
          readOnly={readOnly}
          isApprovalStage={isApprovalStage}
          onStageComplete={onStageComplete}
          onApprove={onApprove}
          onReject={onReject}
        />
      ) : (
        // Inward Transaction Form (Keep Existing)
        <div className="flex flex-col h-full">
          <div className="flex-1 space-y-6 overflow-y-auto pb-4">
            {/* Inward: Account & Amount Section */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium">Account & Amount</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Credit Account */}
                  <div className="space-y-2">
                    <Label htmlFor="creditAccount">Credit Account <span className="text-destructive">*</span></Label>
                    <Select
                      value={inwardFormData.creditAccount}
                      onValueChange={(value) => updateInwardField('creditAccount', value)}
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

                  {/* Sender Name */}
                  <div className="space-y-2">
                    <Label htmlFor="externalSender">Sender Name <span className="text-destructive">*</span></Label>
                    <Input
                      id="externalSender"
                      value={inwardFormData.externalSender}
                      onChange={(e) => updateInwardField('externalSender', e.target.value)}
                      placeholder="Enter sender name"
                      disabled={readOnly}
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Sender Bank */}
                  <div className="space-y-2">
                    <Label htmlFor="externalBank">Sender Bank <span className="text-destructive">*</span></Label>
                    <Input
                      id="externalBank"
                      value={inwardFormData.externalBank}
                      onChange={(e) => updateInwardField('externalBank', e.target.value)}
                      placeholder="Enter sender bank name"
                      disabled={readOnly}
                      className={inputClassName}
                    />
                  </div>

                  {/* Amount */}
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount <span className="text-destructive">*</span></Label>
                    <Input
                      id="amount"
                      type="number"
                      value={inwardFormData.amount || ''}
                      onChange={(e) => updateInwardField('amount', parseFloat(e.target.value) || 0)}
                      placeholder="Enter amount"
                      min={0}
                      disabled={readOnly}
                      className={inputClassName}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Currency */}
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={inwardFormData.currency}
                      onValueChange={(value) => updateInwardField('currency', value)}
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
                    value={inwardFormData.reference}
                    onChange={(e) => updateInwardField('reference', e.target.value)}
                    placeholder="Enter reference or description"
                    disabled={readOnly}
                    className={inputClassName}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Footer Actions for Inward */}
          <div className="border-t bg-background pt-4 mt-4">
            <div className="flex items-center justify-between">
              {/* Left side - Discard (only for data entry) */}
              {!isApprovalStage ? (
                <Button
                  variant="outline"
                  onClick={handleInwardDiscard}
                  disabled={readOnly}
                >
                  <X className="h-4 w-4 mr-2" />
                  Discard
                </Button>
              ) : (
                <div />
              )}

              {/* Right side - Action buttons */}
              <div className="flex items-center gap-3">
                {isApprovalStage ? (
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
                  <>
                    <Button
                      variant="outline"
                      onClick={handleInwardSaveDraft}
                      disabled={readOnly}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save as Draft
                    </Button>
                    <Button
                      onClick={handleInwardSubmit}
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
      )}
    </div>
  );
};

export default TransferFormSection;
