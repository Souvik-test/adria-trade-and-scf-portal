-- Update get_pane_section_mappings to return all active configurations, not just for the current user
-- This is appropriate for Control Centre configuration which should be visible to all admin users

CREATE OR REPLACE FUNCTION public.get_pane_section_mappings(p_user_id uuid)
 RETURNS SETOF pane_section_mappings
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Verify user exists in custom_users (authorization check)
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user ID';
  END IF;
  
  -- Return ALL configurations (not filtered by user_id) since this is admin configuration
  RETURN QUERY
  SELECT *
  FROM pane_section_mappings
  ORDER BY product_code ASC, event_code ASC;
END;
$function$;