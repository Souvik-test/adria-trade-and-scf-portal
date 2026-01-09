import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { StaticStageConfig, StaticPaneProps } from './staticPaneRegistry';
import { ImportLCFormData } from '@/types/importLC';
import RemittancePaneAdapter, { getSectionKeyForPane, extractSectionData, getSectionDefaults } from '@/components/remittance/RemittancePaneAdapter';

interface StaticPaneRendererProps {
  stageConfig: StaticStageConfig;
  formData: ImportLCFormData | Record<string, any>;
  updateField: (field: keyof ImportLCFormData | string, value: any) => void;
  // New props for external button control
  hideNavigationButtons?: boolean;
  onActivePaneChange?: (activeIndex: number, totalPanes: number) => void;
  externalActivePane?: number; // Allow parent to control active pane
  // New prop to indicate if this is a remittance product
  isRemittanceProduct?: boolean;
}

// List of Remittance pane names for detection
const REMITTANCE_PANE_NAMES = [
  'Payment Header', 'Ordering Customer', 'Beneficiary Customer', 
  'Amount & Charges', 'Amount Charges', 'Routing & Settlement', 'Routing Settlement',
  'Regulatory & Compliance', 'Regulatory Compliance', 'Remittance Information', 'Remittance Info',
  'Accounting Entries', 'Release Documents',
  'Settlement Header', 'Instructing Agent', 'Instructed Agent',
  'Settlement Amount', 'Cover Linkage', 'Settlement Instructions',
];

/**
 * Check if a pane name belongs to Remittance product
 */
const isRemittancePane = (paneName: string): boolean => {
  return REMITTANCE_PANE_NAMES.some(
    name => name.toLowerCase() === paneName.toLowerCase()
  );
};

/**
 * StaticPaneRenderer renders one or more static panes for a stage.
 * - Single pane: renders directly without navigation
 * - Multiple panes: renders with tab navigation (buttons optional based on hideNavigationButtons)
 */
const StaticPaneRenderer: React.FC<StaticPaneRendererProps> = ({
  stageConfig,
  formData,
  updateField,
  hideNavigationButtons = false,
  onActivePaneChange,
  externalActivePane,
  isRemittanceProduct: isRemittanceProp,
}) => {
  const [internalActivePane, setInternalActivePane] = useState(0);
  
  // Use external pane index if provided, otherwise use internal state
  const activePane = externalActivePane !== undefined ? externalActivePane : internalActivePane;
  
  // Safety check: ensure stageConfig and panes exist
  const panes = stageConfig?.panes;
  const readOnly = stageConfig?.readOnly;

  // Detect if any pane is a Remittance pane
  const isRemittance = isRemittanceProp || 
    (panes && panes.some(p => isRemittancePane(p.name)));

  // Notify parent of pane changes
  useEffect(() => {
    if (onActivePaneChange && panes && panes.length > 0) {
      onActivePaneChange(activePane, panes.length);
    }
  }, [activePane, panes?.length, onActivePaneChange]);

  // No panes configured or invalid config
  if (!panes || !Array.isArray(panes) || panes.length === 0) {
    return (
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No pane configuration found for this stage.</p>
      </div>
    );
  }

  // Handle field updates - block if readOnly
  // For remittance, handle nested path updates (e.g., "paymentHeader.sttlmMtd")
  const handleUpdateField = (field: keyof ImportLCFormData | string, value: any) => {
    if (readOnly) return;
    
    if (isRemittance && typeof field === 'string' && field.includes('.')) {
      // Handle nested path for remittance (e.g., "paymentHeader.sttlmMtd")
      const [sectionKey, fieldKey] = field.split('.');
      const currentSection = (formData as Record<string, any>)[sectionKey] || {};
      const defaults = getSectionDefaults(sectionKey);
      const updatedSection = { ...defaults, ...currentSection, [fieldKey]: value };
      updateField(sectionKey as any, updatedSection);
    } else {
      updateField(field, value);
    }
  };

  // Render a single pane (handles both Remittance and Import LC)
  const renderPane = (paneConfig: { component: React.ComponentType<any>; name: string }) => {
    const PaneComponent = paneConfig.component;
    const paneName = paneConfig.name;
    
    // Check if this is a Remittance pane that needs data adaptation
    if (isRemittance && isRemittancePane(paneName)) {
      const sectionData = extractSectionData(formData as Record<string, any>, paneName);
      const sectionKey = getSectionKeyForPane(paneName);
      
      // Create onChange handler that updates the nested structure
      const handlePaneChange = (field: string, value: any) => {
        if (sectionKey) {
          handleUpdateField(`${sectionKey}.${field}`, value);
        }
      };
      
      return (
        <PaneComponent
          data={sectionData}
          onChange={handlePaneChange}
          readOnly={readOnly}
        />
      );
    }
    
    // Standard Import LC pane rendering
    return (
      <PaneComponent
        formData={formData}
        updateField={handleUpdateField}
        readOnly={readOnly}
      />
    );
  };

  // Ensure activePane is within bounds
  const safeActivePane = Math.min(Math.max(0, activePane), panes.length - 1);

  // Single pane - render directly without navigation
  if (panes.length === 1) {
    return (
      <div className={cn(readOnly && "pointer-events-none opacity-90")}>
        {readOnly && (
          <div className="mb-4 px-3 py-2 bg-muted/50 border border-border rounded-md text-sm text-muted-foreground">
            This stage is read-only. Fields cannot be edited.
          </div>
        )}
        {renderPane(panes[0])}
      </div>
    );
  }

  // Multiple panes - render with tab navigation
  const activeConfig = panes[safeActivePane];

  if (!activeConfig?.component) {
    return (
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">Invalid pane component at index {safeActivePane}.</p>
      </div>
    );
  }

  const handlePaneChange = (newIndex: number) => {
    if (externalActivePane === undefined) {
      setInternalActivePane(newIndex);
    }
  };

  return (
    <div className="space-y-4">
      {readOnly && (
        <div className="px-3 py-2 bg-muted/50 border border-border rounded-md text-sm text-muted-foreground">
          This stage is read-only. Fields cannot be edited.
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex gap-2 flex-wrap border-b border-border pb-3">
        {panes.map((pane, index) => (
          <Button
            key={pane.name}
            variant={safeActivePane === index ? 'default' : 'outline'}
            size="sm"
            onClick={() => handlePaneChange(index)}
            className={cn(
              "transition-all",
              safeActivePane === index && "shadow-sm"
            )}
          >
            <span className="mr-1.5 text-xs opacity-60">{index + 1}.</span>
            {pane.name}
          </Button>
        ))}
      </div>

      {/* Active pane content */}
      <div className={cn(readOnly && "pointer-events-none opacity-90")}>
        {renderPane(activeConfig)}
      </div>

      {/* Navigation buttons - only shown if not hidden */}
      {!hideNavigationButtons && (
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            disabled={safeActivePane === 0}
            onClick={() => handlePaneChange(safeActivePane - 1)}
            className="gap-1"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground self-center">
            {safeActivePane + 1} of {panes.length}
          </span>
          <Button
            variant="outline"
            disabled={safeActivePane === panes.length - 1}
            onClick={() => handlePaneChange(safeActivePane + 1)}
            className="gap-1"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default StaticPaneRenderer;
