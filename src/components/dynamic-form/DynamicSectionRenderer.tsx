import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SectionFields, DynamicFormData, RepeatableGroupInstance } from '@/types/dynamicForm';
import { Plus, Trash2 } from 'lucide-react';
import DynamicFieldRenderer from './DynamicFieldRenderer';
import RepeatableGroupRenderer from './RepeatableGroupRenderer';

interface DynamicSectionRendererProps {
  section: SectionFields;
  formData: DynamicFormData;
  repeatableGroups: { [groupId: string]: RepeatableGroupInstance[] };
  onFieldChange: (fieldCode: string, value: any) => void;
  onRepeatableFieldChange: (groupId: string, instanceId: string, fieldCode: string, value: any) => void;
  onAddRepeatableInstance: (groupId: string) => void;
  onRemoveRepeatableInstance: (groupId: string, instanceId: string) => void;
  disabled?: boolean;
  fieldEditabilityMap?: Map<string, boolean>; // Per-field editability from workflow_stage_fields
  // Optional overrides from pane_section_mappings
  overrideGridRows?: number;
  overrideGridColumns?: number;
  // Section-level repeatable config
  isRepeatable?: boolean;
  repeatableGroupId?: string;
}

const DynamicSectionRenderer: React.FC<DynamicSectionRendererProps> = ({
  section,
  formData,
  repeatableGroups,
  onFieldChange,
  onRepeatableFieldChange,
  onAddRepeatableInstance,
  onRemoveRepeatableInstance,
  disabled = false,
  fieldEditabilityMap,
  overrideGridRows,
  overrideGridColumns,
  isRepeatable = false,
  repeatableGroupId,
}) => {
  // Check if all fields in a group have the same position (needs auto-flow fallback)
  const needsAutoFlow = (fields: typeof section.groups[0]['fields']): boolean => {
    if (fields.length <= 1) return false;
    
    const positions = fields.map(f => `${f.field_row}-${f.field_column}`);
    const uniquePositions = new Set(positions);
    
    // If all fields have same position, we need auto-flow
    return uniquePositions.size === 1;
  };

  // Section-level repeatable handling
  const sectionGroupId = repeatableGroupId || section.sectionCode;
  const instances = repeatableGroups[sectionGroupId] || [];

  // Render section content (fields)
  const renderSectionContent = (instanceId?: string) => {
    return section.groups.map((group) => {
      // Render repeatable groups differently (field-level repeatable)
      if (group.isRepeatable && group.groupId && !isRepeatable) {
        const groupInstances = repeatableGroups[group.groupId] || [];
        return (
          <RepeatableGroupRenderer
            key={group.groupId}
            groupId={group.groupId}
            fields={group.fields}
            instances={groupInstances}
            onAddInstance={onAddRepeatableInstance}
            onRemoveInstance={onRemoveRepeatableInstance}
            onFieldChange={onRepeatableFieldChange}
            gridRows={overrideGridRows || group.gridRows}
            gridColumns={overrideGridColumns || group.gridColumns}
            disabled={disabled}
          />
        );
      }

      // Use override dimensions if provided, otherwise use group dimensions
      const gridColumns = overrideGridColumns || group.gridColumns || 2;
      const gridRows = overrideGridRows || group.gridRows || Math.ceil(group.fields.length / gridColumns);
      
      // Check if we need auto-flow (all fields have same position)
      const useAutoFlow = needsAutoFlow(group.fields);

      // Build grid style based on whether we need auto-flow or explicit positioning
      const gridStyle: React.CSSProperties = useAutoFlow
        ? {
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
            gap: '1rem',
            gridAutoFlow: 'row',
          }
        : {
            display: 'grid',
            gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridRows}, auto)`,
            gap: '1rem',
          };

      return (
        <div key={group.groupId || 'default'} style={gridStyle}>
          {group.fields.map((field) => {
            // If using auto-flow, don't set explicit grid position
            const gridPositionStyle: React.CSSProperties = useAutoFlow
              ? {}
              : {
                  gridRow: `${field.field_row} / span ${field.ui_row_span || 1}`,
                  gridColumn: `${field.field_column} / span ${field.ui_column_span || 1}`,
                };

            // For repeatable sections, get value from instance data
            const fieldValue = instanceId && isRepeatable
              ? instances.find(i => i.instanceId === instanceId)?.data[field.field_code]
              : formData[field.field_code];

            const handleChange = instanceId && isRepeatable
              ? (fieldCode: string, value: any) => onRepeatableFieldChange(sectionGroupId, instanceId, fieldCode, value)
              : onFieldChange;

            // Determine if this specific field is editable based on workflow_stage_fields config
            // Field is disabled if: global disabled OR field's is_editable is explicitly false
            const fieldIsEditable = fieldEditabilityMap?.get(field.field_label_key) ?? true;
            const fieldDisabled = disabled || !fieldIsEditable;

            return (
              <div key={field.field_code} style={gridPositionStyle}>
                <DynamicFieldRenderer
                  field={field}
                  value={fieldValue}
                  onChange={handleChange}
                  disabled={fieldDisabled}
                />
              </div>
            );
          })}
        </div>
      );
    });
  };

  // If section is repeatable, render with add/remove controls
  if (isRepeatable) {
    return (
      <Card className="border border-border/50">
        <CardHeader className="py-3 px-4 bg-muted/30 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold">{section.sectionName}</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onAddRepeatableInstance(sectionGroupId)}
            disabled={disabled}
            className="h-7 text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add {section.sectionName}
          </Button>
        </CardHeader>
        <CardContent className="py-4 px-4 space-y-4">
          {instances.length === 0 && (
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <p className="text-sm text-muted-foreground mb-3">
                No {section.sectionName.toLowerCase()} added yet
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddRepeatableInstance(sectionGroupId)}
                disabled={disabled}
                className="h-8"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add {section.sectionName}
              </Button>
            </div>
          )}
          {instances.map((instance, index) => (
            <Card key={instance.instanceId} className="border border-border/50 bg-muted/20">
              <CardHeader className="py-2 px-3 flex flex-row items-center justify-between">
                <CardTitle className="text-xs font-medium">
                  {section.sectionName} #{index + 1}
                </CardTitle>
                {instances.length > 1 && !disabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveRepeatableInstance(sectionGroupId, instance.instanceId)}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </CardHeader>
              <CardContent className="py-3 px-3 space-y-4">
                {renderSectionContent(instance.instanceId)}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Regular non-repeatable section
  return (
    <Card className="border border-border/50">
      <CardHeader className="py-3 px-4 bg-muted/30">
        <CardTitle className="text-sm font-semibold">{section.sectionName}</CardTitle>
      </CardHeader>
      <CardContent className="py-4 px-4 space-y-6">
        {renderSectionContent()}
      </CardContent>
    </Card>
  );
};

export default DynamicSectionRenderer;