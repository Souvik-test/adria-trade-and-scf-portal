
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export type ManualBillsFormPane = 
  | 'lc-applicant-details'
  | 'drawing-details' 
  | 'shipment-transportation'
  | 'submission-details'
  | 'document-submission';

interface ManualBillsFormData {
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
  
  // Submission Details
  presentationDate?: string;
  presentingBank?: string;
  notes?: string;
  
  // Document Submission
  documents?: any[];
}

const paneOrder: ManualBillsFormPane[] = [
  'lc-applicant-details',
  'drawing-details',
  'shipment-transportation', 
  'submission-details',
  'document-submission'
];

export const useManualBillsForm = () => {
  const [currentPane, setCurrentPane] = useState<ManualBillsFormPane>('lc-applicant-details');
  const [formData, setFormData] = useState<ManualBillsFormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const updateFormData = useCallback((updates: Partial<ManualBillsFormData>) => {
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('export_lc_bills')
        .insert({
          user_id: user.id,
          lc_reference: formData.lcReference || '',
          corporate_reference: formData.corporateReference,
          lc_currency: formData.lcCurrency,
          lc_amount: formData.lcAmount,
          lc_expiry_place: formData.lcExpiryPlace,
          lc_expiry_date: formData.lcExpiryDate,
          applicant_name: formData.applicantName,
          issuing_bank: formData.issuingBank,
          bill_amount: formData.billAmount,
          bill_currency: formData.billCurrency,
          bill_date: formData.billDate,
          submission_type: 'manual',
          status: 'submitted'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Export LC Bill submitted successfully. Reference: ${data.bill_reference}`,
      });

      // Reset form
      setFormData({});
      setCurrentPane('lc-applicant-details');

    } catch (error) {
      console.error('Error submitting Export LC Bill:', error);
      toast({
        title: "Error",
        description: "Failed to submit Export LC Bill. Please try again.",
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
