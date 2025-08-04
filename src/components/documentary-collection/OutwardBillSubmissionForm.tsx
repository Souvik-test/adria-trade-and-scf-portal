
import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import DocumentUploadSection from './DocumentUploadSection';
import { submitDocumentaryCollectionBill } from '@/services/documentaryCollectionService';

interface OutwardBillSubmissionFormProps {
  onClose: () => void;
  onBack: () => void;
}

const OutwardBillSubmissionForm: React.FC<OutwardBillSubmissionFormProps> = ({
  onClose,
  onBack
}) => {
  console.log('=== DEBUG: OutwardBillSubmissionForm component mounted ===');
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    billReference: '',
    drawerName: '',
    drawerAddress: '',
    draweePayerName: '',
    draweePayerAddress: '',
    collectingBank: '',
    collectingBankAddress: '',
    collectingBankSwiftCode: '',
    billCurrency: 'USD',
    billAmount: '',
    tenorDays: '',
    presentationInstructions: 'D/P',
    documentsAgainst: 'payment',
    specialInstructions: '',
    protectCharges: 'collect',
    interestCharges: 'waive',
    supportingDocuments: []
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAsDraft = async () => {
    if (!formData.billReference) {
      toast({
        title: "Error",
        description: "Please enter a bill reference",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitDocumentaryCollectionBill({
        bill_reference: formData.billReference,
        drawer_name: formData.drawerName,
        drawer_address: formData.drawerAddress,
        drawee_payer_name: formData.draweePayerName,
        drawee_payer_address: formData.draweePayerAddress,
        collecting_bank: formData.collectingBank,
        collecting_bank_address: formData.collectingBankAddress,
        collecting_bank_swift_code: formData.collectingBankSwiftCode,
        bill_currency: formData.billCurrency,
        bill_amount: formData.billAmount ? parseFloat(formData.billAmount) : undefined,
        tenor_days: formData.tenorDays ? parseInt(formData.tenorDays) : undefined,
        presentation_instructions: formData.presentationInstructions,
        documents_against: formData.documentsAgainst,
        special_instructions: formData.specialInstructions,
        protect_charges: formData.protectCharges,
        interest_charges: formData.interestCharges,
        supporting_documents: formData.supportingDocuments,
        status: 'draft'
      });
      
      toast({
        title: "Success",
        description: "Documentary collection bill has been saved as draft",
        variant: "default"
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save documentary collection bill as draft",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    console.log('=== DEBUG: handleSubmit called ===');
    // Basic validation
    if (!formData.billReference || !formData.drawerName || !formData.draweePayerName || !formData.collectingBank || !formData.billAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields including bill reference",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitDocumentaryCollectionBill({
        bill_reference: formData.billReference,
        drawer_name: formData.drawerName,
        drawer_address: formData.drawerAddress,
        drawee_payer_name: formData.draweePayerName,
        drawee_payer_address: formData.draweePayerAddress,
        collecting_bank: formData.collectingBank,
        collecting_bank_address: formData.collectingBankAddress,
        collecting_bank_swift_code: formData.collectingBankSwiftCode,
        bill_currency: formData.billCurrency,
        bill_amount: parseFloat(formData.billAmount),
        tenor_days: formData.tenorDays ? parseInt(formData.tenorDays) : undefined,
        presentation_instructions: formData.presentationInstructions,
        documents_against: formData.documentsAgainst,
        special_instructions: formData.specialInstructions,
        protect_charges: formData.protectCharges,
        interest_charges: formData.interestCharges,
        supporting_documents: formData.supportingDocuments,
        status: 'submitted'
      });
      
      toast({
        title: "Success",
        description: "Documentary collection bill has been submitted successfully",
        variant: "default"
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting bill:', error);
      toast({
        title: "Error",
        description: "Failed to submit documentary collection bill",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="flex items-center gap-2"
                disabled={isSubmitting}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Submit Documentary Collection Bill</h1>
                <p className="text-sm text-gray-600">Outward Documentary Collection (URC 522)</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700"
              disabled={isSubmitting}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Bill Information */}
          <Card>
            <CardHeader>
              <CardTitle>Bill Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="billReference" className="text-sm font-medium">
                    Bill Reference *
                  </Label>
                  <Input
                    id="billReference"
                    value={formData.billReference}
                    onChange={(e) => handleInputChange('billReference', e.target.value)}
                    placeholder="Enter bill reference"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="billCurrency" className="text-sm font-medium">
                    Bill Currency *
                  </Label>
                  <Select
                    value={formData.billCurrency}
                    onValueChange={(value) => handleInputChange('billCurrency', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                      <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="billAmount" className="text-sm font-medium">
                    Bill Amount *
                  </Label>
                  <Input
                    id="billAmount"
                    type="number"
                    step="0.01"
                    value={formData.billAmount}
                    onChange={(e) => handleInputChange('billAmount', e.target.value)}
                    placeholder="0.00"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="tenorDays" className="text-sm font-medium">
                    Tenor (Days)
                  </Label>
                  <Input
                    id="tenorDays"
                    type="number"
                    value={formData.tenorDays}
                    onChange={(e) => handleInputChange('tenorDays', e.target.value)}
                    placeholder="Enter tenor in days"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Drawer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Drawer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="drawerName" className="text-sm font-medium">
                    Drawer Name *
                  </Label>
                  <Input
                    id="drawerName"
                    value={formData.drawerName}
                    onChange={(e) => handleInputChange('drawerName', e.target.value)}
                    placeholder="Enter drawer name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="drawerAddress" className="text-sm font-medium">
                    Drawer Address
                  </Label>
                  <Textarea
                    id="drawerAddress"
                    value={formData.drawerAddress}
                    onChange={(e) => handleInputChange('drawerAddress', e.target.value)}
                    placeholder="Enter drawer address"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Drawee/Payer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Drawee/Payer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="draweePayerName" className="text-sm font-medium">
                    Drawee/Payer Name *
                  </Label>
                  <Input
                    id="draweePayerName"
                    value={formData.draweePayerName}
                    onChange={(e) => handleInputChange('draweePayerName', e.target.value)}
                    placeholder="Enter drawee/payer name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="draweePayerAddress" className="text-sm font-medium">
                    Drawee/Payer Address
                  </Label>
                  <Textarea
                    id="draweePayerAddress"
                    value={formData.draweePayerAddress}
                    onChange={(e) => handleInputChange('draweePayerAddress', e.target.value)}
                    placeholder="Enter drawee/payer address"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collecting Bank Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="collectingBank" className="text-sm font-medium">
                    Collecting Bank *
                  </Label>
                  <Input
                    id="collectingBank"
                    value={formData.collectingBank}
                    onChange={(e) => handleInputChange('collectingBank', e.target.value)}
                    placeholder="Enter collecting bank name"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="collectingBankSwiftCode" className="text-sm font-medium">
                    SWIFT Code
                  </Label>
                  <Input
                    id="collectingBankSwiftCode"
                    value={formData.collectingBankSwiftCode}
                    onChange={(e) => handleInputChange('collectingBankSwiftCode', e.target.value)}
                    placeholder="Enter SWIFT code"
                    className="mt-1"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="collectingBankAddress" className="text-sm font-medium">
                    Collecting Bank Address
                  </Label>
                  <Textarea
                    id="collectingBankAddress"
                    value={formData.collectingBankAddress}
                    onChange={(e) => handleInputChange('collectingBankAddress', e.target.value)}
                    placeholder="Enter collecting bank address"
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Collection Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="presentationInstructions" className="text-sm font-medium">
                    Presentation Instructions
                  </Label>
                  <Select
                    value={formData.presentationInstructions}
                    onValueChange={(value) => handleInputChange('presentationInstructions', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select presentation instructions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="D/P">D/P - Documents against Payment</SelectItem>
                      <SelectItem value="D/A">D/A - Documents against Acceptance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="protectCharges" className="text-sm font-medium">
                    Protest Charges
                  </Label>
                  <Select
                    value={formData.protectCharges}
                    onValueChange={(value) => handleInputChange('protectCharges', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select protest charges" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="collect">Collect</SelectItem>
                      <SelectItem value="waive">Waive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="specialInstructions" className="text-sm font-medium">
                    Special Instructions
                  </Label>
                  <Textarea
                    id="specialInstructions"
                    value={formData.specialInstructions}
                    onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                    placeholder="Enter any special instructions"
                    className="mt-1"
                    rows={4}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Upload */}
          <DocumentUploadSection
            documents={formData.supportingDocuments}
            onDocumentsChange={(docs) => handleInputChange('supportingDocuments', docs)}
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              variant="outline"
              onClick={onClose}
              className="px-8"
              disabled={isSubmitting}
            >
              Discard
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveAsDraft}
              className="px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button
              onClick={() => {
                console.log('=== DEBUG: Submit button clicked ===');
                handleSubmit();
              }}
              className="px-8 bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Bill'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutwardBillSubmissionForm;
