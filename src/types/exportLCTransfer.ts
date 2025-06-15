
export type LCTransferFormStep = 
  | 'lc-and-transfer'
  | 'beneficiary-docs';

export const transferStepOrder: LCTransferFormStep[] = [
  'lc-and-transfer',
  'beneficiary-docs'
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
}

export interface LCTransferFormData {
  lcReference: string;
  issuingBank: string;
  applicant: string;
  currency: string;
  amount: number | '';
  expiryDate: string;
  currentBeneficiary: string;
  issueDate?: string;
  placeOfExpiry?: string;

  transferType: TransferType;
  transferAmount: number | '';
  transferConditions: string;

  newBeneficiary: NewBeneficiary;

  requiredDocuments: string[];
  supportingDocuments: File[];

  requiredDocumentsChecked?: Record<string, boolean>;
}
