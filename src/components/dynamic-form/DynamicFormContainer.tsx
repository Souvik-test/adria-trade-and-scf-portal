import React, { useState, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { useDynamicFormFields } from '@/hooks/useDynamicFormFields';
import { DynamicFormData, RepeatableGroupInstance, DynamicFormState } from '@/types/dynamicForm';
import DynamicSectionRenderer from './DynamicSectionRenderer';

// Section grid config from pane_section_mappings
interface SectionGridConfig {
  name: string;
  rows: number;
  columns: number;
}

interface DynamicFormContainerProps {
  productCode: string;
  eventType: string;
  currentPaneCode?: string; // Filter to show only this pane's sections
  sectionGridConfigs?: SectionGridConfig[]; // Grid dimensions from pane_section_mappings
  stageId?: string;
  initialData?: DynamicFormState;
  onFormChange?: (formState: DynamicFormState) => void;
  disabled?: boolean;
}

// Generate unique instance ID
const generateInstanceId = () => `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const DynamicFormContainer: React.FC<DynamicFormContainerProps> = ({
  productCode,
  eventType,
  currentPaneCode,
  sectionGridConfigs,
  stageId,
  initialData,
  onFormChange,
  disabled = false,
}) => {
  const { panes, loading, error } = useDynamicFormFields({
    productCode,
    eventType,
    paneCode: currentPaneCode,
    stageId,
  });

  // Initialize form state
  const [formData, setFormData] = useState<DynamicFormData>(initialData?.formData || {});
  const [repeatableGroups, setRepeatableGroups] = useState<{ [groupId: string]: RepeatableGroupInstance[] }>(
    initialData?.repeatableGroups || {}
  );

  // Initialize repeatable groups with at least one instance when panes load
  React.useEffect(() => {
    if (panes.length > 0 && Object.keys(repeatableGroups).length === 0) {
      const initialGroups: { [groupId: string]: RepeatableGroupInstance[] } = {};
      
      panes.forEach(pane => {
        pane.sections.forEach(section => {
          section.groups.forEach(group => {
            if (group.isRepeatable && group.groupId && !initialGroups[group.groupId]) {
              initialGroups[group.groupId] = [{
                instanceId: generateInstanceId(),
                data: {},
              }];
            }
          });
        });
      });

      if (Object.keys(initialGroups).length > 0) {
        setRepeatableGroups(initialGroups);
      }
    }
  }, [panes]);

  // Notify parent of form changes
  const notifyChange = useCallback((newFormData: DynamicFormData, newRepeatableGroups: { [groupId: string]: RepeatableGroupInstance[] }) => {
    if (onFormChange) {
      onFormChange({
        formData: newFormData,
        repeatableGroups: newRepeatableGroups,
      });
    }
  }, [onFormChange]);

  // Handle regular field changes
  const handleFieldChange = useCallback((fieldCode: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [fieldCode]: value };
      notifyChange(newData, repeatableGroups);
      return newData;
    });
  }, [repeatableGroups, notifyChange]);

  // Handle field changes within repeatable groups
  const handleRepeatableFieldChange = useCallback((groupId: string, instanceId: string, fieldCode: string, value: any) => {
    setRepeatableGroups(prev => {
      const newGroups = { ...prev };
      const groupInstances = [...(newGroups[groupId] || [])];
      const instanceIndex = groupInstances.findIndex(i => i.instanceId === instanceId);
      
      if (instanceIndex >= 0) {
        groupInstances[instanceIndex] = {
          ...groupInstances[instanceIndex],
          data: {
            ...groupInstances[instanceIndex].data,
            [fieldCode]: value,
          },
        };
        newGroups[groupId] = groupInstances;
      }
      
      notifyChange(formData, newGroups);
      return newGroups;
    });
  }, [formData, notifyChange]);

  // Add new instance to a repeatable group
  const handleAddRepeatableInstance = useCallback((groupId: string) => {
    setRepeatableGroups(prev => {
      const newGroups = { ...prev };
      const groupInstances = [...(newGroups[groupId] || [])];
      groupInstances.push({
        instanceId: generateInstanceId(),
        data: {},
      });
      newGroups[groupId] = groupInstances;
      notifyChange(formData, newGroups);
      return newGroups;
    });
  }, [formData, notifyChange]);

  // Remove instance from a repeatable group
  const handleRemoveRepeatableInstance = useCallback((groupId: string, instanceId: string) => {
    setRepeatableGroups(prev => {
      const newGroups = { ...prev };
      const groupInstances = (newGroups[groupId] || []).filter(i => i.instanceId !== instanceId);
      newGroups[groupId] = groupInstances;
      notifyChange(formData, newGroups);
      return newGroups;
    });
  }, [formData, notifyChange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading form fields...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-center">
        <p className="text-destructive font-medium">Failed to load form</p>
        <p className="text-sm text-muted-foreground mt-1">{error}</p>
      </div>
    );
  }

  if (panes.length === 0) {
    return (
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No fields configured for this form.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Configure fields in Control Centre → Dynamic Form Engine → Field Definition
        </p>
      </div>
    );
  }

  // Get the current pane (should be only one since we filter by paneCode)
  const currentPane = panes[0];
  
  if (!currentPane) {
    return (
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No fields configured for this pane.</p>
      </div>
    );
  }

  // Helper to get grid config for a section
  const getSectionGridConfig = (sectionCode: string) => {
    if (!sectionGridConfigs) return undefined;
    return sectionGridConfigs.find(
      cfg => cfg.name.toLowerCase() === sectionCode.toLowerCase()
    );
  };

  // Render sections directly (no accordion wrapper since we're showing one pane at a time)
  return (
    <div className="space-y-4">
      {currentPane.sections.map((section) => {
        const gridConfig = getSectionGridConfig(section.sectionCode);
        return (
          <DynamicSectionRenderer
            key={section.sectionCode}
            section={section}
            formData={formData}
            repeatableGroups={repeatableGroups}
            onFieldChange={handleFieldChange}
            onRepeatableFieldChange={handleRepeatableFieldChange}
            onAddRepeatableInstance={handleAddRepeatableInstance}
            onRemoveRepeatableInstance={handleRemoveRepeatableInstance}
            disabled={disabled}
            overrideGridRows={gridConfig?.rows}
            overrideGridColumns={gridConfig?.columns}
          />
        );
      })}
    </div>
  );
};

export default DynamicFormContainer;
