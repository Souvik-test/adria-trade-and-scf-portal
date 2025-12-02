-- Create table for pane and section mappings
CREATE TABLE IF NOT EXISTS public.pane_section_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_code text NOT NULL,
  event_code text NOT NULL,
  business_application text[] NOT NULL DEFAULT '{}',
  customer_segment text[] NOT NULL DEFAULT '{}',
  panes jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(product_code, event_code, user_id)
);

-- Enable RLS
ALTER TABLE public.pane_section_mappings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own pane section mappings"
  ON public.pane_section_mappings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pane section mappings"
  ON public.pane_section_mappings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pane section mappings"
  ON public.pane_section_mappings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pane section mappings"
  ON public.pane_section_mappings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_pane_section_mappings_updated_at
  BEFORE UPDATE ON public.pane_section_mappings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();