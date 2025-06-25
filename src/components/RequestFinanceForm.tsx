
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';
import DocumentUploadDetails from './DocumentUploadDetails';
import ActionButtons from './manual-bills/ActionButtons';
import RequestFinanceProgressIndicator from './request-finance/RequestFinanceProgressIndicator';
import RequestFinancePaneRenderer from './request-finance/RequestFinancePaneRenderer';
import { useRequestFinanceForm } from '../hooks/useRequestFinanceForm';
import { useRequestFinanceActions } from './request-finance/RequestFinanceActions';

interface RequestFinanceFormProps {
  onClose: () => void;
  onBack: () => void;
}

const RequestFinanceForm: React.FC<RequestFinanceFormProps> = ({ onClose, onBack }) => {
  const formState = useRequestFinanceForm();
  
  const formActions = useRequestFinanceActions({
    selectedDocuments: formState.selectedDocuments,
    setSelectedDocuments: formState.setSelectedDocuments,
    customDocumentName: formState.customDocumentName,
    setCustomDocumentName: formState.setCustomDocumentName,
    documentTypes: formState.documentTypes,
    setDocumentTypes: formState.setDocumentTypes,
    uploadedDocuments: formState.uploadedDocuments,
    setUploadedDocuments: formState.setUploadedDocuments,
    showDocumentDetails: formState.showDocumentDetails,
    setShowDocumentDetails: formState.setShowDocumentDetails,
    pendingFile: formState.pendingFile,
    setPendingFile: formState.setPendingFile
  });

  const paneHeaders = [
    'Bill Details',
    'Finance Details', 
    'Repayment Details',
    'Upload Supporting Document'
  ];

  const handleNext = () => {
    if (formState.currentPane < 3) {
      formState.setCurrentPane(formState.currentPane + 1);
    }
  };

  const handleGoBack = () => {
    if (formState.currentPane > 0) {
      formState.setCurrentPane(formState.currentPane - 1);
    }
  };

  const handleDiscard = () => {
    onBack();
  };

  const handleSaveAsDraft = () => {
    console.log('Saved as draft');
  };

  const handleSubmit = () => {
    console.log('Form submitted');
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-[100vw] max-h-[100vh] w-full h-full overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300">
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
                  Request Finance - {paneHeaders[formState.currentPane]}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex flex-col h-full p-6 overflow-hidden">
            <RequestFinanceProgressIndicator 
              currentPane={formState.currentPane}
              paneHeaders={paneHeaders}
            />

            <div className="flex-1 overflow-hidden">
              <RequestFinancePaneRenderer
                currentPane={formState.currentPane}
                billReference={formState.billReference}
                setBillReference={formState.setBillReference}
                lcReference={formState.lcReference}
                setLcReference={formState.setLcReference}
                billCurrency={formState.billCurrency}
                setBillCurrency={formState.setBillCurrency}
                billAmount={formState.billAmount}
                setBillAmount={formState.setBillAmount}
                billDueDate={formState.billDueDate}
                setBillDueDate={formState.setBillDueDate}
                isSearching={formState.isSearching}
                financeRequestType={formState.financeRequestType}
                setFinanceRequestType={formState.setFinanceRequestType}
                financeProductType={formState.financeProductType}
                setFinanceProductType={formState.setFinanceProductType}
                financeCurrency={formState.financeCurrency}
                setFinanceCurrency={formState.setFinanceCurrency}
                financeAmountRequested={formState.financeAmountRequested}
                setFinanceAmountRequested={formState.setFinanceAmountRequested}
                financeRequestDate={formState.financeRequestDate}
                setFinanceRequestDate={formState.setFinanceRequestDate}
                financeTenureDays={formState.financeTenureDays}
                setFinanceTenureDays={formState.setFinanceTenureDays}
                financeDueDate={formState.financeDueDate}
                setFinanceDueDate={formState.setFinanceDueDate}
                interestRate={formState.interestRate}
                setInterestRate={formState.setInterestRate}
                interestCurrency={formState.interestCurrency}
                interestAmount={formState.interestAmount}
                purposeOfFinance={formState.purposeOfFinance}
                setPurposeOfFinance={formState.setPurposeOfFinance}
                principalRepaymentAmount={formState.principalRepaymentAmount}
                interestRepaymentAmount={formState.interestRepaymentAmount}
                totalRepaymentAmount={formState.totalRepaymentAmount}
                principalRepaymentAccountNumber={formState.principalRepaymentAccountNumber}
                setPrincipalRepaymentAccountNumber={formState.setPrincipalRepaymentAccountNumber}
                interestRepaymentAccountNumber={formState.interestRepaymentAccountNumber}
                setInterestRepaymentAccountNumber={formState.setInterestRepaymentAccountNumber}
                documentTypes={formState.documentTypes}
                selectedDocuments={formState.selectedDocuments}
                customDocumentName={formState.customDocumentName}
                setCustomDocumentName={formState.setCustomDocumentName}
                uploadedDocuments={formState.uploadedDocuments}
                onBillSearch={formState.handleBillSearch}
                onDocumentSelect={formActions.handleDocumentSelect}
                onAddCustomDocumentType={formActions.handleAddCustomDocumentType}
                onFileSelect={formActions.handleFileSelect}
                onDocumentDelete={formActions.handleDocumentDelete}
              />
            </div>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
              <ActionButtons
                currentPane={formState.currentPane}
                onGoBack={handleGoBack}
                onDiscard={handleDiscard}
                onSaveAsDraft={handleSaveAsDraft}
                onNext={handleNext}
                onSubmit={handleSubmit}
                formType="request-finance"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DocumentUploadDetails
        isOpen={formState.showDocumentDetails}
        onClose={formActions.handleDocumentUploadCancel}
        onUpload={formActions.handleDocumentUpload}
        fileName={formState.pendingFile?.name || ''}
        selectedDocuments={formState.selectedDocuments}
      />
    </>
  );
};

export default RequestFinanceForm;
