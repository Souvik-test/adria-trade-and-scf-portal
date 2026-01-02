import React from 'react';
import LimitDetailsPane from './LimitDetailsPane';
import SanctionDetailsPane from './SanctionDetailsPane';
import AccountingEntriesPane from './AccountingEntriesPane';
import ReleaseDocumentsPane from './ReleaseDocumentsPane';
import BasicLCInformationPane from './BasicLCInformationPane';
import ApplicantInformationPane from './ApplicantInformationPane';
import BeneficiaryInformationPane from './BeneficiaryInformationPane';
import PartyDetailsPane from './PartyDetailsPane';
import LCAmountTermsPane from './LCAmountTermsPane';
import ShipmentDetailsPane from './ShipmentDetailsPane';
import DocumentRequirementsPane from './DocumentRequirementsPane';
import MT700PreviewPane from './MT700PreviewPane';
import { ImportLCFormData } from '@/types/importLC';

/**
 * Common props interface for all static pane components.
 */
export interface StaticPaneProps {
  formData: ImportLCFormData;
  updateField?: (field: keyof ImportLCFormData, value: any) => void;
  readOnly?: boolean;
}

/**
 * Configuration for a single pane within a stage.
 */
export interface StaticPaneConfig {
  component: React.ComponentType<StaticPaneProps>;
  name: string;
}

/**
 * Configuration for a complete stage with one or more panes.
 */
export interface StaticStageConfig {
  panes: StaticPaneConfig[];
  readOnly: boolean;
}

/**
 * Data Entry stage panes - full form with all editable panes.
 */
const dataEntryPanes: StaticPaneConfig[] = [
  { component: BasicLCInformationPane as React.ComponentType<StaticPaneProps>, name: 'Basic LC Information' },
  { component: PartyDetailsPane as React.ComponentType<StaticPaneProps>, name: 'Party Details' },
  { component: LCAmountTermsPane as React.ComponentType<StaticPaneProps>, name: 'LC Amount & Terms' },
  { component: ShipmentDetailsPane as React.ComponentType<StaticPaneProps>, name: 'Shipment Details' },
  { component: DocumentRequirementsPane as React.ComponentType<StaticPaneProps>, name: 'Document Requirements' },
  { component: AccountingEntriesPane as React.ComponentType<StaticPaneProps>, name: 'Accounting Entries' },
  { component: ReleaseDocumentsPane as React.ComponentType<StaticPaneProps>, name: 'Release Documents' },
];

/**
 * Static stage configurations mapping stage types to their panes and read-only state.
 */
export const staticStageConfigurations: Record<string, StaticStageConfig> = {
  // Data Entry / Input / Registration stages - Full form with all panes (editable)
  'Data Entry': { panes: dataEntryPanes, readOnly: false },
  'Input': { panes: dataEntryPanes, readOnly: false },
  'Registration': { panes: dataEntryPanes, readOnly: false },
  'Data Entry Stage': { panes: dataEntryPanes, readOnly: false },
  'Input Stage': { panes: dataEntryPanes, readOnly: false },
  'Registration Stage': { panes: dataEntryPanes, readOnly: false },
  
  // Limit Check stages - Single pane
  'Limit Check': { 
    panes: [{ component: LimitDetailsPane as React.ComponentType<StaticPaneProps>, name: 'Limit Details' }], 
    readOnly: false 
  },
  'Limit Checking': { 
    panes: [{ component: LimitDetailsPane as React.ComponentType<StaticPaneProps>, name: 'Limit Details' }], 
    readOnly: false 
  },
  'Limit Validation': { 
    panes: [{ component: LimitDetailsPane as React.ComponentType<StaticPaneProps>, name: 'Limit Details' }], 
    readOnly: false 
  },
  
  // Compliance/Sanction Check stages - Single pane
  'Compliance Check': { 
    panes: [{ component: SanctionDetailsPane as React.ComponentType<StaticPaneProps>, name: 'Sanction Details' }], 
    readOnly: false 
  },
  'Compliance': { 
    panes: [{ component: SanctionDetailsPane as React.ComponentType<StaticPaneProps>, name: 'Sanction Details' }], 
    readOnly: false 
  },
  'Sanction Check': { 
    panes: [{ component: SanctionDetailsPane as React.ComponentType<StaticPaneProps>, name: 'Sanction Details' }], 
    readOnly: false 
  },
  'Sanction Checking': { 
    panes: [{ component: SanctionDetailsPane as React.ComponentType<StaticPaneProps>, name: 'Sanction Details' }], 
    readOnly: false 
  },
  'Sanction Screening': { 
    panes: [{ component: SanctionDetailsPane as React.ComponentType<StaticPaneProps>, name: 'Sanction Details' }], 
    readOnly: false 
  },
  'AML Check': { 
    panes: [{ component: SanctionDetailsPane as React.ComponentType<StaticPaneProps>, name: 'Sanction Details' }], 
    readOnly: false 
  },
  
  // Approver/Checker stages - All panes in read-only mode
  'Approver': { panes: dataEntryPanes, readOnly: true },
  'Authorization': { panes: dataEntryPanes, readOnly: true },
  'Checker': { panes: dataEntryPanes, readOnly: true },
  'Approval': { panes: dataEntryPanes, readOnly: true },
  'Review': { panes: dataEntryPanes, readOnly: true },
  'Approver Stage': { panes: dataEntryPanes, readOnly: true },
  'Authorization Stage': { panes: dataEntryPanes, readOnly: true },
  'Checker Stage': { panes: dataEntryPanes, readOnly: true },
};

