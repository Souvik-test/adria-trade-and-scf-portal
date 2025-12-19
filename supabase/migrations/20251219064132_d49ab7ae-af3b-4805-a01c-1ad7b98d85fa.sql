-- Drop and recreate get_dynamic_form_fields to include field_actions
DROP FUNCTION IF EXISTS public.get_dynamic_form_fields(text, text);

CREATE OR REPLACE FUNCTION public.get_dynamic_form_fields(p_product_code text, p_event_type text)
 RETURNS TABLE(id uuid, field_id text, field_code text, field_label_key text, field_tooltip_key text, pane_code text, section_code text, field_row integer, field_column integer, ui_row_span integer, ui_column_span integer, group_id text, group_repetition_flag boolean, ui_display_type text, data_type text, lookup_code text, dropdown_values text[], length_min integer, length_max integer, decimal_places integer, default_value text, is_mandatory_portal boolean, is_mandatory_mo boolean, is_mandatory_bo boolean, conditional_visibility_expr text, conditional_mandatory_expr text, is_active_flag boolean, swift_tag text, swift_tag_display_flag boolean, swift_mt_type text, swift_sequence text, swift_subfield_qualifier text, swift_tag_required_flag boolean, swift_format_pattern text, field_actions jsonb)
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
    fr.field_actions
  FROM field_repository fr
  WHERE fr.product_code = p_product_code
    AND fr.event_type = p_event_type
    AND fr.is_active_flag = true
  ORDER BY fr.pane_code, fr.section_code, fr.field_display_sequence;
END;
$function$;