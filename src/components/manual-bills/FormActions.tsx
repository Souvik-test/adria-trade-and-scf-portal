
import React from 'react';

interface UploadedDocument {
  id: string;
  name: string;
  reference: string;
  date: string;
  type: string;
  file: File;
}

interface FormActionsProps {
  selectedDocuments: string[];
  setSelectedDocuments: (docs: string[]) => void;
  customDocumentName: string;
  setCustomDocumentName: (name: string) => void;
  documentTypes: string[];
  setDocumentTypes: (types: string[]) => void;
  uploadedDocuments: UploadedDocument[];
  setUploadedDocuments: (docs: UploadedDocument[]) => void;
  showDocumentDetails: boolean;
  setShowDocumentDetails: (show: boolean) => void;
  pendingFile: File | null;
  setPendingFile: (file: File | null) => void;
}

export const useFormActions = ({
  selectedDocuments,
  setSelectedDocuments,
  customDocumentName,
  setCustomDocumentName,
  documentTypes,
  setDocumentTypes,
  uploadedDocuments,
  setUploadedDocuments,
  showDocumentDetails,
  setShowDocumentDetails,
  pendingFile,
  setPendingFile
}: FormActionsProps) => {
  const handleDocumentSelect = (docType: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, docType]);
    } else {
      setSelectedDocuments(selectedDocuments.filter(doc => doc !== docType));
    }
  };

  const handleAddCustomDocumentType = () => {
    if (customDocumentName.trim() && !documentTypes.includes(customDocumentName.trim())) {
      const newDocType = customDocumentName.trim();
      setDocumentTypes([...documentTypes, newDocType]);
      setSelectedDocuments([...selectedDocuments, newDocType]);
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
      setUploadedDocuments([...uploadedDocuments, newDocument]);
      setShowDocumentDetails(false);
      setPendingFile(null);
    }
  };

  const handleDocumentUploadCancel = () => {
    setShowDocumentDetails(false);
    setPendingFile(null);
  };

  const handleDocumentDelete = (id: string) => {
    setUploadedDocuments(uploadedDocuments.filter(doc => doc.id !== id));
  };

  return {
    handleDocumentSelect,
    handleAddCustomDocumentType,
    handleFileSelect,
    handleDocumentUpload,
    handleDocumentUploadCancel,
    handleDocumentDelete
  };
};
