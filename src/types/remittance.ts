export type RemittanceActionType = 'process' | 'return-reject' | null;
export type TransferDirection = 'outward' | 'inward';
export type TransferType = 'a2a' | 'beneficiary' | 'multiple' | 'international';
export type ExecutionType = 'immediate' | 'deferred' | 'standing';
export type TransferStatus = 'draft' | 'submitted' | 'signed' | 'processed' | 'completed' | 'failed' | 'scheduled';

export interface RecipientEntry {
  id: string;
  creditAccount: string;
  recipientName: string;
  amount: number;
}

export interface TransferFormData {
  direction: TransferDirection;
  outwardType: TransferType;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  currency: string;
  executionType: ExecutionType;
  executionDate: string;
  frequency: string;
  reference: string;
  beneficiary: string;
  externalSender: string;
  externalBank: string;
  multipleRecipients: RecipientEntry[];
}

export interface TransferRecord {
  id: string;
  reference: string;
  direction: TransferDirection;
  outwardType?: TransferType;
  amount: number;
  currency: string;
  status: TransferStatus;
  createdAt: string;
  debitAccount?: string;
  creditAccount?: string;
  beneficiary?: string;
  executionType: ExecutionType;
  executionDate?: string;
}

export const initialTransferFormData: TransferFormData = {
  direction: 'outward',
  outwardType: 'a2a',
  debitAccount: '',
  creditAccount: '',
  amount: 0,
  currency: 'USD',
  executionType: 'immediate',
  executionDate: '',
  frequency: '',
  reference: '',
  beneficiary: '',
  externalSender: '',
  externalBank: '',
  multipleRecipients: [],
};

export const FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
];

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'AED', label: 'AED - UAE Dirham' },
  { value: 'INR', label: 'INR - Indian Rupee' },
];

export const MOCK_ACCOUNTS = [
  { value: 'ACC001', label: 'Current Account - 1234567890' },
  { value: 'ACC002', label: 'Savings Account - 0987654321' },
  { value: 'ACC003', label: 'Business Account - 5678901234' },
];

export const MOCK_BENEFICIARIES = [
  { value: 'BEN001', label: 'John Doe - HSBC Bank' },
  { value: 'BEN002', label: 'Jane Smith - Citibank' },
  { value: 'BEN003', label: 'Acme Corp - Deutsche Bank' },
];
