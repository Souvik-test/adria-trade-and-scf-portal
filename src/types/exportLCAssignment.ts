
export interface AssigneeDetails {
  name: string;
  address: string;
  country: string;
  bankName: string;
  bankAddress: string;
  swiftCode: string;
  accountNumber: string;
}

export interface AssignmentFormData {
  // LC Information
  lcReference: string;
  issuingBank: string;
  issuanceDate: string;
  applicant: string;
  currency: string;
  amount: string;
  expiryDate: string;
  currentBeneficiary: string;
  
  // Assignment Details
  assignmentType: 'Proceeds' | 'Rights';
  assignmentAmount: string;
  assignmentPercentage: string;
  assignee: AssigneeDetails;
  assignmentConditions: string;
  assignmentPurpose: string;
  
  // Documents
  requiredDocuments: string[];
  supportingDocuments: File[];
  requiredDocumentsChecked: Record<string, boolean>;
}

export type AssignmentFormStep = 
  | 'lc-information'
  | 'assignment-details'
  | 'assignee-information'
  | 'documents'
  | 'review-submit';

export const assignmentStepOrder: AssignmentFormStep[] = [
  'lc-information',
  'assignment-details',
  'assignee-information',
  'documents',
  'review-submit'
];
