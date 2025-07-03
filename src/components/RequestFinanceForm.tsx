
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RequestFinancePaneRenderer from './request-finance/RequestFinancePaneRenderer';
import RequestFinanceProgressIndicator from './request-finance/RequestFinanceProgressIndicator';
import { useRequestFinanceForm } from '@/hooks/useRequestFinanceForm';

interface RequestFinanceFormProps {
  onClose: () => void;
  onBack: () => void;
}

const RequestFinanceForm: React.FC<RequestFinanceFormProps> = ({ onClose, onBack }) => {
  const {
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
    interestAmount,
    purposeOfFinance,
    setPurposeOfFinance,
    principalRepaymentAmount,
    interestRepaymentAmount,
    totalRepaymentAmount,
    principalRepaymentAccountNumber,
    setPrincipalRepaymentAccountNumber,
    interestRepaymentAccountNumber,
    setInterestRepaymentAccountNumber,
    documentTypes,
    selectedDocuments,
    setSelectedDocuments,
    customDocumentName,
    setCustomDocumentName,
    uploadedDocuments,
    setUploadedDocuments,
    submitForm,
    isSubmitting
  } = useRequestFinanceForm();

  const paneHeaders = [
    'Bill Details',
    'Finance Details', 
    'Repayment Details',
    'Supporting Documents'
  ];

  const handleNext = () => {
    if (currentPane < paneHeaders.length - 1) {
      setCurrentPane(currentPane + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPane > 0) {
      setCurrentPane(currentPane - 1);
    }
  };

  const handleSubmit = async () => {
    const success = await submitForm();
    if (success) {
      onClose();
    }
  };

  const handleDocumentSelect = (docType: string, checked: boolean) => {
    const updatedDocs = checked 
      ? [...selectedDocuments, docType]
      : selectedDocuments.filter(doc => doc !== docType);
    setSelectedDocuments(updatedDocs);
  };

  const handleAddCustomDocumentType = () => {
    if (customDocumentName.trim()) {
      setSelectedDocuments([...selectedDocuments, customDocumentName.trim()]);
      setCustomDocumentName('');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newDocuments = files.map(file => ({
      id: Date.now().toString() + Math.random(),
      name: file.name,
      reference: '',
      date: new Date().toISOString().split('T')[0],
      type: file.type,
      file: file
    }));
    setUploadedDocuments([...uploadedDocuments, ...newDocuments]);
  };

  const handleDocumentDelete = (id: string) => {
    const updatedDocs = uploadedDocuments.filter(doc => doc.id !== id);
    setUploadedDocuments(updatedDocs);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                Request Finance
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <RequestFinanceProgressIndicator 
            currentPane={currentPane} 
            paneHeaders={paneHeaders}
          />
          
          <div className="flex-1 overflow-auto p-6">
            <RequestFinancePaneRenderer
              currentPane={currentPane}
              billReference={billReference}
              setBillReference={setBillReference}
              lcReference={lcReference}
              setLcReference={setLcReference}
              billCurrency={billCurrency}
              setBillCurrency={setBillCurrency}
              billAmount={billAmount}
              setBillAmount={setBillAmount}
              billDueDate={billDueDate}
              setBillDueDate={setBillDueDate}
              isSearching={isSearching}
              financeRequestType={financeRequestType}
              setFinanceRequestType={setFinanceRequestType}
              financeProductType={financeProductType}
              setFinanceProductType={setFinanceProductType}
              financeCurrency={financeCurrency}
              setFinanceCurrency={setFinanceCurrency}
              financeAmountRequested={financeAmountRequested}
              setFinanceAmountRequested={setFinanceAmountRequested}
              financeRequestDate={financeRequestDate}
              setFinanceRequestDate={setFinanceRequestDate}
              financeTenureDays={financeTenureDays}
              setFinanceTenureDays={setFinanceTenureDays}
              financeDueDate={financeDueDate}
              setFinanceDueDate={setFinanceDueDate}
              interestRate={interestRate}
              setInterestRate={setInterestRate}
              interestCurrency={interestCurrency}
              interestAmount={interestAmount}
              purposeOfFinance={purposeOfFinance}
              setPurposeOfFinance={setPurposeOfFinance}
              principalRepaymentAmount={principalRepaymentAmount}
              interestRepaymentAmount={interestRepaymentAmount}
              totalRepaymentAmount={totalRepaymentAmount}
              principalRepaymentAccountNumber={principalRepaymentAccountNumber}
              setPrincipalRepaymentAccountNumber={setPrincipalRepaymentAccountNumber}
              interestRepaymentAccountNumber={interestRepaymentAccountNumber}
              setInterestRepaymentAccountNumber={setInterestRepaymentAccountNumber}
              documentTypes={documentTypes}
              selectedDocuments={selectedDocuments}
              customDocumentName={customDocumentName}
              setCustomDocumentName={setCustomDocumentName}
              uploadedDocuments={uploadedDocuments}
              onBillSearch={handleBillSearch}
              onDocumentSelect={handleDocumentSelect}
              onAddCustomDocumentType={handleAddCustomDocumentType}
              onFileSelect={handleFileSelect}
              onDocumentDelete={handleDocumentDelete}
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between">
              <div className="flex gap-2">
                {currentPane > 0 && (
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={isSubmitting}
                  >
                    Previous
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                
                {currentPane < paneHeaders.length - 1 ? (
                  <Button onClick={handleNext} disabled={isSubmitting}>
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RequestFinanceForm;
