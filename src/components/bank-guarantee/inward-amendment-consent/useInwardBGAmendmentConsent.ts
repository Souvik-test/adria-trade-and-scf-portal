
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useInwardBGAmendmentConsent = () => {
  const { toast } = useToast();

  const submitAmendmentConsent = async (
    consentData: {
      guaranteeReference: string;
      amendmentNumber: string;
      consentAction: 'accept' | 'refuse';
      individualConsents: Record<string, boolean>;
      rejectionReason?: string;
      applicantName?: string;
      issuingBank?: string;
      guaranteeAmount?: string;
      currency?: string;
      issueDate?: string;
      expiryDate?: string;
      beneficiaryName?: string;
    }
  ) => {
    try {
      const { data, error } = await supabase
        .from('inward_bg_amendment_consents')
        .insert({
          guarantee_reference: consentData.guaranteeReference,
          amendment_number: consentData.amendmentNumber,
          consent_action: consentData.consentAction,
          individual_consents: consentData.individualConsents,
          rejection_reason: consentData.rejectionReason,
          applicant_name: consentData.applicantName,
          issuing_bank: consentData.issuingBank,
          guarantee_amount: consentData.guaranteeAmount,
          currency: consentData.currency,
          issue_date: consentData.issueDate,
          expiry_date: consentData.expiryDate,
          beneficiary_name: consentData.beneficiaryName,
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: `Amendment consent ${consentData.consentAction}ed successfully`,
        variant: "default"
      });

      return data;
    } catch (error) {
      console.error('Error submitting amendment consent:', error);
      toast({
        title: "Error",
        description: "Failed to submit amendment consent",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    submitAmendmentConsent
  };
};
