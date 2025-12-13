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
  buttons?: PaneButtonConfig[];
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

// Button configuration types for panes
export type ButtonActionType = 
  | 'next_pane' 
  | 'previous_pane' 
  | 'save_draft' 
  | 'save_template' 
  | 'submit' 
  | 'discard' 
  | 'close' 
  | 'custom';

export type ButtonPosition = 'left' | 'right';

export type ButtonVariant = 'default' | 'secondary' | 'outline' | 'destructive' | 'ghost';

export interface PaneButtonConfig {
  id: string;
  label: string;
  position: ButtonPosition;
  variant: ButtonVariant;
  action: ButtonActionType;
  targetPaneId?: string | null;
  isVisible: boolean;
  order: number;
}

// Section configuration with buttons
export interface SectionConfig {
  id: string;
  name: string;
  sequence: number;
  rows: number;
  columns: number;
}

// Pane configuration with buttons
export interface PaneConfig {
  id: string;
  name: string;
  sequence: number;
  sections: SectionConfig[];
  buttons: PaneButtonConfig[];
  isOpen?: boolean;
}

// Workflow runtime types
export interface WorkflowTemplateRuntime {
  id: string;
  template_name: string;
  product_code: string;
  event_code: string;
  trigger_types: string[];
  status: string;
}

export interface WorkflowStageRuntime {
  id: string;
  template_id: string;
  stage_name: string;
  stage_order: number;
  actor_type: string;
  sla_hours: number;
  is_rejectable: boolean;
  reject_to_stage_id: string | null;
  stage_type: string;
}

export interface WorkflowStageFieldRuntime {
  id: string;
  stage_id: string;
  field_id: string;
  pane: string;
  section: string;
  field_name: string;
  ui_label: string;
  ui_display_type: string;
  is_visible: boolean;
  is_editable: boolean;
  is_mandatory: boolean;
  field_order: number;
}
