import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  OutwardRemittanceFormData,
  PaymentHeader,
  OrderingCustomer,
  BeneficiaryCustomer,
  AmountCharges,
  RoutingSettlement,
  RegulatoryCompliance,
  RemittanceInfo,
  initialOutwardRemittanceFormData,
  generateUUID,
  generateMessageRef,
  validateBIC,
  CustomerCreditTransferStep,
  CUSTOMER_CREDIT_TRANSFER_STEPS,
  CUSTOMER_CREDIT_TRANSFER_STEP_LABELS,
} from '@/types/internationalRemittance';
import {
  PaymentHeaderPane,
  OrderingCustomerPane,
  BeneficiaryCustomerPane,
  AmountChargesPane,
  RoutingSettlementPane,
  RegulatoryCompliancePane,
  RemittanceInfoPane,
} from './panes';
import RemittanceProgressIndicator from './RemittanceProgressIndicator';
import RemittanceFormActions from './RemittanceFormActions';
import ISO20022Sidebar from './ISO20022Sidebar';
import { getCurrentUserAsync } from '@/services/database';
import { saveRemittanceTransaction, submitRemittanceForApproval, approveRemittanceTransaction, rejectRemittanceTransaction } from '@/services/remittanceService';

interface OutwardRemittanceFormProps {
  readOnly?: boolean;
  isApprovalStage?: boolean;
  transactionId?: string; // For editing existing transactions
  onStageComplete?: () => void;
  onApprove?: () => void;
  onReject?: (reason?: string) => void;
}

