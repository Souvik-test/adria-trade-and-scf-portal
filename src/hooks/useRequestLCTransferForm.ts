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
  issueDate: "",
  placeOfExpiry: "",
  beneficiaryBankName: "",
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
  const [form, setForm] = useState(INITIAL_FORM);
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
  const goToStep = (key) => {
    setStepIdx(transferStepOrder.indexOf(key));
  };
  const updateField = (patch) => {
    setForm(curr => ({ ...curr, ...patch }));
  };

  const updateNewBeneficiary = (patch) => {
    setForm(curr => ({ ...curr, newBeneficiary: { ...curr.newBeneficiary, ...patch } }));
  };

  // Specialized updater for LC selection. Accepts full LC object.
  const updateLCReferenceFromImportLC = (lc) => {
    setForm(curr => ({
      ...curr,
      lcReference: lc.corporate_reference,
      issuingBank: lc.issuing_bank ?? lc.issuingBank ?? "",
      applicant: lc.applicant_name ?? lc.applicant ?? "",
      currency: lc.currency ?? "",
      amount: lc.lc_amount ?? "",
      expiryDate: lc.expiry_date ?? "",
      currentBeneficiary: lc.beneficiary_name ?? "",
      issueDate: lc.issue_date ?? "",
      placeOfExpiry: lc.place_of_expiry ?? "",
      beneficiaryBankName: lc.beneficiary_bank_name ?? "",
      // keep other fields intact
    }));
  };

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
