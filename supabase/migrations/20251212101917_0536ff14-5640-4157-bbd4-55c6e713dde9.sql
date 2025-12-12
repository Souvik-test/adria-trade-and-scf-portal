-- Drop and recreate insert_field_repository with proper date type casting
DROP FUNCTION IF EXISTS public.insert_field_repository(uuid, jsonb);

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
      lookup_code, length_min, length_max, decimal_places, size_standard_source,
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
      dropdown_values, field_row, field_column
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
      (v_field->>'field_column')::integer
    );
  END LOOP;
  
  RETURN jsonb_build_object('success', true, 'message', 'Fields inserted successfully');
END;
$function$;