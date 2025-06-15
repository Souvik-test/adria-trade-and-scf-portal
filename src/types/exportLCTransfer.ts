
export type TransferType = 'Full' | 'Partial';

export interface NewBeneficiary {
  name: string;
  address: string;
  swiftCode: string;
  accountNumber: string;
}

export interface LCTransferFormData {
  // Step 1: Basic LC Info
  lcReference: string;
  issuingBank: string;
  applicant: string;
  currency: string;
  amount: number | '';
  expiryDate: string;
  currentBeneficiary: string;

  // Step 2: Transfer Details
  transferType: TransferType;
  transferAmount: number | '';
  transferConditions: string;

  // Step 3: New Beneficiary Info
  newBeneficiary: NewBeneficiary;

  // Step 4: Supporting Documents
  requiredDocuments: string[];
  supportingDocuments: File[];

  // Step 5: Review (no fields, just summary)
}

export type LCTransferFormStep = 
  | 'lc-info'
  | 'transfer-details'
  | 'new-beneficiary'
  | 'documents'
  | 'review';

export const transferStepOrder: LCTransferFormStep[] = [
  'lc-info',
  'transfer-details',
  'new-beneficiary',
  'documents',
  'review',
];
