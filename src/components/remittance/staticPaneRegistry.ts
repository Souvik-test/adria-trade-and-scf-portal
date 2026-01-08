// Static Pane Registry for Remittance Product (International Transfer)
// Similar structure to Import LC static pane registry for workflow configuration mapping

import React from 'react';
import PaymentHeaderPane from './panes/PaymentHeaderPane';
import OrderingCustomerPane from './panes/OrderingCustomerPane';
import BeneficiaryCustomerPane from './panes/BeneficiaryCustomerPane';
import AmountChargesPane from './panes/AmountChargesPane';
import RoutingSettlementPane from './panes/RoutingSettlementPane';
import RegulatoryCompliancePane from './panes/RegulatoryCompliancePane';
import RemittanceInfoPane from './panes/RemittanceInfoPane';
import RemittanceAccountingEntriesPane from './panes/RemittanceAccountingEntriesPane';
import RemittanceReleaseDocumentsPane from './panes/RemittanceReleaseDocumentsPane';
// PACS.009 Panes
import SettlementHeaderPane from './panes/SettlementHeaderPane';
import InstructingAgentPane from './panes/InstructingAgentPane';
import InstructedAgentPane from './panes/InstructedAgentPane';
import SettlementAmountPane from './panes/SettlementAmountPane';
import CoverLinkagePane from './panes/CoverLinkagePane';
import SettlementInstructionsPane from './panes/SettlementInstructionsPane';
import { OutwardRemittanceFormData, FICreditTransferFormData } from '@/types/internationalRemittance';

// ============= INTERFACES =============

export interface RemittanceStaticPaneProps {
  formData: OutwardRemittanceFormData | FICreditTransferFormData;
  updateField?: (section: string, field: string, value: any) => void;
  readOnly?: boolean;
}

export interface RemittanceStaticPaneConfig {
  component: React.ComponentType<any>;
  name: string;
  paneCode: string;
}

export interface RemittanceStaticStageConfig {
  panes: RemittanceStaticPaneConfig[];
  readOnly: boolean;
}

// ============= PACS.008 PANE CONFIGURATIONS =============

const pacs008DataEntryPanes: RemittanceStaticPaneConfig[] = [
  { component: PaymentHeaderPane, name: 'Payment Header', paneCode: 'PAYMENT_HEADER' },
  { component: OrderingCustomerPane, name: 'Ordering Customer', paneCode: 'ORDERING_CUSTOMER' },
  { component: BeneficiaryCustomerPane, name: 'Beneficiary Customer', paneCode: 'BENEFICIARY_CUSTOMER' },
  { component: AmountChargesPane, name: 'Amount & Charges', paneCode: 'AMOUNT_CHARGES' },
  { component: RoutingSettlementPane, name: 'Routing & Settlement', paneCode: 'ROUTING_SETTLEMENT' },
  { component: RegulatoryCompliancePane, name: 'Regulatory & Compliance', paneCode: 'REGULATORY_COMPLIANCE' },
  { component: RemittanceInfoPane, name: 'Remittance Information', paneCode: 'REMITTANCE_INFO' },
  { component: RemittanceAccountingEntriesPane, name: 'Accounting Entries', paneCode: 'ACCOUNTING_ENTRIES' },
  { component: RemittanceReleaseDocumentsPane, name: 'Release Documents', paneCode: 'RELEASE_DOCUMENTS' },
];

// ============= PACS.009 PANE CONFIGURATIONS =============

const pacs009DataEntryPanes: RemittanceStaticPaneConfig[] = [
  { component: SettlementHeaderPane, name: 'Settlement Header', paneCode: 'SETTLEMENT_HEADER' },
  { component: InstructingAgentPane, name: 'Instructing Agent', paneCode: 'INSTRUCTING_AGENT' },
  { component: InstructedAgentPane, name: 'Instructed Agent', paneCode: 'INSTRUCTED_AGENT' },
  { component: SettlementAmountPane, name: 'Settlement Amount', paneCode: 'SETTLEMENT_AMOUNT' },
  { component: CoverLinkagePane, name: 'Cover Linkage', paneCode: 'COVER_LINKAGE' },
  { component: SettlementInstructionsPane, name: 'Settlement Instructions', paneCode: 'SETTLEMENT_INSTRUCTIONS' },
];

// ============= STAGE CONFIGURATIONS =============