/**
 * Keyword patterns for fuzzy matching stage names to configurations.
 */
const keywordPatterns: { keywords: string[]; configKey: string }[] = [
  { keywords: ['data entry', 'input', 'registration', 'entry stage'], configKey: 'Data Entry' },
  { keywords: ['limit', 'limit check', 'limit validation'], configKey: 'Limit Check' },
  { keywords: ['compliance', 'sanction', 'aml', 'kyc', 'screening'], configKey: 'Compliance Check' },
  { keywords: ['approver', 'authorization', 'checker', 'reviewer', 'verify', 'approval'], configKey: 'Approver' },
];

/**
 * Get the stage configuration for a given stage name with fuzzy matching.
 * Returns null if no configuration is found.
 */
export const getStaticStageConfig = (stageName: string): StaticStageConfig | null => {
  // Exact match first
  if (staticStageConfigurations[stageName]) {
    return staticStageConfigurations[stageName];
  }
  
  // Case-insensitive match
  const normalizedName = stageName.toLowerCase();
  for (const [key, config] of Object.entries(staticStageConfigurations)) {
    if (key.toLowerCase() === normalizedName) {
      return config;
    }
  }
  
  // Keyword matching for common variations
  for (const { keywords, configKey } of keywordPatterns) {
    if (keywords.some(kw => normalizedName.includes(kw))) {
      return staticStageConfigurations[configKey];
    }
  }
  
  return null;
};

/**
 * Legacy registry for backward compatibility - maps stage names to single components.
 */
export const staticPaneRegistry: Record<string, React.ComponentType<any>> = {
  // Limit-related stages
  'Limit Check': LimitDetailsPane,
  'Limit Checking': LimitDetailsPane,
  'Limit Validation': LimitDetailsPane,
  
  // Compliance/Sanction-related stages
  'Compliance Check': SanctionDetailsPane,
  'Sanction Check': SanctionDetailsPane,
  'Sanction Checking': SanctionDetailsPane,
  'Sanction Screening': SanctionDetailsPane,
  'AML Check': SanctionDetailsPane,
  
  // Accounting stages
  'Accounting': AccountingEntriesPane,
  'Accounting Entries': AccountingEntriesPane,
  'Accounting Entry': AccountingEntriesPane,
  
  // Release/Document stages
  'Release Documents': ReleaseDocumentsPane,
  'Document Release': ReleaseDocumentsPane,
  'Release': ReleaseDocumentsPane,
  
  // LC Information stages
  'Basic LC Information': BasicLCInformationPane,
  'LC Information': BasicLCInformationPane,
  'LC Details': BasicLCInformationPane,
  'Data Entry Review': BasicLCInformationPane,
  'LC Review': BasicLCInformationPane,
  
  // Applicant stages
  'Applicant Information': ApplicantInformationPane,
  'Applicant Details': ApplicantInformationPane,
  
  // Beneficiary stages
  'Beneficiary Information': BeneficiaryInformationPane,
  'Beneficiary Details': BeneficiaryInformationPane,
  
  // Party stages
  'Party Details': PartyDetailsPane,
  'Parties': PartyDetailsPane,
  
  // Amount/Terms stages
  'LC Amount Terms': LCAmountTermsPane,
  'Amount Terms': LCAmountTermsPane,
  'LC Amount': LCAmountTermsPane,
  
  // Shipment stages
  'Shipment Details': ShipmentDetailsPane,
  'Shipment': ShipmentDetailsPane,
  
  // Document stages
  'Document Requirements': DocumentRequirementsPane,
  'Documents': DocumentRequirementsPane,
  'Required Documents': DocumentRequirementsPane,
  
  // MT700 Preview stages
  'MT700 Preview': MT700PreviewPane,
  'SWIFT Preview': MT700PreviewPane,
};

