
import React from 'react';
import useImportLCForm from '@/hooks/useImportLCForm';
import ImportLCProgressIndicator from './ImportLCProgressIndicator';
import ImportLCPaneRenderer from './ImportLCPaneRenderer';
import ImportLCFormActions from './ImportLCFormActions';
import MT700SidebarPreview from './MT700SidebarPreview';
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from '@/services/customAuth';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ImportLCFormProps {
  onBack: () => void;
  onClose: () => void;
}

const ImportLCForm: React.FC<ImportLCFormProps> = ({ onBack, onClose }) => {
  const { toast } = useToast();
  const {
    formData,
    currentStep,
    updateField,
    goToStep,
    nextStep,
    previousStep,
    validateCurrentStep,
    submitForm,
    resetForm
  } = useImportLCForm();

  const handleSubmit = async () => {
    try {
      console.log('Starting form submission...');
      await submitForm();
      toast({
        title: "Success",
        description: "Import LC request submitted successfully",
      });
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit Import LC request",
        variant: "destructive",
      });
    }
  };

  const handleSaveDraft = async () => {
    try {
      console.log('Starting draft save...');
      const user = customAuth.getSession()?.user;
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Sync party data to legacy fields for database compatibility
      const applicantParty = formData.parties.find(p => p.role === 'applicant');
      const beneficiaryParty = formData.parties.find(p => p.role === 'beneficiary');
      const advisingBankParty = formData.parties.find(p => p.role === 'advising_bank');

      // Proper boolean conversion - handle both boolean and string values
      const partialShipmentsAllowed = Boolean(formData.partialShipmentsAllowed);
      const transshipmentAllowed = Boolean(formData.transshipmentAllowed);

      console.log('Form data being saved:', {
        user_id: user.id,
        partialShipmentsAllowed,
        transshipmentAllowed,
        formData
      });

      const { error } = await supabase
        .from('import_lc_requests')
        .insert({
          user_id: user.id,
          popi_number: formData.popiNumber,
          popi_type: formData.popiType,
          form_of_documentary_credit: formData.formOfDocumentaryCredit,
          corporate_reference: formData.corporateReference,
          applicable_rules: formData.applicableRules,
          lc_type: formData.lcType,
          issue_date: formData.issueDate || null,
          expiry_date: formData.expiryDate || null,
          place_of_expiry: formData.placeOfExpiry,
          applicant_name: applicantParty?.name || formData.applicantName,
          applicant_address: applicantParty?.address || formData.applicantAddress,
          applicant_account_number: applicantParty?.accountNumber || formData.applicantAccountNumber,
          beneficiary_name: beneficiaryParty?.name || formData.beneficiaryName,
          beneficiary_address: beneficiaryParty?.address || formData.beneficiaryAddress,
          beneficiary_bank_name: formData.beneficiaryBankName,
          beneficiary_bank_address: formData.beneficiaryBankAddress,
          beneficiary_bank_swift_code: beneficiaryParty?.swiftCode || formData.beneficiaryBankSwiftCode,
          advising_bank_swift_code: advisingBankParty?.swiftCode || formData.advisingBankSwiftCode,
          lc_amount: formData.lcAmount,
          currency: formData.currency,
          tolerance: formData.tolerance,
          additional_amount: formData.additionalAmount,
          available_with: formData.availableWith,
          available_by: formData.availableBy,
          partial_shipments_allowed: partialShipmentsAllowed,
          transshipment_allowed: transshipmentAllowed,
          description_of_goods: formData.descriptionOfGoods,
          port_of_loading: formData.portOfLoading,
          port_of_discharge: formData.portOfDischarge,
          latest_shipment_date: formData.latestShipmentDate || null,
          presentation_period: formData.presentationPeriod,
          required_documents: formData.documentRequirements.length > 0 
            ? formData.documentRequirements.map(doc => `${doc.name} - ${doc.original} Original${doc.original > 1 ? 's' : ''}, ${doc.copies} Cop${doc.copies === 1 ? 'y' : 'ies'}`)
            : formData.requiredDocuments,
          additional_conditions: formData.additionalConditions,
          status: 'draft'
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      console.log('Draft saved successfully');
      toast({
        title: "Success",
        description: "Draft saved successfully",
      });
    } catch (error) {
      console.error('Save draft error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save draft",
        variant: "destructive",
      });
    }
  };

  const handleDiscard = () => {
    if (window.confirm('Are you sure you want to discard all changes? This action cannot be undone.')) {
      resetForm();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-800 flex h-screen w-screen overflow-hidden">
      {/* Main Form Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Progress */}
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-600 pb-4 mb-6 px-6 pt-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Request ILC Issuance
            </h2>
          </div>
          
          <ImportLCProgressIndicator
            currentStep={currentStep}
            onStepClick={goToStep}
            formData={formData}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden px-6">
          <ScrollArea className="h-full">
            <ImportLCPaneRenderer
              currentStep={currentStep}
              formData={formData}
              updateField={updateField}
            />
          </ScrollArea>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 px-6 pb-6">
          <ImportLCFormActions
            currentStep={currentStep}
            isValid={validateCurrentStep()}
            onPrevious={previousStep}
            onNext={nextStep}
            onSaveDraft={handleSaveDraft}
            onSubmit={handleSubmit}
            onDiscard={handleDiscard}
            onClose={onClose}
            onBack={onBack}
          />
        </div>
      </div>

      {/* MT 700 Sidebar Preview */}
      <MT700SidebarPreview formData={formData} />
    </div>
  );
};

export default ImportLCForm;
