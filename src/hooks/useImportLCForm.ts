
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { customAuth } from '@/services/customAuth';

export interface PartyDetail {
  id: string;
  role: 'applicant' | 'beneficiary' | 'advising_bank' | 'issuing_bank' | 'confirming_bank';
  name: string;
  address: string;
  swiftCode?: string;
  accountNumber?: string;
}

export interface DocumentRequirement {
  id: string;
  name: string;
  original: number;
  copies: number;
}

export interface ImportLCFormData {
  // Basic LC Information
  popiNumber: string;
  popiType: 'PO' | 'PI' | '';
  formOfDocumentaryCredit: string;
  corporateReference: string;
  applicableRules: string;
  lcType: string;
  issueDate: string;
  expiryDate: string;
  placeOfExpiry: string;
  confirmation: string;

  // Party Information (updated structure)
  parties: PartyDetail[];
  
  // Legacy fields for backward compatibility
  applicantName: string;
  applicantAddress: string;
  applicantAccountNumber: string;
  beneficiaryName: string;
  beneficiaryAddress: string;
  beneficiaryBankName: string;
  beneficiaryBankAddress: string;
  beneficiaryBankSwiftCode: string;
  advisingBankSwiftCode: string;

  // LC Amount and Terms
  lcAmount: number;
  currency: string;
  tolerance: string;
  additionalAmount: number;
  availableWith: string;
  availableBy: string;
  partialShipmentsAllowed: boolean;
  transshipmentAllowed: boolean;

  // Shipment Details
  descriptionOfGoods: string;
  portOfLoading: string;
  portOfDischarge: string;
  latestShipmentDate: string;
  presentationPeriod: string;

  // Document Requirements (updated structure)
  documentRequirements: DocumentRequirement[];
  requiredDocuments: string[];
  additionalConditions: string;
  supportingDocuments: File[];
}

export type ImportLCFormStep = 'basic' | 'parties' | 'amount' | 'shipment' | 'documents';

