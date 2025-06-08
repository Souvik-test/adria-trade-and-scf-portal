
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';
import DocumentUploadDetails from './DocumentUploadDetails';
import ActionButtons from './manual-bills/ActionButtons';
import FormProgressIndicator from './manual-bills/FormProgressIndicator';
import FormPaneRenderer from './manual-bills/FormPaneRenderer';
import { useManualBillsForm } from '../hooks/useManualBillsForm';
import { useFormActions } from './manual-bills/FormActions';

interface ManualBillsFormProps {
  onClose: () => void;
  onBack: () => void;
}

const ManualBillsForm: React.FC<ManualBillsFormProps> = ({ onClose, onBack }) => {
  const formState = useManualBillsForm();
  
  const formActions = useFormActions({
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
    'Submission Details',
    'LC & Applicant Details',
    'Drawing Details',
    'Shipment & Transportation Details',
    'Document Submission Details'
  ];

  const handleNext = () => {
    if (formState.currentPane < 4) {
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

  const handleLcSearch = () => {
    console.log('Searching LC Reference:', formState.lcReference);
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
                  Export LC Bills - {paneHeaders[formState.currentPane]}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex flex-col h-full p-6 overflow-hidden">
            <FormProgressIndicator 
              currentPane={formState.currentPane}
              paneHeaders={paneHeaders}
            />

            <div className="flex-1 overflow-hidden">
              <FormPaneRenderer
                currentPane={formState.currentPane}
                submissionType={formState.submissionType}
                setSubmissionType={formState.setSubmissionType}
                submissionDate={formState.submissionDate}
                setSubmissionDate={formState.setSubmissionDate}
                submissionReference={formState.submissionReference}
                setSubmissionReference={formState.setSubmissionReference}
                lcReference={formState.lcReference}
                setLcReference={formState.setLcReference}
                corporateReference={formState.corporateReference}
                lcCurrency={formState.lcCurrency}
                setLcCurrency={formState.setLcCurrency}
                applicantName={formState.applicantName}
                setApplicantName={formState.setApplicantName}
                drawingCurrency={formState.drawingCurrency}
                setDrawingCurrency={formState.setDrawingCurrency}
                drawingAmount={formState.drawingAmount}
                setDrawingAmount={formState.setDrawingAmount}
                drawingDate={formState.drawingDate}
                setDrawingDate={formState.setDrawingDate}
                tenorType={formState.tenorType}
                setTenorType={formState.setTenorType}
                tenorDays={formState.tenorDays}
                setTenorDays={formState.setTenorDays}
                billDueDate={formState.billDueDate}
                setBillDueDate={formState.setBillDueDate}
                shipmentDetails={formState.shipmentDetails}
                setShipmentDetails={formState.setShipmentDetails}
                billOfLadingNo={formState.billOfLadingNo}
                setBillOfLadingNo={formState.setBillOfLadingNo}
                documentTypes={formState.documentTypes}
                selectedDocuments={formState.selectedDocuments}
                customDocumentName={formState.customDocumentName}
                setCustomDocumentName={formState.setCustomDocumentName}
                uploadedDocuments={formState.uploadedDocuments}
                onLcSearch={handleLcSearch}
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

export default ManualBillsForm;
