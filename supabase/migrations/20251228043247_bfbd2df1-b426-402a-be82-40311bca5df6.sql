-- Drop the old function and create a simpler one without user_id parameter
DROP FUNCTION IF EXISTS public.get_all_fields_for_mapping(uuid, text, text);

CREATE OR REPLACE FUNCTION public.get_all_fields_for_mapping(
  p_product_code text,
  p_event_type text
)
RETURNS TABLE (
  field_id text,
  field_code text,
  field_label_key text,
  pane_code text,
  section_code text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fr.field_id,
    fr.field_code,
    fr.field_label_key,
    fr.pane_code,
    fr.section_code
  FROM field_repository fr
  WHERE fr.product_code = p_product_code
    AND fr.event_type = p_event_type
    AND fr.is_active_flag = true
  ORDER BY fr.pane_code, fr.section_code, fr.field_display_sequence;
END;
$$;