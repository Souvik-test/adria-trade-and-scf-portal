// Dynamic Form Types for Workflow-Based UI Generation

export interface DynamicFieldDefinition {
  id: string;
  field_id: string;
  field_code: string;
  field_label_key: string;
  field_tooltip_key: string;
  product_code: string;
  event_type: string;
  pane_code: string;
  section_code: string;
  field_display_sequence: number;
  field_row: number;
  field_column: number;
  ui_row_span: number;
  ui_column_span: number;
  group_id: string | null;
  group_repetition_flag: boolean;
  ui_display_type: string;
  data_type: string;
  lookup_code: string | null;
  dropdown_values: string[] | null;
  length_min: number | null;
  length_max: number | null;
  decimal_places: number | null;
  default_value: string | null;
  is_mandatory_portal: boolean;
  is_mandatory_mo: boolean;
  is_mandatory_bo: boolean;
  conditional_visibility_expr: string | null;
  conditional_mandatory_expr: string | null;
  is_active_flag: boolean;
}

export interface GroupedFields {
  groupId: string | null;
  isRepeatable: boolean;
  fields: DynamicFieldDefinition[];
  gridRows: number;
  gridColumns: number;
}

export interface SectionFields {
  sectionCode: string;
  sectionName: string;
  groups: GroupedFields[];
  gridRows: number;
  gridColumns: number;
}

export interface PaneFields {
  paneCode: string;
  paneName: string;
  sections: SectionFields[];
}

export interface DynamicFormData {
  [fieldCode: string]: any;
}

export interface RepeatableGroupInstance {
  instanceId: string;
  data: DynamicFormData;
}

export interface DynamicFormState {
  formData: DynamicFormData;
  repeatableGroups: {
    [groupId: string]: RepeatableGroupInstance[];
  };
}
