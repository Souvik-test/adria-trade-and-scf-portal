-- Add ui_render_mode column to workflow_stages table
-- This column determines whether to use static hardcoded screens or dynamic UI rendering
ALTER TABLE workflow_stages 
ADD COLUMN ui_render_mode text NOT NULL DEFAULT 'static';

-- Add check constraint to ensure valid values
ALTER TABLE workflow_stages 
ADD CONSTRAINT workflow_stages_ui_render_mode_check 
CHECK (ui_render_mode IN ('static', 'dynamic'));

-- Add comment for documentation
COMMENT ON COLUMN workflow_stages.ui_render_mode IS 
'Determines UI rendering: static = use hardcoded screen component, dynamic = use workflow-driven dynamic form with panes/sections/fields';