-- Add static_panes column to workflow_stages table
-- This column stores an array of pane names that should be displayed when UI Render Mode is 'static'
ALTER TABLE workflow_stages 
ADD COLUMN IF NOT EXISTS static_panes jsonb DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN workflow_stages.static_panes IS 'Array of static pane names to display when ui_render_mode is static. E.g., ["Basic LC Information", "Party Details"]';