const OutwardRemittanceForm: React.FC<OutwardRemittanceFormProps> = ({
  readOnly = false,
  isApprovalStage = false,
  transactionId,
  onStageComplete,
  onApprove,
  onReject,
}) => {
  const [formData, setFormData] = useState<OutwardRemittanceFormData>(initialOutwardRemittanceFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [savedTransactionId, setSavedTransactionId] = useState<string | undefined>(transactionId);
  const [currentStep, setCurrentStep] = useState<CustomerCreditTransferStep>('payment-header');

  const currentStepIndex = CUSTOMER_CREDIT_TRANSFER_STEPS.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === CUSTOMER_CREDIT_TRANSFER_STEPS.length - 1;

  // Auto-generate read-only fields on mount
  useEffect(() => {
    const now = new Date().toISOString();
    setFormData((prev) => ({
      ...prev,
      paymentHeader: { ...prev.paymentHeader, msgRef: generateMessageRef(), uetr: generateUUID(), creDt: now },
    }));
  }, []);

  // Navigation
  const goToStep = (step: CustomerCreditTransferStep) => setCurrentStep(step);
  const nextStep = () => { if (!isLastStep) setCurrentStep(CUSTOMER_CREDIT_TRANSFER_STEPS[currentStepIndex + 1]); };
  const previousStep = () => { if (!isFirstStep) setCurrentStep(CUSTOMER_CREDIT_TRANSFER_STEPS[currentStepIndex - 1]); };

  const getStepStatus = (step: CustomerCreditTransferStep): 'completed' | 'current' | 'pending' => {
    const stepIndex = CUSTOMER_CREDIT_TRANSFER_STEPS.indexOf(step);
    if (step === currentStep) return 'current';
    if (stepIndex < currentStepIndex) return 'completed';
    return 'pending';
  };

  // Update handlers
  const updatePaymentHeader = (field: keyof PaymentHeader, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, paymentHeader: { ...prev.paymentHeader, [field]: value } }));
  };

  const updateOrderingCustomer = (field: keyof OrderingCustomer, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, orderingCustomer: { ...prev.orderingCustomer, [field]: value } }));
  };

  const updateBeneficiaryCustomer = (field: keyof BeneficiaryCustomer, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, beneficiaryCustomer: { ...prev.beneficiaryCustomer, [field]: value } }));
  };

  const updateAmountCharges = (field: keyof AmountCharges, value: string | number) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, amountCharges: { ...prev.amountCharges, [field]: value } }));
  };

  const updateRoutingSettlement = (field: keyof RoutingSettlement, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, routingSettlement: { ...prev.routingSettlement, [field]: value } }));
  };

  const updateRegulatoryCompliance = (field: keyof RegulatoryCompliance, value: string | boolean) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, regulatoryCompliance: { ...prev.regulatoryCompliance, [field]: value } }));
  };

  const updateRemittanceInfo = (field: keyof RemittanceInfo, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, remittanceInfo: { ...prev.remittanceInfo, [field]: value } }));
  };

  // Validation per step
  const validateCurrentStep = (): boolean => {
    const { paymentHeader, orderingCustomer, beneficiaryCustomer, amountCharges, routingSettlement, regulatoryCompliance } = formData;
    switch (currentStep) {
      case 'payment-header':
        return !!paymentHeader.sttlmMtd;
      case 'ordering-customer':
        return !!orderingCustomer.ordName.trim() && !!orderingCustomer.ordAcct.trim() && !!orderingCustomer.ordCountry;
      case 'beneficiary-customer':
        return !!beneficiaryCustomer.benName.trim() && !!beneficiaryCustomer.benAcct.trim() && validateBIC(beneficiaryCustomer.benBic) && !!beneficiaryCustomer.benCountry;
      case 'amount-charges':
        return amountCharges.instAmt !== '' && amountCharges.instAmt > 0 && !!amountCharges.ccy && !!amountCharges.chgBr;
      case 'routing-settlement':
        return validateBIC(routingSettlement.instgAgtBic) && validateBIC(routingSettlement.instdAgtBic);
      case 'regulatory-compliance':
        return !!regulatoryCompliance.purpCd && !!regulatoryCompliance.srcFunds && regulatoryCompliance.declFlg;
      case 'remittance-info':
        return true; // Optional
      default:
        return true;
    }
  };

  // Action handlers
  const handleDiscard = () => {
    const now = new Date().toISOString();
    setFormData({
      ...initialOutwardRemittanceFormData,
      paymentHeader: { ...initialOutwardRemittanceFormData.paymentHeader, msgRef: generateMessageRef(), uetr: generateUUID(), creDt: now },
    });
    setCurrentStep('payment-header');
    setSavedTransactionId(undefined);
    toast.info('Form discarded');
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      const user = await getCurrentUserAsync();
      if (!user) {
        toast.error('User not authenticated');
        return;
      }
      const result = await saveRemittanceTransaction(user.id, formData, 'draft', savedTransactionId);
      if (result.success) {
        setSavedTransactionId(result.id);
        toast.success(`Draft saved - Ref: ${result.transactionRef}`);
      } else {
        toast.error(result.error || 'Failed to save draft');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {
      const user = await getCurrentUserAsync();
      if (!user) {
        toast.error('User not authenticated');
        return;
      }
      const result = await submitRemittanceForApproval(user.id, formData);
      if (result.success) {
        const msg = result.pacs009Ref 
          ? `Submitted - PACS.008: ${result.pacs008Ref}, PACS.009: ${result.pacs009Ref}`
          : `Submitted - Ref: ${result.pacs008Ref}`;
        toast.success(msg);
        onStageComplete?.();
      } else {
        toast.error(result.error || 'Failed to submit');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit');
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprove = async () => {
    if (!savedTransactionId) {
      toast.error('No transaction to approve');
      return;
    }
    setIsSaving(true);
    try {
      const user = await getCurrentUserAsync();
      if (!user) {
        toast.error('User not authenticated');
        return;
      }
      const result = await approveRemittanceTransaction(savedTransactionId, user.id);
      if (result.success) {
        toast.success('Transfer approved');
        onApprove?.();
      } else {
        toast.error(result.error || 'Failed to approve');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReject = async () => {
    if (!savedTransactionId) {
      toast.error('No transaction to reject');
      return;
    }
    setIsSaving(true);
    try {
      const user = await getCurrentUserAsync();
      if (!user) {
        toast.error('User not authenticated');
        return;
      }
      const result = await rejectRemittanceTransaction(savedTransactionId, user.id, 'Rejected by approver');
      if (result.success) {
        toast.info('Transfer rejected');
        onReject?.('Rejected by approver');
      } else {
        toast.error(result.error || 'Failed to reject');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject');
    } finally {
      setIsSaving(false);
    }
  };


  // Render current pane
  const renderCurrentPane = () => {
    switch (currentStep) {
      case 'payment-header':
        return <PaymentHeaderPane data={formData.paymentHeader} onChange={updatePaymentHeader} readOnly={readOnly} />;
      case 'ordering-customer':
        return <OrderingCustomerPane data={formData.orderingCustomer} onChange={updateOrderingCustomer} readOnly={readOnly} />;
      case 'beneficiary-customer':
        return <BeneficiaryCustomerPane data={formData.beneficiaryCustomer} onChange={updateBeneficiaryCustomer} readOnly={readOnly} />;
      case 'amount-charges':
        return <AmountChargesPane data={formData.amountCharges} onChange={updateAmountCharges} readOnly={readOnly} />;
      case 'routing-settlement':
        return <RoutingSettlementPane data={formData.routingSettlement} onChange={updateRoutingSettlement} readOnly={readOnly} />;
      case 'regulatory-compliance':
        return <RegulatoryCompliancePane data={formData.regulatoryCompliance} onChange={updateRegulatoryCompliance} readOnly={readOnly} />;
      case 'remittance-info':
        return <RemittanceInfoPane data={formData.remittanceInfo} onChange={updateRemittanceInfo} readOnly={readOnly} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full">
      {/* Main Form Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Progress Indicator */}
        <RemittanceProgressIndicator
          steps={CUSTOMER_CREDIT_TRANSFER_STEPS}
          currentStep={currentStep}
          stepLabels={CUSTOMER_CREDIT_TRANSFER_STEP_LABELS}
          onStepClick={goToStep}
          getStepStatus={getStepStatus}
        />

        {/* Current Pane */}
        <div className="flex-1 overflow-y-auto pb-4">
          {renderCurrentPane()}
        </div>

        {/* Footer Actions */}
        <RemittanceFormActions
          isFirstStep={isFirstStep}
          isLastStep={isLastStep}
          isValid={validateCurrentStep()}
          onPrevious={previousStep}
          onNext={nextStep}
          onSaveDraft={handleSaveDraft}
          onSubmit={handleSubmit}
          onDiscard={handleDiscard}
          readOnly={readOnly}
          isApprovalStage={isApprovalStage}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </div>

      {/* ISO 20022 Sidebar */}
      <ISO20022Sidebar
        pacs008Data={formData}
        transferType="customer"
        settlementMethod={formData.paymentHeader.sttlmMtd}
      />
    </div>
  );
};

export default OutwardRemittanceForm;
