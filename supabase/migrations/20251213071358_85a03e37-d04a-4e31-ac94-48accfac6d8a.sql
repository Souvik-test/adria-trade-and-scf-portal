CREATE OR REPLACE FUNCTION public.delete_fields_by_product_event(
  p_user_id uuid,
  p_product_code text,
  p_event_type text
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_deleted_count integer;
BEGIN
  -- Validate user exists
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;
  
  -- Delete ALL fields for this product-event combination (across all panes/sections)
  DELETE FROM field_repository
  WHERE product_code = p_product_code
    AND event_type = p_event_type;
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  
  RETURN v_deleted_count;
END;
$$;