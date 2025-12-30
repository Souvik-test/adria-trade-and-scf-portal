import React from 'react';
import LimitDetailsPane from './LimitDetailsPane';
import SanctionDetailsPane from './SanctionDetailsPane';
import AccountingEntriesPane from './AccountingEntriesPane';
import ReleaseDocumentsPane from './ReleaseDocumentsPane';

/**
 * Registry mapping stage names to their static pane components.
 * Used by HybridFormContainer to render static UI when a stage's ui_render_mode is 'static'.
 * 
 * Keys should match the stage_name values in workflow_stages table.
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
};

/**
 * Get the static pane component for a given stage name.
 * Returns null if no static component is registered for the stage.
 */
export const getStaticPaneComponent = (stageName: string): React.ComponentType<any> | null => {
  // Try exact match first
  if (staticPaneRegistry[stageName]) {
    return staticPaneRegistry[stageName];
  }
  
  // Try case-insensitive match
  const normalizedStageName = stageName.toLowerCase();
  for (const [key, component] of Object.entries(staticPaneRegistry)) {
    if (key.toLowerCase() === normalizedStageName) {
      return component;
    }
  }
  
  return null;
};

/**
 * Check if a stage has a registered static pane component.
 */
export const hasStaticPaneComponent = (stageName: string): boolean => {
  return getStaticPaneComponent(stageName) !== null;
};
