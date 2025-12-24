import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Send, X, CheckCircle, XCircle } from 'lucide-react';
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
} from '@/types/internationalRemittance';
import SettlementHeaderPane from './panes/SettlementHeaderPane';
import InstructingAgentPane from './panes/InstructingAgentPane';
import InstructedAgentPane from './panes/InstructedAgentPane';
import SettlementAmountPane from './panes/SettlementAmountPane';
import CoverLinkagePane from './panes/CoverLinkagePane';
import SettlementInstructionsPane from './panes/SettlementInstructionsPane';

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
  
  // Pane open/close state - first pane open by default
  const [openPanes, setOpenPanes] = useState<Record<string, boolean>>({
    settlementHeader: true,
    instructingAgent: false,
    instructedAgent: false,
    settlementAmount: false,
    coverLinkage: false,
    settlementInstructions: false,
  });

  const togglePane = (pane: string) => {
    setOpenPanes((prev) => ({ ...prev, [pane]: !prev[pane] }));
  };

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

  // Generic update handlers for each pane
  const updateSettlementHeader = (field: keyof SettlementHeader, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      settlementHeader: { ...prev.settlementHeader, [field]: value },
    }));
  };

  const updateInstructingAgent = (field: keyof InstructingAgent, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      instructingAgent: { ...prev.instructingAgent, [field]: value },
    }));
  };

  const updateInstructedAgent = (field: keyof InstructedAgent, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      instructedAgent: { ...prev.instructedAgent, [field]: value },
    }));
  };

  const updateSettlementAmount = (field: keyof SettlementAmount, value: string | number) => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      settlementAmount: { ...prev.settlementAmount, [field]: value },
    }));
  };

  const updateSettlementInstructions = (field: keyof SettlementInstructions, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      settlementInstructions: { ...prev.settlementInstructions, [field]: value },
    }));
  };

  // Validation
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const { settlementHeader, instructingAgent, instructedAgent, settlementAmount } = formData;

    // Settlement Header
    if (!settlementHeader.sttlmMtd) {
      errors.push('Settlement Method is required');
    }

    // Instructing Agent
    if (!instructingAgent.instgAgtName.trim()) {
      errors.push('Instructing Agent Name is required');
    }
    if (!instructingAgent.instgAgtBic.trim()) {
      errors.push('Instructing Agent BIC is required');
    } else if (!validateBIC(instructingAgent.instgAgtBic)) {
      errors.push('Instructing Agent BIC format is invalid');
    }

    // Instructed Agent
    if (!instructedAgent.instdAgtName.trim()) {
      errors.push('Instructed Agent Name is required');
    }
    if (!instructedAgent.instdAgtBic.trim()) {
      errors.push('Instructed Agent BIC is required');
    } else if (!validateBIC(instructedAgent.instdAgtBic)) {
      errors.push('Instructed Agent BIC format is invalid');
    }

    // Settlement Amount
    if (settlementAmount.sttlmAmt === '' || settlementAmount.sttlmAmt <= 0) {
      errors.push('Settlement Amount must be greater than 0');
    }
    if (!settlementAmount.ccy) {
      errors.push('Currency is required');
    }
    if (!settlementAmount.valDt) {
      errors.push('Value Date is required');
    }

    return { isValid: errors.length === 0, errors };
  };

  // Action handlers
  const handleDiscard = () => {
    const now = new Date().toISOString();
    setFormData({
      ...initialFICreditTransferFormData,
      settlementHeader: {
        ...initialFICreditTransferFormData.settlementHeader,
        sttlmRef: generateMessageRef(),
        uetr: generateUUID(),
        creDt: now,
      },
    });
    toast.info('Form discarded');
  };

  const handleSaveDraft = () => {
    toast.success('FI Credit Transfer saved as draft');
  };

  const handleSubmit = () => {
    const { isValid, errors } = validateForm();
    if (!isValid) {
      errors.forEach((err) => toast.error(err));
      return;
    }
    toast.success('FI Credit Transfer submitted successfully');
    onStageComplete?.();
  };

  const handleApprove = () => {
    toast.success('Transfer approved');
    onApprove?.();
  };

  const handleReject = () => {
    toast.info('Transfer rejected');
    onReject?.('Rejected by approver');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 overflow-y-auto pb-4">
        {/* Pane 1: Settlement Header */}
        <SettlementHeaderPane
          data={formData.settlementHeader}
          onChange={updateSettlementHeader}
          readOnly={readOnly}
          isOpen={openPanes.settlementHeader}
          onToggle={() => togglePane('settlementHeader')}
        />

        {/* Pane 2: Instructing Agent */}
        <InstructingAgentPane
          data={formData.instructingAgent}
          onChange={updateInstructingAgent}
          readOnly={readOnly}
          isOpen={openPanes.instructingAgent}
          onToggle={() => togglePane('instructingAgent')}
        />

        {/* Pane 3: Instructed Agent */}
        <InstructedAgentPane
          data={formData.instructedAgent}
          onChange={updateInstructedAgent}
          readOnly={readOnly}
          isOpen={openPanes.instructedAgent}
          onToggle={() => togglePane('instructedAgent')}
        />

        {/* Pane 4: Settlement Amount */}
        <SettlementAmountPane
          data={formData.settlementAmount}
          onChange={updateSettlementAmount}
          readOnly={readOnly}
          isOpen={openPanes.settlementAmount}
          onToggle={() => togglePane('settlementAmount')}
        />

        {/* Pane 5: Cover / Linkage */}
        <CoverLinkagePane
          data={formData.coverLinkage}
          isOpen={openPanes.coverLinkage}
          onToggle={() => togglePane('coverLinkage')}
        />

        {/* Pane 6: Settlement Instructions */}
        <SettlementInstructionsPane
          data={formData.settlementInstructions}
          onChange={updateSettlementInstructions}
          readOnly={readOnly}
          isOpen={openPanes.settlementInstructions}
          onToggle={() => togglePane('settlementInstructions')}
        />
      </div>

      {/* Footer Actions */}
      <div className="border-t bg-background pt-4 mt-4">
        <div className="flex items-center justify-between">
          {/* Left side - Discard (only for data entry) */}
          {!isApprovalStage ? (
            <Button
              variant="outline"
              onClick={handleDiscard}
              disabled={readOnly}
            >
              <X className="h-4 w-4 mr-2" />
              Discard
            </Button>
          ) : (
            <div /> // Empty div to maintain flex layout
          )}

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-3">
            {isApprovalStage ? (
              // Approval stage buttons
              <>
                <Button
                  variant="outline"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={handleReject}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={handleApprove}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            ) : (
              // Data entry stage buttons
              <>
                <Button
                  variant="outline"
                  onClick={handleSaveDraft}
                  disabled={readOnly}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={readOnly}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FICreditTransferForm;
