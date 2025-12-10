-- Create workflow_templates table
CREATE TABLE public.workflow_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  template_name text NOT NULL,
  module_code text NOT NULL,
  module_name text NOT NULL,
  product_code text NOT NULL,
  product_name text NOT NULL,
  event_code text NOT NULL,
  event_name text NOT NULL,
  trigger_types text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create workflow_stages table
CREATE TABLE public.workflow_stages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid NOT NULL REFERENCES public.workflow_templates(id) ON DELETE CASCADE,
  stage_name text NOT NULL,
  stage_order integer NOT NULL,
  actor_type text NOT NULL DEFAULT 'Maker',
  sla_hours integer DEFAULT 24,
  is_rejectable boolean DEFAULT false,
  reject_to_stage_id uuid REFERENCES public.workflow_stages(id) ON DELETE SET NULL,
  stage_type text NOT NULL DEFAULT 'Input',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create workflow_stage_fields table
CREATE TABLE public.workflow_stage_fields (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_id uuid NOT NULL REFERENCES public.workflow_stages(id) ON DELETE CASCADE,
  field_id text NOT NULL,
  pane text,
  section text,
  field_name text NOT NULL,
  ui_label text,
  ui_display_type text DEFAULT 'text',
  is_visible boolean DEFAULT true,
  is_editable boolean DEFAULT true,
  is_mandatory boolean DEFAULT false,
  field_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create workflow_conditions table
CREATE TABLE public.workflow_conditions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid NOT NULL REFERENCES public.workflow_templates(id) ON DELETE CASCADE,
  stage_id uuid REFERENCES public.workflow_stages(id) ON DELETE CASCADE,
  group_name text NOT NULL DEFAULT 'Group 1',
  group_operator text NOT NULL DEFAULT 'AND',
  condition_order integer DEFAULT 0,
  field_name text NOT NULL,
  operator text NOT NULL DEFAULT 'Equals',
  compare_type text NOT NULL DEFAULT 'Value',
  compare_value text,
  compare_field text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_stage_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_conditions ENABLE ROW LEVEL SECURITY;

-- RLS policies for workflow_templates
CREATE POLICY "Users can view all workflow templates" ON public.workflow_templates
  FOR SELECT USING (true);

CREATE POLICY "Users can create workflow templates" ON public.workflow_templates
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update workflow templates" ON public.workflow_templates
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete workflow templates" ON public.workflow_templates
  FOR DELETE USING (true);

-- RLS policies for workflow_stages
CREATE POLICY "Users can view all workflow stages" ON public.workflow_stages
  FOR SELECT USING (true);

CREATE POLICY "Users can create workflow stages" ON public.workflow_stages
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update workflow stages" ON public.workflow_stages
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete workflow stages" ON public.workflow_stages
  FOR DELETE USING (true);

-- RLS policies for workflow_stage_fields
CREATE POLICY "Users can view all workflow stage fields" ON public.workflow_stage_fields
  FOR SELECT USING (true);

CREATE POLICY "Users can create workflow stage fields" ON public.workflow_stage_fields
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update workflow stage fields" ON public.workflow_stage_fields
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete workflow stage fields" ON public.workflow_stage_fields
  FOR DELETE USING (true);

-- RLS policies for workflow_conditions
CREATE POLICY "Users can view all workflow conditions" ON public.workflow_conditions
  FOR SELECT USING (true);

CREATE POLICY "Users can create workflow conditions" ON public.workflow_conditions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update workflow conditions" ON public.workflow_conditions
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete workflow conditions" ON public.workflow_conditions
  FOR DELETE USING (true);

-- Create indexes for performance
CREATE INDEX idx_workflow_stages_template_id ON public.workflow_stages(template_id);
CREATE INDEX idx_workflow_stage_fields_stage_id ON public.workflow_stage_fields(stage_id);
CREATE INDEX idx_workflow_conditions_template_id ON public.workflow_conditions(template_id);
CREATE INDEX idx_workflow_conditions_stage_id ON public.workflow_conditions(stage_id);

-- Create trigger for updated_at
CREATE TRIGGER update_workflow_templates_updated_at
  BEFORE UPDATE ON public.workflow_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflow_stages_updated_at
  BEFORE UPDATE ON public.workflow_stages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();