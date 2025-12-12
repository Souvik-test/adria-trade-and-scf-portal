import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { DynamicFieldDefinition, DynamicFormData, RepeatableGroupInstance } from '@/types/dynamicForm';
import DynamicFieldRenderer from './DynamicFieldRenderer';
import { cn } from '@/lib/utils';

interface RepeatableGroupRendererProps {
  groupId: string;
  groupName?: string;
  fields: DynamicFieldDefinition[];
  instances: RepeatableGroupInstance[];
  onAddInstance: (groupId: string) => void;
  onRemoveInstance: (groupId: string, instanceId: string) => void;
  onFieldChange: (groupId: string, instanceId: string, fieldCode: string, value: any) => void;
  gridRows: number;
  gridColumns: number;
  disabled?: boolean;
  minInstances?: number;
  maxInstances?: number;
}

const RepeatableGroupRenderer: React.FC<RepeatableGroupRendererProps> = ({
  groupId,
  groupName,
  fields,
  instances,
  onAddInstance,
  onRemoveInstance,
  onFieldChange,
  gridRows,
  gridColumns,
  disabled = false,
  minInstances = 1,
  maxInstances = 10,
}) => {
  const displayName = groupName || groupId.replace(/([A-Z])/g, ' $1').trim();
  
  const canAddMore = instances.length < maxInstances;
  const canRemove = instances.length > minInstances;

  const handleAddInstance = useCallback(() => {
    if (canAddMore) {
      onAddInstance(groupId);
    }
  }, [groupId, canAddMore, onAddInstance]);

  const handleRemoveInstance = useCallback((instanceId: string) => {
    if (canRemove) {
      onRemoveInstance(groupId, instanceId);
    }
  }, [groupId, canRemove, onRemoveInstance]);

  const handleFieldChange = useCallback((instanceId: string, fieldCode: string, value: any) => {
    onFieldChange(groupId, instanceId, fieldCode, value);
  }, [groupId, onFieldChange]);

  // Render a single instance of the group
  const renderInstance = (instance: RepeatableGroupInstance, index: number) => {
    // Build CSS grid template
    const gridStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${gridRows}, auto)`,
      gap: '1rem',
    };

    return (
      <Card key={instance.instanceId} className="border border-border/50 bg-muted/20">
        <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium">
            {displayName} {instances.length > 1 ? `#${index + 1}` : ''}
          </CardTitle>
          {canRemove && !disabled && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveInstance(instance.instanceId)}
              className="h-7 w-7 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent className="py-3 px-4">
          <div style={gridStyle}>
            {fields.map((field) => {
              // Calculate grid position
              const gridPositionStyle: React.CSSProperties = {
                gridRow: `${field.field_row} / span ${field.ui_row_span || 1}`,
                gridColumn: `${field.field_column} / span ${field.ui_column_span || 1}`,
              };

              return (
                <div key={field.field_code} style={gridPositionStyle}>
                  <DynamicFieldRenderer
                    field={field}
                    value={instance.data[field.field_code]}
                    onChange={(fieldCode, value) => handleFieldChange(instance.instanceId, fieldCode, value)}
                    disabled={disabled}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-3">
      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">{displayName}</h4>
        {canAddMore && !disabled && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddInstance}
            className="h-8 text-xs"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add {displayName}
          </Button>
        )}
      </div>

      {/* Instances */}
      <div className="space-y-3">
        {instances.map((instance, index) => renderInstance(instance, index))}
      </div>

      {/* Empty state */}
      {instances.length === 0 && (
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">No {displayName.toLowerCase()} added yet</p>
          {!disabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddInstance}
              className="h-8"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add {displayName}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default RepeatableGroupRenderer;
