import React, { useState, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { Loader2 } from 'lucide-react';
import { useDynamicFormFields } from '@/hooks/useDynamicFormFields';
import useFieldActions from '@/hooks/useFieldActions';
import {
  DynamicFieldDefinition,
  DynamicFormData,
  RepeatableGroupInstance,
  DynamicFormState,
} from '@/types/dynamicForm';
import DynamicSectionRenderer from './DynamicSectionRenderer';

// Section config from pane_section_mappings
interface SectionConfig {
  name: string;
  rows: number;
  columns: number;
  isRepeatable?: boolean;
  groupId?: string;
}

interface DynamicFormContainerProps {
  productCode: string;
  eventType: string;
  currentPaneCode?: string; // Filter to show only this pane's sections
  sectionConfigs?: SectionConfig[]; // Section configs from pane_section_mappings
  stageId?: string;
  allowedFieldNames?: string[]; // Field names allowed for current stage (from workflow_stage_fields)
  fieldEditabilityMap?: Map<string, boolean>; // Field name -> isEditable from workflow_stage_fields
  initialData?: DynamicFormState;
  onFormChange?: (formState: DynamicFormState) => void;
  disabled?: boolean;
}

// Expose these methods to parent via ref
export interface DynamicFormContainerRef {
  getFormData: () => DynamicFormData;
  getRepeatableGroups: () => { [groupId: string]: RepeatableGroupInstance[] };
}

// Generate unique instance ID
const generateInstanceId = () => `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const DynamicFormContainer = forwardRef<DynamicFormContainerRef, DynamicFormContainerProps>(({
  productCode,
  eventType,
  currentPaneCode,
  sectionConfigs,
  stageId,
  allowedFieldNames,
  fieldEditabilityMap,
  initialData,
  onFormChange,
  disabled = false,
}, ref) => {
  const { panes, loading, error } = useDynamicFormFields({
    productCode,
    eventType,
    // IMPORTANT: fetch ALL panes so mapped fields can auto-populate across panes
    stageId,
  });

  // Initialize form state from initialData
  const [formData, setFormData] = useState<DynamicFormData>(initialData?.formData || {});
  const [repeatableGroups, setRepeatableGroups] = useState<{ [groupId: string]: RepeatableGroupInstance[] }>(
    initialData?.repeatableGroups || {}
  );

  // Expose methods to parent via ref for on-demand data capture
  useImperativeHandle(ref, () => ({
    getFormData: () => formData,
    getRepeatableGroups: () => repeatableGroups,
  }), [formData, repeatableGroups]);

  // Collect ALL fields across ALL panes for computed field evaluation
  const allFieldsFlat = useMemo<DynamicFieldDefinition[]>(() => {
    const fields: DynamicFieldDefinition[] = [];
    panes.forEach(pane => {
      pane.sections.forEach(section => {
        section.groups.forEach(group => {
          group.fields.forEach(field => fields.push(field));
        });
      });
    });
    return fields;
  }, [panes]);

  // Use the field actions hook to get computed values
  const { getComputedValue, isFieldComputed } = useFieldActions({
    fields: allFieldsFlat,
    formData,
  });

  // Notify parent of form changes - define this early so other effects can use it
  const notifyChange = useCallback((newFormData: DynamicFormData, newRepeatableGroups: { [groupId: string]: RepeatableGroupInstance[] }) => {
    if (onFormChange) {
      onFormChange({
        formData: newFormData,
        repeatableGroups: newRepeatableGroups,
      });
    }
  }, [onFormChange]);

  // Apply field mappings - auto-populate values from mapped fields
  const applyFieldMappings = useCallback(
    (
      fields: {
        mapped_from_field_code?: string | null;
        field_code: string;
        ui_display_type?: string | null;
        data_type?: string | null;
        decimal_places?: number | null;
      }[],
      currentFormData: DynamicFormData
    ): DynamicFormData => {
      const updatedData = { ...currentFormData };
      let hasChanges = false;

      const normalizeFieldCode = (code: string) => code.toUpperCase().replace(/\s+/g, '_');

      const getValueForCode = (data: DynamicFormData, code: string) => {
        return (
          data[code] ??
          data[normalizeFieldCode(code)] ??
          data[code.toLowerCase()] ??
          data[code.toUpperCase()]
        );
      };

      const coerceMappedValue = (
        raw: any,
        target: { ui_display_type?: string | null; data_type?: string | null }
      ) => {
        if (raw === undefined || raw === null) return raw;

        const dt = (target.data_type || '').toUpperCase();
        const isNumericTarget =
          target.ui_display_type === 'NUMBER' ||
          dt === 'NUMERIC' ||
          dt === 'NUMBER' ||
          dt === 'DECIMAL' ||
          dt === 'FLOAT' ||
          dt === 'INTEGER' ||
          dt === 'INT';

        // Sanitize common currency formats like "USD 100,000.00" for numeric targets
        if (isNumericTarget) {
          if (typeof raw === 'number') return raw;
          if (typeof raw === 'string') {
            const cleaned = raw.replace(/[^0-9.-]/g, '').trim();
            if (cleaned === '' || cleaned === '-' || cleaned === '.') return null;
            const num = Number(cleaned);
            return Number.isFinite(num) ? num : raw;
          }
        }

        return raw;
      };

      fields.forEach((field) => {
        if (field.mapped_from_field_code && !updatedData[field.field_code]) {
          const sourceValue = getValueForCode(updatedData, field.mapped_from_field_code);
          const mappedValue = coerceMappedValue(sourceValue, field);

          if (mappedValue !== undefined && mappedValue !== null && mappedValue !== '') {
            updatedData[field.field_code] = mappedValue;
            hasChanges = true;
          }
        }
      });

      return hasChanges ? updatedData : currentFormData;
    },
    []
  );

  // Sync formData and repeatableGroups when initialData changes (important for stage transitions)
  React.useEffect(() => {
    if (initialData?.formData) {
      setFormData(prevData => {
        // Merge initial data with current data, preserving any local changes
        const mergedData = { ...initialData.formData };
        // Only update if there are actual changes
        const hasChanges = Object.keys(mergedData).some(
          key => prevData[key] !== mergedData[key]
        );
        return hasChanges ? { ...prevData, ...mergedData } : prevData;
      });
    }
    
    // Also sync repeatableGroups from initialData (for Party Details, Documents Required, etc.)
    if (initialData?.repeatableGroups && Object.keys(initialData.repeatableGroups).length > 0) {
      setRepeatableGroups(prevGroups => {
        const hasChanges = Object.keys(initialData.repeatableGroups).some(
          key => JSON.stringify(prevGroups[key]) !== JSON.stringify(initialData.repeatableGroups[key])
        );
        return hasChanges ? { ...prevGroups, ...initialData.repeatableGroups } : prevGroups;
      });
    }
  }, [initialData?.formData, initialData?.repeatableGroups]);

  // STEP 1: Materialize computed field values into formData
  // This ensures computed fields like TOTAL_LC_AMOUNT are in formData so mappings can read them
  React.useEffect(() => {
    if (allFieldsFlat.length === 0 || Object.keys(formData).length === 0) return;

    let hasChanges = false;
    const updatedData = { ...formData };

    allFieldsFlat.forEach(field => {
      if (isFieldComputed(field.field_code)) {
        const computedVal = getComputedValue(field.field_code);
        if (computedVal !== null && computedVal !== updatedData[field.field_code]) {
          updatedData[field.field_code] = computedVal;
          hasChanges = true;
        }
      }
    });

    if (hasChanges) {
      setFormData(updatedData);
      notifyChange(updatedData, repeatableGroups);
    }
  }, [allFieldsFlat, formData, getComputedValue, isFieldComputed, notifyChange, repeatableGroups]);

  // STEP 2: Apply field mappings AFTER computed values are materialized
  React.useEffect(() => {
    if (panes.length > 0 && Object.keys(formData).length > 0) {
      // Collect all fields that have mapped_from_field_code
      const mappedFields: {
        mapped_from_field_code?: string | null;
        field_code: string;
        ui_display_type?: string | null;
        data_type?: string | null;
        decimal_places?: number | null;
      }[] = [];
      panes.forEach(pane => {
        pane.sections.forEach(section => {
          section.groups.forEach(group => {
            group.fields.forEach(field => {
              if (field.mapped_from_field_code) {
                mappedFields.push({
                  field_code: field.field_code,
                  mapped_from_field_code: field.mapped_from_field_code,
                  ui_display_type: field.ui_display_type,
                  data_type: field.data_type,
                  decimal_places: field.decimal_places,
                });
              }
            });
          });
        });
      });
      
      if (mappedFields.length > 0) {
        const updatedFormData = applyFieldMappings(mappedFields, formData);
        if (updatedFormData !== formData) {
          setFormData(updatedFormData);
          notifyChange(updatedFormData, repeatableGroups);
        }
      }
    }
  }, [panes, formData, applyFieldMappings, notifyChange, repeatableGroups]);

  // Helper to get section config by name
  const getSectionConfig = (sectionName: string): SectionConfig | undefined => {
    if (!sectionConfigs) return undefined;
    return sectionConfigs.find(
      cfg => cfg.name.toLowerCase() === sectionName.toLowerCase()
    );
  };

  // Initialize repeatable groups with at least one instance when panes load
  React.useEffect(() => {
    if (panes.length > 0) {
      const initialGroups: { [groupId: string]: RepeatableGroupInstance[] } = { ...repeatableGroups };
      let hasNewGroups = false;
      
      panes.forEach(pane => {
        pane.sections.forEach(section => {
          // Check if this section is configured as repeatable in pane_section_mappings
          const sectionConfig = getSectionConfig(section.sectionCode);
          const isRepeatableSection = sectionConfig?.isRepeatable;
          const sectionGroupId = sectionConfig?.groupId || section.sectionCode;
          
          if (isRepeatableSection && sectionGroupId && !initialGroups[sectionGroupId]) {
            initialGroups[sectionGroupId] = [{
              instanceId: generateInstanceId(),
              data: {},
            }];
            hasNewGroups = true;
          }
          
          // Also check for field-level repeatable groups
          section.groups.forEach(group => {
            if (group.isRepeatable && group.groupId && !initialGroups[group.groupId]) {
              initialGroups[group.groupId] = [{
                instanceId: generateInstanceId(),
                data: {},
              }];
              hasNewGroups = true;
            }
          });
        });
      });

      if (hasNewGroups) {
        setRepeatableGroups(initialGroups);
      }
    }
  }, [panes, sectionConfigs]);

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

  // Pick the pane to render (we still fetch all panes to support cross-pane mappings)
  const currentPane = currentPaneCode
    ? panes.find((p) => p.paneCode === currentPaneCode)
    : panes[0];
  
  if (!currentPane) {
    return (
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No fields configured for this pane.</p>
      </div>
    );
  }

  // Get sections from pane_section_mappings if available, otherwise use sections from field_repository
  // Then filter fields based on allowedFieldNames from workflow_stage_fields
  const sectionsToRender = (sectionConfigs && sectionConfigs.length > 0
    ? sectionConfigs.map(cfg => {
        // Find matching section from field_repository data
        const matchingSection = currentPane.sections.find(
          s => s.sectionCode.toLowerCase() === cfg.name.toLowerCase()
        );
        
        // Apply repeatable config from pane_section_mappings to the section/groups
        let groups = matchingSection?.groups.map(group => ({
          ...group,
          // Override group's isRepeatable if section is configured as repeatable
          isRepeatable: cfg.isRepeatable || group.isRepeatable,
          groupId: cfg.isRepeatable ? (cfg.groupId || cfg.name) : group.groupId,
        })) || [];
        
        return {
          sectionCode: cfg.name,
          sectionName: cfg.name,
          groups,
          gridRows: cfg.rows,
          gridColumns: cfg.columns,
          isRepeatable: cfg.isRepeatable,
          groupId: cfg.groupId,
        };
      })
    : currentPane.sections
  ).map(section => {
    // Filter fields within each group based on allowedFieldNames
    if (allowedFieldNames && allowedFieldNames.length > 0) {
      return {
        ...section,
        groups: section.groups.map(group => ({
          ...group,
          fields: group.fields.filter(field => 
            allowedFieldNames.includes(field.field_label_key) ||
            allowedFieldNames.includes(field.field_code || '')
          )
        })).filter(group => group.fields.length > 0) // Remove empty groups
      };
    }
    return section;
  });

  // Render sections directly (no accordion wrapper since we're showing one pane at a time)
  return (
    <div className="space-y-4">
      {sectionsToRender.map((section) => {
        const sectionConfig = getSectionConfig(section.sectionCode);
        
        // If section is repeatable but has no groups with fields, render a placeholder with Add button
        if (sectionConfig?.isRepeatable && (!section.groups || section.groups.length === 0 || section.groups.every(g => g.fields.length === 0))) {
          const groupId = sectionConfig.groupId || section.sectionCode;
          const instances = repeatableGroups[groupId] || [];
          
          return (
            <div key={section.sectionCode} className="border border-dashed border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-muted-foreground">{section.sectionName}</h4>
                <button
                  type="button"
                  onClick={() => handleAddRepeatableInstance(groupId)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                  disabled={disabled}
                >
                  + Add {section.sectionName}
                </button>
              </div>
              {instances.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">
                  No {section.sectionName.toLowerCase()} added yet. Click "Add {section.sectionName}" to add one.
                </p>
              )}
              {instances.map((instance, idx) => (
                <div key={instance.instanceId} className="border border-border rounded-lg p-3 mb-2 bg-muted/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{section.sectionName} #{idx + 1}</span>
                    {instances.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveRepeatableInstance(groupId, instance.instanceId)}
                        className="text-destructive hover:text-destructive/80 text-xs"
                        disabled={disabled}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">No fields configured for this section</p>
                </div>
              ))}
            </div>
          );
        }
        
        // Only render section if it has groups/fields
        if (!section.groups || section.groups.length === 0) {
          return (
            <div key={section.sectionCode} className="border border-dashed border-border rounded-lg p-4">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">{section.sectionName}</h4>
              <p className="text-xs text-muted-foreground">No fields configured for this section</p>
            </div>
          );
        }
        
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
            fieldEditabilityMap={fieldEditabilityMap}
            overrideGridRows={sectionConfig?.rows || section.gridRows}
            overrideGridColumns={sectionConfig?.columns || section.gridColumns}
            isRepeatable={sectionConfig?.isRepeatable}
            repeatableGroupId={sectionConfig?.groupId}
          />
        );
      })}
    </div>
  );
});

DynamicFormContainer.displayName = 'DynamicFormContainer';

export default DynamicFormContainer;