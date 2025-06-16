
export type LCAssignmentFormStep = 
  | 'lc-and-assignment'  // Step 1: LC Information & Assignment Details
  | 'assignee-docs';     // Step 2: Assignee Info & Documents

export const assignmentStepOrder: LCAssignmentFormStep[] = [
  'lc-and-assignment',
  'assignee-docs'
];

export type AssignmentType = 'Full' | 'Partial';

export interface Assignee {
  name: string;
  address: string;
  country?: string;
  bankName?: string;
  bankAddress?: string;
  swiftCode: string;
  accountNumber: string;
}

export interface LCAssignmentFormData {
  // Step 1: Basic LC Info
  lcReference: string;
  issuingBank: string;
  issuanceDate?: string;
  applicant: string;
  currency: string;
  amount: number | '';
  expiryDate: string;
  currentBeneficiary: string;

  // Step 2: Assignment Details
  assignmentType: AssignmentType;
  assignmentAmount: number | '';
  assignmentConditions: string;
  assignmentReason: string;

  // Step 3: Assignee Info & Documents
  assignee: Assignee;

  // Step 4: Supporting Documents
  requiredDocuments: string[];
  supportingDocuments: File[];

  // Optionally for checked state on required documents
  requiredDocumentsChecked?: Record<string, boolean>;
}