export const remittanceStaticStageConfigurations: Record<string, RemittanceStaticStageConfig> = {
  // PACS.008 stages
  'Data Entry': { panes: pacs008DataEntryPanes, readOnly: false },
  'Approval': { panes: pacs008DataEntryPanes, readOnly: true },
  'Authorization': { panes: pacs008DataEntryPanes, readOnly: true },
  'Checker': { panes: pacs008DataEntryPanes, readOnly: true },
  
  // PACS.009 stages (FI Credit Transfer)
  'FI Data Entry': { panes: pacs009DataEntryPanes, readOnly: false },
  'FI Approval': { panes: pacs009DataEntryPanes, readOnly: true },
};

// ============= LEGACY REGISTRY (Backward Compatibility) =============

export const remittanceStaticPaneRegistry: Record<string, React.ComponentType<any>> = {
  // PACS.008 panes
  'Payment Header': PaymentHeaderPane,
  'Ordering Customer': OrderingCustomerPane,
  'Beneficiary Customer': BeneficiaryCustomerPane,
  'Amount & Charges': AmountChargesPane,
  'Amount Charges': AmountChargesPane,
  'Routing & Settlement': RoutingSettlementPane,
  'Routing Settlement': RoutingSettlementPane,
  'Regulatory & Compliance': RegulatoryCompliancePane,
  'Regulatory Compliance': RegulatoryCompliancePane,
  'Remittance Information': RemittanceInfoPane,
  'Remittance Info': RemittanceInfoPane,
  'Accounting Entries': RemittanceAccountingEntriesPane,
  'Release Documents': RemittanceReleaseDocumentsPane,
  
  // PACS.009 panes
  'Settlement Header': SettlementHeaderPane,
  'Instructing Agent': InstructingAgentPane,
  'Instructed Agent': InstructedAgentPane,
  'Settlement Amount': SettlementAmountPane,
  'Cover Linkage': CoverLinkagePane,
  'Settlement Instructions': SettlementInstructionsPane,
};

// ============= AVAILABLE PANES LIST =============

export const REMITTANCE_AVAILABLE_STATIC_PANES = [
  // PACS.008 panes
  { value: 'PAYMENT_HEADER', label: 'Payment Header', transferType: 'customer' },
  { value: 'ORDERING_CUSTOMER', label: 'Ordering Customer', transferType: 'customer' },
  { value: 'BENEFICIARY_CUSTOMER', label: 'Beneficiary Customer', transferType: 'customer' },
  { value: 'AMOUNT_CHARGES', label: 'Amount & Charges', transferType: 'customer' },
  { value: 'ROUTING_SETTLEMENT', label: 'Routing & Settlement', transferType: 'customer' },
  { value: 'REGULATORY_COMPLIANCE', label: 'Regulatory & Compliance', transferType: 'customer' },
  { value: 'REMITTANCE_INFO', label: 'Remittance Information', transferType: 'customer' },
  { value: 'ACCOUNTING_ENTRIES', label: 'Accounting Entries', transferType: 'customer' },
  { value: 'RELEASE_DOCUMENTS', label: 'Release Documents', transferType: 'customer' },
  
  // PACS.009 panes
  { value: 'SETTLEMENT_HEADER', label: 'Settlement Header', transferType: 'fi' },
  { value: 'INSTRUCTING_AGENT', label: 'Instructing Agent', transferType: 'fi' },
  { value: 'INSTRUCTED_AGENT', label: 'Instructed Agent', transferType: 'fi' },
  { value: 'SETTLEMENT_AMOUNT', label: 'Settlement Amount', transferType: 'fi' },
  { value: 'COVER_LINKAGE', label: 'Cover Linkage', transferType: 'fi' },
  { value: 'SETTLEMENT_INSTRUCTIONS', label: 'Settlement Instructions', transferType: 'fi' },
];

// ============= UTILITY FUNCTIONS =============

/**
 * Get stage configuration for a given stage name
 */
export const getRemittanceStaticStageConfig = (stageName: string): RemittanceStaticStageConfig | null => {
  // Exact match
  if (remittanceStaticStageConfigurations[stageName]) {
    return remittanceStaticStageConfigurations[stageName];
  }

  // Case-insensitive match
  const normalizedStageName = stageName.toLowerCase().trim();
  for (const [key, config] of Object.entries(remittanceStaticStageConfigurations)) {
    if (key.toLowerCase().trim() === normalizedStageName) {
      return config;
    }
  }

  // Keyword-based fuzzy matching
  if (normalizedStageName.includes('data entry') || normalizedStageName.includes('maker') || normalizedStageName.includes('input')) {
    return remittanceStaticStageConfigurations['Data Entry'];
  }
  
  if (normalizedStageName.includes('approval') || normalizedStageName.includes('checker') || normalizedStageName.includes('review')) {
    return remittanceStaticStageConfigurations['Approval'];
  }
  
  if (normalizedStageName.includes('authorization') || normalizedStageName.includes('final')) {
    return remittanceStaticStageConfigurations['Authorization'];
  }

  return null;
};

