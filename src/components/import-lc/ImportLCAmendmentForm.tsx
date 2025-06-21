
import React, { useState } from 'react';
import { ImportLCFormData } from '@/types/importLC';
import ImportLCAmendmentPanes from './ImportLCAmendmentPanes';
import ImportLCAmendmentActions from './ImportLCAmendmentActions';
import ImportLCAmendmentProgress from './ImportLCAmendmentProgress';
import MT707SidebarPreview from './MT707SidebarPreview';
import AmendmentChangesSummaryModal from './AmendmentChangesSummaryModal';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import useImportLCAmendmentForm from '@/hooks/useImportLCAmendmentForm';

interface ImportLCAmendmentFormProps {
  onBack: () => void;
  onClose: () => void;
}

const ImportLCAmendmentForm: React.FC<ImportLCAmendmentFormProps> = ({ onBack, onClose }) => {
  const { toast } = useToast();
  const [showChangesSummary, setShowChangesSummary] = useState(false);
  
  const {
    formData,
    originalData,
    currentStep,
    changes,
    updateField,
    goToStep,
    nextStep,
    previousStep,
    validateCurrentStep,
    submitAmendment,
    saveDraft,
    resetForm
  } = useImportLCAmendmentForm();

  const handleSubmit = async () => {
    try {
      console.log('Starting amendment submission...');
      await submitAmendment();
      toast({
        title: "Success",
        description: "Amendment request submitted successfully",
      });
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit amendment request",
        variant: "destructive",
      });
    }
  };

  const handleSaveDraft = async () => {
    try {
      console.log('Starting draft save...');
      await saveDraft();
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
              Request ILC Amendment
            </h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {Object.keys(changes).length} change{Object.keys(changes).length !== 1 ? 's' : ''} detected
              </span>
              <button
                onClick={() => setShowChangesSummary(true)}
                className="text-sm text-corporate-blue hover:underline"
                disabled={Object.keys(changes).length === 0}
              >
                View Changes
              </button>
            </div>
          </div>
          
          <ImportLCAmendmentProgress
            currentStep={currentStep}
            onStepClick={goToStep}
            formData={formData}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden px-6">
          <ScrollArea className="h-full">
            <ImportLCAmendmentPanes
              currentStep={currentStep}
              formData={formData}
              originalData={originalData}
              changes={changes}
              updateField={updateField}
            />
          </ScrollArea>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 px-6 pb-6">
          <ImportLCAmendmentActions
            currentStep={currentStep}
            isValid={isCurrentStepValid()}
            changesCount={Object.keys(changes).length}
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

      {/* MT 707 Sidebar Preview */}
      <MT707SidebarPreview formData={formData} originalData={originalData} changes={changes} />

      {/* Changes Summary Modal */}
      {showChangesSummary && (
        <AmendmentChangesSummaryModal
          open={showChangesSummary}
          onClose={() => setShowChangesSummary(false)}
          changes={changes}
          formData={formData}
          originalData={originalData}
        />
      )}
    </div>
  );
};

export default ImportLCAmendmentForm;
