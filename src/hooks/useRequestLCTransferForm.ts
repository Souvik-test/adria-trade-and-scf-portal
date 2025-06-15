
import { useState } from "react";
import { LCTransferFormStep, transferStepOrder, LCTransferFormData } from "@/types/exportLCTransfer";

const INITIAL_FORM: LCTransferFormData = {
  lcReference: "",
  issuingBank: "",
  applicant: "",
  currency: "",
  amount: "",
  expiryDate: "",
  currentBeneficiary: "",
  transferType: "Full",
  transferAmount: "",
  transferConditions: "",
  newBeneficiary: {
    name: "",
    address: "",
    country: "",
    bankName: "",
    bankAddress: "",
    swiftCode: "",
    accountNumber: "",
  },
  requiredDocuments: [],
  supportingDocuments: [],
  requiredDocumentsChecked: {},
};

export function useRequestLCTransferForm(onClose: () => void) {
  const [form, setForm] = useState<LCTransferFormData>(INITIAL_FORM);
  const [stepIdx, setStepIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const step = transferStepOrder[stepIdx];

  const goNext = () => {
    if (stepIdx < transferStepOrder.length - 1) setStepIdx(i => i + 1);
  };
  const goBack = () => {
    if (stepIdx > 0) setStepIdx(i => i - 1);
    else onClose();
  };
  const goToStep = (key: LCTransferFormStep) => {
    setStepIdx(transferStepOrder.indexOf(key));
  };
  const updateField = (patch: Partial<LCTransferFormData>) => {
    setForm(curr => ({ ...curr, ...patch }));
  };

  // For nested fields
  const updateNewBeneficiary = (patch: Partial<LCTransferFormData["newBeneficiary"]>) => {
    setForm(curr => ({ ...curr, newBeneficiary: { ...curr.newBeneficiary, ...patch } }));
  };

  // Specialized updater for LC selection
  const updateLCReferenceFromImportLC = (lc: any) => {
    setForm(curr => ({
      ...curr,
      lcReference: lc.popi_number,
      issuingBank: lc.issuing_bank_name || curr.issuingBank,
      applicant: lc.applicant_name || curr.applicant,
      currency: lc.currency || curr.currency,
      amount: lc.lc_amount || curr.amount,
      expiryDate: lc.expiry_date || curr.expiryDate,
      // "currentBeneficiary" could be extended if needed
    }));
  };

  // Save as Draft, Submit, Discard logic
  const saveDraft = () => {
    alert("Save as draft not yet implemented.");
  };
  const submitForm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Transfer Submitted! (Not yet implemented)");
      onClose();
    }, 1000);
  };
  const discard = () => {
    if (confirm("Are you sure you want to discard this request?")) {
      onClose();
    }
  };

  return {
    form, step, stepIdx, goNext, goBack, goToStep, updateField, updateNewBeneficiary, updateLCReferenceFromImportLC,
    saveDraft, submitForm, discard, isSubmitting
  };
}
