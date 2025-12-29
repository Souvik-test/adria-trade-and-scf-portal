-- Fix Mapped From persistence + enable auto-population in dynamic forms
-- 1) Ensure get_dynamic_form_fields returns mapped_from_field_code
DROP FUNCTION IF EXISTS public.get_dynamic_form_fields(text, text);

CREATE OR REPLACE FUNCTION public.get_dynamic_form_fields(
  p_product_code text,
  p_event_type text
)
RETURNS TABLE(
  id uuid,
  field_id text,
  field_code text,
  field_label_key text,
  field_tooltip_key text,
  pane_code text,
  section_code text,
  field_row integer,
  field_column integer,
  ui_row_span integer,
  ui_column_span integer,
  group_id text,
  group_repetition_flag boolean,
  ui_display_type text,
  data_type text,
  lookup_code text,
  dropdown_values text[],
  length_min integer,
  length_max integer,
  decimal_places integer,
  default_value text,
  is_mandatory_portal boolean,
  is_mandatory_mo boolean,
  is_mandatory_bo boolean,
  conditional_visibility_expr text,
  conditional_mandatory_expr text,
  is_active_flag boolean,
  swift_tag text,
  swift_tag_display_flag boolean,
  swift_mt_type text,
  swift_sequence text,
  swift_subfield_qualifier text,
  swift_tag_required_flag boolean,
  swift_format_pattern text,
  field_actions jsonb,
  mapped_from_field_code text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    fr.id,
    fr.field_id,
    fr.field_code,
    fr.field_label_key,
    fr.field_tooltip_key,
    fr.pane_code,
    fr.section_code,
    fr.field_row,
    fr.field_column,
    fr.ui_row_span,
    fr.ui_column_span,
    fr.group_id,
    fr.group_repetition_flag,
    fr.ui_display_type,
    fr.data_type,
    fr.lookup_code,
    fr.dropdown_values,
    fr.length_min,
    fr.length_max,
    fr.decimal_places,
    fr.default_value,
    fr.is_mandatory_portal,
    fr.is_mandatory_mo,
    fr.is_mandatory_bo,
    fr.conditional_visibility_expr,
    fr.conditional_mandatory_expr,
    fr.is_active_flag,
    fr.swift_tag,
    fr.swift_tag_display_flag,
    fr.swift_mt_type,
    fr.swift_sequence,
    fr.swift_subfield_qualifier,
    fr.swift_tag_required_flag,
    fr.swift_format_pattern,
    fr.field_actions,
    fr.mapped_from_field_code
  FROM field_repository fr
  WHERE fr.product_code = p_product_code
    AND fr.event_type = p_event_type
    AND fr.is_active_flag = true
  ORDER BY fr.pane_code, fr.section_code, fr.field_display_sequence;
END;
$function$;

-- 2) Persist mapped_from_field_code on inserts (used by Field Definition Save + bulk upload)
CREATE OR REPLACE FUNCTION public.insert_field_repository(p_user_id uuid, p_fields jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_result jsonb;
  v_field jsonb;
  v_inserted_ids jsonb := '[]'::jsonb;
BEGIN
  -- Validate user exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user ID';
  END IF;
  
  -- Handle both single object and array of objects
  IF jsonb_typeof(p_fields) = 'object' THEN
    -- Single field object - wrap in array
    p_fields := jsonb_build_array(p_fields);
  END IF;
  
  -- Insert each field
  FOR v_field IN SELECT * FROM jsonb_array_elements(p_fields)
  LOOP
    INSERT INTO field_repository (
      field_id, field_code, field_label_key, field_tooltip_key, product_code,
      event_type, stage, channel_customer_portal_flag, channel_middle_office_flag,
      channel_back_office_flag, pane_code, pane_display_sequence, section_code,
      section_display_sequence, field_display_sequence, ui_display_type, data_type,
      lookup_code, mapped_from_field_code, length_min, length_max, decimal_places, size_standard_source,
      is_mandatory_portal, is_mandatory_mo, is_mandatory_bo, input_allowed_flag,
      edit_allowed_flag, view_allowed_flag, read_only_flag, default_value,
      computed_expression, validation_rule_set_id, conditional_visibility_expr,
      conditional_mandatory_expr, group_repetition_flag, group_id, is_attachment_field,
      masking_flag, audit_track_changes_flag, swift_mt_type, swift_sequence,
      swift_tag, swift_subfield_qualifier, swift_tag_required_flag, swift_tag_display_flag,
      swift_format_pattern, sanction_check_required_flag, sanction_field_category,
      sanction_party_role, sanction_engine_field_map, limit_check_required_flag,
      limit_dimension_type, workflow_role_access, error_message_key, help_content_type,
      help_content_ref, ui_row_span, ui_column_span, is_active_flag, effective_from_date,
      effective_to_date, config_version, created_by, last_updated_by,
      iso20022_element_code, iso_data_format_pattern, ai_mapping_key, user_id,
      dropdown_values, field_row, field_column, field_actions
    ) VALUES (
      COALESCE(v_field->>'field_id', 'FLD_' || extract(epoch from now())::text || '_' || substr(md5(random()::text), 1, 9)),
      v_field->>'field_code',
      v_field->>'field_label_key',
      v_field->>'field_tooltip_key',
      v_field->>'product_code',
      v_field->>'event_type',
      v_field->>'stage',
      COALESCE((v_field->>'channel_customer_portal_flag')::boolean, false),
      COALESCE((v_field->>'channel_middle_office_flag')::boolean, false),
      COALESCE((v_field->>'channel_back_office_flag')::boolean, false),
      v_field->>'pane_code',
      (v_field->>'pane_display_sequence')::integer,
      v_field->>'section_code',
      (v_field->>'section_display_sequence')::integer,
      (v_field->>'field_display_sequence')::integer,
      v_field->>'ui_display_type',
      v_field->>'data_type',
      v_field->>'lookup_code',
      NULLIF(v_field->>'mapped_from_field_code', ''),
      (v_field->>'length_min')::integer,
      (v_field->>'length_max')::integer,
      (v_field->>'decimal_places')::integer,
      v_field->>'size_standard_source',
      COALESCE((v_field->>'is_mandatory_portal')::boolean, false),
      COALESCE((v_field->>'is_mandatory_mo')::boolean, false),
      COALESCE((v_field->>'is_mandatory_bo')::boolean, false),
      COALESCE((v_field->>'input_allowed_flag')::boolean, true),
      COALESCE((v_field->>'edit_allowed_flag')::boolean, true),
      COALESCE((v_field->>'view_allowed_flag')::boolean, true),
      COALESCE((v_field->>'read_only_flag')::boolean, false),
      v_field->>'default_value',
      v_field->>'computed_expression',
      v_field->>'validation_rule_set_id',
      v_field->>'conditional_visibility_expr',
      v_field->>'conditional_mandatory_expr',
      COALESCE((v_field->>'group_repetition_flag')::boolean, false),
      v_field->>'group_id',
      COALESCE((v_field->>'is_attachment_field')::boolean, false),
      COALESCE((v_field->>'masking_flag')::boolean, false),
      COALESCE((v_field->>'audit_track_changes_flag')::boolean, false),
      v_field->>'swift_mt_type',
      v_field->>'swift_sequence',
      v_field->>'swift_tag',
      v_field->>'swift_subfield_qualifier',
      COALESCE((v_field->>'swift_tag_required_flag')::boolean, false),
      COALESCE((v_field->>'swift_tag_display_flag')::boolean, false),
      v_field->>'swift_format_pattern',
      COALESCE((v_field->>'sanction_check_required_flag')::boolean, false),
      v_field->>'sanction_field_category',
      v_field->>'sanction_party_role',
      v_field->>'sanction_engine_field_map',
      COALESCE((v_field->>'limit_check_required_flag')::boolean, false),
      v_field->>'limit_dimension_type',
      CASE WHEN v_field->'workflow_role_access' IS NOT NULL THEN v_field->'workflow_role_access' ELSE NULL END,
      v_field->>'error_message_key',
      v_field->>'help_content_type',
      v_field->>'help_content_ref',
      COALESCE((v_field->>'ui_row_span')::integer, 1),
      COALESCE((v_field->>'ui_column_span')::integer, 1),
      COALESCE((v_field->>'is_active_flag')::boolean, true),
      COALESCE((v_field->>'effective_from_date')::date, now()::date),
      (v_field->>'effective_to_date')::date,
      (v_field->>'config_version')::integer,
      v_field->>'created_by',
      v_field->>'last_updated_by',
      v_field->>'iso20022_element_code',
      v_field->>'iso_data_format_pattern',
      v_field->>'ai_mapping_key',
      p_user_id,
      CASE WHEN v_field->'dropdown_values' IS NOT NULL AND jsonb_typeof(v_field->'dropdown_values') = 'array' 
           THEN ARRAY(SELECT jsonb_array_elements_text(v_field->'dropdown_values'))
           ELSE NULL END,
      (v_field->>'field_row')::integer,
      (v_field->>'field_column')::integer,
      CASE WHEN v_field->'field_actions' IS NOT NULL THEN v_field->'field_actions' ELSE NULL END
    );
  END LOOP;
  
  RETURN jsonb_build_object('success', true, 'message', 'Fields inserted successfully');
END;
$function$;

-- 3) Persist mapped_from_field_code on updates (used by Field Definition Edit)
CREATE OR REPLACE FUNCTION public.update_field_repository(p_user_id uuid, p_field_id uuid, p_field_data jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Validate user exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user ID';
  END IF;
  
  -- Validate field exists
  IF NOT EXISTS (SELECT 1 FROM field_repository WHERE id = p_field_id) THEN
    RAISE EXCEPTION 'Field not found';
  END IF;
  
  -- Update the field with all provided values
  UPDATE field_repository SET
    field_code = COALESCE(p_field_data->>'field_code', field_code),
    field_label_key = COALESCE(p_field_data->>'field_label_key', field_label_key),
    field_tooltip_key = COALESCE(p_field_data->>'field_tooltip_key', field_tooltip_key),
    ui_display_type = COALESCE(p_field_data->>'ui_display_type', ui_display_type),
    data_type = COALESCE(p_field_data->>'data_type', data_type),
    length_min = COALESCE((p_field_data->>'length_min')::integer, length_min),
    length_max = COALESCE((p_field_data->>'length_max')::integer, length_max),
    decimal_places = COALESCE((p_field_data->>'decimal_places')::integer, decimal_places),
    is_mandatory_portal = COALESCE((p_field_data->>'is_mandatory_portal')::boolean, is_mandatory_portal),
    is_mandatory_mo = COALESCE((p_field_data->>'is_mandatory_mo')::boolean, is_mandatory_mo),
    is_mandatory_bo = COALESCE((p_field_data->>'is_mandatory_bo')::boolean, is_mandatory_bo),
    default_value = COALESCE(p_field_data->>'default_value', default_value),
    field_row = COALESCE((p_field_data->>'field_row')::integer, field_row),
    field_column = COALESCE((p_field_data->>'field_column')::integer, field_column),
    ui_row_span = COALESCE((p_field_data->>'ui_row_span')::integer, ui_row_span),
    ui_column_span = COALESCE((p_field_data->>'ui_column_span')::integer, ui_column_span),
    swift_tag = COALESCE(p_field_data->>'swift_tag', swift_tag),
    swift_tag_display_flag = COALESCE((p_field_data->>'swift_tag_display_flag')::boolean, swift_tag_display_flag),
    swift_mt_type = COALESCE(p_field_data->>'swift_mt_type', swift_mt_type),
    swift_sequence = COALESCE(p_field_data->>'swift_sequence', swift_sequence),
    swift_subfield_qualifier = COALESCE(p_field_data->>'swift_subfield_qualifier', swift_subfield_qualifier),
    swift_tag_required_flag = COALESCE((p_field_data->>'swift_tag_required_flag')::boolean, swift_tag_required_flag),
    swift_format_pattern = COALESCE(p_field_data->>'swift_format_pattern', swift_format_pattern),
    mapped_from_field_code = CASE
      WHEN p_field_data ? 'mapped_from_field_code' THEN NULLIF(p_field_data->>'mapped_from_field_code', '')
      ELSE mapped_from_field_code
    END,
    dropdown_values = CASE 
      WHEN p_field_data->'dropdown_values' IS NOT NULL AND jsonb_typeof(p_field_data->'dropdown_values') = 'array' 
      THEN ARRAY(SELECT jsonb_array_elements_text(p_field_data->'dropdown_values'))
      ELSE dropdown_values 
    END,
    field_actions = CASE 
      WHEN p_field_data ? 'field_actions' THEN p_field_data->'field_actions'
      ELSE field_actions 
    END,
    updated_at = now()
  WHERE id = p_field_id;
  
  RETURN jsonb_build_object('success', true, 'message', 'Field updated successfully');
END;
$function$;