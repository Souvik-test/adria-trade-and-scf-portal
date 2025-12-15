-- Fix: Update update_field_repository function to include dropdown_values and other missing fields
CREATE OR REPLACE FUNCTION public.update_field_repository(p_user_id uuid, p_field_id uuid, p_field_data jsonb)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
    -- Add missing fields for dropdown_values, lengths, coordinates, etc.
    dropdown_values = CASE 
      WHEN p_field_data->'dropdown_values' IS NOT NULL AND jsonb_typeof(p_field_data->'dropdown_values') = 'array'
      THEN ARRAY(SELECT jsonb_array_elements_text(p_field_data->'dropdown_values'))
      ELSE dropdown_values
    END,
    length_min = COALESCE((p_field_data->>'length_min')::integer, length_min),
    length_max = COALESCE((p_field_data->>'length_max')::integer, length_max),
    decimal_places = COALESCE((p_field_data->>'decimal_places')::integer, decimal_places),
    field_row = COALESCE((p_field_data->>'field_row')::integer, field_row),
    field_column = COALESCE((p_field_data->>'field_column')::integer, field_column),
    field_display_sequence = COALESCE((p_field_data->>'field_display_sequence')::integer, field_display_sequence),
    ui_row_span = COALESCE((p_field_data->>'ui_row_span')::integer, ui_row_span),
    ui_column_span = COALESCE((p_field_data->>'ui_column_span')::integer, ui_column_span),
    group_id = COALESCE(p_field_data->>'group_id', group_id),
    group_repetition_flag = COALESCE((p_field_data->>'group_repetition_flag')::boolean, group_repetition_flag),
    default_value = COALESCE(p_field_data->>'default_value', default_value),
    lookup_code = COALESCE(p_field_data->>'lookup_code', lookup_code),
    size_standard_source = COALESCE(p_field_data->>'size_standard_source', size_standard_source),
    is_mandatory_portal = COALESCE((p_field_data->>'is_mandatory_portal')::boolean, is_mandatory_portal),
    is_mandatory_mo = COALESCE((p_field_data->>'is_mandatory_mo')::boolean, is_mandatory_mo),
    is_mandatory_bo = COALESCE((p_field_data->>'is_mandatory_bo')::boolean, is_mandatory_bo),
    conditional_visibility_expr = COALESCE(p_field_data->>'conditional_visibility_expr', conditional_visibility_expr),
    conditional_mandatory_expr = COALESCE(p_field_data->>'conditional_mandatory_expr', conditional_mandatory_expr),
    swift_mt_type = COALESCE(p_field_data->>'swift_mt_type', swift_mt_type),
    swift_sequence = COALESCE(p_field_data->>'swift_sequence', swift_sequence),
    swift_tag = COALESCE(p_field_data->>'swift_tag', swift_tag),
    swift_subfield_qualifier = COALESCE(p_field_data->>'swift_subfield_qualifier', swift_subfield_qualifier),
    swift_tag_display_flag = COALESCE((p_field_data->>'swift_tag_display_flag')::boolean, swift_tag_display_flag),
    swift_tag_required_flag = COALESCE((p_field_data->>'swift_tag_required_flag')::boolean, swift_tag_required_flag),
    swift_format_pattern = COALESCE(p_field_data->>'swift_format_pattern', swift_format_pattern),
    error_message_key = COALESCE(p_field_data->>'error_message_key', error_message_key),
    help_content_type = COALESCE(p_field_data->>'help_content_type', help_content_type),
    help_content_ref = COALESCE(p_field_data->>'help_content_ref', help_content_ref),
    iso20022_element_code = COALESCE(p_field_data->>'iso20022_element_code', iso20022_element_code),
    iso_data_format_pattern = COALESCE(p_field_data->>'iso_data_format_pattern', iso_data_format_pattern),
    ai_mapping_key = COALESCE(p_field_data->>'ai_mapping_key', ai_mapping_key),
    updated_at = now()
  WHERE id = p_field_id AND user_id = p_user_id
  RETURNING row_to_json(field_repository.*) INTO v_result;

  RETURN v_result;
END;
$function$;