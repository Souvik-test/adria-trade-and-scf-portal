// Adapter component that transforms flat formData to proper nested structures for Remittance panes
import React from 'react';
import {
  initialPaymentHeader,
  initialOrderingCustomer,
  initialBeneficiaryCustomer,
  initialAmountCharges,
  initialRoutingSettlement,
  initialRegulatoryCompliance,
  initialRemittanceInfo,
  initialSettlementHeader,
  initialInstructingAgent,
  initialInstructedAgent,
  initialSettlementAmount,
  initialCoverLinkage,
  initialSettlementInstructions,
  PaymentHeader,
  OrderingCustomer,
  BeneficiaryCustomer,
  AmountCharges,
  RoutingSettlement,
  RegulatoryCompliance,
  RemittanceInfo,
  SettlementHeader,
  InstructingAgent,
  InstructedAgent,
  SettlementAmount,
  CoverLinkage,
  SettlementInstructions,
} from '@/types/internationalRemittance';

// Map pane codes/names to their section key in formData
const PANE_SECTION_MAPPING: Record<string, string> = {
  // PACS.008 panes
  'PAYMENT_HEADER': 'paymentHeader',
  'Payment Header': 'paymentHeader',
  'ORDERING_CUSTOMER': 'orderingCustomer',
  'Ordering Customer': 'orderingCustomer',
  'BENEFICIARY_CUSTOMER': 'beneficiaryCustomer',
  'Beneficiary Customer': 'beneficiaryCustomer',
  'AMOUNT_CHARGES': 'amountCharges',
  'Amount & Charges': 'amountCharges',
  'Amount Charges': 'amountCharges',
  'ROUTING_SETTLEMENT': 'routingSettlement',
  'Routing & Settlement': 'routingSettlement',
  'Routing Settlement': 'routingSettlement',
  'REGULATORY_COMPLIANCE': 'regulatoryCompliance',
  'Regulatory & Compliance': 'regulatoryCompliance',
  'Regulatory Compliance': 'regulatoryCompliance',
  'REMITTANCE_INFO': 'remittanceInfo',
  'Remittance Information': 'remittanceInfo',
  'Remittance Info': 'remittanceInfo',
  'ACCOUNTING_ENTRIES': 'accountingEntries',
  'Accounting Entries': 'accountingEntries',
  'RELEASE_DOCUMENTS': 'releaseDocuments',
  'Release Documents': 'releaseDocuments',
  // PACS.009 panes
  'SETTLEMENT_HEADER': 'settlementHeader',
  'Settlement Header': 'settlementHeader',
  'INSTRUCTING_AGENT': 'instructingAgent',
  'Instructing Agent': 'instructingAgent',
  'INSTRUCTED_AGENT': 'instructedAgent',
  'Instructed Agent': 'instructedAgent',
  'SETTLEMENT_AMOUNT': 'settlementAmount',
  'Settlement Amount': 'settlementAmount',
  'COVER_LINKAGE': 'coverLinkage',
  'Cover Linkage': 'coverLinkage',
  'SETTLEMENT_INSTRUCTIONS': 'settlementInstructions',
  'Settlement Instructions': 'settlementInstructions',
};

// Default values mapping
const SECTION_DEFAULTS: Record<string, any> = {
  paymentHeader: initialPaymentHeader,
  orderingCustomer: initialOrderingCustomer,
  beneficiaryCustomer: initialBeneficiaryCustomer,
  amountCharges: initialAmountCharges,
  routingSettlement: initialRoutingSettlement,
  regulatoryCompliance: initialRegulatoryCompliance,
  remittanceInfo: initialRemittanceInfo,
  settlementHeader: initialSettlementHeader,
  instructingAgent: initialInstructingAgent,
  instructedAgent: initialInstructedAgent,
  settlementAmount: initialSettlementAmount,
  coverLinkage: initialCoverLinkage,
  settlementInstructions: initialSettlementInstructions,
  accountingEntries: {},
  releaseDocuments: {},
};

/**
 * Get the section key for a pane by its name or code
 */
export const getSectionKeyForPane = (paneName: string): string | null => {
  return PANE_SECTION_MAPPING[paneName] || null;
};

/**
 * Extract section data from formData for a specific pane
 */
export const extractSectionData = (
  formData: Record<string, any>,
  paneName: string
): any => {
  const sectionKey = getSectionKeyForPane(paneName);
  if (!sectionKey) {
    console.warn(`No section mapping found for pane: ${paneName}`);
    return {};
  }

  // Check if formData already has nested structure
  if (formData[sectionKey] && typeof formData[sectionKey] === 'object') {
    return { ...SECTION_DEFAULTS[sectionKey], ...formData[sectionKey] };
  }

  // Return defaults with any matching flat fields merged in
  return { ...SECTION_DEFAULTS[sectionKey] };
};

/**
 * Get default values for a section
 */
export const getSectionDefaults = (sectionKey: string): any => {
  return SECTION_DEFAULTS[sectionKey] || {};
};

interface RemittancePaneAdapterProps {
  PaneComponent: React.ComponentType<any>;
  paneName: string;
  formData: Record<string, any>;
  updateField: (field: string, value: any) => void;
  readOnly?: boolean;
}

/**
 * Adapter component that wraps Remittance panes and provides proper data structure
 */
const RemittancePaneAdapter: React.FC<RemittancePaneAdapterProps> = ({
  PaneComponent,
  paneName,
  formData,
  updateField,
  readOnly = false,
}) => {
  const sectionKey = getSectionKeyForPane(paneName);
  
  // Extract section data with defaults
  const sectionData = extractSectionData(formData, paneName);
  
  // Create onChange handler that updates the nested structure
  const handleChange = (field: string, value: any) => {
    if (sectionKey) {
      // Update the nested field: formData.sectionKey.field = value
      // We need to emit a change that the parent can understand
      // The updateField should handle nested paths
      updateField(`${sectionKey}.${field}`, value);
    }
  };

  return (
    <PaneComponent
      data={sectionData}
      onChange={handleChange}
      readOnly={readOnly}
    />
  );
};

export default RemittancePaneAdapter;
