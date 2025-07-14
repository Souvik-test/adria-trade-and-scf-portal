
import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { fetchDocumentaryCollectionBills, fetchDocumentaryCollectionBillByRef } from '@/services/documentaryCollectionService';
import { submitDiscountFinanceRequest, saveDiscountFinanceRequestAsDraft } from '@/services/discountFinanceService';

interface OutwardBillDiscountFinanceFormProps {
  onClose: () => void;
  onBack: () => void;
}

const OutwardBillDiscountFinanceForm: React.FC<OutwardBillDiscountFinanceFormProps> = ({
  onClose,
  onBack
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableBills, setAvailableBills] = useState<any[]>([]);
  const [selectedBillRef, setSelectedBillRef] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Bill basic details
  const [billDetails, setBillDetails] = useState({
    billCurrency: '',
    billAmount: 0,
    submissionDate: '',
    dueDate: '',
    importerName: '',
    importerAddress: '',
    exporterName: '',
    exporterAddress: ''
  });

  // Form data
  const [formData, setFormData] = useState({
    requestType: '',
    // Discount fields
    discountPercentage: '',
    proceedAmount: 0,
    creditAccountNumber: '',
    // Finance fields
    financeCurrency: '',
    financeAmount: 0,
    financeTenorDays: '',
    financePercentage: '',
    principalAmount: 0,
    interestAmount: 0,
    totalRepaymentAmount: 0,
    repaymentAccountNumber: ''
  });

  useEffect(() => {
    loadAvailableBills();
  }, []);

  // Auto-calculate proceed amount for discount
  useEffect(() => {
    if (formData.requestType === 'discount' && formData.discountPercentage && billDetails.billAmount) {
      const discountPercent = parseFloat(formData.discountPercentage) || 0;
      const proceedAmount = billDetails.billAmount * (1 - discountPercent / 100);
      setFormData(prev => ({ ...prev, proceedAmount }));
    }
  }, [formData.discountPercentage, billDetails.billAmount, formData.requestType]);

  // Auto-calculate finance amounts
  useEffect(() => {
    if (formData.requestType === 'finance' && formData.financeTenorDays && formData.financePercentage && billDetails.billAmount) {
      const principal = billDetails.billAmount;
      const tenorDays = parseInt(formData.financeTenorDays) || 0;
      const financePercent = parseFloat(formData.financePercentage) || 0;
      
      // Calculate interest for the tenor period (annual rate applied to tenor days)
      const interestAmount = (principal * financePercent * tenorDays) / (100 * 365);
      const totalRepayment = principal + interestAmount;
      
      setFormData(prev => ({
        ...prev,
        principalAmount: principal,
        interestAmount,
        totalRepaymentAmount: totalRepayment
      }));
    }
  }, [formData.financeTenorDays, formData.financePercentage, billDetails.billAmount, formData.requestType]);

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
        setBillDetails({
          billCurrency: bill.bill_currency || 'USD',
          billAmount: bill.bill_amount || 0,
          submissionDate: bill.created_at ? new Date(bill.created_at).toLocaleDateString() : '',
          dueDate: bill.updated_at ? new Date(bill.updated_at).toLocaleDateString() : '',
          importerName: bill.drawee_payer_name || '',
          importerAddress: bill.drawee_payer_address || '',
          exporterName: bill.drawer_name || '',
          exporterAddress: bill.drawer_address || ''
        });
        
        // Set finance defaults
        setFormData(prev => ({
          ...prev,
          financeCurrency: bill.bill_currency || 'USD',
          financeAmount: bill.bill_amount || 0
        }));
        
        setSelectedBillRef(billRef);
        setSearchTerm('');
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

  const buildRequestData = () => {
    const baseData = {
      bill_reference: selectedBillRef,
      request_type: formData.requestType as 'discount' | 'finance',
      bill_currency: billDetails.billCurrency,
      bill_amount: billDetails.billAmount,
      submission_date: billDetails.submissionDate,
      due_date: billDetails.dueDate,
      importer_name: billDetails.importerName,
      importer_address: billDetails.importerAddress,
      exporter_name: billDetails.exporterName,
      exporter_address: billDetails.exporterAddress,
    };

    if (formData.requestType === 'discount') {
      return {
        ...baseData,
        discount_percentage: parseFloat(formData.discountPercentage) || 0,
        proceed_amount: formData.proceedAmount,
        credit_account_number: formData.creditAccountNumber,
      };
    } else {
      return {
        ...baseData,
        finance_currency: formData.financeCurrency,
        finance_amount: formData.financeAmount,
        finance_tenor_days: parseInt(formData.financeTenorDays) || 0,
        finance_percentage: parseFloat(formData.financePercentage) || 0,
        principal_amount: formData.principalAmount,
        interest_amount: formData.interestAmount,
        total_repayment_amount: formData.totalRepaymentAmount,
        repayment_account_number: formData.repaymentAccountNumber,
      };
    }
  };

  const handleSubmit = async () => {
    if (!selectedBillRef) {
      toast({
        title: "Error",
        description: "Please select a bill reference first",
        variant: "destructive"
      });
      return;
    }

    if (!formData.requestType) {
      toast({
        title: "Error",
        description: "Please select a request type",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData = buildRequestData();
      await submitDiscountFinanceRequest(requestData);
      
      toast({
        title: "Success",
        description: `${formData.requestType === 'discount' ? 'Discount' : 'Finance'} request submitted successfully`,
        variant: "default"
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request",
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
      const requestData = buildRequestData();
      await saveDiscountFinanceRequestAsDraft(requestData);
      
      toast({
        title: "Success",
        description: "Request saved as draft",
        variant: "default"
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save request as draft",
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
                <h1 className="text-2xl font-bold text-gray-800">Request Discount/Finance</h1>
                <p className="text-sm text-gray-600">Outward Documentary Collection Bills</p>
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
          {/* Bill Reference Search */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Bill Reference Search</h2>
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

          {/* Bill Basic Details */}
          {selectedBillRef && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Bill Basic Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium">Bill Reference</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">{selectedBillRef}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Bill Currency & Amount</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                    {billDetails.billCurrency} {billDetails.billAmount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Submission Date</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">{billDetails.submissionDate}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Due Date</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">{billDetails.dueDate}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Importer Name</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">{billDetails.importerName}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Importer Address</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">{billDetails.importerAddress}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Exporter Name</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">{billDetails.exporterName}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Exporter Address</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">{billDetails.exporterAddress}</div>
                </div>
              </div>
            </div>
          )}

          {/* Request Type Selection */}
          {selectedBillRef && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Request Type</h2>
              <RadioGroup
                value={formData.requestType}
                onValueChange={(value) => handleInputChange('requestType', value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="discount" id="discount" />
                  <Label htmlFor="discount">Discount Request</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="finance" id="finance" />
                  <Label htmlFor="finance">Finance Request</Label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Discount Request Fields */}
          {formData.requestType === 'discount' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Discount Request Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="discountPercentage" className="text-sm font-medium">
                    Discount Percentage (%) *
                  </Label>
                  <Input
                    id="discountPercentage"
                    type="number"
                    step="0.01"
                    value={formData.discountPercentage}
                    onChange={(e) => handleInputChange('discountPercentage', e.target.value)}
                    placeholder="Enter discount percentage"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Proceed Amount</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                    {billDetails.billCurrency} {formData.proceedAmount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label htmlFor="creditAccountNumber" className="text-sm font-medium">
                    Credit Account Number *
                  </Label>
                  <Input
                    id="creditAccountNumber"
                    value={formData.creditAccountNumber}
                    onChange={(e) => handleInputChange('creditAccountNumber', e.target.value)}
                    placeholder="Enter credit account number"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Finance Request Fields */}
          {formData.requestType === 'finance' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Finance Request Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <Label className="text-sm font-medium">Finance Currency</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">{formData.financeCurrency}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Finance Amount</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                    {formData.financeAmount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label htmlFor="financeTenorDays" className="text-sm font-medium">
                    Finance Tenor (Days) *
                  </Label>
                  <Input
                    id="financeTenorDays"
                    type="number"
                    value={formData.financeTenorDays}
                    onChange={(e) => handleInputChange('financeTenorDays', e.target.value)}
                    placeholder="Enter tenor in days"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="financePercentage" className="text-sm font-medium">
                    Finance Percentage (%) *
                  </Label>
                  <Input
                    id="financePercentage"
                    type="number"
                    step="0.01"
                    value={formData.financePercentage}
                    onChange={(e) => handleInputChange('financePercentage', e.target.value)}
                    placeholder="Enter finance percentage"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Principal Amount</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                    {formData.financeCurrency} {formData.principalAmount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Interest Amount</Label>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-sm">
                    {formData.financeCurrency} {formData.interestAmount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Repayment Amount</Label>
                  <div className="mt-1 p-2 bg-blue-50 rounded border border-blue-200 text-sm font-medium">
                    {formData.financeCurrency} {formData.totalRepaymentAmount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <Label htmlFor="repaymentAccountNumber" className="text-sm font-medium">
                    Repayment Account Number *
                  </Label>
                  <Input
                    id="repaymentAccountNumber"
                    value={formData.repaymentAccountNumber}
                    onChange={(e) => handleInputChange('repaymentAccountNumber', e.target.value)}
                    placeholder="Enter repayment account number"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

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
              disabled={isSubmitting || !selectedBillRef}
            >
              {isSubmitting ? 'Saving...' : 'Save as Draft'}
            </Button>
            <Button
              onClick={handleSubmit}
              className="px-8 bg-primary hover:bg-primary/90"
              disabled={isSubmitting || !selectedBillRef || !formData.requestType}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
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

export default OutwardBillDiscountFinanceForm;
