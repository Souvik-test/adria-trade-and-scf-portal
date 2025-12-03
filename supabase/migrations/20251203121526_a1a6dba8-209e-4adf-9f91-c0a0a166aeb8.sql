-- Create a security definer function to fetch all pane section mappings for a user
CREATE OR REPLACE FUNCTION public.get_pane_section_mappings(p_user_id uuid)
RETURNS SETOF pane_section_mappings
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verify user exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user ID';
  END IF;
  
  -- Return all configurations for this user
  RETURN QUERY
  SELECT *
  FROM pane_section_mappings
  WHERE user_id = p_user_id
  ORDER BY product_code ASC, event_code ASC;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_pane_section_mappings(uuid) TO anon, authenticated;