
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
  tenorDays?: string;
  billDueDate?: string;
  
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

      // Generate unique bill reference if not provided
      const billReference = formData.presentingBank || `BILL-${Date.now()}`;

      // Prepare data for insertion with proper null handling
      const insertData = {
        user_id: user.id,
        bill_reference: billReference,
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
        bill_due_date: formData.billDueDate || null,
        tenor: formData.tenor || '',
        tenor_days: formData.tenorDays ? parseInt(formData.tenorDays) : null,
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

      // Create transaction record for the dashboard
      const transactionData = {
        user_id: user.id,
        transaction_ref: data.bill_reference,
        product_type: 'EXPORT LC BILLS',
        process_type: 'PRESENT BILL',
        status: data.status,
        customer_name: data.applicant_name,
        amount: data.bill_amount,
        currency: data.bill_currency,
        created_by: user.email || 'Unknown',
        initiating_channel: 'Portal'
      };

      const { error: transactionError } = await supabase
        .from('transactions')
        .insert(transactionData);

      if (transactionError) {
        console.error('Transaction creation error:', transactionError);
      }

      // Create notification
      const notificationData = {
        user_id: user.id,
        transaction_ref: data.bill_reference,
        transaction_type: 'EXPORT LC BILLS',
        message: `Export LC Bill ${data.bill_reference} has been submitted successfully for processing.`,
        is_read: false
      };

      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notificationData);

      if (notificationError) {
        console.error('Notification creation error:', notificationError);
      }

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
