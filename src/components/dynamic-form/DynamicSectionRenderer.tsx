import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionFields, DynamicFormData, RepeatableGroupInstance } from '@/types/dynamicForm';
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
  // Optional overrides from pane_section_mappings
  overrideGridRows?: number;
  overrideGridColumns?: number;
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
  overrideGridRows,
  overrideGridColumns,
}) => {
  // Check if all fields in a group have the same position (needs auto-flow fallback)
  const needsAutoFlow = (fields: typeof section.groups[0]['fields']): boolean => {
    if (fields.length <= 1) return false;
    
    const positions = fields.map(f => `${f.field_row}-${f.field_column}`);
    const uniquePositions = new Set(positions);
    
    // If all fields have same position, we need auto-flow
    return uniquePositions.size === 1;
  };

  return (
    <Card className="border border-border/50">
      <CardHeader className="py-3 px-4 bg-muted/30">
        <CardTitle className="text-sm font-semibold">{section.sectionName}</CardTitle>
      </CardHeader>
      <CardContent className="py-4 px-4 space-y-6">
        {section.groups.map((group) => {
          // Render repeatable groups differently
          if (group.isRepeatable && group.groupId) {
            const instances = repeatableGroups[group.groupId] || [];
            return (
              <RepeatableGroupRenderer
                key={group.groupId}
                groupId={group.groupId}
                fields={group.fields}
                instances={instances}
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
              {group.fields.map((field, index) => {
                // If using auto-flow, don't set explicit grid position
                const gridPositionStyle: React.CSSProperties = useAutoFlow
                  ? {}
                  : {
                      gridRow: `${field.field_row} / span ${field.ui_row_span || 1}`,
                      gridColumn: `${field.field_column} / span ${field.ui_column_span || 1}`,
                    };

                return (
                  <div key={field.field_code} style={gridPositionStyle}>
                    <DynamicFieldRenderer
                      field={field}
                      value={formData[field.field_code]}
                      onChange={onFieldChange}
                      disabled={disabled}
                    />
                  </div>
                );
              })}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DynamicSectionRenderer;
