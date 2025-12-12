-- Create function to delete all fields for a specific configuration
CREATE OR REPLACE FUNCTION public.delete_fields_by_config(
  p_user_id uuid,
  p_product_code text,
  p_event_type text,
  p_pane_code text,
  p_section_code text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_deleted_count integer;
BEGIN
  -- Validate user exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;
  
  -- Delete all fields matching the configuration
  DELETE FROM field_repository
  WHERE product_code = p_product_code
    AND event_type = p_event_type
    AND pane_code = p_pane_code
    AND section_code = p_section_code;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  
  RETURN v_deleted_count;
END;
$$;