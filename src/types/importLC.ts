export interface PartyDetail {
  id: string;
  role: 'applicant' | 'beneficiary' | 'advising_bank' | 'issuing_bank' | 'confirming_bank';
  name: string;
  address: string;
  swiftCode?: string;
  accountNumber?: string;
}

export interface DocumentRequirement {
  id: string;
  name: string;
  original: number;
  copies: number;
}

export interface ImportLCFormData {
  // Basic LC Information
  popiNumber: string;
  popiType: 'PO' | 'PI' | '';
  formOfDocumentaryCredit: string;
  corporateReference: string;
  applicableRules: string;
  lcType: string;
  issueDate: string;
  expiryDate: string;
  placeOfExpiry: string;
  confirmation: string;
  isTransferable: boolean;

  // Party Information (updated structure)
  parties: PartyDetail[];
  
  // Legacy fields for backward compatibility
  applicantName: string;
  applicantAddress: string;
  applicantAccountNumber: string;
  beneficiaryName: string;
  beneficiaryAddress: string;
  beneficiaryBankName: string;
  beneficiaryBankAddress: string;
  beneficiaryBankSwiftCode: string;
  advisingBankSwiftCode: string;

  // LC Amount and Terms
  lcAmount: number;
  currency: string;
  tolerance: string;
  additionalAmount: number;
  availableWith: string;
  availableBy: string;
  partialShipmentsAllowed: boolean;
  transshipmentAllowed: boolean;

  // Shipment Details
  descriptionOfGoods: string;
  portOfLoading: string;
  portOfDischarge: string;
  latestShipmentDate: string;
  presentationPeriod: string;

  // Document Requirements (updated structure)
  documentRequirements: DocumentRequirement[];
  requiredDocuments: string[];
  additionalConditions: string;
  supportingDocuments: File[];
}

export type ImportLCFormStep = 'basic' | 'parties' | 'amount' | 'shipment' | 'documents';

export interface SwiftTagInfo {
  tag: string;
  label: string;
  description: string;
  required: boolean;
}

// Only change 'lcAmount' field's label
export const SWIFT_TAGS: Record<string, SwiftTagInfo> = {
  corporateReference: {
    tag: ':20:',
    label: 'Sender\'s Reference',
    description: 'Unique reference assigned by the sender',
    required: true
  },
  formOfDocumentaryCredit: {
    tag: ':40A:',
    label: 'Form of Documentary Credit',
    description: 'Irrevocable/Revocable Documentary Credit',
    required: true
  },
  lcAmount: {
    tag: ':32B:',
    label: 'Amount',
    description: 'Amount of the credit', // No mention of currency code!
    required: true
  },
  applicantName: {
    tag: ':50:',
    label: 'Applicant',
    description: 'Name and address of the applicant',
    required: true
  },
  beneficiaryName: {
    tag: ':59:',
    label: 'Beneficiary',
    description: 'Name and address of the beneficiary',
    required: true
  },
  expiryDate: {
    tag: ':31D:',
    label: 'Date and Place of Expiry',
    description: 'Expiry date and place of the credit',
    required: true
  },
  availableWith: {
    tag: ':41A:',
    label: 'Available With/By',
    description: 'Bank with which credit is available',
    required: false
  },
  partialShipmentsAllowed: {
    tag: ':43P:',
    label: 'Partial Shipments',
    description: 'Allowed/Not Allowed',
    required: false
  },
  transshipmentAllowed: {
    tag: ':43T:',
    label: 'Transshipment',
    description: 'Allowed/Not Allowed',
    required: false
  },
  portOfLoading: {
    tag: ':44E:',
    label: 'Port of Loading',
    description: 'Port/Airport/Place of loading/dispatch',
    required: false
  },
  portOfDischarge: {
    tag: ':44F:',
    label: 'Port of Discharge',
    description: 'Port/Airport/Place of final destination',
    required: false
  },
  latestShipmentDate: {
    tag: ':44C:',
    label: 'Latest Date of Shipment',
    description: 'Latest date for shipment of goods',
    required: false
  },
  descriptionOfGoods: {
    tag: ':45A:',
    label: 'Description of Goods',
    description: 'Description of goods and/or services',
    required: true
  },
  requiredDocuments: {
    tag: ':46A:',
    label: 'Documents Required',
    description: 'Documents required for presentation',
    required: true
  }
};
