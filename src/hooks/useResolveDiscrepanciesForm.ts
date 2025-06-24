
import { useState } from 'react';
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
  
  // General Details state
  const [billReference, setBillReference] = useState('');
  const [lcReference, setLcReference] = useState('');
  const [corporateReference, setCorporateReference] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [issuingBank, setIssuingBank] = useState('');
  const [discrepancyNotificationDate, setDiscrepancyNotificationDate] = useState('');
  
  // Discrepancy Details state
  const [discrepancyType, setDiscrepancyType] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [discrepancyDescription, setDiscrepancyDescription] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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

    if (!billReference.trim()) {
      errors.push('Bill Reference Number is required');
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const submitForm = async () => {
    console.log('Starting form submission...');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return false;
    }

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

      console.log('User authenticated:', user.id);

      // Prepare data for insertion
      const insertData = {
        user_id: user.id,
        bill_reference: billReference.trim(),
        lc_reference: lcReference?.trim() || null,
        corporate_reference: corporateReference?.trim() || null,
        applicant_name: applicantName?.trim() || null,
        issuing_bank: issuingBank?.trim() || null,
        discrepancy_notification_date: discrepancyNotificationDate || null,
        discrepancy_type: discrepancyType?.trim() || null,
        document_type: documentType?.trim() || null,
        discrepancy_description: discrepancyDescription?.trim() || null,
        resolution_status: resolutionStatus?.trim() || null,
        document_reupload_required: documentReuploadRequired?.trim() || null,
        resolution_remarks: resolutionRemarks?.trim() || null,
        status: 'submitted'
      };

      console.log('Submitting resolve discrepancies data:', insertData);

      const { data, error } = await supabase
        .from('resolve_discrepancies')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Successfully inserted resolve discrepancies:', data);

      // Create transaction record for the dashboard
      const transactionData = {
        user_id: user.id,
        transaction_ref: billReference,
        product_type: 'RESOLVE DISCREPANCIES',
        process_type: 'DISCREPANCY RESOLUTION',
        status: 'submitted',
        customer_name: applicantName || null,
        amount: null,
        currency: 'USD',
        created_by: user.email || 'Unknown',
        initiating_channel: 'Portal'
      };

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert(transactionData);

      if (transactionError) {
        console.error('Transaction creation error:', transactionError);
        // Don't fail the main submission for transaction error
      }

      toast({
        title: "Success",
        description: `Discrepancy resolution submitted successfully for Bill Reference: ${billReference}`,
      });

      // Reset form
      setBillReference('');
      setLcReference('');
      setCorporateReference('');
      setApplicantName('');
      setIssuingBank('');
      setDiscrepancyNotificationDate('');
      setDiscrepancyType('');
      setDocumentType('');
      setDiscrepancyDescription('');
      setResolutionStatus('');
      setDocumentReuploadRequired('');
      setResolutionRemarks('');
      setSelectedDocuments([]);
      setUploadedDocuments([]);
      setCurrentPane(0);
      setValidationErrors([]);

      return true;
    } catch (error) {
      console.error('Error submitting resolve discrepancies:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit discrepancy resolution. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
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
    
    // Functions
    validateForm,
    submitForm
  };
};
