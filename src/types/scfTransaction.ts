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
  productType?: string;
  transactionReference?: string;
  programId?: string;
  anchorId?: string;
  counterPartyId?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
}

export interface FinanceEligibility {
  eligible: boolean;
  reason?: string;
}
