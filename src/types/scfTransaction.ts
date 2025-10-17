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

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  sortable: boolean;
  alwaysVisible?: boolean;
}

export const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: "productType", label: "Product Type", visible: true, sortable: true },
  { id: "transactionReference", label: "Transaction Reference", visible: true, sortable: true, alwaysVisible: true },
  { id: "programId", label: "Program ID", visible: true, sortable: true },
  { id: "programName", label: "Program Name", visible: true, sortable: false },
  { id: "anchorId", label: "Anchor ID", visible: true, sortable: false },
  { id: "anchorName", label: "Anchor Name", visible: true, sortable: false },
  { id: "counterPartyId", label: "Counter Party ID", visible: true, sortable: false },
  { id: "counterPartyName", label: "Counter Party Name", visible: true, sortable: false },
  { id: "transactionDate", label: "Transaction Date", visible: true, sortable: true },
  { id: "dueDate", label: "Due Date", visible: true, sortable: false },
  { id: "currency", label: "Currency", visible: true, sortable: false },
  { id: "amount", label: "Amount", visible: true, sortable: true },
  { id: "financeEligible", label: "Finance Eligible", visible: true, sortable: false },
  { id: "relatedTransactionRefs", label: "Related Refs", visible: true, sortable: false },
  { id: "status", label: "Status", visible: true, sortable: true }
];
