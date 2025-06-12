
import React from 'react';
import useImportLCForm from '@/hooks/useImportLCForm';
import ImportLCProgressIndicator from './ImportLCProgressIndicator';
import ImportLCPaneRenderer from './ImportLCPaneRenderer';
import ImportLCFormActions from './ImportLCFormActions';
import MT700SidebarPreview from './MT700SidebarPreview';

interface ImportLCFormProps {
  onBack: () => void;
  onClose: () => void;
}

const ImportLCForm: React.FC<ImportLCFormProps> = ({ onBack, onClose }) => {
  const {
    formData,
    currentStep,
    updateField,
    goToStep,
    nextStep,
    previousStep,
    validateCurrentStep
  } = useImportLCForm();

  return (
    <div className="flex h-full w-full">
      {/* Main Form Content */}
      <div className="flex-1 flex flex-col max-h-screen overflow-hidden">
        {/* Header with Progress */}
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-600 pb-4 mb-6 px-6 pt-6">
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
            onSaveDraft={() => console.log('Save draft')}
            onSubmit={() => console.log('Submit')}
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
