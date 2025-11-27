-- Create field_repository table for Product Field Definition
CREATE TABLE public.field_repository (
  -- Group 1: Field Identification
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  field_id text NOT NULL UNIQUE,
  field_code text,
  field_label_key text,
  field_tooltip_key text,
  
  -- Group 2: Product/Event/Stage/Channel
  product_code text NOT NULL,
  event_type text,
  stage text,
  channel_customer_portal_flag boolean DEFAULT false,
  channel_middle_office_flag boolean DEFAULT false,
  channel_back_office_flag boolean DEFAULT false,
  
  -- Group 3: UI Layout & Positioning
  pane_code text,
  pane_display_sequence integer,
  section_code text,
  section_display_sequence integer,
  field_display_sequence integer,
  ui_display_type text,
  
  -- Group 4: Data Properties
  data_type text,
  lookup_code text,
  length_min integer,
  length_max integer,
  decimal_places integer,
  size_standard_source text,
  
  -- Group 5: Mandatory & Permissions
  is_mandatory_portal boolean DEFAULT false,
  is_mandatory_mo boolean DEFAULT false,
  is_mandatory_bo boolean DEFAULT false,
  input_allowed_flag boolean DEFAULT true,
  edit_allowed_flag boolean DEFAULT true,
  view_allowed_flag boolean DEFAULT true,
  read_only_flag boolean DEFAULT false,
  
  -- Group 6: Default & Computed Values
  default_value text,
  computed_expression text,
  validation_rule_set_id text,
  
  -- Group 7: Conditional Logic
  conditional_visibility_expr text,
  conditional_mandatory_expr text,
  
  -- Group 8: Group & Repetition
  group_repetition_flag boolean DEFAULT false,
  group_id text,
  is_attachment_field boolean DEFAULT false,
  
  -- Group 9: Security & Audit
  masking_flag boolean DEFAULT false,
  audit_track_changes_flag boolean DEFAULT false,
  
  -- Group 10: SWIFT Mapping
  swift_mt_type text,
  swift_sequence text,
  swift_tag text,
  swift_subfield_qualifier text,
  swift_tag_required_flag boolean DEFAULT false,
  swift_tag_display_flag boolean DEFAULT false,
  swift_format_pattern text,
  
  -- Group 11: Sanctions & Limits
  sanction_check_required_flag boolean DEFAULT false,
  sanction_field_category text,
  sanction_party_role text,
  sanction_engine_field_map text,
  limit_check_required_flag boolean DEFAULT false,
  limit_dimension_type text,
  
  -- Group 12: Workflow & Access
  workflow_role_access jsonb,
  
  -- Group 13: Error & Help
  error_message_key text,
  help_content_type text,
  help_content_ref text,
  
  -- Group 14: UI Layout Hints
  ui_row_span integer DEFAULT 1,
  ui_column_span integer DEFAULT 1,
  
  -- Group 15: Configuration Management
  is_active_flag boolean DEFAULT true,
  effective_from_date date NOT NULL,
  effective_to_date date,
  config_version integer DEFAULT 1,
  created_by text,
  created_at timestamptz DEFAULT now(),
  last_updated_by text,
  updated_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL,
  
  -- Group 16: ISO & AI Mapping
  iso20022_element_code text,
  iso_data_format_pattern text,
  ai_mapping_key text
);

-- Enable RLS
ALTER TABLE public.field_repository ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own field definitions"
  ON public.field_repository
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own field definitions"
  ON public.field_repository
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own field definitions"
  ON public.field_repository
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own field definitions"
  ON public.field_repository
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_field_repository_updated_at
  BEFORE UPDATE ON public.field_repository
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_field_repository_product_code ON public.field_repository(product_code);
CREATE INDEX idx_field_repository_event_type ON public.field_repository(event_type);
CREATE INDEX idx_field_repository_stage ON public.field_repository(stage);
CREATE INDEX idx_field_repository_user_id ON public.field_repository(user_id);
CREATE INDEX idx_field_repository_is_active ON public.field_repository(is_active_flag);