
import React, { useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';
import FormPaneRenderer from './manual-bills/FormPaneRenderer';
import FormProgressIndicator from './manual-bills/FormProgressIndicator';
import ActionButtons from './manual-bills/ActionButtons';
import { useManualBillsForm } from '@/hooks/useManualBillsForm';

interface ManualBillsFormProps {
  onClose: () => void;
  onBack: () => void;
}

const ManualBillsForm: React.FC<ManualBillsFormProps> = ({ onClose, onBack }) => {
  const {
    currentPane,
    formData,
    updateFormData,
    nextPane,
    previousPane,
    isFirstPane,
    isLastPane,
    submitForm,
    isSubmitting
  } = useManualBillsForm();

  const paneHeaders = [
    'Submission Details',
    'LC & Applicant Details',
    'Drawing Details',
    'Shipment & Transportation',
    'Document Submission'
  ];

  const handleUpdateFormData = useCallback((updates: any) => {
    console.log('Updating form data:', updates);
    
    // Handle numeric conversions properly
    const processedUpdates = { ...updates };
    
    // Convert string numbers to actual numbers for numeric fields
    if ('lcAmount' in updates) {
      const numValue = parseFloat(updates.lcAmount);
      processedUpdates.lcAmount = isNaN(numValue) ? 0 : numValue;
    }
    
    if ('billAmount' in updates) {
      const numValue = parseFloat(updates.billAmount);
      processedUpdates.billAmount = isNaN(numValue) ? 0 : numValue;
    }
    
    updateFormData(processedUpdates);
  }, [updateFormData]);

  const getCurrentPaneIndex = () => {
    const paneOrder = ['submission-details', 'lc-applicant-details', 'drawing-details', 'shipment-transportation', 'document-submission'];
    return paneOrder.indexOf(currentPane);
  };

  const handleGoBack = () => {
    previousPane();
  };

  const handleDiscard = () => {
    onClose();
  };

  const handleSaveAsDraft = () => {
    console.log('Saving as draft:', formData);
    // TODO: Implement save as draft functionality
  };

  const handleNext = () => {
    nextPane();
  };

  const handleSubmit = () => {
    submitForm();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <DialogTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                Export LC Bills - Present Bills
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <FormProgressIndicator 
            currentPane={getCurrentPaneIndex()} 
            paneHeaders={paneHeaders}
          />
          
          <div className="flex-1 overflow-auto p-6">
            <FormPaneRenderer 
              currentPane={currentPane}
              formData={formData}
              updateFormData={handleUpdateFormData}
            />
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 p-6">
            <ActionButtons
              currentPane={getCurrentPaneIndex()}
              onGoBack={handleGoBack}
              onDiscard={handleDiscard}
              onSaveAsDraft={handleSaveAsDraft}
              onNext={handleNext}
              onSubmit={handleSubmit}
              formType="manual-bills"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManualBillsForm;
