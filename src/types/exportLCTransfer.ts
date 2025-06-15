
export type LCTransferFormStep = 
  | 'lc-and-transfer'  // Step 1: LC Information & Transfer Details
  | 'beneficiary-docs'; // Step 2: New Beneficiary Info & Documents

export const transferStepOrder: LCTransferFormStep[] = [
  'lc-and-transfer',
  'beneficiary-docs'
];

export type TransferType = 'Full' | 'Partial';

export interface NewBeneficiary {
  name: string;
  address: string;
  country?: string; // made optional as in the form
  bankName?: string;
  bankAddress?: string;
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

  // Step 3: New Beneficiary Info & Documents
  newBeneficiary: NewBeneficiary;

  // Step 4: Supporting Documents
  requiredDocuments: string[];
  supportingDocuments: File[];

  // Optionally for checked state on required documents
  requiredDocumentsChecked?: Record<string, boolean>;
}
