
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import usePOPIForm from '@/hooks/usePOPIForm';
import POPIProgressIndicator from './popi-form/POPIProgressIndicator';
import POPIPaneRenderer from './popi-form/POPIPaneRenderer';
import POPIFormActions from './popi-form/POPIFormActions';

interface POPIFormProps {
  onClose: () => void;
  onBack: () => void;
}

const POPIForm: React.FC<POPIFormProps> = ({ onClose, onBack }) => {
  const {
    formData,
    currentStep,
    updateField,
    addItem,
    updateItem,
    removeItem,
    calculateTotals,
    nextStep,
    previousStep,
    validateCurrentStep,
    initializeForm
  } = usePOPIForm();

  // Initialize form when component mounts
  useEffect(() => {
    initializeForm('purchase-order');
  }, [initializeForm]);

  // Recalculate totals when items change
  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.shippingCost, calculateTotals]);

  const handleInstrumentTypeChange = (value: 'purchase-order' | 'proforma-invoice') => {
    initializeForm(value);
  };

  const handleDiscard = () => {
    onBack();
  };

  const handleSaveAsDraft = () => {
    console.log('Saving as draft:', formData);
    // TODO: Implement save as draft functionality
  };

  const handleGoBack = () => {
    previousStep();
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  const handleSubmit = () => {
    if (validateCurrentStep()) {
      console.log('Submitting form:', formData);
      // TODO: Implement form submission
      onClose();
    }
  };

  const steps = ['general', 'items', 'summary'];
  const currentStepIndex = steps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-screen max-h-screen w-full h-full overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
                {formData.instrumentType === 'purchase-order' 
                  ? 'Create Purchase Order' 
                  : 'Create Pro-forma Invoice'
                }
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Instrument Type Selection */}
            <div className="mb-8">
              <Label htmlFor="instrumentType" className="text-base font-medium">
                Instrument Type *
              </Label>
              <Select
                value={formData.instrumentType}
                onValueChange={handleInstrumentTypeChange}
                disabled={currentStep !== 'general'}
              >
                <SelectTrigger className="mt-2 max-w-xs">
                  <SelectValue placeholder="Select instrument type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase-order">Purchase Order</SelectItem>
                  <SelectItem value="proforma-invoice">Pro-forma Invoice</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Progress Indicator */}
            <POPIProgressIndicator 
              currentStep={currentStep}
              instrumentType={formData.instrumentType}
            />

            {/* Form Content */}
            <POPIPaneRenderer
              currentStep={currentStep}
              formData={formData}
              updateField={updateField}
              addItem={addItem}
              updateItem={updateItem}
              removeItem={removeItem}
            />

            {/* Form Actions */}
            <POPIFormActions
              currentStep={currentStep}
              onDiscard={handleDiscard}
              onSaveAsDraft={handleSaveAsDraft}
              onGoBack={handleGoBack}
              onNext={handleNext}
              onSubmit={handleSubmit}
              canProceed={validateCurrentStep()}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default POPIForm;
