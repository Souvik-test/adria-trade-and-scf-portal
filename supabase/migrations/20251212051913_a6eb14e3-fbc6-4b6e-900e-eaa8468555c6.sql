-- Create security definer function to insert fields (bypasses RLS, validates user directly)
CREATE OR REPLACE FUNCTION public.insert_field_repository(
  p_user_id uuid,
  p_field_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- Validate that user_id exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id: user does not exist';
  END IF;

  -- Insert the field and return the result
  WITH inserted AS (
    INSERT INTO field_repository (
      field_id, field_code, field_label_key, field_tooltip_key, product_code, event_type, stage,
      channel_customer_portal_flag, channel_middle_office_flag, channel_back_office_flag,
      pane_code, pane_display_sequence, section_code, section_display_sequence, field_display_sequence,
      ui_display_type, data_type, lookup_code, length_min, length_max, decimal_places, size_standard_source,
      is_mandatory_portal, is_mandatory_mo, is_mandatory_bo, input_allowed_flag, edit_allowed_flag,
      view_allowed_flag, read_only_flag, default_value, computed_expression, validation_rule_set_id,
      conditional_visibility_expr, conditional_mandatory_expr, group_repetition_flag, group_id,
      is_attachment_field, masking_flag, audit_track_changes_flag, swift_mt_type, swift_sequence,
      swift_tag, swift_subfield_qualifier, swift_tag_required_flag, swift_tag_display_flag,
      swift_format_pattern, sanction_check_required_flag, sanction_field_category, sanction_party_role,
      sanction_engine_field_map, limit_check_required_flag, limit_dimension_type, workflow_role_access,
      error_message_key, help_content_type, help_content_ref, ui_row_span, ui_column_span,
      is_active_flag, effective_from_date, effective_to_date, config_version, created_by,
      last_updated_by, iso20022_element_code, iso_data_format_pattern, ai_mapping_key, user_id,
      dropdown_values, field_row, field_column
    )
    SELECT
      COALESCE(f->>'field_id', 'FLD_' || extract(epoch from now())::text || '_' || substr(md5(random()::text), 1, 9)),
      f->>'field_code', f->>'field_label_key', f->>'field_tooltip_key', f->>'product_code', f->>'event_type', f->>'stage',
      (f->>'channel_customer_portal_flag')::boolean, (f->>'channel_middle_office_flag')::boolean, (f->>'channel_back_office_flag')::boolean,
      f->>'pane_code', (f->>'pane_display_sequence')::integer, f->>'section_code', (f->>'section_display_sequence')::integer, (f->>'field_display_sequence')::integer,
      f->>'ui_display_type', f->>'data_type', f->>'lookup_code', (f->>'length_min')::integer, (f->>'length_max')::integer, (f->>'decimal_places')::integer, f->>'size_standard_source',
      (f->>'is_mandatory_portal')::boolean, (f->>'is_mandatory_mo')::boolean, (f->>'is_mandatory_bo')::boolean, (f->>'input_allowed_flag')::boolean, (f->>'edit_allowed_flag')::boolean,
      (f->>'view_allowed_flag')::boolean, (f->>'read_only_flag')::boolean, f->>'default_value', f->>'computed_expression', f->>'validation_rule_set_id',
      f->>'conditional_visibility_expr', f->>'conditional_mandatory_expr', (f->>'group_repetition_flag')::boolean, f->>'group_id',
      (f->>'is_attachment_field')::boolean, (f->>'masking_flag')::boolean, (f->>'audit_track_changes_flag')::boolean, f->>'swift_mt_type', f->>'swift_sequence',
      f->>'swift_tag', f->>'swift_subfield_qualifier', (f->>'swift_tag_required_flag')::boolean, (f->>'swift_tag_display_flag')::boolean,
      f->>'swift_format_pattern', (f->>'sanction_check_required_flag')::boolean, f->>'sanction_field_category', f->>'sanction_party_role',
      f->>'sanction_engine_field_map', (f->>'limit_check_required_flag')::boolean, f->>'limit_dimension_type', (f->>'workflow_role_access')::jsonb,
      f->>'error_message_key', f->>'help_content_type', f->>'help_content_ref', (f->>'ui_row_span')::integer, (f->>'ui_column_span')::integer,
      COALESCE((f->>'is_active_flag')::boolean, true), COALESCE(f->>'effective_from_date', now()::text)::date, (f->>'effective_to_date')::date, (f->>'config_version')::integer, f->>'created_by',
      f->>'last_updated_by', f->>'iso20022_element_code', f->>'iso_data_format_pattern', f->>'ai_mapping_key', p_user_id,
      CASE WHEN f->'dropdown_values' IS NOT NULL THEN ARRAY(SELECT jsonb_array_elements_text(f->'dropdown_values')) ELSE NULL END,
      (f->>'field_row')::integer, (f->>'field_column')::integer
    FROM jsonb_array_elements(p_field_data) AS f
    RETURNING *
  )
  SELECT jsonb_agg(row_to_json(inserted.*)) INTO v_result FROM inserted;

  RETURN v_result;
END;
$$;

-- Create security definer function to fetch fields for a user
CREATE OR REPLACE FUNCTION public.get_user_fields(p_user_id uuid)
RETURNS SETOF field_repository
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;
  
  RETURN QUERY
  SELECT * FROM field_repository
  WHERE user_id = p_user_id
  ORDER BY created_at DESC;
END;
$$;

-- Create security definer function to update a field
CREATE OR REPLACE FUNCTION public.update_field_repository(
  p_user_id uuid,
  p_field_id uuid,
  p_field_data jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;

  UPDATE field_repository
  SET
    field_code = COALESCE(p_field_data->>'field_code', field_code),
    field_label_key = COALESCE(p_field_data->>'field_label_key', field_label_key),
    field_tooltip_key = COALESCE(p_field_data->>'field_tooltip_key', field_tooltip_key),
    product_code = COALESCE(p_field_data->>'product_code', product_code),
    event_type = COALESCE(p_field_data->>'event_type', event_type),
    stage = COALESCE(p_field_data->>'stage', stage),
    pane_code = COALESCE(p_field_data->>'pane_code', pane_code),
    section_code = COALESCE(p_field_data->>'section_code', section_code),
    ui_display_type = COALESCE(p_field_data->>'ui_display_type', ui_display_type),
    data_type = COALESCE(p_field_data->>'data_type', data_type),
    is_active_flag = COALESCE((p_field_data->>'is_active_flag')::boolean, is_active_flag),
    updated_at = now()
  WHERE id = p_field_id AND user_id = p_user_id
  RETURNING row_to_json(field_repository.*) INTO v_result;

  RETURN v_result;
END;
$$;

-- Create security definer function to delete a field
CREATE OR REPLACE FUNCTION public.delete_field_repository(
  p_user_id uuid,
  p_field_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;

  DELETE FROM field_repository
  WHERE id = p_field_id AND user_id = p_user_id;

  RETURN FOUND;
END;
$$;

-- Create security definer function to toggle field active status
CREATE OR REPLACE FUNCTION public.toggle_field_active(
  p_user_id uuid,
  p_field_id uuid,
  p_is_active boolean
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;

  UPDATE field_repository
  SET is_active_flag = p_is_active, updated_at = now()
  WHERE id = p_field_id AND user_id = p_user_id;

  RETURN FOUND;
END;
$$;

-- Create security definer function to copy a field
CREATE OR REPLACE FUNCTION public.copy_field_repository(
  p_user_id uuid,
  p_field_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_original RECORD;
  v_new_field_id text;
  v_result jsonb;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;

  SELECT * INTO v_original FROM field_repository WHERE id = p_field_id AND user_id = p_user_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Field not found';
  END IF;

  v_new_field_id := v_original.field_id || '_COPY_' || extract(epoch from now())::bigint;

  INSERT INTO field_repository (
    field_id, field_code, field_label_key, field_tooltip_key, product_code, event_type, stage,
    channel_customer_portal_flag, channel_middle_office_flag, channel_back_office_flag,
    pane_code, pane_display_sequence, section_code, section_display_sequence, field_display_sequence,
    ui_display_type, data_type, lookup_code, length_min, length_max, decimal_places, size_standard_source,
    is_mandatory_portal, is_mandatory_mo, is_mandatory_bo, input_allowed_flag, edit_allowed_flag,
    view_allowed_flag, read_only_flag, default_value, computed_expression, validation_rule_set_id,
    conditional_visibility_expr, conditional_mandatory_expr, group_repetition_flag, group_id,
    is_attachment_field, masking_flag, audit_track_changes_flag, swift_mt_type, swift_sequence,
    swift_tag, swift_subfield_qualifier, swift_tag_required_flag, swift_tag_display_flag,
    swift_format_pattern, sanction_check_required_flag, sanction_field_category, sanction_party_role,
    sanction_engine_field_map, limit_check_required_flag, limit_dimension_type, workflow_role_access,
    error_message_key, help_content_type, help_content_ref, ui_row_span, ui_column_span,
    is_active_flag, effective_from_date, effective_to_date, config_version, created_by,
    last_updated_by, iso20022_element_code, iso_data_format_pattern, ai_mapping_key, user_id,
    dropdown_values, field_row, field_column
  ) VALUES (
    v_new_field_id, v_original.field_code, v_original.field_label_key, v_original.field_tooltip_key,
    v_original.product_code, v_original.event_type, v_original.stage,
    v_original.channel_customer_portal_flag, v_original.channel_middle_office_flag, v_original.channel_back_office_flag,
    v_original.pane_code, v_original.pane_display_sequence, v_original.section_code, v_original.section_display_sequence, v_original.field_display_sequence,
    v_original.ui_display_type, v_original.data_type, v_original.lookup_code, v_original.length_min, v_original.length_max, v_original.decimal_places, v_original.size_standard_source,
    v_original.is_mandatory_portal, v_original.is_mandatory_mo, v_original.is_mandatory_bo, v_original.input_allowed_flag, v_original.edit_allowed_flag,
    v_original.view_allowed_flag, v_original.read_only_flag, v_original.default_value, v_original.computed_expression, v_original.validation_rule_set_id,
    v_original.conditional_visibility_expr, v_original.conditional_mandatory_expr, v_original.group_repetition_flag, v_original.group_id,
    v_original.is_attachment_field, v_original.masking_flag, v_original.audit_track_changes_flag, v_original.swift_mt_type, v_original.swift_sequence,
    v_original.swift_tag, v_original.swift_subfield_qualifier, v_original.swift_tag_required_flag, v_original.swift_tag_display_flag,
    v_original.swift_format_pattern, v_original.sanction_check_required_flag, v_original.sanction_field_category, v_original.sanction_party_role,
    v_original.sanction_engine_field_map, v_original.limit_check_required_flag, v_original.limit_dimension_type, v_original.workflow_role_access,
    v_original.error_message_key, v_original.help_content_type, v_original.help_content_ref, v_original.ui_row_span, v_original.ui_column_span,
    v_original.is_active_flag, v_original.effective_from_date, v_original.effective_to_date, v_original.config_version, v_original.created_by,
    v_original.last_updated_by, v_original.iso20022_element_code, v_original.iso_data_format_pattern, v_original.ai_mapping_key, p_user_id,
    v_original.dropdown_values, v_original.field_row, v_original.field_column
  )
  RETURNING row_to_json(field_repository.*) INTO v_result;

  RETURN v_result;
END;
$$;