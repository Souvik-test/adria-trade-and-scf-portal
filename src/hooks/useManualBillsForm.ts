
import { useState } from 'react';

interface UploadedDocument {
  id: string;
  name: string;
  reference: string;
  date: string;
  type: string;
  file: File;
}

export const useManualBillsForm = () => {
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
  const [drawingCurrency, setDrawingCurrency] = useState('USD');
  const [drawingAmount, setDrawingAmount] = useState('');
  const [drawingDate, setDrawingDate] = useState('');
  const [tenorType, setTenorType] = useState('');
  const [tenorDays, setTenorDays] = useState('');
  const [billDueDate, setBillDueDate] = useState('');
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

  return {
    currentPane,
    setCurrentPane,
    uploadedDocuments,
    setUploadedDocuments,
    selectedDocuments,
    setSelectedDocuments,
    customDocumentName,
    setCustomDocumentName,
    showDocumentDetails,
    setShowDocumentDetails,
    pendingFile,
    setPendingFile,
    submissionType,
    setSubmissionType,
    submissionDate,
    setSubmissionDate,
    submissionReference,
    setSubmissionReference,
    lcReference,
    setLcReference,
    corporateReference,
    setCorporateReference,
    lcCurrency,
    setLcCurrency,
    applicantName,
    setApplicantName,
    drawingCurrency,
    setDrawingCurrency,
    drawingAmount,
    setDrawingAmount,
    drawingDate,
    setDrawingDate,
    tenorType,
    setTenorType,
    tenorDays,
    setTenorDays,
    billDueDate,
    setBillDueDate,
    shipmentDetails,
    setShipmentDetails,
    billOfLadingNo,
    setBillOfLadingNo,
    documentTypes,
    setDocumentTypes
  };
};
