import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DynamicFormState, RepeatableGroupInstance } from '@/types/dynamicForm';
import { StagePaneInfo } from '@/services/workflowTemplateService';
import { 
  getStaticStageConfig, 
  getStaticPaneComponent, 
  getStaticPanesByNames,
  StaticStageConfig 
} from '@/components/import-lc/staticPaneRegistry';
import {
  getRemittanceStaticStageConfig,
  getRemittanceStaticPaneComponent,
  getRemittanceStaticPanesByCode,
  RemittanceStaticStageConfig,
} from '@/components/remittance/staticPaneRegistry';
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
  // New prop: explicitly configured static panes from workflow stage
  configuredStaticPanes?: string[];
  // Props for external button control in static stages
  hideStaticNavigationButtons?: boolean;
  onStaticPaneChange?: (activeIndex: number, totalPanes: number) => void;
  staticActivePaneIndex?: number;
}

/**
 * HybridFormContainer renders either static pane components or the dynamic form
 * based on the current stage's ui_render_mode setting.
 * 
 * When ui_render_mode is 'static':
 * - First checks if stage has explicitly configured static_panes in database
 * - Falls back to multi-pane stage configuration (Data Entry, Approver, etc.)
 * - Then falls back to single pane component lookup
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
  configuredStaticPanes,
  hideStaticNavigationButtons,
  onStaticPaneChange,
  staticActivePaneIndex,
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
    // Determine if this is a Remittance product
    const isRemittanceProduct = productCode === 'REM' || productCode === 'REMITTANCE';
    
    // Priority 1: Check for explicitly configured static_panes from database
    if (configuredStaticPanes && configuredStaticPanes.length > 0) {
      // For Remittance products, use remittance-specific pane loader
      if (isRemittanceProduct) {
        const remittancePaneConfigs = getRemittanceStaticPanesByCode(configuredStaticPanes);
        if (remittancePaneConfigs.length > 0) {
          const remittanceStageConfig: RemittanceStaticStageConfig = {
            panes: remittancePaneConfigs,
            readOnly: isApprovalStage,
          };
          
          // Convert to StaticStageConfig format for StaticPaneRenderer
          const stageConfig: StaticStageConfig = {
            panes: remittanceStageConfig.panes.map(p => ({
              component: p.component,
              name: p.name,
            })),
            readOnly: remittanceStageConfig.readOnly,
          };
          
          return (
            <StaticPaneRenderer
              stageConfig={stageConfig}
              formData={formData as any}
              updateField={(field, value) => onFieldChange(field as string, value)}
              hideNavigationButtons={hideStaticNavigationButtons}
              onActivePaneChange={onStaticPaneChange}
              externalActivePane={staticActivePaneIndex}
            />
          );
        }
      }
      
      // For other products, use Import LC pane registry
      const paneConfigs = getStaticPanesByNames(configuredStaticPanes);
      
      if (paneConfigs.length > 0) {
        const stageConfig: StaticStageConfig = {
          panes: paneConfigs,
          readOnly: isApprovalStage,
        };
        
        return (
          <StaticPaneRenderer
            stageConfig={stageConfig}
            formData={formData as any}
            updateField={(field, value) => onFieldChange(field as string, value)}
            hideNavigationButtons={hideStaticNavigationButtons}
            onActivePaneChange={onStaticPaneChange}
            externalActivePane={staticActivePaneIndex}
          />
        );
      }
    }
    
    // Priority 2: Try to get multi-pane stage configuration by stage name
    // For Remittance products, use remittance-specific registry first
    if (isRemittanceProduct) {
      const remittanceStageConfig = getRemittanceStaticStageConfig(stageName);
      if (remittanceStageConfig) {
        // Convert to StaticStageConfig format for StaticPaneRenderer
        const stageConfig: StaticStageConfig = {
          panes: remittanceStageConfig.panes.map(p => ({
            component: p.component,
            name: p.name,
          })),
          readOnly: remittanceStageConfig.readOnly,
        };
        
        return (
          <StaticPaneRenderer
            stageConfig={stageConfig}
            formData={formData as any}
            updateField={(field, value) => onFieldChange(field as string, value)}
            hideNavigationButtons={hideStaticNavigationButtons}
            onActivePaneChange={onStaticPaneChange}
            externalActivePane={staticActivePaneIndex}
          />
        );
      }
      
      // Try legacy single component lookup for Remittance
      const RemittanceStaticComponent = getRemittanceStaticPaneComponent(stageName);
      if (RemittanceStaticComponent) {
        return (
          <RemittanceStaticComponent 
            formData={formData}
            updateField={(section: string, field: string, value: any) => {
              onFieldChange(field, value);
            }}
            readOnly={isApprovalStage}
          />
        );
      }
    }
    
    // For Import LC and other products
    const stageConfig = getStaticStageConfig(stageName);
    
    if (stageConfig) {
      // Use StaticPaneRenderer for multi-pane or single-pane static stages
      return (
        <StaticPaneRenderer
          stageConfig={stageConfig}
          formData={formData as any}
          updateField={(field, value) => onFieldChange(field as string, value)}
          hideNavigationButtons={hideStaticNavigationButtons}
          onActivePaneChange={onStaticPaneChange}
          externalActivePane={staticActivePaneIndex}
        />
      );
    }
    
    // Priority 3: Fall back to legacy single component lookup
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
