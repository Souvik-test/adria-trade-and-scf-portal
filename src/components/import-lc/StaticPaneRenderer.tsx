import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StaticStageConfig, StaticPaneProps } from './staticPaneRegistry';
import { ImportLCFormData } from '@/types/importLC';

interface StaticPaneRendererProps {
  stageConfig: StaticStageConfig;
  formData: ImportLCFormData;
  updateField: (field: keyof ImportLCFormData, value: any) => void;
}

/**
 * StaticPaneRenderer renders one or more static panes for a stage.
 * - Single pane: renders directly without navigation
 * - Multiple panes: renders with tab navigation and prev/next buttons
 */
const StaticPaneRenderer: React.FC<StaticPaneRendererProps> = ({
  stageConfig,
  formData,
  updateField,
}) => {
  const [activePane, setActivePane] = useState(0);
  const { panes, readOnly } = stageConfig;

  // No panes configured
  if (!panes || panes.length === 0) {
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
  const ActivePaneComponent = panes[activePane].component;

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
            variant={activePane === index ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActivePane(index)}
            className={cn(
              "transition-all",
              activePane === index && "shadow-sm"
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

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4 border-t border-border">
        <Button
          variant="outline"
          disabled={activePane === 0}
          onClick={() => setActivePane(prev => prev - 1)}
          className="gap-1"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <span className="text-sm text-muted-foreground self-center">
          {activePane + 1} of {panes.length}
        </span>
        <Button
          variant="outline"
          disabled={activePane === panes.length - 1}
          onClick={() => setActivePane(prev => prev + 1)}
          className="gap-1"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default StaticPaneRenderer;
