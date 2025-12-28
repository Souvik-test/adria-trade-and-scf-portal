-- Create RPC function to get all fields for mapping (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_all_fields_for_mapping(
  p_user_id uuid,
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
  -- Validate user exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;
  
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