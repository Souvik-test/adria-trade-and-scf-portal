-- Create import_lc_templates table
CREATE TABLE IF NOT EXISTS public.import_lc_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  template_id text NOT NULL,
  template_name text NOT NULL,
  product_name text NOT NULL DEFAULT 'Import LC',
  template_description text,
  
  -- Reference to original transaction (if created from existing transaction)
  source_transaction_ref text,
  
  -- Store all form data as JSONB
  template_data jsonb NOT NULL,
  
  -- Metadata
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean DEFAULT true,
  
  -- Search/filter fields
  tags text[],
  
  CONSTRAINT unique_template_id_per_user UNIQUE(user_id, template_id)
);

-- Enable RLS
ALTER TABLE public.import_lc_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can create their own templates"
  ON public.import_lc_templates FOR INSERT
  WITH CHECK (user_id IN (
    SELECT id FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  ));

CREATE POLICY "Users can view their own templates"
  ON public.import_lc_templates FOR SELECT
  USING (user_id IN (
    SELECT id FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  ));

CREATE POLICY "Users can update their own templates"
  ON public.import_lc_templates FOR UPDATE
  USING (user_id IN (
    SELECT id FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  ));

CREATE POLICY "Users can delete their own templates"
  ON public.import_lc_templates FOR DELETE
  USING (user_id IN (
    SELECT id FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  ));

-- Indexes for performance
CREATE INDEX idx_import_lc_templates_user_id ON public.import_lc_templates(user_id);
CREATE INDEX idx_import_lc_templates_template_id ON public.import_lc_templates(template_id);
CREATE INDEX idx_import_lc_templates_product_name ON public.import_lc_templates(product_name);
CREATE INDEX idx_import_lc_templates_is_active ON public.import_lc_templates(is_active);

-- Trigger to update updated_at
CREATE TRIGGER update_import_lc_templates_updated_at
  BEFORE UPDATE ON public.import_lc_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();