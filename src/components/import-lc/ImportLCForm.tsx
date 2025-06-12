
import React from 'react';
import useImportLCForm from '@/hooks/useImportLCForm';
import ImportLCProgressIndicator from './ImportLCProgressIndicator';
import ImportLCPaneRenderer from './ImportLCPaneRenderer';
import ImportLCFormActions from './ImportLCFormActions';

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
    <div className="flex flex-col h-full max-h-[75vh]">
      {/* Header with Progress */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-600 pb-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Request ILC Issuance
          </h2>
          <button
            onClick={onBack}
            className="text-corporate-blue hover:underline text-sm font-medium"
          >
            ← Back to Methods
          </button>
        </div>
        
        <ImportLCProgressIndicator
          currentStep={currentStep}
          onStepClick={goToStep}
          formData={formData}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ImportLCPaneRenderer
          currentStep={currentStep}
          formData={formData}
          updateField={updateField}
        />
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
        <ImportLCFormActions
          currentStep={currentStep}
          isValid={validateCurrentStep()}
          onPrevious={previousStep}
          onNext={nextStep}
          onSaveDraft={() => console.log('Save draft')}
          onSubmit={() => console.log('Submit')}
          onDiscard={() => console.log('Discard')}
          onClose={onClose}
        />
      </div>
    </div>
  );
};

export default ImportLCForm;
