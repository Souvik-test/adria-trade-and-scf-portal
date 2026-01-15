
import React, { useState, useEffect, useCallback } from 'react';
import useImportLCForm from '@/hooks/useImportLCForm';
import useBusinessValidation from '@/hooks/useBusinessValidation';
import ImportLCProgressIndicator from './ImportLCProgressIndicator';
import ImportLCPaneRenderer from './ImportLCPaneRenderer';
import ImportLCFormActions from './ImportLCFormActions';
import MT700SidebarPreview from './MT700SidebarPreview';
import SaveTemplateDialog from './SaveTemplateDialog';
import ValidationResultsDialog from './ValidationResultsDialog';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { getPaneSectionConfig } from '@/services/paneSectionService';
import { PaneConfig } from '@/types/dynamicForm';

interface ImportLCFormProps {
  onBack: () => void;
  onClose: () => void;
}

const ImportLCForm: React.FC<ImportLCFormProps> = ({ onBack, onClose }) => {
  const { toast } = useToast();
  const [saveTemplateOpen, setSaveTemplateOpen] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [paneConfig, setPaneConfig] = useState<PaneConfig[]>([]);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<'next' | 'submit' | null>(null);
  
  const { validationResult, isValidating, runValidation, clearValidation } = useBusinessValidation();
  
  // Determine context based on businessCentre
  const businessCentre = localStorage.getItem('businessCentre') || '';
  const isBankContext = businessCentre.includes('Orchestrator') || businessCentre.includes('Bank');
  
  const {
    formData,
    currentStep,
    updateField,
    goToStep,
    nextStep,
    previousStep,
    validateCurrentStep,
    submitForm,
    saveDraft,
    resetForm
  } = useImportLCForm(isBankContext);

  // Get user ID on mount
  useEffect(() => {
    const fetchUserId = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return;
      
      const { data: userData } = await supabase
        .from('custom_users')
        .select('id')
        .eq('user_id', data.user.id)
        .single();
      
      if (userData) setUserId(userData.id);
    };
    fetchUserId();
  }, []);

  // Load pane configuration
  useEffect(() => {
    const loadPaneConfig = async () => {
      const config = await getPaneSectionConfig('ILC', 'ISSUANCE');
      setPaneConfig(config);
    };
    loadPaneConfig();
  }, []);

  // Get current pane's showSwiftPreview setting
  const currentPaneConfig = paneConfig[currentStep];
  const showSwiftPreview = currentPaneConfig?.showSwiftPreview !== false;

  // Run business validation before navigation
  const handleNextWithValidation = useCallback(async () => {
    // Run business validation
    const result = await runValidation('ILC', 'ISS', formData);
    
    // If there are any validation messages, show the dialog
    if (result.hasErrors || result.hasWarnings || result.information.length > 0) {
      setPendingNavigation('next');
      setValidationDialogOpen(true);
    } else {
      // No validation issues, proceed directly
      nextStep();
    }
  }, [formData, runValidation, nextStep]);

  // Handle submit with validation
  const handleSubmitWithValidation = useCallback(async () => {
    // Run business validation
    const result = await runValidation('ILC', 'ISS', formData);
    
    // If there are any validation messages, show the dialog
    if (result.hasErrors || result.hasWarnings || result.information.length > 0) {
      setPendingNavigation('submit');
      setValidationDialogOpen(true);
    } else {
      // No validation issues, proceed directly
      await performSubmit();
    }
  }, [formData, runValidation]);

  const performSubmit = async () => {
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

  // Handle proceeding after validation dialog
  const handleValidationProceed = useCallback(() => {
    setValidationDialogOpen(false);
    clearValidation();
    
    if (pendingNavigation === 'next') {
      nextStep();
    } else if (pendingNavigation === 'submit') {
      performSubmit();
    }
    setPendingNavigation(null);
  }, [pendingNavigation, nextStep, clearValidation]);

  // Handle canceling after validation dialog
  const handleValidationCancel = useCallback(() => {
    setValidationDialogOpen(false);
    clearValidation();
    setPendingNavigation(null);
  }, [clearValidation]);

  const handleSaveDraft = async () => {
    try {
      console.log('Starting draft save...');
      await saveDraft();
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

  // Ensure validateCurrentStep returns a boolean
  const isCurrentStepValid = () => {
    const result = validateCurrentStep();
    return Boolean(result);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-800 flex h-screen w-screen overflow-hidden">
      {/* Main Form Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Progress */}
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-600 pb-4 mb-6 px-6 pt-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {isBankContext ? 'Initiate LC Issuance' : 'Request ILC Issuance'}
            </h2>
          </div>
          
          <ImportLCProgressIndicator
            currentStep={currentStep}
            onStepClick={goToStep}
            formData={formData}
            isBankContext={isBankContext}
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
            isValid={isCurrentStepValid() && !isValidating}
            onPrevious={previousStep}
            onNext={handleNextWithValidation}
            onSaveDraft={handleSaveDraft}
            onSaveTemplate={() => setSaveTemplateOpen(true)}
            onSubmit={handleSubmitWithValidation}
            onDiscard={handleDiscard}
            onClose={onClose}
            onBack={onBack}
            isBankContext={isBankContext}
          />
        </div>
      </div>

      {/* MT 700 Sidebar Preview */}
      <MT700SidebarPreview formData={formData} visible={showSwiftPreview} />

      {/* Save Template Dialog */}
      <SaveTemplateDialog
        open={saveTemplateOpen}
        onOpenChange={setSaveTemplateOpen}
        formData={formData}
        userId={userId}
      />

      {/* Validation Results Dialog */}
      <ValidationResultsDialog
        open={validationDialogOpen}
        onOpenChange={setValidationDialogOpen}
        validationResult={validationResult}
        onProceed={handleValidationProceed}
        onCancel={handleValidationCancel}
      />
    </div>
  );
};

export default ImportLCForm;
