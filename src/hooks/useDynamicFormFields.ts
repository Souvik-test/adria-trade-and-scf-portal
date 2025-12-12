import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  DynamicFieldDefinition, 
  GroupedFields, 
  SectionFields, 
  PaneFields 
} from '@/types/dynamicForm';

interface UseDynamicFormFieldsProps {
  productCode: string;
  eventType: string;
  stageId?: string; // Optional: if provided, filter by workflow stage
}

interface UseDynamicFormFieldsReturn {
  panes: PaneFields[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Organize fields by group, calculating grid dimensions
const groupFieldsByGroup = (fields: DynamicFieldDefinition[]): GroupedFields[] => {
  const groupMap = new Map<string | null, DynamicFieldDefinition[]>();
  
  fields.forEach(field => {
    const groupId = field.group_id || null;
    if (!groupMap.has(groupId)) {
      groupMap.set(groupId, []);
    }
    groupMap.get(groupId)!.push(field);
  });

  const groups: GroupedFields[] = [];
  
  groupMap.forEach((groupFields, groupId) => {
    // Calculate grid dimensions for this group
    const maxRow = Math.max(...groupFields.map(f => f.field_row + (f.ui_row_span || 1) - 1));
    const maxCol = Math.max(...groupFields.map(f => f.field_column + (f.ui_column_span || 1) - 1));
    
    // Check if any field in the group is repeatable
    const isRepeatable = groupFields.some(f => f.group_repetition_flag);
    
    groups.push({
      groupId,
      isRepeatable: isRepeatable && !!groupId, // Only repeatable if has group_id
      fields: groupFields.sort((a, b) => {
        // Sort by row first, then by column
        if (a.field_row !== b.field_row) return a.field_row - b.field_row;
        return a.field_column - b.field_column;
      }),
      gridRows: maxRow,
      gridColumns: maxCol,
    });
  });

  // Sort groups: non-grouped fields first, then by first field's position
  return groups.sort((a, b) => {
    if (!a.groupId && b.groupId) return -1;
    if (a.groupId && !b.groupId) return 1;
    const aFirstField = a.fields[0];
    const bFirstField = b.fields[0];
    if (aFirstField.field_row !== bFirstField.field_row) {
      return aFirstField.field_row - bFirstField.field_row;
    }
    return aFirstField.field_column - bFirstField.field_column;
  });
};

// Organize fields by section
const groupFieldsBySection = (fields: DynamicFieldDefinition[]): SectionFields[] => {
  const sectionMap = new Map<string, DynamicFieldDefinition[]>();
  
  fields.forEach(field => {
    const sectionCode = field.section_code;
    if (!sectionMap.has(sectionCode)) {
      sectionMap.set(sectionCode, []);
    }
    sectionMap.get(sectionCode)!.push(field);
  });

  const sections: SectionFields[] = [];
  
  sectionMap.forEach((sectionFields, sectionCode) => {
    const groups = groupFieldsByGroup(sectionFields);
    
    // Calculate overall section grid dimensions
    const maxRow = Math.max(...sectionFields.map(f => f.field_row + (f.ui_row_span || 1) - 1));
    const maxCol = Math.max(...sectionFields.map(f => f.field_column + (f.ui_column_span || 1) - 1));
    
    sections.push({
      sectionCode,
      sectionName: sectionCode, // Could be enhanced with lookup
      groups,
      gridRows: maxRow,
      gridColumns: maxCol,
    });
  });

  return sections.sort((a, b) => a.sectionCode.localeCompare(b.sectionCode));
};

// Organize fields by pane
const groupFieldsByPane = (fields: DynamicFieldDefinition[]): PaneFields[] => {
  const paneMap = new Map<string, DynamicFieldDefinition[]>();
  
  fields.forEach(field => {
    const paneCode = field.pane_code;
    if (!paneMap.has(paneCode)) {
      paneMap.set(paneCode, []);
    }
    paneMap.get(paneCode)!.push(field);
  });

  const panes: PaneFields[] = [];
  
  paneMap.forEach((paneFields, paneCode) => {
    panes.push({
      paneCode,
      paneName: paneCode, // Could be enhanced with lookup
      sections: groupFieldsBySection(paneFields),
    });
  });

  return panes.sort((a, b) => a.paneCode.localeCompare(b.paneCode));
};

export const useDynamicFormFields = ({
  productCode,
  eventType,
  stageId,
}: UseDynamicFormFieldsProps): UseDynamicFormFieldsReturn => {
  const [panes, setPanes] = useState<PaneFields[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFields = useCallback(async () => {
    if (!productCode || !eventType) {
      setPanes([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('field_repository')
        .select('*')
        .eq('product_code', productCode)
        .eq('event_type', eventType)
        .eq('is_active_flag', true);

      // If stageId is provided, we could filter by workflow stage fields
      // This would require joining with workflow_stage_fields table

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      const fields = (data || []) as unknown as DynamicFieldDefinition[];
      const organizedPanes = groupFieldsByPane(fields);
      setPanes(organizedPanes);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch fields');
      setPanes([]);
    } finally {
      setLoading(false);
    }
  }, [productCode, eventType, stageId]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  return {
    panes,
    loading,
    error,
    refetch: fetchFields,
  };
};

export default useDynamicFormFields;
