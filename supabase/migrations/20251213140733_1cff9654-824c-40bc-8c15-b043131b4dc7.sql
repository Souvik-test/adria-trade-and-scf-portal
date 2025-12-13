-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Users can view their own pane section mappings" ON pane_section_mappings;

-- Allow anyone to read active configurations (they're UI structure definitions, not sensitive data)
CREATE POLICY "Anyone can view active pane section mappings"
  ON pane_section_mappings FOR SELECT
  USING (is_active = true);