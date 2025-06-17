
import { useState } from 'react';
import { AssignmentFormData, AssignmentFormStep, assignmentStepOrder } from '@/types/exportLCAssignment';
import { useToast } from '@/hooks/use-toast';

export const useRequestAssignmentForm = (onClose: () => void) => {
  const { toast } = useToast();
  const [step, setStep] = useState<AssignmentFormStep>('lc-information');
  const [form, setForm] = useState<AssignmentFormData>({
    lcReference: '',
    issuingBank: '',
    issuanceDate: '',
    applicant: '',
    currency: 'USD',
    amount: '',
    expiryDate: '',
    currentBeneficiary: '',
    assignmentType: 'Proceeds',
    assignmentAmount: '',
    assignmentPercentage: '',
    assignee: {
      name: '',
      address: '',
      country: '',
      bankName: '',
      bankAddress: '',
      swiftCode: '',
      accountNumber: ''
    },
    assignmentConditions: '',
    assignmentPurpose: '',
    requiredDocuments: [],
    supportingDocuments: [],
    requiredDocumentsChecked: {}
  });

  const stepIdx = assignmentStepOrder.indexOf(step);

  const updateField = (updates: Partial<AssignmentFormData>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const updateAssignee = (updates: Partial<AssignmentFormData['assignee']>) => {
    setForm(prev => ({
      ...prev,
      assignee: { ...prev.assignee, ...updates }
    }));
  };

  const nextStep = () => {
    const currentIdx = assignmentStepOrder.indexOf(step);
    if (currentIdx < assignmentStepOrder.length - 1) {
      setStep(assignmentStepOrder[currentIdx + 1]);
    }
  };

  const prevStep = () => {
    const currentIdx = assignmentStepOrder.indexOf(step);
    if (currentIdx > 0) {
      setStep(assignmentStepOrder[currentIdx - 1]);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('Assignment Request submitted:', form);
      
      toast({
        title: "Success",
        description: "Assignment request submitted successfully.",
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting Assignment request:', error);
      toast({
        title: "Error",
        description: "Failed to submit Assignment request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDiscard = () => {
    onClose();
  };

  const handleSaveAsDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Assignment request saved as draft.",
    });
  };

  return {
    form,
    step,
    stepIdx,
    updateField,
    updateAssignee,
    nextStep,
    prevStep,
    handleSubmit,
    handleDiscard,
    handleSaveAsDraft,
    canGoNext: stepIdx < assignmentStepOrder.length - 1,
    canGoPrev: stepIdx > 0,
    isLastStep: stepIdx === assignmentStepOrder.length - 1
  };
};