/**
 * Get static pane component by pane name
 */
export const getRemittanceStaticPaneComponent = (paneName: string): React.ComponentType<any> | null => {
  if (remittanceStaticPaneRegistry[paneName]) {
    return remittanceStaticPaneRegistry[paneName];
  }

  // Case-insensitive fallback
  const normalizedName = paneName.toLowerCase().trim();
  for (const [key, component] of Object.entries(remittanceStaticPaneRegistry)) {
    if (key.toLowerCase().trim() === normalizedName) {
      return component;
    }
  }

  return null;
};

/**
 * Check if a stage has static pane configuration
 */
export const hasRemittanceStaticPaneComponent = (stageName: string): boolean => {
  return getRemittanceStaticStageConfig(stageName) !== null;
};

/**
 * Get panes by their codes
 */
export const getRemittanceStaticPanesByCode = (paneCodes: string[]): RemittanceStaticPaneConfig[] => {
  const allPanes = [...pacs008DataEntryPanes, ...pacs009DataEntryPanes];
  
  return paneCodes
    .map(code => allPanes.find(p => p.paneCode === code))
    .filter((p): p is RemittanceStaticPaneConfig => p !== undefined);
};

/**
 * Get panes by their names (for workflow configuration which stores names)
 */
export const getRemittanceStaticPanesByName = (paneNames: string[]): RemittanceStaticPaneConfig[] => {
  const allPanes = [...pacs008DataEntryPanes, ...pacs009DataEntryPanes];
  
  const normalizeName = (name: string) => 
    name.toLowerCase().replace(/&/g, '').replace(/\s+/g, ' ').trim();
  
  return paneNames
    .map(name => {
      // Exact match by name
      const exactMatch = allPanes.find(p => p.name === name);
      if (exactMatch) return exactMatch;
      
      // Case-insensitive match
      const lowerName = name.toLowerCase();
      const caseInsensitive = allPanes.find(p => p.name.toLowerCase() === lowerName);
      if (caseInsensitive) return caseInsensitive;
      
      // Normalized match (handles & vs no &, extra spaces)
      const normalizedInput = normalizeName(name);
      const normalizedMatch = allPanes.find(p => normalizeName(p.name) === normalizedInput);
      if (normalizedMatch) return normalizedMatch;
      
      // Also try matching by paneCode for backward compatibility
      const codeMatch = allPanes.find(p => p.paneCode === name);
      if (codeMatch) return codeMatch;
      
      console.warn(`Remittance pane "${name}" not found`);
      return undefined;
    })
    .filter((p): p is RemittanceStaticPaneConfig => p !== undefined);
};

/**
 * Get suggested panes based on stage name keywords
 */
export const getSuggestedRemittancePanes = (stageName: string, transferType: 'customer' | 'fi' = 'customer'): string[] => {
  const normalizedName = stageName.toLowerCase();
  
  if (transferType === 'fi') {
    return ['SETTLEMENT_HEADER', 'INSTRUCTING_AGENT', 'INSTRUCTED_AGENT', 'SETTLEMENT_AMOUNT', 'COVER_LINKAGE', 'SETTLEMENT_INSTRUCTIONS'];
  }
  
  // Default PACS.008 panes
  if (normalizedName.includes('data entry') || normalizedName.includes('maker')) {
    return ['PAYMENT_HEADER', 'ORDERING_CUSTOMER', 'BENEFICIARY_CUSTOMER', 'AMOUNT_CHARGES', 'ROUTING_SETTLEMENT', 'REGULATORY_COMPLIANCE', 'REMITTANCE_INFO', 'ACCOUNTING_ENTRIES', 'RELEASE_DOCUMENTS'];
  }
  
  // Approval stages - same panes but read-only
  return ['PAYMENT_HEADER', 'ORDERING_CUSTOMER', 'BENEFICIARY_CUSTOMER', 'AMOUNT_CHARGES', 'ROUTING_SETTLEMENT', 'REGULATORY_COMPLIANCE', 'REMITTANCE_INFO', 'ACCOUNTING_ENTRIES', 'RELEASE_DOCUMENTS'];
};
