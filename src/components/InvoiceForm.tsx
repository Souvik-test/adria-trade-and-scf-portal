import React from 'react';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import useInvoiceForm from '@/hooks/useInvoiceForm';
import InvoiceProgressIndicator from './invoice-form/InvoiceProgressIndicator';
import InvoicePaneRenderer from './invoice-form/InvoicePaneRenderer';
import InvoiceFormActions from './invoice-form/InvoiceFormActions';
import { saveSCFInvoice, saveInvoice, searchPurchaseOrder } from '@/services/transactionService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  validateInvoiceManual, 
  fetchProgramConfiguration,
  ProgramConfiguration 
} from '@/services/invoiceManualValidationService';

interface InvoiceFormProps {
  onClose: () => void;
  onBack: () => void;
  module?: 'SCF' | 'TradeFin';
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ onClose, onBack, module = 'SCF' }) => {
  const {
    formData,
    currentStep,
    updateField,
    searchPurchaseOrder: originalSearchPO,
    addLineItem,
    updateLineItem,
    removeLineItem,
    calculateTotals,
    nextStep,
    previousStep,
    validateCurrentStep,
    validateBeforeSubmit,
    initializeForm
  } = useInvoiceForm();

  const { toast } = useToast();
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session?.user);
    };
    checkAuth();
  }, []);

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

  const handleSearchPurchaseOrder = async (poNumber: string) => {
    try {
      const poData = await searchPurchaseOrder(poNumber);
      if (poData) {
        // Update form with PO data
        updateField('purchaseOrderNumber', poData.po_number);
        updateField('purchaseOrderCurrency', poData.currency);
        updateField('purchaseOrderAmount', poData.grand_total);
        updateField('purchaseOrderDate', poData.po_date);
        
        toast({
          title: 'Purchase Order Found',
          description: `PO #${poData.po_number} details have been loaded.`,
        });
      } else {
        toast({
          title: 'Purchase Order Not Found',
          description: `No purchase order found with number: ${poNumber}`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error searching PO:', error);
      toast({
        title: 'Search Failed',
        description: 'There was an error searching for the purchase order.',
        variant: 'destructive',
      });
    }
  };

  const handleDiscard = () => {
    onBack();
  };

  const handleSaveAsDraft = () => {
    console.log('Saving as draft:', formData);
    toast({
      title: 'Draft Saved',
      description: 'Your draft has been saved locally.',
    });
  };

  const handleGoBack = () => {
    previousStep();
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to submit invoices.',
        variant: 'destructive',
      });
      return;
    }

    if (!validateCurrentStep()) {
      return;
    }

    try {
      // Fetch program configuration for validation
      const programConfig = await fetchProgramConfiguration(formData.programId);
      
      if (!programConfig) {
        toast({
          title: 'Validation Error',
          description: 'Unable to fetch program configuration. Please check the program ID.',
          variant: 'destructive',
        });
        return;
      }

      // Run comprehensive validation
      const validationResult = await validateInvoiceManual(formData, programConfig);
      
      if (!validationResult.valid) {
        // Show validation errors in dialog
        setValidationErrors(validationResult.errors);
        setShowValidationDialog(true);
        return;
      }

      // All validations passed - proceed with submission
      const result = module === 'SCF' 
        ? await saveSCFInvoice(formData)
        : await saveInvoice(formData);
      
      toast({
        title: `${formData.invoiceType === 'invoice' ? 'Invoice' : formData.invoiceType === 'credit-note' ? 'Credit Note' : 'Debit Note'} Submitted!`,
        description: `${result.invoice_number} has been successfully saved to the database.`,
      });
      onClose();
    } catch (error) {
      console.error('❌ Error submitting invoice:', error);
      console.error('📋 Form data at time of error:', JSON.stringify(formData, null, 2));
      console.error('📊 Validation errors:', validationErrors);
      console.error('🔍 Error details:', JSON.stringify(error, null, 2));
      const errorMessage = error instanceof Error ? error.message : 'There was an error saving your invoice. Please try again.';
      toast({
        title: 'Submission Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const steps = ['general', 'items', 'summary'];
  const currentStepIndex = steps.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <>
      {/* Validation Error Dialog */}
      <AlertDialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invoice Validation Failed</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p className="font-medium">The following errors must be resolved before submission:</p>
              <ul className="list-disc list-inside space-y-1 text-red-600">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowValidationDialog(false)}>
              Close
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
              searchPurchaseOrder={handleSearchPurchaseOrder}
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
    </>
  );
};

export default InvoiceForm;
