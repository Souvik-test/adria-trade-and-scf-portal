import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { StaticStageConfig, StaticPaneProps } from './staticPaneRegistry';
import { ImportLCFormData } from '@/types/importLC';

interface StaticPaneRendererProps {
  stageConfig: StaticStageConfig;
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
  // New props for external button control
  hideNavigationButtons?: boolean;
  onActivePaneChange?: (activeIndex: number, totalPanes: number) => void;
  externalActivePane?: number; // Allow parent to control active pane
}

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
}) => {
  const [internalActivePane, setInternalActivePane] = useState(0);
  
  // Use external pane index if provided, otherwise use internal state
  const activePane = externalActivePane !== undefined ? externalActivePane : internalActivePane;
  
  // Safety check: ensure stageConfig and panes exist
  const panes = stageConfig?.panes;
  const readOnly = stageConfig?.readOnly;

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
  const handleUpdateField = (field: keyof ImportLCFormData, value: any) => {
    if (!readOnly) {
      updateField(field, value);
    }
  };

  // Ensure activePane is within bounds
  const safeActivePane = Math.min(Math.max(0, activePane), panes.length - 1);

  // Single pane - render directly without navigation
  if (panes.length === 1) {
    const PaneComponent = panes[0].component;
    return (
      <div className={cn(readOnly && "pointer-events-none opacity-90")}>
        {readOnly && (
          <div className="mb-4 px-3 py-2 bg-muted/50 border border-border rounded-md text-sm text-muted-foreground">
            This stage is read-only. Fields cannot be edited.
          </div>
        )}
        <PaneComponent
          formData={formData}
          updateField={handleUpdateField}
          readOnly={readOnly}
        />
      </div>
    );
  }

  // Multiple panes - render with tab navigation
  const ActivePaneComponent = panes[safeActivePane]?.component;

  if (!ActivePaneComponent) {
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
        <ActivePaneComponent
          formData={formData}
          updateField={handleUpdateField}
          readOnly={readOnly}
        />
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
