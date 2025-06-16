
export type LCTransferFormStep = 
  | 'lc-and-transfer'  // Step 1: LC Information & Transfer Details
  | 'beneficiary'      // Step 2: New Beneficiary Info  
  | 'documents';       // Step 3: Documents

export const transferStepOrder: LCTransferFormStep[] = [
  'lc-and-transfer',
  'beneficiary',
  'documents'
];

export type TransferType = 'Full' | 'Partial';

export interface NewBeneficiary {
  name: string;
  address: string;
  country?: string;
  bankName?: string;
  bankAddress?: string;
  swiftCode: string;
  accountNumber: string;
  transferAmount: number | '';
}

export interface LCTransferFormData {
  // Step 1: Basic LC Info
  lcReference: string;
  issuingBank: string;
  issuanceDate?: string;
  applicant: string;
  currency: string;
  amount: number | '';
  expiryDate: string;
  currentBeneficiary: string;

  // Step 2: Transfer Details
  transferType: TransferType;
  transferConditions: string;

  // Step 3: New Beneficiaries Info
  newBeneficiaries: NewBeneficiary[];

  // Step 4: Supporting Documents
  requiredDocuments: string[];
  supportingDocuments: File[];

  // Optionally for checked state on required documents
  requiredDocumentsChecked?: Record<string, boolean>;
}
