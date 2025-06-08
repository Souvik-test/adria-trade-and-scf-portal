
import { useState } from 'react';

interface UploadedDocument {
  id: string;
  name: string;
  reference: string;
  date: string;
  type: string;
  file: File;
}

interface DocumentUploadDetails {
  type: string;
  documentId: string;
  date: string;
  file: File | null;
}

export const useResolveDiscrepanciesForm = () => {
  const [currentPane, setCurrentPane] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [customDocumentName, setCustomDocumentName] = useState('');
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [editingDocument, setEditingDocument] = useState<string | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadDetails, setUploadDetails] = useState<DocumentUploadDetails>({
    type: '',
    documentId: '',
    date: '',
    file: null
  });
  
  // Form state
  const [resolutionStatus, setResolutionStatus] = useState<string>('');
  const [documentReuploadRequired, setDocumentReuploadRequired] = useState<string>('');
  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [lcReference, setLcReference] = useState('');
  const [billReference, setBillReference] = useState('');

  const defaultDocumentTypes = [
    'Commercial Invoice',
    'Packing List', 
    'Bill of Lading/AWB',
    'Certificate of Origin',
    'Insurance Certificate',
    'Inspection Certificate'
  ];

  const [documentTypes, setDocumentTypes] = useState(defaultDocumentTypes);

  const validateForm = () => {
    const errors: string[] = [];

    if (resolutionStatus === 'resolved' && !resolutionRemarks.trim()) {
      errors.push('Resolution remarks are required when status is resolved');
    }

    if (documentReuploadRequired === 'yes' && uploadedDocuments.length === 0) {
      errors.push('At least one document must be uploaded when document re-upload is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  return {
    // State
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
    lcReference,
    billReference,
    documentTypes,
    
    // Setters
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
    setLcReference,
    setBillReference,
    setDocumentTypes,
    
    // Functions
    validateForm
  };
};
