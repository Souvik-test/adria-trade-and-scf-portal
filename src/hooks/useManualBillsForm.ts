
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type ManualBillsFormPane = 
  | 'submission-details'
  | 'lc-applicant-details'
  | 'drawing-details' 
  | 'shipment-transportation'
  | 'document-submission';

interface ManualBillsFormData {
  // Submission Details
  presentationDate?: string;
  presentingBank?: string;
  notes?: string;
  
  // LC & Applicant Details
  lcReference?: string;
  corporateReference?: string;
  lcCurrency?: string;
  lcAmount?: number;
  lcExpiryPlace?: string;
  lcExpiryDate?: string;
  applicantName?: string;
  issuingBank?: string;
  
  // Drawing Details
  billAmount?: number;
  billCurrency?: string;
  billDate?: string;
  tenor?: string;
  
  // Shipment & Transportation
  portOfLoading?: string;
  portOfDischarge?: string;
  shipmentDate?: string;
  vesselName?: string;
  
  // Document Submission
  selectedDocuments?: string[];
  customDocumentName?: string;
  documents?: any[];
}

const paneOrder: ManualBillsFormPane[] = [
  'submission-details',
  'lc-applicant-details',
  'drawing-details',
  'shipment-transportation',
  'document-submission'
];

export const useManualBillsForm = () => {
  const [currentPane, setCurrentPane] = useState<ManualBillsFormPane>('submission-details');
  const [formData, setFormData] = useState<ManualBillsFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateFormData = useCallback((updates: Partial<ManualBillsFormData>) => {
    console.log('Updating form data:', updates);
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const getCurrentPaneIndex = () => paneOrder.indexOf(currentPane);

  const nextPane = useCallback(() => {
    const currentIndex = getCurrentPaneIndex();
    if (currentIndex < paneOrder.length - 1) {
      setCurrentPane(paneOrder[currentIndex + 1]);
    }
  }, [currentPane]);

  const previousPane = useCallback(() => {
    const currentIndex = getCurrentPaneIndex();
    if (currentIndex > 0) {
      setCurrentPane(paneOrder[currentIndex - 1]);
    }
  }, [currentPane]);

  const isFirstPane = getCurrentPaneIndex() === 0;
  const isLastPane = getCurrentPaneIndex() === paneOrder.length - 1;

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      console.log('Submitting Export LC Bill:', formData);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting user:', userError);
        throw new Error('Authentication error');
      }
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Prepare data for insertion - provide empty bill_reference that the trigger will replace
      const insertData = {
        user_id: user.id,
        bill_reference: '', // Empty string that will be replaced by the database trigger
        lc_reference: formData.lcReference || '',
        corporate_reference: formData.corporateReference || '',
        lc_currency: formData.lcCurrency || 'USD',
        lc_amount: formData.lcAmount || 0,
        lc_expiry_place: formData.lcExpiryPlace || '',
        lc_expiry_date: formData.lcExpiryDate || null,
        applicant_name: formData.applicantName || '',
        issuing_bank: formData.issuingBank || '',
        bill_amount: formData.billAmount || 0,
        bill_currency: formData.billCurrency || 'USD',
        bill_date: formData.billDate || null,
        submission_type: 'manual',
        status: 'submitted'
      };

      console.log('Insert data:', insertData);

      const { data, error } = await supabase
        .from('export_lc_bills')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Successfully inserted:', data);

      toast({
        title: "Success",
        description: `Export LC Bill submitted successfully. Reference: ${data.bill_reference}`,
      });

      // Reset form
      setFormData({});
      setCurrentPane('submission-details');

    } catch (error) {
      console.error('Error submitting Export LC Bill:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit Export LC Bill. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentPane,
    formData,
    updateFormData,
    nextPane,
    previousPane,
    isFirstPane,
    isLastPane,
    submitForm,
    isSubmitting
  };
};
