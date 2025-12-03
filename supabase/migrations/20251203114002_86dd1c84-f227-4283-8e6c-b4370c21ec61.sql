-- Update RLS policies on pane_section_mappings to support both Supabase auth and custom auth

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own pane section mappings" ON pane_section_mappings;
DROP POLICY IF EXISTS "Users can view their own pane section mappings" ON pane_section_mappings;
DROP POLICY IF EXISTS "Users can update their own pane section mappings" ON pane_section_mappings;
DROP POLICY IF EXISTS "Users can delete their own pane section mappings" ON pane_section_mappings;

-- Recreate policies with support for both Supabase auth and custom auth
CREATE POLICY "Users can create their own pane section mappings" 
ON pane_section_mappings FOR INSERT 
WITH CHECK (
  user_id = auth.uid() 
  OR 
  user_id IN (SELECT id FROM custom_users WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text))
);

CREATE POLICY "Users can view their own pane section mappings" 
ON pane_section_mappings FOR SELECT 
USING (
  user_id = auth.uid() 
  OR 
  user_id IN (SELECT id FROM custom_users WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text))
);

CREATE POLICY "Users can update their own pane section mappings" 
ON pane_section_mappings FOR UPDATE 
USING (
  user_id = auth.uid() 
  OR 
  user_id IN (SELECT id FROM custom_users WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text))
);

CREATE POLICY "Users can delete their own pane section mappings" 
ON pane_section_mappings FOR DELETE 
USING (
  user_id = auth.uid() 
  OR 
  user_id IN (SELECT id FROM custom_users WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text))
);