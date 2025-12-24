// International Remittance Types - pacs.008 / pacs.009 Specifications

// =====================================================
// DROPDOWN OPTIONS - Business Friendly Labels
// =====================================================

export const SETTLEMENT_METHOD_OPTIONS = [
  { value: 'INDA', label: 'Through Correspondent Bank' },
  { value: 'COVE', label: 'Cover Payment Method' },
];

export const CHARGE_BEARER_OPTIONS = [
  { value: 'OUR', label: 'Sender Pays All Charges' },
  { value: 'SHA', label: 'Shared Charges' },
  { value: 'BEN', label: 'Beneficiary Pays All Charges' },
];

export const PURPOSE_CODE_OPTIONS = [
  { value: 'P010', label: 'P010 - Family Maintenance' },
  { value: 'P020', label: 'P020 - Education' },
  { value: 'P030', label: 'P030 - Medical Treatment' },
  { value: 'P080', label: 'P080 - Trade Settlement' },
  { value: 'P999', label: 'P999 - Others' },
];

export const SOURCE_OF_FUNDS_OPTIONS = [
  { value: 'SALARY', label: 'Salary / Employment Income' },
  { value: 'BUSINESS', label: 'Business Income' },
  { value: 'SAVINGS', label: 'Personal Savings' },
  { value: 'INVESTMENT', label: 'Investment Returns' },
  { value: 'LOAN', label: 'Loan Proceeds' },
  { value: 'GIFT', label: 'Gift / Inheritance' },
  { value: 'OTHER', label: 'Other' },
];

export const COUNTRY_OPTIONS = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AE', label: 'United Arab Emirates' },
  { value: 'IN', label: 'India' },
  { value: 'SG', label: 'Singapore' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'CH', label: 'Switzerland' },
  { value: 'AU', label: 'Australia' },
  { value: 'CA', label: 'Canada' },
  { value: 'HK', label: 'Hong Kong' },
];

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'AED', label: 'AED - UAE Dirham' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'CHF', label: 'CHF - Swiss Franc' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'SGD', label: 'SGD - Singapore Dollar' },
];

// =====================================================
// PANE 1: Payment Header (pacs.008)
// =====================================================
export interface PaymentHeader {
  msgRef: string;           // Max 35, Read-only, System generated
  uetr: string;             // Max 36, Read-only, UUID format
  creDt: string;            // Read-only, ISO DateTime
  sttlmMtd: 'INDA' | 'COVE' | ''; // Settlement Method dropdown
}

export const initialPaymentHeader: PaymentHeader = {
  msgRef: '',
  uetr: '',
  creDt: '',
  sttlmMtd: '',
};

// =====================================================
// PANE 2: Ordering Customer
// =====================================================
export interface OrderingCustomer {
  ordName: string;          // Max 140, Mandatory
  ordAcct: string;          // Max 34, Mandatory (IBAN/BBAN)
  ordAddr1: string;         // Max 70, Optional
  ordAddr2: string;         // Max 70, Optional
  ordCountry: string;       // ISO 2-letter, Mandatory
}

export const initialOrderingCustomer: OrderingCustomer = {
  ordName: '',
  ordAcct: '',
  ordAddr1: '',
  ordAddr2: '',
  ordCountry: '',
};

// =====================================================
// PANE 3: Beneficiary Customer
// =====================================================
export interface BeneficiaryCustomer {
  benName: string;          // Max 140, Mandatory
  benAcct: string;          // Max 34, Mandatory
  benBic: string;           // Max 11, Mandatory (BIC format)
  benAddr1: string;         // Max 70, Optional
  benAddr2: string;         // Max 70, Optional
  benCountry: string;       // ISO 2-letter, Mandatory
}

export const initialBeneficiaryCustomer: BeneficiaryCustomer = {
  benName: '',
  benAcct: '',
  benBic: '',
  benAddr1: '',
  benAddr2: '',
  benCountry: '',
};

// =====================================================
// PANE 4: Amount & Charges
// =====================================================
export interface AmountCharges {
  instAmt: number | '';     // Decimal 18,2, Mandatory
  ccy: string;              // ISO 4217 3-letter, Mandatory
  chgBr: 'OUR' | 'SHA' | 'BEN' | ''; // Charge Bearer, Mandatory
  fxRate: number | '';      // Decimal 10,6, Read-only, Optional
}

export const initialAmountCharges: AmountCharges = {
  instAmt: '',
  ccy: '',
  chgBr: '',
  fxRate: '',
};

// =====================================================
// PANE 5: Routing & Settlement
// =====================================================
export interface RoutingSettlement {
  instgAgtBic: string;      // Max 11, Instructing Agent BIC
  instdAgtBic: string;      // Max 11, Instructed Agent BIC
  intrmyBic: string;        // Max 11, Intermediary Bank BIC, Optional
  intrmyName: string;       // Max 140, Intermediary Bank Name, Optional
  intrmyAcct: string;       // Max 34, Intermediary Account, Optional
}

export const initialRoutingSettlement: RoutingSettlement = {
  instgAgtBic: '',
  instdAgtBic: '',
  intrmyBic: '',
  intrmyName: '',
  intrmyAcct: '',
};

// =====================================================
// PANE 6: Regulatory & Compliance
// =====================================================
export interface RegulatoryCompliance {
  purpCd: string;           // Purpose Code, Mandatory
  srcFunds: string;         // Source of Funds, Mandatory
  declFlg: boolean;         // Declaration Accepted, Mandatory
}

export const initialRegulatoryCompliance: RegulatoryCompliance = {
  purpCd: '',
  srcFunds: '',
  declFlg: false,
};

// =====================================================
// PANE 7: Remittance Information
// =====================================================
export interface RemittanceInfo {
  rmtInfo: string;          // Max 140, Optional, TextArea
  invRef: string;           // Max 35, Optional
}

export const initialRemittanceInfo: RemittanceInfo = {
  rmtInfo: '',
  invRef: '',
};

// =====================================================
// Combined Form Data for Outward International Remittance
// =====================================================
export interface OutwardRemittanceFormData {
  paymentHeader: PaymentHeader;
  orderingCustomer: OrderingCustomer;
  beneficiaryCustomer: BeneficiaryCustomer;
  amountCharges: AmountCharges;
  routingSettlement: RoutingSettlement;
  regulatoryCompliance: RegulatoryCompliance;
  remittanceInfo: RemittanceInfo;
}

export const initialOutwardRemittanceFormData: OutwardRemittanceFormData = {
  paymentHeader: initialPaymentHeader,
  orderingCustomer: initialOrderingCustomer,
  beneficiaryCustomer: initialBeneficiaryCustomer,
  amountCharges: initialAmountCharges,
  routingSettlement: initialRoutingSettlement,
  regulatoryCompliance: initialRegulatoryCompliance,
  remittanceInfo: initialRemittanceInfo,
};

// =====================================================
// Utility Functions
// =====================================================
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const generateMessageRef = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `MSG${timestamp}${random}`.substring(0, 35);
};

export const validateBIC = (bic: string): boolean => {
  // BIC format: 8 or 11 alphanumeric characters
  const bicRegex = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  return bicRegex.test(bic.toUpperCase());
};

export const validateIBAN = (iban: string): boolean => {
  // Basic IBAN validation: 15-34 alphanumeric characters
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{11,30}$/;
  return ibanRegex.test(iban.toUpperCase().replace(/\s/g, ''));
};
