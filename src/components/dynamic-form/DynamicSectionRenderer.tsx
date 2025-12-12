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
}) => {
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
                gridRows={group.gridRows}
                gridColumns={group.gridColumns}
                disabled={disabled}
              />
            );
          }

          // Render non-repeatable fields in a grid
          const gridStyle: React.CSSProperties = {
            display: 'grid',
            gridTemplateColumns: `repeat(${group.gridColumns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${group.gridRows}, auto)`,
            gap: '1rem',
          };

          return (
            <div key={group.groupId || 'default'} style={gridStyle}>
              {group.fields.map((field) => {
                const gridPositionStyle: React.CSSProperties = {
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
