CREATE OR REPLACE FUNCTION public.get_fields_by_config(
  p_user_id uuid,
  p_product_code text,
  p_event_type text,
  p_pane_code text,
  p_section_code text
)
RETURNS SETOF field_repository
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Validate user exists
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;
  
  RETURN QUERY
  SELECT * FROM field_repository
  WHERE product_code = p_product_code
    AND event_type = p_event_type
    AND pane_code = p_pane_code
    AND section_code = p_section_code
  ORDER BY field_display_sequence ASC;
END;
$$;