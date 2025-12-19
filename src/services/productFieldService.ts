import { supabase } from "@/integrations/supabase/client";
import { FieldActions } from "@/types/dynamicForm";

export interface ProductField {
  id?: string;
  field_id: string;
  field_code?: string;
  field_label_key?: string;
  field_tooltip_key?: string;
  product_code: string;
  event_type?: string;
  stage?: string;
  channel_customer_portal_flag?: boolean;
  channel_middle_office_flag?: boolean;
  channel_back_office_flag?: boolean;
  pane_code?: string;
  pane_display_sequence?: number;
  section_code?: string;
  section_display_sequence?: number;
  field_display_sequence?: number;
  ui_display_type?: string;
  data_type?: string;
  lookup_code?: string;
  length_min?: number;
  length_max?: number;
  decimal_places?: number;
  size_standard_source?: string;
  is_mandatory_portal?: boolean;
  is_mandatory_mo?: boolean;
  is_mandatory_bo?: boolean;
  input_allowed_flag?: boolean;
  edit_allowed_flag?: boolean;
  view_allowed_flag?: boolean;
  read_only_flag?: boolean;
  default_value?: string;
  computed_expression?: string;
  validation_rule_set_id?: string;
  conditional_visibility_expr?: string;
  conditional_mandatory_expr?: string;
  group_repetition_flag?: boolean;
  group_id?: string;
  is_attachment_field?: boolean;
  masking_flag?: boolean;
  audit_track_changes_flag?: boolean;
  swift_mt_type?: string;
  swift_sequence?: string;
  swift_tag?: string;
  swift_subfield_qualifier?: string;
  swift_tag_required_flag?: boolean;
  swift_tag_display_flag?: boolean;
  swift_format_pattern?: string;
  sanction_check_required_flag?: boolean;
  sanction_field_category?: string;
  sanction_party_role?: string;
  sanction_engine_field_map?: string;
  limit_check_required_flag?: boolean;
  limit_dimension_type?: string;
  workflow_role_access?: any;
  error_message_key?: string;
  help_content_type?: string;
  help_content_ref?: string;
  ui_row_span?: number;
  ui_column_span?: number;
  is_active_flag?: boolean;
  effective_from_date: string;
  effective_to_date?: string;
  config_version?: number;
  created_by?: string;
  created_at?: string;
  last_updated_by?: string;
  updated_at?: string;
  iso20022_element_code?: string;
  iso_data_format_pattern?: string;
  ai_mapping_key?: string;
  user_id: string;
  // Field actions for computed fields and conditional logic
  field_actions?: FieldActions | null;
}

export const fetchProductFields = async (userId: string) => {
  const { data, error } = await supabase
    .from("field_repository")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const createProductField = async (fieldData: ProductField, userId: string) => {
  // Auto-generate field_id if not provided
  const fieldId = fieldData.field_id || `FLD_${Date.now()}_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  
  // Cast to any to handle JSONB field_actions type
  const insertData = { ...fieldData, field_id: fieldId, user_id: userId } as any;
  
  const { data, error } = await supabase
    .from("field_repository")
    .insert([insertData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateProductField = async (id: string, fieldData: Partial<ProductField>, userId: string) => {
  // Cast to any to handle JSONB field_actions type
  const updateData = fieldData as any;
  
  const { data, error } = await supabase
    .from("field_repository")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteProductField = async (id: string, userId: string) => {
  const { error } = await supabase
    .from("field_repository")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) throw error;
};

export const toggleFieldActive = async (id: string, isActive: boolean, userId: string) => {
  const { data, error } = await supabase
    .from("field_repository")
    .update({ is_active_flag: isActive })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const copyProductField = async (id: string, userId: string) => {
  const { data: original, error: fetchError } = await supabase
    .from("field_repository")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (fetchError) throw fetchError;

  const { id: _, field_id, created_at, updated_at, ...copyData } = original;
  const newFieldId = `${field_id}_COPY_${Date.now()}`;

  const { data, error } = await supabase
    .from("field_repository")
    .insert([{ ...copyData, field_id: newFieldId, user_id: userId }])
    .select()
    .single();

  if (error) throw error;
  return data;
};
