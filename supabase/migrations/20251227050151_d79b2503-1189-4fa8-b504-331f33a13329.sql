-- Drop the restrictive SELECT policy that only allows active configs
DROP POLICY IF EXISTS "Anyone can view active pane section mappings" ON pane_section_mappings;

-- Create a new SELECT policy that allows users to view all configurations
-- This is needed for admin/config management screens
CREATE POLICY "Users can view all pane section mappings"
ON pane_section_mappings
FOR SELECT
USING (
  -- Allow users to view configurations they own OR all configurations if they have a valid custom_users session
  user_id = auth.uid() 
  OR user_id IN (
    SELECT custom_users.id 
    FROM custom_users 
    WHERE custom_users.user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  )
  OR EXISTS (
    SELECT 1 FROM custom_users 
    WHERE custom_users.user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  )
);