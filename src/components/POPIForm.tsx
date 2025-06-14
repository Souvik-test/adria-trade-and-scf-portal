
import React, { useEffect } from 'react';
import usePOPIForm from '@/hooks/usePOPIForm';
import POPIPaneRenderer from './popi-form/POPIPaneRenderer';
import POPIProgressIndicator from './popi-form/POPIProgressIndicator';
import POPIFormActions from './popi-form/POPIFormActions';
import { savePurchaseOrder, saveProformaInvoice } from '@/services/transactionService';
import { useToast } from '@/hooks/use-toast';

interface POPIFormProps {
  onClose?: () => void;
}

const POPIForm: React.FC<POPIFormProps> = ({ onClose }) => {
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

  const { toast } = useToast();

  // Initialize the form on mount
  useEffect(() => {
    initializeForm(formData.instrumentType || 'purchase-order');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    calculateTotals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.items, formData.shippingCost]);

  const steps = ['general', 'items', 'summary'];
  const currentStepIndex = steps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleGoBack = () => {
    previousStep();
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  const handleDiscard = () => {
    if (onClose) onClose();
  };

  const handleSaveAsDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your draft has been saved locally.",
    });
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    try {
      if (formData.instrumentType === 'purchase-order') {
        await savePurchaseOrder(formData);
        toast({
          title: "Purchase Order Saved",
          description: `PO ${formData.poNumber || ''} has been successfully submitted.`,
        });
      } else {
        await saveProformaInvoice(formData);
        toast({
          title: "Proforma Invoice Saved",
          description: `PI ${formData.piNumber || ''} has been successfully submitted.`,
        });
      }
      if (onClose) onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "An error occurred while saving.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      {/* Progress Indicator */}
      <POPIProgressIndicator
        currentStep={currentStep}
        instrumentType={formData.instrumentType}
      />

      {/* Step Content */}
      <div className="flex-1 overflow-auto">
        <POPIPaneRenderer
          currentStep={currentStep}
          formData={formData}
          updateField={updateField}
          addItem={addItem}
          updateItem={updateItem}
          removeItem={removeItem}
        />
      </div>

      {/* Step Actions */}
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
  );
};

export default POPIForm;

// NOTE: This file is now getting too long! You should consider asking me to refactor POPIForm into smaller files after this.
