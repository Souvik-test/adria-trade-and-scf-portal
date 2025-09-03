export interface ShippingGuaranteeFormData {
  // Basic Information
  guaranteeReference?: string;
  corporateReference?: string;
  issueDate?: string;
  expiryDate?: string;
  guaranteeAmount?: number;
  currency?: string;
  
  // Applicant Details
  applicantName?: string;
  applicantAddress?: string;
  applicantAccountNumber?: string;
  
  // Beneficiary Details
  beneficiaryName?: string;
  beneficiaryAddress?: string;
  beneficiaryBankName?: string;
  beneficiaryBankAddress?: string;
  beneficiaryBankSwiftCode?: string;
  
  // Shipping Details
  vesselName?: string;
  voyageNumber?: string;
  portOfLoading?: string;
  portOfDischarge?: string;
  billOfLadingNumber?: string;
  cargoDescription?: string;
  
  // Guarantee Details
  guaranteeType?: string;
  guaranteeText?: string;
  termsAndConditions?: string;
  claimsPayableAt?: string;
  
  // Additional Information
  underlyingContract?: string;
  specialInstructions?: string;
  chargesDetails?: string;
  supportingDocuments?: File[];
  
  // Status
  status?: string;
}

export type ShippingGuaranteeActionType = 'create' | 'update' | 'link-delink' | null;