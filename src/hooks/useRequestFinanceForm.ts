
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UploadedDocument {
  id: string;
  name: string;
  reference: string;
  date: string;
  type: string;
  file: File;
}

export const useRequestFinanceForm = () => {
  const { toast } = useToast();
  const [currentPane, setCurrentPane] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Bill Details
  const [billReference, setBillReference] = useState('');
  const [lcReference, setLcReference] = useState('');
  const [billCurrency, setBillCurrency] = useState('');
  const [billAmount, setBillAmount] = useState('');
  const [billDueDate, setBillDueDate] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Finance Details
  const [financeRequestType, setFinanceRequestType] = useState('');
  const [financeProductType, setFinanceProductType] = useState('');
  const [financeCurrency, setFinanceCurrency] = useState('');
  const [financeAmountRequested, setFinanceAmountRequested] = useState('');
  const [financeRequestDate, setFinanceRequestDate] = useState(new Date().toISOString().split('T')[0]);
  const [financeTenureDays, setFinanceTenureDays] = useState('');
  const [financeDueDate, setFinanceDueDate] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [purposeOfFinance, setPurposeOfFinance] = useState('');
  
  // Calculated fields
  const [interestCurrency, setInterestCurrency] = useState('');
  const [interestAmount, setInterestAmount] = useState('');
  
  // Repayment Details
  const [principalRepaymentAmount, setPrincipalRepaymentAmount] = useState('');
  const [interestRepaymentAmount, setInterestRepaymentAmount] = useState('');
  const [totalRepaymentAmount, setTotalRepaymentAmount] = useState('');
  const [principalRepaymentAccountNumber, setPrincipalRepaymentAccountNumber] = useState('');
  const [interestRepaymentAccountNumber, setInterestRepaymentAccountNumber] = useState('');
  
  // Document Upload
  const [documentTypes, setDocumentTypes] = useState([
    'Invoice',
    'Packing List',
    'Bill of Lading',
    'Certificate of Origin',
    'Insurance Certificate',
    'Commercial Invoice',
    'Customs Declaration'
  ]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [customDocumentName, setCustomDocumentName] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [showDocumentDetails, setShowDocumentDetails] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Bill search functionality
  const handleBillSearch = async () => {
    if (!billReference.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Bill Reference to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    try {
      console.log('Searching for bill:', billReference);
      
      const { data: bills, error } = await supabase
        .from('export_lc_bills')
        .select('*')
        .eq('bill_reference', billReference.trim())
        .eq('status', 'submitted');

      if (error) {
        console.error('Bill search error:', error);
        throw error;
      }

      if (bills && bills.length > 0) {
        const bill = bills[0];
        console.log('Found bill:', bill);
        
        // Auto-populate bill details including bill_due_date
        setLcReference(bill.lc_reference || '');
        setBillCurrency(bill.bill_currency || 'USD');
        setBillAmount(bill.bill_amount?.toString() || '');
        setBillDueDate(bill.bill_due_date || '');
        
        // Set finance currency to match bill currency
        setFinanceCurrency(bill.bill_currency || 'USD');

        toast({
          title: "Success",
          description: "Bill details retrieved and auto-populated successfully",
        });
      } else {
        toast({
          title: "Not Found",
          description: "No submitted bill found with this reference number",
          variant: "destructive",
        });
        
        // Clear auto-populated fields
        setLcReference('');
        setBillCurrency('');
        setBillAmount('');
        setBillDueDate('');
        setFinanceCurrency('');
      }
    } catch (error) {
      console.error('Bill search error:', error);
      toast({
        title: "Error",
        description: "Failed to search for bill. Please try again.",
        variant: "destructive",
      });
      
      // Clear auto-populated fields on error
      setLcReference('');
      setBillCurrency('');
      setBillAmount('');
      setBillDueDate('');
      setFinanceCurrency('');
    } finally {
      setIsSearching(false);
    }
  };

  // Calculate interest currency (should match finance currency)
  useEffect(() => {
    if (financeCurrency) {
      setInterestCurrency(financeCurrency);
    }
  }, [financeCurrency]);

  // Calculate interest amount using the corrected formula: [(P*R*T)/(100*365)]
  useEffect(() => {
    if (financeAmountRequested && interestRate && financeTenureDays) {
      const amount = parseFloat(financeAmountRequested) || 0;
      const rate = parseFloat(interestRate) || 0;
      const tenure = parseInt(financeTenureDays) || 0;
      
      const calculatedInterest = (amount * rate * tenure) / (100 * 365);
      setInterestAmount(calculatedInterest.toFixed(2));
    } else {
      setInterestAmount('');
    }
  }, [financeAmountRequested, interestRate, financeTenureDays]);

  // Calculate principal repayment amount
  useEffect(() => {
    if (financeCurrency && financeAmountRequested) {
      setPrincipalRepaymentAmount(`${financeCurrency} ${financeAmountRequested}`);
    } else {
      setPrincipalRepaymentAmount('');
    }
  }, [financeCurrency, financeAmountRequested]);

  // Calculate interest repayment amount
  useEffect(() => {
    if (interestCurrency && interestAmount) {
      setInterestRepaymentAmount(`${interestCurrency} ${interestAmount}`);
    } else {
      setInterestRepaymentAmount('');
    }
  }, [interestCurrency, interestAmount]);

  // Calculate total repayment amount
  useEffect(() => {
    if (financeAmountRequested && interestAmount && financeCurrency) {
      const principalAmount = parseFloat(financeAmountRequested) || 0;
      const interestAmountValue = parseFloat(interestAmount) || 0;
      const total = (principalAmount + interestAmountValue).toFixed(2);
      setTotalRepaymentAmount(`${financeCurrency} ${total}`);
    } else {
      setTotalRepaymentAmount('');
    }
  }, [financeAmountRequested, interestAmount, financeCurrency]);

  // Submit form function
  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting user:', userError);
        throw new Error('Authentication error');
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Generate unique finance request reference
      const financeRequestRef = `FIN-${Date.now()}`;

      // Create transaction record
      const transactionData = {
        user_id: user.id,
        transaction_ref: financeRequestRef,
        product_type: 'FINANCE REQUEST',
        process_type: 'REQUEST FINANCE',
        status: 'submitted',
        customer_name: null,
        amount: parseFloat(financeAmountRequested) || 0,
        currency: financeCurrency || 'USD',
        created_by: user.email || 'Unknown',
        initiating_channel: 'Portal'
      };

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert(transactionData);

      if (transactionError) {
        console.error('Transaction creation error:', transactionError);
        throw transactionError;
      }

      // Create notification
      const notificationData = {
        user_id: user.id,
        transaction_ref: financeRequestRef,
        transaction_type: 'FINANCE REQUEST',
        message: `Finance request ${financeRequestRef} for ${financeCurrency} ${financeAmountRequested} has been submitted successfully.`,
        is_read: false
      };

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notificationData);

      if (notificationError) {
        console.error('Notification creation error:', notificationError);
      }

      toast({
        title: "Success",
        description: `Finance request submitted successfully. Reference: ${financeRequestRef}`,
      });

      // Reset form
      setBillReference('');
      setLcReference('');
      setBillCurrency('');
      setBillAmount('');
      setBillDueDate('');
      setFinanceRequestType('');
      setFinanceProductType('');
      setFinanceCurrency('');
      setFinanceAmountRequested('');
      setFinanceTenureDays('');
      setFinanceDueDate('');
      setInterestRate('');
      setPurposeOfFinance('');
      setSelectedDocuments([]);
      setUploadedDocuments([]);
      setCurrentPane(0);

      return true;
    } catch (error) {
      console.error('Error submitting finance request:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit finance request. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentPane,
    setCurrentPane,
    billReference,
    setBillReference,
    lcReference,
    setLcReference,
    billCurrency,
    setBillCurrency,
    billAmount,
    setBillAmount,
    billDueDate,
    setBillDueDate,
    isSearching,
    handleBillSearch,
    financeRequestType,
    setFinanceRequestType,
    financeProductType,
    setFinanceProductType,
    financeCurrency,
    setFinanceCurrency,
    financeAmountRequested,
    setFinanceAmountRequested,
    financeRequestDate,
    setFinanceRequestDate,
    financeTenureDays,
    setFinanceTenureDays,
    financeDueDate,
    setFinanceDueDate,
    interestRate,
    setInterestRate,
    interestCurrency,
    setInterestCurrency,
    interestAmount,
    setInterestAmount,
    purposeOfFinance,
    setPurposeOfFinance,
    principalRepaymentAmount,
    setPrincipalRepaymentAmount,
    interestRepaymentAmount,
    setInterestRepaymentAmount,
    totalRepaymentAmount,
    setTotalRepaymentAmount,
    principalRepaymentAccountNumber,
    setPrincipalRepaymentAccountNumber,
    interestRepaymentAccountNumber,
    setInterestRepaymentAccountNumber,
    documentTypes,
    setDocumentTypes,
    selectedDocuments,
    setSelectedDocuments,
    customDocumentName,
    setCustomDocumentName,
    uploadedDocuments,
    setUploadedDocuments,
    showDocumentDetails,
    setShowDocumentDetails,
    pendingFile,
    setPendingFile,
    submitForm,
    isSubmitting
  };
};