const useImportLCForm = () => {
  const [currentStep, setCurrentStep] = useState<ImportLCFormStep>('basic');
  const [formData, setFormData] = useState<ImportLCFormData>({
    popiNumber: '',
    popiType: '',
    formOfDocumentaryCredit: '',
    corporateReference: '',
    applicableRules: 'UCP Latest Version',
    lcType: '',
    issueDate: '',
    expiryDate: '',
    placeOfExpiry: '',
    confirmation: '',
    parties: [],
    applicantName: '',
    applicantAddress: '',
    applicantAccountNumber: '',
    beneficiaryName: '',
    beneficiaryAddress: '',
    beneficiaryBankName: '',
    beneficiaryBankAddress: '',
    beneficiaryBankSwiftCode: '',
    advisingBankSwiftCode: '',
    lcAmount: 0,
    currency: 'USD',
    tolerance: '',
    additionalAmount: 0,
    availableWith: '',
    availableBy: '',
    partialShipmentsAllowed: false,
    transshipmentAllowed: false,
    descriptionOfGoods: '',
    portOfLoading: '',
    portOfDischarge: '',
    latestShipmentDate: '',
    presentationPeriod: '',
    documentRequirements: [],
    requiredDocuments: [],
    additionalConditions: '',
    supportingDocuments: []
  });

  // Update form field
  const updateField = useCallback((field: keyof ImportLCFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Navigation
  const goToStep = useCallback((step: ImportLCFormStep) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    const steps: ImportLCFormStep[] = ['basic', 'parties', 'amount', 'shipment', 'documents'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    const steps: ImportLCFormStep[] = ['basic', 'parties', 'amount', 'shipment', 'documents'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  // Form validation
  const validateCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 'basic':
        return !!(formData.corporateReference && formData.formOfDocumentaryCredit);
      case 'parties':
        const hasApplicant = formData.parties.some(p => p.role === 'applicant') || 
                           (formData.applicantName && formData.applicantAddress);
        const hasBeneficiary = formData.parties.some(p => p.role === 'beneficiary') || 
                             (formData.beneficiaryName && formData.beneficiaryAddress);
        return hasApplicant && hasBeneficiary;
      case 'amount':
        return !!(formData.lcAmount > 0 && formData.currency);
      case 'shipment':
        return !!(formData.descriptionOfGoods && formData.latestShipmentDate);
      case 'documents':
        return formData.documentRequirements.length > 0 || formData.requiredDocuments.length > 0;
      default:
        return false;
    }
  }, [currentStep, formData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData({
      popiNumber: '',
      popiType: '',
      formOfDocumentaryCredit: '',
      corporateReference: '',
      applicableRules: 'UCP Latest Version',
      lcType: '',
      issueDate: '',
      expiryDate: '',
      placeOfExpiry: '',
      confirmation: '',
      parties: [],
      applicantName: '',
      applicantAddress: '',
      applicantAccountNumber: '',
      beneficiaryName: '',
      beneficiaryAddress: '',
      beneficiaryBankName: '',
      beneficiaryBankAddress: '',
      beneficiaryBankSwiftCode: '',
      advisingBankSwiftCode: '',
      lcAmount: 0,
      currency: 'USD',
      tolerance: '',
      additionalAmount: 0,
      availableWith: '',
      availableBy: '',
      partialShipmentsAllowed: false,
      transshipmentAllowed: false,
      descriptionOfGoods: '',
      portOfLoading: '',
      portOfDischarge: '',
      latestShipmentDate: '',
      presentationPeriod: '',
      documentRequirements: [],
      requiredDocuments: [],
      additionalConditions: '',
      supportingDocuments: []
    });
    setCurrentStep('basic');
  }, []);

  // Submit form
  const submitForm = useCallback(async () => {
    console.log('submitForm called with formData:', formData);
    
    const user = customAuth.getSession()?.user;
    if (!user) {
      console.error('No user session found');
      throw new Error('User not authenticated');
    }

    console.log('User found:', user);

    try {
      // Sync party data to legacy fields for database compatibility
      const applicantParty = formData.parties.find(p => p.role === 'applicant');
      const beneficiaryParty = formData.parties.find(p => p.role === 'beneficiary');
      const advisingBankParty = formData.parties.find(p => p.role === 'advising_bank');

      // Ensure proper boolean conversion
      const partialShipmentsAllowed = formData.partialShipmentsAllowed === true || formData.partialShipmentsAllowed === 'true';
      const transshipmentAllowed = formData.transshipmentAllowed === true || formData.transshipmentAllowed === 'true';

      const insertData = {
        user_id: user.id,
        popi_number: formData.popiNumber,
        popi_type: formData.popiType,
        form_of_documentary_credit: formData.formOfDocumentaryCredit,
        corporate_reference: formData.corporateReference,
        applicable_rules: formData.applicableRules,
        lc_type: formData.lcType,
        issue_date: formData.issueDate || null,
        expiry_date: formData.expiryDate || null,
        place_of_expiry: formData.placeOfExpiry,
        applicant_name: applicantParty?.name || formData.applicantName,
        applicant_address: applicantParty?.address || formData.applicantAddress,
        applicant_account_number: applicantParty?.accountNumber || formData.applicantAccountNumber,
        beneficiary_name: beneficiaryParty?.name || formData.beneficiaryName,
        beneficiary_address: beneficiaryParty?.address || formData.beneficiaryAddress,
        beneficiary_bank_name: formData.beneficiaryBankName,
        beneficiary_bank_address: formData.beneficiaryBankAddress,
        beneficiary_bank_swift_code: beneficiaryParty?.swiftCode || formData.beneficiaryBankSwiftCode,
        advising_bank_swift_code: advisingBankParty?.swiftCode || formData.advisingBankSwiftCode,
        lc_amount: formData.lcAmount,
        currency: formData.currency,
        tolerance: formData.tolerance,
        additional_amount: formData.additionalAmount,
        available_with: formData.availableWith,
        available_by: formData.availableBy,
        partial_shipments_allowed: partialShipmentsAllowed,
        transshipment_allowed: transshipmentAllowed,
        description_of_goods: formData.descriptionOfGoods,
        port_of_loading: formData.portOfLoading,
        port_of_discharge: formData.portOfDischarge,
        latest_shipment_date: formData.latestShipmentDate || null,
        presentation_period: formData.presentationPeriod,
        required_documents: formData.documentRequirements.length > 0 
          ? formData.documentRequirements.map(doc => `${doc.name} - ${doc.original} Original${doc.original > 1 ? 's' : ''}, ${doc.copies} Cop${doc.copies === 1 ? 'y' : 'ies'}`)
          : formData.requiredDocuments,
        additional_conditions: formData.additionalConditions,
        status: 'submitted'
      };

      console.log('Attempting to insert data:', insertData);

      const { data, error } = await supabase
        .from('import_lc_requests')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Database insert error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      console.log('Import LC request submitted successfully:', data);
      return data;
    } catch (error) {
      console.error('Error submitting Import LC request:', error);
      throw error;
    }
  }, [formData]);

  return {
    formData,
    currentStep,
    setCurrentStep,
    updateField,
    goToStep,
    nextStep,
    previousStep,
    validateCurrentStep,
    submitForm,
    resetForm
  };
};

export default useImportLCForm;
