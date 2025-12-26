
import React, { useState, useEffect } from 'react';
import useImportLCForm from '@/hooks/useImportLCForm';
import ImportLCProgressIndicator from './ImportLCProgressIndicator';
import ImportLCPaneRenderer from './ImportLCPaneRenderer';
import ImportLCFormActions from './ImportLCFormActions';
import MT700SidebarPreview from './MT700SidebarPreview';
import SaveTemplateDialog from './SaveTemplateDialog';
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
  } = useImportLCForm();

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
            isValid={isCurrentStepValid()}
            onPrevious={previousStep}
            onNext={nextStep}
            onSaveDraft={handleSaveDraft}
            onSaveTemplate={() => setSaveTemplateOpen(true)}
            onSubmit={handleSubmit}
            onDiscard={handleDiscard}
            onClose={onClose}
            onBack={onBack}
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
    </div>
  );
};

export default ImportLCForm;
