
import React from 'react';
import useImportLCForm from '@/hooks/useImportLCForm';
import ImportLCProgressIndicator from './ImportLCProgressIndicator';
import ImportLCPaneRenderer from './ImportLCPaneRenderer';
import ImportLCFormActions from './ImportLCFormActions';
import MT700SidebarPreview from './MT700SidebarPreview';
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from '@/services/customAuth';
import { useToast } from '@/hooks/use-toast';

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
    submitForm
  } = useImportLCForm();

  const handleSubmit = async () => {
    try {
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
        description: "Failed to submit Import LC request",
        variant: "destructive",
      });
    }
  };

  const handleSaveDraft = async () => {
    try {
      const user = customAuth.getSession()?.user;
      if (!user) {
        throw new Error('User not authenticated');
      }

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
          applicant_name: formData.applicantName,
          applicant_address: formData.applicantAddress,
          applicant_account_number: formData.applicantAccountNumber,
          beneficiary_name: formData.beneficiaryName,
          beneficiary_address: formData.beneficiaryAddress,
          beneficiary_bank_name: formData.beneficiaryBankName,
          beneficiary_bank_address: formData.beneficiaryBankAddress,
          beneficiary_bank_swift_code: formData.beneficiaryBankSwiftCode,
          advising_bank_swift_code: formData.advisingBankSwiftCode,
          lc_amount: formData.lcAmount,
          currency: formData.currency,
          tolerance: formData.tolerance,
          additional_amount: formData.additionalAmount,
          available_with: formData.availableWith,
          available_by: formData.availableBy,
          partial_shipments_allowed: formData.partialShipmentsAllowed,
          transshipment_allowed: formData.transshipmentAllowed,
          description_of_goods: formData.descriptionOfGoods,
          port_of_loading: formData.portOfLoading,
          port_of_discharge: formData.portOfDischarge,
          latest_shipment_date: formData.latestShipmentDate || null,
          presentation_period: formData.presentationPeriod,
          required_documents: formData.requiredDocuments,
          additional_conditions: formData.additionalConditions,
          status: 'draft'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Draft saved successfully",
      });
    } catch (error) {
      console.error('Save draft error:', error);
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-full w-full">
      {/* Main Form Content */}
      <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
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
          <ImportLCPaneRenderer
            currentStep={currentStep}
            formData={formData}
            updateField={updateField}
          />
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
            onDiscard={() => console.log('Discard')}
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
