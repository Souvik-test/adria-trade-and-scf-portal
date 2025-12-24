import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Send, X, CheckCircle, XCircle } from 'lucide-react';
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

interface OutwardRemittanceFormProps {
  readOnly?: boolean;
  isApprovalStage?: boolean;
  onStageComplete?: () => void;
  onApprove?: () => void;
  onReject?: (reason?: string) => void;
}

const OutwardRemittanceForm: React.FC<OutwardRemittanceFormProps> = ({
  readOnly = false,
  isApprovalStage = false,
  onStageComplete,
  onApprove,
  onReject,
}) => {
  const [formData, setFormData] = useState<OutwardRemittanceFormData>(initialOutwardRemittanceFormData);

  // Auto-generate read-only fields on mount
  useEffect(() => {
    const now = new Date().toISOString();
    setFormData((prev) => ({
      ...prev,
      paymentHeader: {
        ...prev.paymentHeader,
        msgRef: generateMessageRef(),
        uetr: generateUUID(),
        creDt: now,
      },
    }));
  }, []);

  // Generic update handlers for each pane
  const updatePaymentHeader = (field: keyof PaymentHeader, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      paymentHeader: { ...prev.paymentHeader, [field]: value },
    }));
  };

  const updateOrderingCustomer = (field: keyof OrderingCustomer, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      orderingCustomer: { ...prev.orderingCustomer, [field]: value },
    }));
  };

  const updateBeneficiaryCustomer = (field: keyof BeneficiaryCustomer, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      beneficiaryCustomer: { ...prev.beneficiaryCustomer, [field]: value },
    }));
  };

  const updateAmountCharges = (field: keyof AmountCharges, value: string | number) => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      amountCharges: { ...prev.amountCharges, [field]: value },
    }));
  };

  const updateRoutingSettlement = (field: keyof RoutingSettlement, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      routingSettlement: { ...prev.routingSettlement, [field]: value },
    }));
  };

  const updateRegulatoryCompliance = (field: keyof RegulatoryCompliance, value: string | boolean) => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      regulatoryCompliance: { ...prev.regulatoryCompliance, [field]: value },
    }));
  };

  const updateRemittanceInfo = (field: keyof RemittanceInfo, value: string) => {
    if (readOnly) return;
    setFormData((prev) => ({
      ...prev,
      remittanceInfo: { ...prev.remittanceInfo, [field]: value },
    }));
  };

  // Validation
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const { paymentHeader, orderingCustomer, beneficiaryCustomer, amountCharges, routingSettlement, regulatoryCompliance } = formData;

    // Payment Header
    if (!paymentHeader.sttlmMtd) {
      errors.push('Settlement Method is required');
    }

    // Ordering Customer
    if (!orderingCustomer.ordName.trim()) {
      errors.push('Ordering Customer Name is required');
    }
    if (!orderingCustomer.ordAcct.trim()) {
      errors.push('Ordering Account/IBAN is required');
    }
    if (!orderingCustomer.ordCountry) {
      errors.push('Ordering Customer Country is required');
    }

    // Beneficiary Customer
    if (!beneficiaryCustomer.benName.trim()) {
      errors.push('Beneficiary Name is required');
    }
    if (!beneficiaryCustomer.benAcct.trim()) {
      errors.push('Beneficiary Account/IBAN is required');
    }
    if (!beneficiaryCustomer.benBic.trim()) {
      errors.push('Beneficiary Bank BIC is required');
    } else if (!validateBIC(beneficiaryCustomer.benBic)) {
      errors.push('Beneficiary Bank BIC format is invalid');
    }
    if (!beneficiaryCustomer.benCountry) {
      errors.push('Beneficiary Country is required');
    }

    // Amount & Charges
    if (amountCharges.instAmt === '' || amountCharges.instAmt <= 0) {
      errors.push('Instructed Amount must be greater than 0');
    }
    if (!amountCharges.ccy) {
      errors.push('Currency is required');
    }
    if (!amountCharges.chgBr) {
      errors.push('Charge Bearer is required');
    }

    // Routing & Settlement
    if (!routingSettlement.instgAgtBic.trim()) {
      errors.push('Instructing Agent BIC is required');
    } else if (!validateBIC(routingSettlement.instgAgtBic)) {
      errors.push('Instructing Agent BIC format is invalid');
    }
    if (!routingSettlement.instdAgtBic.trim()) {
      errors.push('Instructed Agent BIC is required');
    } else if (!validateBIC(routingSettlement.instdAgtBic)) {
      errors.push('Instructed Agent BIC format is invalid');
    }

    // Regulatory & Compliance
    if (!regulatoryCompliance.purpCd) {
      errors.push('Purpose Code is required');
    }
    if (!regulatoryCompliance.srcFunds) {
      errors.push('Source of Funds is required');
    }
    if (!regulatoryCompliance.declFlg) {
      errors.push('Declaration must be accepted');
    }

    return { isValid: errors.length === 0, errors };
  };

  // Action handlers
  const handleDiscard = () => {
    const now = new Date().toISOString();
    setFormData({
      ...initialOutwardRemittanceFormData,
      paymentHeader: {
        ...initialOutwardRemittanceFormData.paymentHeader,
        msgRef: generateMessageRef(),
        uetr: generateUUID(),
        creDt: now,
      },
    });
    toast.info('Form discarded');
  };

  const handleSaveDraft = () => {
    toast.success('Transfer saved as draft');
  };

  const handleSubmit = () => {
    const { isValid, errors } = validateForm();
    if (!isValid) {
      errors.forEach((err) => toast.error(err));
      return;
    }
    toast.success('Outward remittance submitted successfully');
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
      <div className="flex-1 space-y-6 overflow-y-auto pb-4">
        {/* Pane 1: Payment Header */}
        <PaymentHeaderPane
          data={formData.paymentHeader}
          onChange={updatePaymentHeader}
          readOnly={readOnly}
        />

        {/* Pane 2: Ordering Customer */}
        <OrderingCustomerPane
          data={formData.orderingCustomer}
          onChange={updateOrderingCustomer}
          readOnly={readOnly}
        />

        {/* Pane 3: Beneficiary Customer */}
        <BeneficiaryCustomerPane
          data={formData.beneficiaryCustomer}
          onChange={updateBeneficiaryCustomer}
          readOnly={readOnly}
        />

        {/* Pane 4: Amount & Charges */}
        <AmountChargesPane
          data={formData.amountCharges}
          onChange={updateAmountCharges}
          readOnly={readOnly}
        />

        {/* Pane 5: Routing & Settlement */}
        <RoutingSettlementPane
          data={formData.routingSettlement}
          onChange={updateRoutingSettlement}
          readOnly={readOnly}
        />

        {/* Pane 6: Regulatory & Compliance */}
        <RegulatoryCompliancePane
          data={formData.regulatoryCompliance}
          onChange={updateRegulatoryCompliance}
          readOnly={readOnly}
        />

        {/* Pane 7: Remittance Information */}
        <RemittanceInfoPane
          data={formData.remittanceInfo}
          onChange={updateRemittanceInfo}
          readOnly={readOnly}
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

export default OutwardRemittanceForm;
