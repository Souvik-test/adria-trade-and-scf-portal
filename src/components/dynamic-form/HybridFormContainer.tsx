import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicFormState, RepeatableGroupInstance } from '@/types/dynamicForm';
import { StagePaneInfo } from '@/services/workflowTemplateService';
import { getStaticPaneComponent } from '@/components/import-lc/staticPaneRegistry';
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
 * HybridFormContainer renders either a static pane component or the dynamic form
 * based on the current stage's ui_render_mode setting.
 * 
 * When ui_render_mode is 'static', it looks up the stage name in staticPaneRegistry
 * and renders the corresponding static component (e.g., LimitDetailsPane, SanctionDetailsPane).
 * 
 * When ui_render_mode is 'dynamic', it renders the DynamicFormContainer with field_repository fields.
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
    const StaticComponent = getStaticPaneComponent(stageName);
    
    if (StaticComponent) {
      // Render the static pane component
      // Static components expect formData prop with the current form state
      return (
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{currentPane.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <StaticComponent formData={formData} />
          </CardContent>
        </Card>
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
