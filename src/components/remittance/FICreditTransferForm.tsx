import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  FICreditTransferFormData,
  SettlementHeader,
  InstructingAgent,
  InstructedAgent,
  SettlementAmount,
  SettlementInstructions,
  initialFICreditTransferFormData,
  generateUUID,
  generateMessageRef,
  validateBIC,
  FICreditTransferStep,
  FI_CREDIT_TRANSFER_STEPS,
  FI_CREDIT_TRANSFER_STEP_LABELS,
} from '@/types/internationalRemittance';
import SettlementHeaderPane from './panes/SettlementHeaderPane';
import InstructingAgentPane from './panes/InstructingAgentPane';
import InstructedAgentPane from './panes/InstructedAgentPane';
import SettlementAmountPane from './panes/SettlementAmountPane';
import CoverLinkagePane from './panes/CoverLinkagePane';
import SettlementInstructionsPane from './panes/SettlementInstructionsPane';
import RemittanceProgressIndicator from './RemittanceProgressIndicator';
import RemittanceFormActions from './RemittanceFormActions';
import ISO20022Sidebar from './ISO20022Sidebar';

interface FICreditTransferFormProps {
  readOnly?: boolean;
  isApprovalStage?: boolean;
  onStageComplete?: () => void;
  onApprove?: () => void;
  onReject?: (reason?: string) => void;
}

const FICreditTransferForm: React.FC<FICreditTransferFormProps> = ({
  readOnly = false,
  isApprovalStage = false,
  onStageComplete,
  onApprove,
  onReject,
}) => {
  const [formData, setFormData] = useState<FICreditTransferFormData>(initialFICreditTransferFormData);
  const [currentStep, setCurrentStep] = useState<FICreditTransferStep>('settlement-header');

  const currentStepIndex = FI_CREDIT_TRANSFER_STEPS.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === FI_CREDIT_TRANSFER_STEPS.length - 1;

  // Auto-generate read-only fields on mount
  useEffect(() => {
    const now = new Date().toISOString();
    setFormData((prev) => ({
      ...prev,
      settlementHeader: {
        ...prev.settlementHeader,
        sttlmRef: generateMessageRef(),
        uetr: generateUUID(),
        creDt: now,
      },
    }));
  }, []);

  // Navigation
  const goToStep = (step: FICreditTransferStep) => setCurrentStep(step);
  const nextStep = () => {
    if (!isLastStep) setCurrentStep(FI_CREDIT_TRANSFER_STEPS[currentStepIndex + 1]);
  };
  const previousStep = () => {
    if (!isFirstStep) setCurrentStep(FI_CREDIT_TRANSFER_STEPS[currentStepIndex - 1]);
  };

  const getStepStatus = (step: FICreditTransferStep): 'completed' | 'current' | 'pending' => {
    const stepIndex = FI_CREDIT_TRANSFER_STEPS.indexOf(step);
    if (step === currentStep) return 'current';
    if (stepIndex < currentStepIndex) return 'completed';
    return 'pending';
  };

  // Update handlers
  const updateSettlementHeader = (field: keyof SettlementHeader, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, settlementHeader: { ...prev.settlementHeader, [field]: value } }));
  };

  const updateInstructingAgent = (field: keyof InstructingAgent, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, instructingAgent: { ...prev.instructingAgent, [field]: value } }));
  };

  const updateInstructedAgent = (field: keyof InstructedAgent, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, instructedAgent: { ...prev.instructedAgent, [field]: value } }));
  };

  const updateSettlementAmount = (field: keyof SettlementAmount, value: string | number) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, settlementAmount: { ...prev.settlementAmount, [field]: value } }));
  };

  const updateSettlementInstructions = (field: keyof SettlementInstructions, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({ ...prev, settlementInstructions: { ...prev.settlementInstructions, [field]: value } }));
  };

  // Validation
  const validateCurrentStep = (): boolean => {
    const { settlementHeader, instructingAgent, instructedAgent, settlementAmount } = formData;
    switch (currentStep) {
      case 'settlement-header':
        return !!settlementHeader.sttlmMtd;
      case 'instructing-agent':
        return !!instructingAgent.instgAgtName.trim() && validateBIC(instructingAgent.instgAgtBic);
      case 'instructed-agent':
        return !!instructedAgent.instdAgtName.trim() && validateBIC(instructedAgent.instdAgtBic);
      case 'settlement-amount':
        return settlementAmount.sttlmAmt !== '' && settlementAmount.sttlmAmt > 0 && !!settlementAmount.ccy && !!settlementAmount.valDt;
      case 'cover-linkage':
        return true; // Read-only pane
      case 'settlement-instructions':
        return true; // Optional fields
      default:
        return true;
    }
  };

  // Action handlers
  const handleDiscard = () => {
    const now = new Date().toISOString();
    setFormData({
      ...initialFICreditTransferFormData,
      settlementHeader: { ...initialFICreditTransferFormData.settlementHeader, sttlmRef: generateMessageRef(), uetr: generateUUID(), creDt: now },
    });
    setCurrentStep('settlement-header');
    toast.info('Form discarded');
  };

  const handleSaveDraft = () => toast.success('FI Credit Transfer saved as draft');

  const handleSubmit = () => {
    toast.success('FI Credit Transfer submitted successfully');
    onStageComplete?.();
  };

  const handleApprove = () => { toast.success('Transfer approved'); onApprove?.(); };
  const handleReject = () => { toast.info('Transfer rejected'); onReject?.('Rejected by approver'); };

  // Render current pane
  const renderCurrentPane = () => {
    switch (currentStep) {
      case 'settlement-header':
        return <SettlementHeaderPane data={formData.settlementHeader} onChange={updateSettlementHeader} readOnly={readOnly} />;
      case 'instructing-agent':
        return <InstructingAgentPane data={formData.instructingAgent} onChange={updateInstructingAgent} readOnly={readOnly} />;
      case 'instructed-agent':
        return <InstructedAgentPane data={formData.instructedAgent} onChange={updateInstructedAgent} readOnly={readOnly} />;
      case 'settlement-amount':
        return <SettlementAmountPane data={formData.settlementAmount} onChange={updateSettlementAmount} readOnly={readOnly} />;
      case 'cover-linkage':
        return <CoverLinkagePane data={formData.coverLinkage} />;
      case 'settlement-instructions':
        return <SettlementInstructionsPane data={formData.settlementInstructions} onChange={updateSettlementInstructions} readOnly={readOnly} />;
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
          steps={FI_CREDIT_TRANSFER_STEPS}
          currentStep={currentStep}
          stepLabels={FI_CREDIT_TRANSFER_STEP_LABELS}
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
        pacs009Data={formData}
        transferType="fi"
        settlementMethod={formData.settlementHeader.sttlmMtd}
      />
    </div>
  );
};

export default FICreditTransferForm;
