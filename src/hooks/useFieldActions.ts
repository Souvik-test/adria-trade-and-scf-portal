import { useMemo, useCallback } from 'react';
import { DynamicFieldDefinition, DynamicFormData, FieldActions } from '@/types/dynamicForm';

interface UseFieldActionsProps {
  fields: DynamicFieldDefinition[];
  formData: DynamicFormData;
}

interface FieldActionsResult {
  getFieldVisibility: (fieldCode: string) => boolean;
  getFilteredDropdownOptions: (fieldCode: string, originalOptions: string[]) => string[];
  getComputedValue: (fieldCode: string) => number | string | null;
  isFieldComputed: (fieldCode: string) => boolean;
}

// Normalize field code to UPPERCASE_UNDERSCORE format
const normalizeFieldCode = (code: string): string => {
  return code.toUpperCase().replace(/\s+/g, '_');
};

// Build a lookup map for field values with multiple key variants
const buildFieldValueMap = (formData: DynamicFormData): Map<string, any> => {
  const map = new Map<string, any>();
  
  Object.entries(formData).forEach(([key, value]) => {
    // Add original key
    map.set(key, value);
    // Add normalized version
    const normalized = normalizeFieldCode(key);
    if (normalized !== key) {
      map.set(normalized, value);
    }
    // Add lowercase version
    map.set(key.toLowerCase(), value);
  });
  
  return map;
};

// Parse and evaluate a simple arithmetic formula
const evaluateFormula = (formula: string, formData: DynamicFormData): number | null => {
  if (!formula) return null;
  
  try {
    // Build a lookup map with multiple key variants
    const valueMap = buildFieldValueMap(formData);
    
    // Replace field codes with their values
    let expression = formula;
    
    // Find all field codes (uppercase letters, underscores, and numbers)
    const fieldCodePattern = /[A-Z][A-Z0-9_]*/g;
    const fieldCodes = formula.match(fieldCodePattern) || [];
    
    // Replace each field code with its numeric value
    for (const code of fieldCodes) {
      // Try multiple variants to find the value
      let value = valueMap.get(code) ?? valueMap.get(normalizeFieldCode(code)) ?? valueMap.get(code.toLowerCase());
      
      const numValue = typeof value === 'number' ? value : parseFloat(value) || 0;
      expression = expression.replace(new RegExp(code, 'g'), String(numValue));
    }
    
    // Evaluate the expression safely (only allow numbers and basic operators)
    if (!/^[\d\s+\-*/().]+$/.test(expression)) {
      console.warn('Invalid formula expression:', expression);
      return null;
    }
    
    // Use Function constructor for safe evaluation
    const result = new Function(`return ${expression}`)();
    return typeof result === 'number' && !isNaN(result) ? result : null;
  } catch (error) {
    console.warn('Error evaluating formula:', formula, error);
    return null;
  }
};

export const useFieldActions = ({ fields, formData }: UseFieldActionsProps): FieldActionsResult => {
  // Build a map of field_code to field_actions
  const fieldActionsMap = useMemo(() => {
    const map = new Map<string, FieldActions>();
    fields.forEach(field => {
      if (field.field_actions && field.field_code) {
        map.set(field.field_code, field.field_actions);
      }
    });
    return map;
  }, [fields]);

  // Build a set of visible fields based on all triggers
  const visibilityOverrides = useMemo(() => {
    const showSet = new Set<string>();
    const hideSet = new Set<string>();

    fields.forEach(field => {
      const actions = field.field_actions;
      if (!actions?.triggers) return;

      const currentValue = formData[field.field_code];
      
      actions.triggers.forEach(trigger => {
        // Check if current value matches any of the trigger values
        const matches = trigger.when_value?.some(val => {
          if (Array.isArray(currentValue)) {
            return currentValue.includes(val);
          }
          return String(currentValue) === val;
        });

        if (matches) {
          // Add fields to show
          trigger.show_fields?.forEach(code => showSet.add(code));
          // Add fields to hide
          trigger.hide_fields?.forEach(code => hideSet.add(code));
        }
      });
    });

    return { showSet, hideSet };
  }, [fields, formData]);

  // Get visibility for a specific field
  const getFieldVisibility = useCallback((fieldCode: string): boolean => {
    const { showSet, hideSet } = visibilityOverrides;
    
    // If explicitly hidden, return false
    if (hideSet.has(fieldCode)) return false;
    
    // Check if this field has a dropdown_filter_source - it should be visible if triggered
    const field = fields.find(f => f.field_code === fieldCode);
    if (field?.field_actions?.dropdown_filter_source) {
      // Only show if the source field's triggers include this field in show_fields
      const sourceField = fields.find(f => f.field_code === field.field_actions?.dropdown_filter_source);
      if (sourceField?.field_actions?.triggers) {
        const sourceValue = formData[sourceField.field_code];
        const anyTriggerShowsThis = sourceField.field_actions.triggers.some(trigger => {
          const matches = trigger.when_value?.some(val => String(sourceValue) === val);
          return matches && trigger.show_fields?.includes(fieldCode);
        });
        if (!anyTriggerShowsThis && showSet.size > 0) {
          // If there are explicit show rules and this field isn't in them, check if it should be hidden by default
          const hasHideByDefault = sourceField.field_actions.triggers.some(trigger => 
            trigger.show_fields?.length && !trigger.show_fields.includes(fieldCode)
          );
          // Don't automatically hide unless explicitly in hideSet
        }
      }
    }
    
    // Default: visible (unless there's an explicit conditional_visibility_expr that hides it)
    return true;
  }, [visibilityOverrides, fields, formData]);

  // Get filtered dropdown options
  const getFilteredDropdownOptions = useCallback((fieldCode: string, originalOptions: string[]): string[] => {
    const field = fields.find(f => f.field_code === fieldCode);
    const filterSource = field?.field_actions?.dropdown_filter_source;
    
    if (!filterSource) return originalOptions;
    
    // Find the source field and check its triggers
    const sourceField = fields.find(f => f.field_code === filterSource);
    if (!sourceField?.field_actions?.triggers) return originalOptions;
    
    const sourceValue = formData[filterSource];
    
    for (const trigger of sourceField.field_actions.triggers) {
      const matches = trigger.when_value?.some(val => String(sourceValue) === val);
      
      if (matches && trigger.filter_dropdowns?.[fieldCode]) {
        // Return only the allowed options that exist in the original options
        const allowedOptions = trigger.filter_dropdowns[fieldCode];
        return originalOptions.filter(opt => allowedOptions.includes(opt));
      }
    }
    
    return originalOptions;
  }, [fields, formData]);

  // Get computed value for a field
  const getComputedValue = useCallback((fieldCode: string): number | string | null => {
    const actions = fieldActionsMap.get(fieldCode);
    
    if (!actions?.is_computed || !actions?.computed_formula) {
      return null;
    }
    
    return evaluateFormula(actions.computed_formula, formData);
  }, [fieldActionsMap, formData]);

  // Check if a field is computed
  const isFieldComputed = useCallback((fieldCode: string): boolean => {
    const actions = fieldActionsMap.get(fieldCode);
    return actions?.is_computed === true;
  }, [fieldActionsMap]);

  return {
    getFieldVisibility,
    getFilteredDropdownOptions,
    getComputedValue,
    isFieldComputed,
  };
};

export default useFieldActions;