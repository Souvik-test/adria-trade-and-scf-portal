import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import DocumentUploadSection from './DocumentUploadSection';
import { fetchDocumentaryCollectionBills, fetchDocumentaryCollectionBillByRef, updateDocumentaryCollectionBill } from '@/services/documentaryCollectionService';

interface OutwardBillUpdateFormProps {
  onClose: () => void;
  onBack: () => void;
}

const OutwardBillUpdateForm: React.FC<OutwardBillUpdateFormProps> = ({
  onClose,
  onBack
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableBills, setAvailableBills] = useState<any[]>([]);
  const [selectedBillRef, setSelectedBillRef] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
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

  useEffect(() => {
    loadAvailableBills();
  }, []);

  const loadAvailableBills = async () => {
    try {
      const bills = await fetchDocumentaryCollectionBills();
      setAvailableBills(bills);
    } catch (error) {
      console.error('Error loading bills:', error);
      toast({
        title: "Error",
        description: "Failed to load available bills",
        variant: "destructive"
      });
    }
  };

  const handleBillSelect = async (billRef: string) => {
    if (!billRef) return;
    
    setIsLoading(true);
    try {
      const bill = await fetchDocumentaryCollectionBillByRef(billRef);
      if (bill) {
        setFormData({
          billReference: bill.bill_reference || '',
          drawerName: bill.drawer_name || '',
          drawerAddress: bill.drawer_address || '',
          draweePayerName: bill.drawee_payer_name || '',
          draweePayerAddress: bill.drawee_payer_address || '',
          collectingBank: bill.collecting_bank || '',
          collectingBankAddress: bill.collecting_bank_address || '',
          collectingBankSwiftCode: bill.collecting_bank_swift_code || '',
          billCurrency: bill.bill_currency || 'USD',
          billAmount: bill.bill_amount ? bill.bill_amount.toString() : '',
          tenorDays: bill.tenor_days ? bill.tenor_days.toString() : '',
          presentationInstructions: bill.presentation_instructions || 'D/P',
          documentsAgainst: bill.documents_against || 'payment',
          specialInstructions: bill.special_instructions || '',
          protectCharges: bill.protect_charges || 'collect',
          interestCharges: bill.interest_charges || 'waive',
          supportingDocuments: Array.isArray(bill.supporting_documents) ? bill.supporting_documents : []
        });
        setSelectedBillRef(billRef);
      }
    } catch (error) {
      console.error('Error loading bill details:', error);
      toast({
        title: "Error",
        description: "Failed to load bill details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = async () => {
    if (!selectedBillRef) {
      toast({
        title: "Error",
        description: "Please select a bill reference first",
        variant: "destructive"
      });
      return;
    }

    if (!formData.drawerName || !formData.draweePayerName || !formData.collectingBank || !formData.billAmount) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDocumentaryCollectionBill(selectedBillRef, {
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
        status: 'updated'
      });
      
      toast({
        title: "Success",
        description: "Documentary collection bill has been updated successfully",
        variant: "default"
      });
      
      onClose();
    } catch (error) {
      console.error('Error updating bill:', error);
      toast({
        title: "Error",
        description: "Failed to update documentary collection bill",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = async () => {
    if (!selectedBillRef) {
      toast({
        title: "Error",
        description: "Please select a bill reference first",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDocumentaryCollectionBill(selectedBillRef, {
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
        description: "Bill has been saved as draft",
        variant: "default"
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save bill as draft",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBills = availableBills.filter(bill =>
    bill.bill_reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <h1 className="text-2xl font-bold text-gray-800">Update Documentary Collection Bill</h1>
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
          {/* Bill Reference Selection */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Bill Reference</h2>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search and select bill reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchTerm && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                {filteredBills.map((bill) => (
                  <div
                    key={bill.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedBillRef === bill.bill_reference
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleBillSelect(bill.bill_reference)}
                  >
                    <div className="font-medium text-sm">{bill.bill_reference}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {bill.drawee_payer_name || 'No payer name'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {bill.bill_currency} {bill.bill_amount || 0}
                    </div>
                  </div>
                ))}
                {filteredBills.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No bills found matching your search
                  </div>
                )}
              </div>
            )}
          </div>

          {/* All Form Fields - Always Visible */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Bill Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Bill Information */}
              <div>
                <Label htmlFor="billReference" className="text-sm font-medium">
                  Bill Reference (Read-only)
                </Label>
                <Input
                  id="billReference"
                  value={formData.billReference}
                  className="mt-1 bg-gray-50"
                  readOnly
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

              {/* Drawer Information */}
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

              {/* Collecting Bank Information */}
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

              {/* Collection Instructions */}
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
                <Label htmlFor="documentsAgainst" className="text-sm font-medium">
                  Documents Against
                </Label>
                <Select
                  value={formData.documentsAgainst}
                  onValueChange={(value) => handleInputChange('documentsAgainst', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select documents against" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="acceptance">Acceptance</SelectItem>
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

              <div>
                <Label htmlFor="interestCharges" className="text-sm font-medium">
                  Interest Charges
                </Label>
                <Select
                  value={formData.interestCharges}
                  onValueChange={(value) => handleInputChange('interestCharges', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select interest charges" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waive">Waive</SelectItem>
                    <SelectItem value="collect">Collect</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Special Instructions - Full Width */}
            <div className="mt-6">
              <div>
                <Label htmlFor="specialInstructions" className="text-sm font-medium">
                  Special Instructions
                </Label>
                <Textarea
                  id="specialInstructions"
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  placeholder="Enter any special instructions"
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </div>

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
              Cancel
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
              onClick={handleUpdate}
              className="px-8 bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Bill'}
            </Button>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="text-gray-500">Loading bill details...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutwardBillUpdateForm;