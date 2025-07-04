import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, X, Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useResolveDiscrepanciesForm } from '@/hooks/useResolveDiscrepanciesForm';
import { GeneralDetailsPane } from './resolve-discrepancies/GeneralDetailsPane';
import { DiscrepancyDetailsPane } from './resolve-discrepancies/DiscrepancyDetailsPane';
import { ResolutionDetailsPane } from './resolve-discrepancies/ResolutionDetailsPane';
import { DocumentSubmissionPane } from './resolve-discrepancies/DocumentSubmissionPane';

interface ResolveDiscrepanciesFormProps {
  onClose: () => void;
  onBack: () => void;
  isFullScreen?: boolean;
}

interface DocumentUploadDetails {
  type: string;
  documentId: string;
  date: string;
  file: File | null;
}

const ResolveDiscrepanciesForm: React.FC<ResolveDiscrepanciesFormProps> = ({ 
  onClose, 
  onBack, 
  isFullScreen = false 
}) => {
  const {
    currentPane,
    isExpanded,
    customDocumentName,
    uploadedDocuments,
    editingDocument,
    showUploadDialog,
    uploadDetails,
    resolutionStatus,
    documentReuploadRequired,
    resolutionRemarks,
    selectedDocuments,
    validationErrors,
    billReference,
    lcReference,
    corporateReference,
    applicantName,
    issuingBank,
    discrepancyNotificationDate,
    discrepancyType,
    documentType,
    discrepancyDescription,
    documentTypes,
    isSubmitting,
    setCurrentPane,
    setIsExpanded,
    setCustomDocumentName,
    setUploadedDocuments,
    setEditingDocument,
    setShowUploadDialog,
    setUploadDetails,
    setResolutionStatus,
    setDocumentReuploadRequired,
    setResolutionRemarks,
    setSelectedDocuments,
    setBillReference,
    setLcReference,
    setCorporateReference,
    setApplicantName,
    setIssuingBank,
    setDiscrepancyNotificationDate,
    setDiscrepancyType,
    setDocumentType,
    setDiscrepancyDescription,
    setDocumentTypes,
    validateForm,
    submitForm
  } = useResolveDiscrepanciesForm();

  // Initialize isExpanded with isFullScreen prop
  React.useEffect(() => {
    setIsExpanded(isFullScreen);
  }, [isFullScreen, setIsExpanded]);

  const paneHeaders = [
    'General Details',
    'Discrepancy Details', 
    'Resolution Details',
    'Document Submission Details'
  ];

  const handleLcSearch = () => {
    console.log('Searching LC Reference:', lcReference);
  };

  const handleBillSearch = () => {
    console.log('Searching Bill Reference:', billReference);
  };

  const handleDocumentSelect = (docType: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, docType]);
    } else {
      setSelectedDocuments(prev => prev.filter(doc => doc !== docType));
    }
  };

  const handleAddCustomDocumentType = () => {
    if (customDocumentName.trim() && !documentTypes.includes(customDocumentName.trim())) {
      const newDocType = customDocumentName.trim();
      setDocumentTypes(prev => [...prev, newDocType]);
      setSelectedDocuments(prev => [...prev, newDocType]);
      setCustomDocumentName('');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedDocuments.length > 0) {
      setUploadDetails({
        type: selectedDocuments[0],
        documentId: '',
        date: new Date().toISOString().split('T')[0],
        file: file
      });
      setShowUploadDialog(true);
    }
    event.target.value = '';
  };

  const handleUploadConfirm = () => {
    if (uploadDetails.file && uploadDetails.type && uploadDetails.date && uploadDetails.documentId.trim()) {
      const newDocument = {
        id: Date.now().toString(),
        name: uploadDetails.file.name,
        reference: uploadDetails.documentId,
        date: uploadDetails.date,
        type: uploadDetails.type,
        file: uploadDetails.file
      };
      setUploadedDocuments(prev => [...prev, newDocument]);
      setShowUploadDialog(false);
      setUploadDetails({
        type: '',
        documentId: '',
        date: '',
        file: null
      });
    }
  };

  const handleUploadCancel = () => {
    setShowUploadDialog(false);
    setUploadDetails({
      type: '',
      documentId: '',
      date: '',
      file: null
    });
  };

  const handleDocumentEdit = (id: string, field: string, value: string) => {
    setUploadedDocuments(docs => 
      docs.map(doc => 
        doc.id === id ? { ...doc, [field]: value } : doc
      )
    );
  };

  const handleDocumentDelete = (id: string) => {
    setUploadedDocuments(docs => docs.filter(doc => doc.id !== id));
  };

  const handleSubmit = async () => {
    const success = await submitForm();
    if (success) {
      onClose();
    }
  };

  const handleDiscard = () => {
    onBack();
  };

  const handleSaveAsDraft = () => {
    console.log('Saved as draft');
  };

  const handleNext = () => {
    if (currentPane < 3) {
      setCurrentPane(currentPane + 1);
    }
  };

  const handleGoBack = () => {
    if (currentPane > 0) {
      setCurrentPane(currentPane - 1);
    }
  };

  const renderCurrentPane = () => {
    switch (currentPane) {
      case 0:
        return (
          <GeneralDetailsPane
            billReference={billReference}
            setBillReference={setBillReference}
            lcReference={lcReference}
            setLcReference={setLcReference}
            corporateReference={corporateReference}
            setCorporateReference={setCorporateReference}
            applicantName={applicantName}
            setApplicantName={setApplicantName}
            issuingBank={issuingBank}
            setIssuingBank={setIssuingBank}
            discrepancyNotificationDate={discrepancyNotificationDate}
            setDiscrepancyNotificationDate={setDiscrepancyNotificationDate}
            onBillSearch={() => console.log('Bill search clicked')}
          />
        );
      case 1:
        return <DiscrepancyDetailsPane documentTypes={documentTypes} />;
      case 2:
        return (
          <ResolutionDetailsPane
            resolutionStatus={resolutionStatus}
            setResolutionStatus={setResolutionStatus}
            documentReuploadRequired={documentReuploadRequired}
            setDocumentReuploadRequired={setDocumentReuploadRequired}
            resolutionRemarks={resolutionRemarks}
            setResolutionRemarks={setResolutionRemarks}
          />
        );
      case 3:
        return (
          <DocumentSubmissionPane
            documentTypes={documentTypes}
            selectedDocuments={selectedDocuments}
            customDocumentName={customDocumentName}
            setCustomDocumentName={setCustomDocumentName}
            uploadedDocuments={uploadedDocuments}
            editingDocument={editingDocument}
            setEditingDocument={setEditingDocument}
            onDocumentSelect={handleDocumentSelect}
            onAddCustomDocumentType={handleAddCustomDocumentType}
            onFileSelect={handleFileSelect}
            onDocumentEdit={handleDocumentEdit}
            onDocumentDelete={handleDocumentDelete}
          />
        );
      default:
        return null;
    }
  };

  const renderPaneButtons = () => {
    const baseButtons = (
      <>
        <Button 
          variant="outline" 
          onClick={handleDiscard}
          className="px-6 py-2 text-sm font-medium border-red-400 text-red-600 hover:bg-red-50 hover:border-red-500"
        >
          Discard
        </Button>
        <Button 
          variant="outline" 
          onClick={handleSaveAsDraft}
          className="px-6 py-2 text-sm font-medium border-amber-400 text-amber-600 hover:bg-amber-50 hover:border-amber-500"
        >
          Save as Draft
        </Button>
      </>
    );

    if (currentPane === 0) {
      return (
        <div className="flex justify-end items-center">
          <div className="flex gap-3">
            {baseButtons}
            <Button 
              onClick={handleNext}
              className="px-6 py-2 text-sm font-medium bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white"
            >
              Next
            </Button>
          </div>
        </div>
      );
    }

    if (currentPane === 3) {
      return (
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handleGoBack}
            className="px-6 py-2 text-sm font-medium border-gray-400 text-gray-600 hover:bg-gray-50"
          >
            Go Back
          </Button>
          <div className="flex gap-3">
            {baseButtons}
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handleGoBack}
          className="px-6 py-2 text-sm font-medium border-gray-400 text-gray-600 hover:bg-gray-50"
        >
          Go Back
        </Button>
        <div className="flex gap-3">
          {baseButtons}
          <Button 
            onClick={handleNext}
            className="px-6 py-2 text-sm font-medium bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white"
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className={`${isExpanded ? 'max-w-[100vw] max-h-[100vh] w-full h-full' : 'max-w-7xl max-h-[90vh]'} overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300`}>
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
                  Resolve Discrepancies - <span className="text-corporate-teal-600">{paneHeaders[currentPane]}</span>
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex flex-col h-full p-6 overflow-hidden">
            {validationErrors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <div className="text-red-800 dark:text-red-200 text-sm">
                  <p className="font-medium mb-2">Please fix the following errors:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-4">
                {paneHeaders.map((header, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index === currentPane 
                        ? 'bg-corporate-teal-500 text-white' 
                        : index < currentPane 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className={`ml-2 text-sm font-medium ${
                      index === currentPane ? 'text-corporate-teal-600' : 'text-gray-600'
                    }`}>
                      {header}
                    </div>
                    {index < paneHeaders.length - 1 && (
                      <div className={`w-12 h-0.5 ml-4 ${
                        index < currentPane ? 'bg-green-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="pr-4">
                {renderCurrentPane()}
              </div>
            </ScrollArea>

            <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
              {renderPaneButtons()}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showUploadDialog} onOpenChange={handleUploadCancel}>
        <DialogContent className="max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <DialogTitle className="text-lg font-semibold text-gray-800 dark:text-white">
              Document Upload Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 p-6">
            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Document Type</Label>
              <Select value={uploadDetails.type} onValueChange={(value) => setUploadDetails(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="mt-1 border-orange-300">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  {selectedDocuments.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Document ID</Label>
              <Input
                value={uploadDetails.documentId}
                onChange={(e) => setUploadDetails(prev => ({ ...prev, documentId: e.target.value }))}
                placeholder="Enter document ID"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Document Date</Label>
              <div className="relative mt-1">
                <Input
                  type="date"
                  value={uploadDetails.date}
                  onChange={(e) => setUploadDetails(prev => ({ ...prev, date: e.target.value }))}
                  className="pr-10"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            {uploadDetails.file && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Selected file: {uploadDetails.file.name}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleUploadCancel}
                className="px-6 py-2 border-gray-400 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUploadConfirm}
                disabled={!uploadDetails.type || !uploadDetails.date || !uploadDetails.file || !uploadDetails.documentId.trim()}
                className="px-6 py-2 bg-corporate-teal-500 hover:bg-corporate-teal-600 text-white disabled:opacity-50"
              >
                Attach
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ResolveDiscrepanciesForm;
