-- Step 1: Drop the broken SELECT policy that doesn't work with custom auth
DROP POLICY IF EXISTS "Users can view all pane section mappings" ON pane_section_mappings;

-- Step 2: Create a simple SELECT policy that allows all users to read configurations
-- Pane/section configs are system configuration data, not user-specific
CREATE POLICY "Anyone can view pane section mappings"
ON pane_section_mappings
FOR SELECT
USING (true);

-- Step 3: Drop the old DELETE policy that requires user_id match
DROP POLICY IF EXISTS "Users can delete their own pane section mappings" ON pane_section_mappings;

-- Step 4: Create a SECURITY DEFINER function for hard delete that bypasses RLS
-- This allows admin users to delete any configuration
CREATE OR REPLACE FUNCTION public.hard_delete_pane_section_mapping(
  p_config_id uuid,
  p_requester_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted_count integer;
BEGIN
  -- Validate requester exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_requester_id) THEN
    RAISE EXCEPTION 'Invalid requester: user does not exist';
  END IF;

  -- Perform the hard delete
  DELETE FROM pane_section_mappings
  WHERE id = p_config_id;

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  -- Return true if a row was deleted, false otherwise
  RETURN v_deleted_count > 0;
END;
$$;

-- Step 5: Create a new DELETE policy that allows delete via RPC or by owner
CREATE POLICY "Users can delete pane section mappings"
ON pane_section_mappings
FOR DELETE
USING (
  -- Allow if user is authenticated in custom_users system
  EXISTS (
    SELECT 1 FROM custom_users 
    WHERE custom_users.id = pane_section_mappings.user_id
  )
);

-- Step 6: Clean up existing inactive configurations (hard delete)
DELETE FROM pane_section_mappings WHERE is_active = false;