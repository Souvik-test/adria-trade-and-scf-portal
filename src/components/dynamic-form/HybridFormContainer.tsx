import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicFormState, RepeatableGroupInstance } from '@/types/dynamicForm';
import { StagePaneInfo } from '@/services/workflowTemplateService';
import { getStaticStageConfig, getStaticPaneComponent } from '@/components/import-lc/staticPaneRegistry';
import StaticPaneRenderer from '@/components/import-lc/StaticPaneRenderer';
import DynamicFormContainer from './DynamicFormContainer';

interface SectionConfig {
  name: string;
  rows: number;
  columns: number;
  isRepeatable?: boolean;
  groupId?: string;
}

interface CurrentPane {
  id: string;
  name: string;
  sections?: {
    name: string;
    rows?: number;
    columns?: number;
    isRepeatable?: boolean;
    groupId?: string;
  }[];
  showSwiftPreview?: boolean;
}

interface HybridFormContainerProps {
  productCode: string;
  eventCode: string;
  currentPane: CurrentPane | null;
  currentPaneIndex: number;
  stagePaneMapping: StagePaneInfo[];
  formData: Record<string, any>;
  repeatableGroups: { [groupId: string]: RepeatableGroupInstance[] };
  currentStageAllowedFields: string[];
  currentStageFieldEditability: Map<string, boolean>;
  isApprovalStage: boolean;
  onFieldChange: (fieldCode: string, value: any) => void;
  onFormChange?: (state: DynamicFormState) => void;
}

/**
 * HybridFormContainer renders either static pane components or the dynamic form
 * based on the current stage's ui_render_mode setting.
 * 
 * When ui_render_mode is 'static':
 * - First checks for multi-pane stage configuration (Data Entry, Approver, etc.)
 * - Falls back to single pane component lookup
 * 
 * When ui_render_mode is 'dynamic':
 * - Renders the DynamicFormContainer with field_repository fields.
 */
const HybridFormContainer: React.FC<HybridFormContainerProps> = ({
  productCode,
  eventCode,
  currentPane,
  currentPaneIndex,
  stagePaneMapping,
  formData,
  repeatableGroups,
  currentStageAllowedFields,
  currentStageFieldEditability,
  isApprovalStage,
  onFieldChange,
  onFormChange,
}) => {
  if (!currentPane) {
    return (
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No pane configuration found.</p>
      </div>
    );
  }

  // Get the current pane's stage info from mapping
  const currentMapping = stagePaneMapping[currentPaneIndex];
  const uiRenderMode = currentMapping?.uiRenderMode || 'dynamic';
  const stageName = currentMapping?.stageName || '';

  // Check if this stage should use static UI
  if (uiRenderMode === 'static') {
    // First try to get multi-pane stage configuration
    const stageConfig = getStaticStageConfig(stageName);
    
    if (stageConfig) {
      // Use StaticPaneRenderer for multi-pane or single-pane static stages
      return (
        <StaticPaneRenderer
          stageConfig={stageConfig}
          formData={formData as any}
          updateField={(field, value) => onFieldChange(field as string, value)}
        />
      );
    }
    
    // Fall back to legacy single component lookup
    const StaticComponent = getStaticPaneComponent(stageName);
    
    if (StaticComponent) {
      // Render the static pane component directly
      return (
        <StaticComponent 
          formData={formData}
          updateField={(field: string, value: any) => {
            onFieldChange(field, value);
          }}
          readOnly={isApprovalStage}
        />
      );
    } else {
      // No static component registered for this stage, fall back to dynamic
      console.warn(
        `Stage "${stageName}" is configured for static UI but no static component is registered. Falling back to dynamic rendering.`
      );
    }
  }

  // Render dynamic form container
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{currentPane.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DynamicFormContainer
          productCode={productCode}
          eventType={eventCode}
          currentPaneCode={currentPane.name}
          sectionConfigs={currentPane.sections?.map(s => ({
            name: s.name,
            rows: s.rows || 2,
            columns: s.columns || 2,
            isRepeatable: s.isRepeatable || false,
            groupId: s.groupId,
          }))}
          allowedFieldNames={currentStageAllowedFields}
          fieldEditabilityMap={currentStageFieldEditability}
          initialData={{ formData, repeatableGroups }}
          onFormChange={(state) => {
            // Sync with parent state (only if not read-only)
            if (!isApprovalStage && onFormChange) {
              onFormChange(state);
            }
            // Also update individual field changes for parent state tracking
            if (!isApprovalStage) {
              Object.entries(state.formData).forEach(([key, value]) => {
                if (formData[key] !== value) {
                  onFieldChange(key, value);
                }
              });
            }
          }}
          disabled={isApprovalStage}
        />
      </CardContent>
    </Card>
  );
};

export default HybridFormContainer;