/**
 * Get the static pane component for a given stage name.
 * Returns null if no static component is registered for the stage.
 * 
 * @deprecated Use getStaticStageConfig for multi-pane support
 */
export const getStaticPaneComponent = (stageName: string): React.ComponentType<any> | null => {
  // First try to get from multi-pane config (returns first pane)
  const stageConfig = getStaticStageConfig(stageName);
  if (stageConfig && stageConfig.panes.length > 0) {
    return stageConfig.panes[0].component;
  }
  
  // Fall back to legacy registry
  if (staticPaneRegistry[stageName]) {
    return staticPaneRegistry[stageName];
  }
  
  // Try case-insensitive match on legacy registry
  const normalizedStageName = stageName.toLowerCase();
  for (const [key, component] of Object.entries(staticPaneRegistry)) {
    if (key.toLowerCase() === normalizedStageName) {
      return component;
    }
  }
  
  return null;
};

/**
 * Check if a stage has a registered static pane component or configuration.
 */
export const hasStaticPaneComponent = (stageName: string): boolean => {
  return getStaticStageConfig(stageName) !== null || getStaticPaneComponent(stageName) !== null;
};

/**
 * List of all available static panes for workflow configuration UI.
 */
export const AVAILABLE_STATIC_PANES = [
  { value: 'Basic LC Information', label: 'Basic LC Information' },
  { value: 'Party Details', label: 'Party Details' },
  { value: 'Applicant Information', label: 'Applicant Information' },
  { value: 'Beneficiary Information', label: 'Beneficiary Information' },
  { value: 'LC Amount & Terms', label: 'LC Amount & Terms' },
  { value: 'Shipment Details', label: 'Shipment Details' },
  { value: 'Document Requirements', label: 'Document Requirements' },
  { value: 'Accounting Entries', label: 'Accounting Entries' },
  { value: 'Release Documents', label: 'Release Documents' },
  { value: 'Limit Details', label: 'Limit Details' },
  { value: 'Sanction Details', label: 'Sanction Details' },
  { value: 'MT700 Preview', label: 'MT700 Preview' },
];

/**
 * Get suggested panes based on stage name keywords.
 */
export const getSuggestedPanes = (stageName: string): string[] => {
  const normalizedName = stageName.toLowerCase();
  
  if (normalizedName.includes('limit')) {
    return ['Limit Details'];
  }
  if (normalizedName.includes('compliance') || normalizedName.includes('sanction') || normalizedName.includes('aml')) {
    return ['Sanction Details'];
  }
  if (normalizedName.includes('data entry') || normalizedName.includes('input') || normalizedName.includes('registration')) {
    return ['Basic LC Information', 'Party Details', 'LC Amount & Terms', 'Shipment Details', 'Document Requirements', 'Accounting Entries', 'Release Documents'];
  }
  if (normalizedName.includes('approver') || normalizedName.includes('checker') || normalizedName.includes('authorization') || normalizedName.includes('review')) {
    return ['Basic LC Information', 'Party Details', 'LC Amount & Terms', 'Shipment Details', 'Document Requirements', 'Accounting Entries', 'Release Documents'];
  }
  
  return [];
};

/**
 * Get static pane configurations by their names.
 * Returns pane configs in the order specified.
 */
export const getStaticPanesByNames = (paneNames: string[]): StaticPaneConfig[] => {
  return paneNames
    .map(name => {
      // Check legacy registry first
      const component = staticPaneRegistry[name];
      if (component) {
        return { component, name };
      }
      
      // Try case-insensitive match
      const normalizedName = name.toLowerCase();
      for (const [key, comp] of Object.entries(staticPaneRegistry)) {
        if (key.toLowerCase() === normalizedName) {
          return { component: comp, name };
        }
      }
      
      return null;
    })
    .filter(Boolean) as StaticPaneConfig[];
};
