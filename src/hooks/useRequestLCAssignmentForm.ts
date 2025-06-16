
import { useState } from "react";
import { LCAssignmentFormStep, assignmentStepOrder, LCAssignmentFormData } from "@/types/exportLCAssignment";

const INITIAL_FORM: LCAssignmentFormData = {
  lcReference: "",
  issuingBank: "",
  applicant: "",
  currency: "",
  amount: "",
  expiryDate: "",
  currentBeneficiary: "",
  assignmentType: "Full",
  assignmentAmount: "",
  assignmentConditions: "",
  assignmentReason: "",
  assignee: {
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

export function useRequestLCAssignmentForm(onClose: () => void) {
  const [form, setForm] = useState<LCAssignmentFormData>(INITIAL_FORM);
  const [stepIdx, setStepIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const step = assignmentStepOrder[stepIdx];

  // Validation for assignment amount
  const validateAssignmentAmount = () => {
    if (form.assignmentType === "Partial") {
      const lcAmount = Number(form.amount) || 0;
      const assignmentAmount = Number(form.assignmentAmount) || 0;
      return assignmentAmount > 0 && assignmentAmount <= lcAmount;
    }
    return true;
  };

  const goNext = () => {
    // Validate current step before proceeding
    if (step === "lc-and-assignment" && !validateAssignmentAmount()) {
      return; // Don't proceed if validation fails
    }
    if (stepIdx < assignmentStepOrder.length - 1) setStepIdx(i => i + 1);
  };
  
  const goBack = () => {
    if (stepIdx > 0) setStepIdx(i => i - 1);
    else onClose();
  };
  
  const goToStep = (key: LCAssignmentFormStep) => {
    setStepIdx(assignmentStepOrder.indexOf(key));
  };
  
  const updateField = (patch: Partial<LCAssignmentFormData>) => {
    setForm(curr => ({ ...curr, ...patch }));
  };

  // For nested fields
  const updateAssignee = (patch: Partial<LCAssignmentFormData["assignee"]>) => {
    setForm(curr => ({ ...curr, assignee: { ...curr.assignee, ...patch } }));
  };

  // Save as Draft, Submit, Discard logic
  const saveDraft = () => {
    alert("Save as draft not yet implemented.");
  };
  
  const submitForm = () => {
    // Final validation before submission
    if (!validateAssignmentAmount()) {
      alert("Please fix validation errors before submitting.");
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Assignment Request Submitted! (Not yet implemented)");
      onClose();
    }, 1000);
  };
  
  const discard = () => {
    if (confirm("Are you sure you want to discard this request?")) {
      onClose();
    }
  };

  return {
    form, step, stepIdx, goNext, goBack, goToStep, updateField, updateAssignee,
    saveDraft, submitForm, discard, isSubmitting, validateAssignmentAmount
  };
}
