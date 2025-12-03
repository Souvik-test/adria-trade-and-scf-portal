-- Create security definer functions for pane_section_mappings operations
-- These bypass RLS but validate the user_id exists in custom_users

-- Function to upsert pane section mapping
CREATE OR REPLACE FUNCTION public.upsert_pane_section_mapping(
  p_user_id uuid,
  p_product_code text,
  p_event_code text,
  p_business_application text[],
  p_customer_segment text[],
  p_panes jsonb,
  p_is_active boolean DEFAULT true
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  -- Validate that user_id exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id: user does not exist';
  END IF;

  -- Check if configuration already exists
  SELECT id INTO v_id 
  FROM pane_section_mappings 
  WHERE product_code = p_product_code 
    AND event_code = p_event_code
    AND business_application = p_business_application
    AND customer_segment = p_customer_segment;

  IF v_id IS NOT NULL THEN
    -- Update existing record
    UPDATE pane_section_mappings 
    SET panes = p_panes,
        is_active = p_is_active,
        updated_at = now()
    WHERE id = v_id;
  ELSE
    -- Insert new record
    INSERT INTO pane_section_mappings (
      user_id, product_code, event_code, business_application, 
      customer_segment, panes, is_active
    ) VALUES (
      p_user_id, p_product_code, p_event_code, p_business_application,
      p_customer_segment, p_panes, p_is_active
    )
    RETURNING id INTO v_id;
  END IF;

  RETURN v_id;
END;
$$;

-- Function to toggle active status
CREATE OR REPLACE FUNCTION public.toggle_pane_section_active(
  p_config_id uuid,
  p_is_active boolean
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE pane_section_mappings 
  SET is_active = p_is_active,
      updated_at = now()
  WHERE id = p_config_id;
  
  RETURN FOUND;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.upsert_pane_section_mapping TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_pane_section_active TO anon, authenticated;