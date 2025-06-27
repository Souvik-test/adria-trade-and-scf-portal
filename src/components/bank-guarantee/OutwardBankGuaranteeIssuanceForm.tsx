
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import OutwardBGFormActions from './OutwardBGFormActions';
import OutwardBGPaneRenderer from './OutwardBGPaneRenderer';
import OutwardBGProgressIndicator from './OutwardBGProgressIndicator';
import MT760SidebarPreview from './MT760SidebarPreview';

interface OutwardBankGuaranteeIssuanceFormProps {
  onClose: () => void;
  onBack: () => void;
}

const OutwardBankGuaranteeIssuanceForm: React.FC<OutwardBankGuaranteeIssuanceFormProps> = ({ 
  onClose, 
  onBack 
}) => {
  const [currentPane, setCurrentPane] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const panes = [
    'Guarantee Information',
    'Party Details', 
    'Amount & Terms',
    'Conditions & Clauses',
    'Documents Required',
    'Supporting Documents',
    'Review & Submit'
  ];

  const handleNext = () => {
    if (currentPane < panes.length - 1) {
      setCurrentPane(currentPane + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPane > 0) {
      setCurrentPane(currentPane - 1);
    }
  };

  const handlePaneClick = (paneIndex: number) => {
    setCurrentPane(paneIndex);
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveAsDraft = async () => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to save your request.",
          variant: "destructive",
        });
        return;
      }

      const requestData = {
        user_id: user.id,
        status: 'draft',
        // Map form data to database fields
        senders_reference: formData.sendersReference || '',
        bank_operation_code: formData.bankOperationCode || '',
        date_of_issue: formData.dateOfIssue || null,
        date_of_expiry: formData.dateOfExpiry || null,
        place_of_expiry: formData.placeOfExpiry || '',
        currency: formData.currency || 'USD',
        guarantee_amount: formData.guaranteeAmount || null,
        form_of_guarantee: formData.formOfGuarantee || '',
        applicable_rules: formData.applicableRules || 'URDG 758',
        applicant_name: formData.applicantName || '',
        applicant_address: formData.applicantAddress || '',
        applicant_account_number: formData.applicantAccountNumber || '',
        beneficiary_name: formData.beneficiaryName || '',
        beneficiary_address: formData.beneficiaryAddress || '',
        beneficiary_bank_name: formData.beneficiaryBankName || '',
        beneficiary_bank_address: formData.beneficiaryBankAddress || '',
        beneficiary_bank_swift_code: formData.beneficiaryBankSwiftCode || '',
        guarantee_details: formData.guaranteeDetails || '',
        terms_and_conditions: formData.termsAndConditions || '',
        documents_required: formData.documentsRequired || '',
        guarantee_type: formData.guaranteeType || '',
        contract_reference: formData.contractReference || '',
        underlying_contract_details: formData.underlyingContractDetails || '',
        special_instructions: formData.specialInstructions || '',
        supporting_documents: formData.supportingDocuments || []
      };

      const { error } = await supabase
        .from('outward_bg_requests')
        .insert([requestData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your Bank Guarantee request has been saved as draft.",
      });

    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscard = () => {
    if (Object.keys(formData).length > 0) {
      if (window.confirm('Are you sure you want to discard all changes? This action cannot be undone.')) {
        setFormData({});
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to submit your request.",
          variant: "destructive",
        });
        return;
      }

      const requestData = {
        user_id: user.id,
        status: 'submitted',
        // Map form data to database fields
        senders_reference: formData.sendersReference || '',
        bank_operation_code: formData.bankOperationCode || '',
        date_of_issue: formData.dateOfIssue || null,
        date_of_expiry: formData.dateOfExpiry || null,
        place_of_expiry: formData.placeOfExpiry || '',
        currency: formData.currency || 'USD',
        guarantee_amount: formData.guaranteeAmount || null,
        form_of_guarantee: formData.formOfGuarantee || '',
        applicable_rules: formData.applicableRules || 'URDG 758',
        applicant_name: formData.applicantName || '',
        applicant_address: formData.applicantAddress || '',
        applicant_account_number: formData.applicantAccountNumber || '',
        beneficiary_name: formData.beneficiaryName || '',
        beneficiary_address: formData.beneficiaryAddress || '',
        beneficiary_bank_name: formData.beneficiaryBankName || '',
        beneficiary_bank_address: formData.beneficiaryBankAddress || '',
        beneficiary_bank_swift_code: formData.beneficiaryBankSwiftCode || '',
        guarantee_details: formData.guaranteeDetails || '',
        terms_and_conditions: formData.termsAndConditions || '',
        documents_required: formData.documentsRequired || '',
        guarantee_type: formData.guaranteeType || '',
        contract_reference: formData.contractReference || '',
        underlying_contract_details: formData.underlyingContractDetails || '',
        special_instructions: formData.specialInstructions || '',
        supporting_documents: formData.supportingDocuments || []
      };

      const { error } = await supabase
        .from('outward_bg_requests')
        .insert([requestData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your Bank Guarantee issuance request has been submitted successfully.",
      });

      onClose();

    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Outward Bank Guarantee/SBLC Issuance
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Request new guarantee issuance based on MT 760 format
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Progress Indicator */}
        <OutwardBGProgressIndicator
          currentPane={currentPane}
          panes={panes}
          onPaneClick={handlePaneClick}
        />

        {/* Form Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-6">
            <OutwardBGPaneRenderer
              currentPane={currentPane}
              formData={formData}
              onFieldChange={handleFieldChange}
            />
          </div>
        </div>

        {/* Form Actions */}
        <OutwardBGFormActions
          currentPane={currentPane}
          totalPanes={panes.length}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSaveAsDraft={handleSaveAsDraft}
          onDiscard={handleDiscard}
          onSubmit={handleSubmit}
          formData={formData}
        />
      </div>

      {/* MT 760 Preview Sidebar */}
      <MT760SidebarPreview formData={formData} />
    </div>
  );
};

export default OutwardBankGuaranteeIssuanceForm;
