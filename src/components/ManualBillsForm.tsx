
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';
import DocumentUploadDetails from './DocumentUploadDetails';
import SubmissionDetailsPane from './manual-bills/SubmissionDetailsPane';
import LcApplicantDetailsPane from './manual-bills/LcApplicantDetailsPane';
import DrawingDetailsPane from './manual-bills/DrawingDetailsPane';
import ShipmentTransportationPane from './manual-bills/ShipmentTransportationPane';
import DocumentSubmissionPane from './manual-bills/DocumentSubmissionPane';
import ActionButtons from './manual-bills/ActionButtons';

interface ManualBillsFormProps {
  onClose: () => void;
  onBack: () => void;
}

interface UploadedDocument {
  id: string;
  name: string;
  reference: string;
  date: string;
  type: string;
  file: File;
}

const ManualBillsForm: React.FC<ManualBillsFormProps> = ({ onClose, onBack }) => {
  const [currentPane, setCurrentPane] = useState(0);
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [customDocumentName, setCustomDocumentName] = useState('');
  const [showDocumentDetails, setShowDocumentDetails] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  
  // Form state
  const [submissionType, setSubmissionType] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [submissionReference, setSubmissionReference] = useState('');
  const [lcReference, setLcReference] = useState('');
  const [corporateReference, setCorporateReference] = useState('CORP-REF-001');
  const [lcCurrency, setLcCurrency] = useState('USD');
  const [applicantName, setApplicantName] = useState('');
  const [drawingAmount, setDrawingAmount] = useState('');
  const [tenorType, setTenorType] = useState('');
  const [tenorDays, setTenorDays] = useState('');
  const [shipmentDetails, setShipmentDetails] = useState('');
  const [billOfLadingNo, setBillOfLadingNo] = useState('');

  const defaultDocumentTypes = [
    'Commercial Invoice',
    'Packing List', 
    'Bill of Lading/AWB',
    'Certificate of Origin',
    'Insurance Certificate',
    'Inspection Certificate'
  ];

  const [documentTypes, setDocumentTypes] = useState(defaultDocumentTypes);

  const paneHeaders = [
    'Submission Details',
    'LC & Applicant Details',
    'Drawing Details',
    'Shipment & Transportation Details',
    'Document Submission Details'
  ];

  const handleNext = () => {
    if (currentPane < 4) {
      setCurrentPane(currentPane + 1);
    }
  };

  const handleGoBack = () => {
    if (currentPane > 0) {
      setCurrentPane(currentPane - 1);
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
    console.log('Searching LC Reference:', lcReference);
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
      setPendingFile(file);
      setShowDocumentDetails(true);
    }
    event.target.value = '';
  };

  const handleDocumentUpload = (details: { type: string; id: string; date: string }) => {
    if (pendingFile) {
      const newDocument: UploadedDocument = {
        id: Date.now().toString(),
        name: pendingFile.name,
        reference: details.id,
        date: details.date,
        type: details.type,
        file: pendingFile
      };
      setUploadedDocuments(prev => [...prev, newDocument]);
      setShowDocumentDetails(false);
      setPendingFile(null);
    }
  };

  const handleDocumentUploadCancel = () => {
    setShowDocumentDetails(false);
    setPendingFile(null);
  };

  const handleDocumentDelete = (id: string) => {
    setUploadedDocuments(docs => docs.filter(doc => doc.id !== id));
  };

  const renderCurrentPane = () => {
    switch (currentPane) {
      case 0:
        return (
          <SubmissionDetailsPane
            submissionType={submissionType}
            setSubmissionType={setSubmissionType}
            submissionDate={submissionDate}
            setSubmissionDate={setSubmissionDate}
            submissionReference={submissionReference}
            setSubmissionReference={setSubmissionReference}
          />
        );
      case 1:
        return (
          <LcApplicantDetailsPane
            lcReference={lcReference}
            setLcReference={setLcReference}
            corporateReference={corporateReference}
            lcCurrency={lcCurrency}
            setLcCurrency={setLcCurrency}
            applicantName={applicantName}
            setApplicantName={setApplicantName}
            onLcSearch={handleLcSearch}
          />
        );
      case 2:
        return (
          <DrawingDetailsPane
            drawingAmount={drawingAmount}
            setDrawingAmount={setDrawingAmount}
            tenorType={tenorType}
            setTenorType={setTenorType}
            tenorDays={tenorDays}
            setTenorDays={setTenorDays}
          />
        );
      case 3:
        return (
          <ShipmentTransportationPane
            shipmentDetails={shipmentDetails}
            setShipmentDetails={setShipmentDetails}
            billOfLadingNo={billOfLadingNo}
            setBillOfLadingNo={setBillOfLadingNo}
          />
        );
      case 4:
        return (
          <DocumentSubmissionPane
            documentTypes={documentTypes}
            selectedDocuments={selectedDocuments}
            customDocumentName={customDocumentName}
            setCustomDocumentName={setCustomDocumentName}
            uploadedDocuments={uploadedDocuments}
            onDocumentSelect={handleDocumentSelect}
            onAddCustomDocumentType={handleAddCustomDocumentType}
            onFileSelect={handleFileSelect}
            onDocumentDelete={handleDocumentDelete}
          />
        );
      default:
        return null;
    }
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
                  Export LC Bills - {paneHeaders[currentPane]}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex flex-col h-full p-6 overflow-hidden">
            {/* Progress indicator */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center space-x-2">
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
                    {index < paneHeaders.length - 1 && (
                      <div className={`w-8 h-0.5 mx-2 ${
                        index < currentPane ? 'bg-green-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-hidden">
              {renderCurrentPane()}
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-6 mt-6">
              <ActionButtons
                currentPane={currentPane}
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
        isOpen={showDocumentDetails}
        onClose={handleDocumentUploadCancel}
        onUpload={handleDocumentUpload}
        fileName={pendingFile?.name || ''}
        selectedDocuments={selectedDocuments}
      />
    </>
  );
};

export default ManualBillsForm;
