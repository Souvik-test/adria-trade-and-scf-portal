export interface SCFTransactionRow {
  id: string;
  productType: 'Invoice' | 'Credit Note' | 'Debit Note' | 'Finance Disbursement' | 'Finance Repayment';
  transactionReference: string;
  programId: string;
  programName: string;
  anchorId: string;
  anchorName: string;
  counterPartyId: string;
  counterPartyName: string;
  transactionDate: string;
  dueDate: string | null;
  currency: string;
  amount: number;
  financeEligible: boolean;
  financeEligibleReason?: string;
  relatedTransactionRefs: string[];
  status: string;
  rawData: any;
}

export interface TransactionFilters {
  wildcardSearch?: string;
  productType?: string;
  transactionReference?: string;
  programId?: string;
  programName?: string;
  anchorId?: string;
  anchorName?: string;
  counterPartyId?: string;
  counterPartyName?: string;
  status?: string;
  currency?: string;
  fromDate?: string;
  toDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface FinanceEligibility {
  eligible: boolean;
  reason?: string;
}
