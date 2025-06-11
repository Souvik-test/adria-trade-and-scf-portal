
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import useInvoiceForm from '@/hooks/useInvoiceForm';
import InvoiceProgressIndicator from './invoice-form/InvoiceProgressIndicator';
import InvoicePaneRenderer from './invoice-form/InvoicePaneRenderer';
import InvoiceFormActions from './invoice-form/InvoiceFormActions';

interface InvoiceFormProps {
  onClose: () => void;
  onBack: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onClose, onBack }) => {
  const {
    formData,
    currentStep,
    updateField,
    addLineItem,
    updateLineItem,
    removeLineItem,
    calculateTotals,
    nextStep,
    previousStep,
    validateCurrentStep,
    initializeForm
  } = useInvoiceForm();

  // Initialize form when component mounts
  useEffect(() => {
    initializeForm('invoice');
  }, [initializeForm]);

  // Recalculate totals when line items change
  useEffect(() => {
    calculateTotals();
  }, [formData.lineItems, formData.discountAmount, calculateTotals]);

  const handleInvoiceTypeChange = (value: 'invoice' | 'credit-note' | 'debit-note') => {
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
      console.log('Submitting invoice:', formData);
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
                {formData.invoiceType === 'invoice' 
                  ? 'Create Invoice' 
                  : formData.invoiceType === 'credit-note'
                    ? 'Create Credit Note'
                    : 'Create Debit Note'
                }
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Invoice Type Selection */}
            <div className="mb-8">
              <Label htmlFor="invoiceType" className="text-base font-medium">
                Invoice Type *
              </Label>
              <Select
                value={formData.invoiceType}
                onValueChange={handleInvoiceTypeChange}
                disabled={currentStep !== 'general'}
              >
                <SelectTrigger className="mt-2 max-w-xs">
                  <SelectValue placeholder="Select invoice type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoice">Invoice</SelectItem>
                  <SelectItem value="credit-note">Credit Note</SelectItem>
                  <SelectItem value="debit-note">Debit Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Progress Indicator */}
            <InvoiceProgressIndicator 
              currentStep={currentStep}
              invoiceType={formData.invoiceType}
            />

            {/* Form Content */}
            <InvoicePaneRenderer
              currentStep={currentStep}
              formData={formData}
              updateField={updateField}
              addLineItem={addLineItem}
              updateLineItem={updateLineItem}
              removeLineItem={removeLineItem}
            />

            {/* Form Actions */}
            <InvoiceFormActions
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

export default InvoiceForm;
