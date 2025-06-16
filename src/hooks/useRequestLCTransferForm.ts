
import { useState } from 'react';
import { LCTransferFormData, LCTransferFormStep, transferStepOrder, NewBeneficiary } from '@/types/exportLCTransfer';

export const useRequestLCTransferForm = (onClose: () => void) => {
  const [step, setStep] = useState<LCTransferFormStep>('lc-and-transfer');
  const [form, setForm] = useState<LCTransferFormData>({
    lcReference: '',
    issuingBank: '',
    issuanceDate: '',
    applicant: '',
    currency: 'USD',
    amount: '',
    expiryDate: '',
    currentBeneficiary: '',
    transferType: 'Full',
    transferConditions: '',
    newBeneficiaries: [{
      name: '',
      address: '',
      country: '',
      bankName: '',
      bankAddress: '',
      swiftCode: '',
      accountNumber: '',
      transferAmount: ''
    }],
    requiredDocuments: [],
    supportingDocuments: [],
    requiredDocumentsChecked: {}
  });

  const stepIdx = transferStepOrder.indexOf(step);

  const updateField = (updates: Partial<LCTransferFormData>) => {
    setForm(prev => ({ ...prev, ...updates }));
  };

  const updateNewBeneficiary = (index: number, updates: Partial<NewBeneficiary>) => {
    setForm(prev => ({
      ...prev,
      newBeneficiaries: prev.newBeneficiaries.map((beneficiary, i) => 
        i === index ? { ...beneficiary, ...updates } : beneficiary
      )
    }));
  };

  const addNewBeneficiary = () => {
    setForm(prev => ({
      ...prev,
      newBeneficiaries: [...prev.newBeneficiaries, {
        name: '',
        address: '',
        country: '',
        bankName: '',
        bankAddress: '',
        swiftCode: '',
        accountNumber: '',
        transferAmount: ''
      }]
    }));
  };

  const removeNewBeneficiary = (index: number) => {
    if (form.newBeneficiaries.length > 1) {
      setForm(prev => ({
        ...prev,
        newBeneficiaries: prev.newBeneficiaries.filter((_, i) => i !== index)
      }));
    }
  };

  const nextStep = () => {
    const currentIdx = transferStepOrder.indexOf(step);
    if (currentIdx < transferStepOrder.length - 1) {
      setStep(transferStepOrder[currentIdx + 1]);
    }
  };

  const prevStep = () => {
    const currentIdx = transferStepOrder.indexOf(step);
    if (currentIdx > 0) {
      setStep(transferStepOrder[currentIdx - 1]);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting LC Transfer Request:', form);
    onClose();
  };

  return {
    form,
    step,
    stepIdx,
    updateField,
    updateNewBeneficiary,
    addNewBeneficiary,
    removeNewBeneficiary,
    nextStep,
    prevStep,
    handleSubmit,
    canGoNext: stepIdx < transferStepOrder.length - 1,
    canGoPrev: stepIdx > 0,
    isLastStep: stepIdx === transferStepOrder.length - 1
  };
};
