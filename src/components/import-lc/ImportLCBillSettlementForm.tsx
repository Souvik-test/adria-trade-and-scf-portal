
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  Calendar, 
  DollarSign,
  CreditCard,
  Building
} from 'lucide-react';

interface ImportLCBillSettlementFormProps {
  onBack: () => void;
  onClose: () => void;
}

interface BillData {
  billReference: string;
  billAmount: number;
  currency: string;
  billDueDate: string;
  lcReference: string;
  applicantName: string;
  issuingBank: string;
}

interface FormData {
  billReference: string;
  paymentOption: 'partial' | 'full' | '';
  settlementAmount: number;
  settlementMethod: 'account-debit' | 'payment-financing' | '';
  // Account Debit fields
  debitAccountNumber: string;
  // Payment with Financing fields
  financingType: string;
  financingAmount: number;
  financingTenor: string;
  billData?: BillData;
}

const ImportLCBillSettlementForm: React.FC<ImportLCBillSettlementFormProps> = ({ onBack, onClose }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    billReference: '',
    paymentOption: '',
    settlementAmount: 0,
    settlementMethod: '',
    debitAccountNumber: '',
    financingType: '',
    financingAmount: 0,
    financingTenor: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSearch = async () => {
    if (!formData.billReference.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Bill Reference number",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      console.log('Searching for bill:', formData.billReference);
      
      const { data: bills, error } = await supabase
        .from('export_lc_bills')
        .select('*')
        .eq('bill_reference', formData.billReference.trim())
        .in('status', ['submitted', 'presented', 'accepted']);

      if (error) {
        console.error('Bill search error:', error);
        throw error;
      }

      if (bills && bills.length > 0) {
        const bill = bills[0];
        console.log('Found bill:', bill);
        
        // Calculate bill due date (assuming 30 days from bill date for now)
        let billDueDate = '';
        if (bill.bill_date) {
          const billDate = new Date(bill.bill_date);
          const dueDate = new Date(billDate);
          dueDate.setDate(dueDate.getDate() + 30);
          billDueDate = dueDate.toISOString().split('T')[0];
        }

        const mockBillData: BillData = {
          billReference: bill.bill_reference,
          billAmount: bill.bill_amount || 50000,
          currency: bill.bill_currency || 'USD',
          billDueDate: billDueDate,
          lcReference: bill.lc_reference || 'LC-2024-001234',
          applicantName: bill.applicant_name || 'XYZ Imports Pvt. Ltd.',
          issuingBank: bill.issuing_bank || 'Standard Bank International'
        };
        
        setFormData(prev => ({
          ...prev,
          billData: mockBillData,
          settlementAmount: mockBillData.billAmount
        }));
        
        toast({
          title: "Success",
          description: "Bill details retrieved successfully",
        });
      } else {
        toast({
          title: "Not Found",
          description: "No accepted or presented bill found with this reference number",
          variant: "destructive",
        });
        
        setFormData(prev => ({
          ...prev,
          billData: undefined,
          settlementAmount: 0
        }));
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Error",
        description: "Failed to retrieve bill details",
        variant: "destructive",
      });
      
      setFormData(prev => ({
        ...prev,
        billData: undefined,
        settlementAmount: 0
      }));
    } finally {
      setIsSearching(false);
    }
  };

  const handlePaymentOptionChange = (value: 'partial' | 'full') => {
    setFormData(prev => ({
      ...prev,
      paymentOption: value,
      settlementAmount: value === 'full' ? (prev.billData?.billAmount || 0) : prev.settlementAmount
    }));
  };

  const handleSettlementAmountChange = (value: string) => {
    const amount = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      settlementAmount: amount
    }));
  };

  const handleSubmit = async () => {
    if (!formData.billData) {
      toast({
        title: "Error",
        description: "Please search for a bill first",
        variant: "destructive",
      });
      return;
    }

    if (!formData.paymentOption) {
      toast({
        title: "Error",
        description: "Please select payment option",
        variant: "destructive",
      });
      return;
    }

    if (!formData.settlementMethod) {
      toast({
        title: "Error",
        description: "Please select settlement method",
        variant: "destructive",
      });
      return;
    }

    if (formData.settlementAmount <= 0) {
      toast({
        title: "Error",
        description: "Settlement amount must be greater than zero",
        variant: "destructive",
      });
      return;
    }

    if (formData.settlementMethod === 'account-debit' && !formData.debitAccountNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter debit account number",
        variant: "destructive",
      });
      return;
    }

    if (formData.settlementMethod === 'payment-financing' && (!formData.financingType || !formData.financingTenor)) {
      toast({
        title: "Error",
        description: "Please fill all financing details",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting settlement:', formData);
      
      // TODO: Implement actual submission logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: `Bill settlement processed successfully for ${formData.settlementAmount} ${formData.billData.currency}`,
      });
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Failed to process bill settlement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-800 flex h-screen w-screen overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-600 pb-4 mb-6 px-6 pt-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Import LC Bill - Process Bill Settlement
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden px-6">
          <ScrollArea className="h-full">
            <div className="space-y-6">
              {/* Bill Search Section */}
              <Card className="border border-gray-200 dark:border-gray-600 shadow">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Search Bill Reference
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Bill Reference Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={formData.billReference}
                        onChange={(e) => setFormData(prev => ({ ...prev, billReference: e.target.value }))}
                        placeholder="Enter Bill Reference Number..."
                        className="w-full"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        onClick={handleSearch}
                        disabled={isSearching || !formData.billReference.trim()}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                      >
                        {isSearching ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bill Details Section */}
              {formData.billData && (
                <>
                  <Card className="border border-gray-200 dark:border-gray-600 shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        Bill Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Bill Amount</div>
                            <div className="font-semibold">{formData.billData.currency} {formData.billData.billAmount.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-orange-600" />
                          <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Bill Due Date</div>
                            <div className="font-semibold">{formData.billData.billDueDate}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">LC Reference</div>
                          <div className="font-semibold">{formData.billData.lcReference}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Applicant</div>
                          <div className="font-semibold">{formData.billData.applicantName}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Issuing Bank</div>
                          <div className="font-semibold">{formData.billData.issuingBank}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Settlement Options Section */}
                  <Card className="border border-blue-200 dark:border-blue-600 shadow">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        Settlement Options
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Payment Option */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                          Payment Option <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup 
                          value={formData.paymentOption} 
                          onValueChange={(value) => handlePaymentOptionChange(value as 'partial' | 'full')}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="partial" id="partial" />
                            <Label htmlFor="partial">Partial Settlement</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="full" id="full" />
                            <Label htmlFor="full">Full Settlement</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Settlement Amount */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                          Settlement Amount <span className="text-red-500">*</span>
                        </Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {formData.billData.currency}
                          </span>
                          <Input
                            type="number"
                            value={formData.settlementAmount}
                            onChange={(e) => handleSettlementAmountChange(e.target.value)}
                            disabled={formData.paymentOption === 'full'}
                            className="flex-1"
                            min="0"
                            max={formData.billData.billAmount}
                          />
                        </div>
                        {formData.paymentOption === 'partial' && formData.settlementAmount > formData.billData.billAmount && (
                          <p className="text-sm text-red-600 mt-1">
                            Settlement amount cannot exceed bill amount
                          </p>
                        )}
                      </div>

                      {/* Settlement Method */}
                      <div>
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                          Settlement Method <span className="text-red-500">*</span>
                        </Label>
                        <RadioGroup 
                          value={formData.settlementMethod} 
                          onValueChange={(value) => setFormData(prev => ({ ...prev, settlementMethod: value as 'account-debit' | 'payment-financing' }))}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="account-debit" id="account-debit" />
                            <Label htmlFor="account-debit">Account Debit</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="payment-financing" id="payment-financing" />
                            <Label htmlFor="payment-financing">Payment with Financing</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Account Debit Fields */}
                      {formData.settlementMethod === 'account-debit' && (
                        <Card className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                          <CardHeader>
                            <CardTitle className="text-md font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              Account Debit Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                Debit Account Number <span className="text-red-500">*</span>
                              </Label>
                              <Input
                                value={formData.debitAccountNumber}
                                onChange={(e) => setFormData(prev => ({ ...prev, debitAccountNumber: e.target.value }))}
                                placeholder="Enter account number to debit..."
                              />
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Payment with Financing Fields */}
                      {formData.settlementMethod === 'payment-financing' && (
                        <Card className="border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                          <CardHeader>
                            <CardTitle className="text-md font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Financing Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                  Financing Type <span className="text-red-500">*</span>
                                </Label>
                                <RadioGroup 
                                  value={formData.financingType} 
                                  onValueChange={(value) => setFormData(prev => ({ ...prev, financingType: value }))}
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="import-loan" id="import-loan" />
                                    <Label htmlFor="import-loan">Import Loan</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="usance-payment" id="usance-payment" />
                                    <Label htmlFor="usance-payment">Usance Payment</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                              <div>
                                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                  Financing Tenor <span className="text-red-500">*</span>
                                </Label>
                                <RadioGroup 
                                  value={formData.financingTenor} 
                                  onValueChange={(value) => setFormData(prev => ({ ...prev, financingTenor: value }))}
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="30-days" id="30-days" />
                                    <Label htmlFor="30-days">30 Days</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="60-days" id="60-days" />
                                    <Label htmlFor="60-days">60 Days</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="90-days" id="90-days" />
                                    <Label htmlFor="90-days">90 Days</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                            <div>
                              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                Financing Amount
                              </Label>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                  {formData.billData.currency}
                                </span>
                                <Input
                                  type="number"
                                  value={formData.financingAmount || formData.settlementAmount}
                                  onChange={(e) => setFormData(prev => ({ ...prev, financingAmount: parseFloat(e.target.value) || 0 }))}
                                  className="flex-1"
                                  min="0"
                                  max={formData.settlementAmount}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 px-6 pb-6">
          <div className="flex justify-end items-center pt-6 border-t border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
            <div className="flex gap-3 items-center">
              <Button
                onClick={onBack}
                variant="outline"
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Back
              </Button>
              
              <Button
                onClick={handleSubmit}
                disabled={!formData.billData || !formData.paymentOption || !formData.settlementMethod || formData.settlementAmount <= 0 || isSubmitting}
                className="bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed px-8"
              >
                {isSubmitting ? 'Processing...' : 'Process Settlement'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportLCBillSettlementForm;
