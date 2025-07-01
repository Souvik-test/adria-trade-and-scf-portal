
export interface OutwardBGFormData {
  // MT 760 fields
  sendersReference?: string;
  bankOperationCode?: string;
  dateOfIssue?: string;
  dateOfExpiry?: string;
  placeOfExpiry?: string;
  currency?: string;
  guaranteeAmount?: number;
  formOfGuarantee?: string;
  applicableRules?: string;
  
  // Applicant details
  applicantName?: string;
  applicantAddress?: string;
  applicantAccountNumber?: string;
  
  // Beneficiary details
  beneficiaryName?: string;
  beneficiaryAddress?: string;
  beneficiaryBankName?: string;
  beneficiaryBankAddress?: string;
  beneficiaryBankSwiftCode?: string;
  
  // Guarantee details
  guaranteeDetails?: string;
  termsAndConditions?: string;
  documentsRequired?: string;
  
  // Additional fields
  guaranteeType?: string;
  contractReference?: string;
  underlyingContractDetails?: string;
  specialInstructions?: string;
  supportingDocuments?: File[];
  
  // Form-specific fields
  referenceNumber?: string;
  guaranteeText?: string;
  amount?: string;
  percentageCreditAmount?: string;
  maximumCreditAmount?: string;
  additionalAmounts?: string;
  additionalConditions?: string;
  chargesDetails?: string;
  
  // MT 767 Amendment specific fields
  guaranteeReferenceNo?: string;
  amendmentNumber?: string;
  increaseDecreaseAmount?: string;
  
  // Additional parties (for tracking changes in Party Details)
  additionalParties?: Array<{
    id: string;
    name: string;
    address: string;
    role: string;
  }>;
}
