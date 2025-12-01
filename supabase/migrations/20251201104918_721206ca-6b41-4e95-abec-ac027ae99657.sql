-- Create enum for target audience
CREATE TYPE target_audience_type AS ENUM ('Corporate', 'Bank', 'Agent');

-- Create product_event_mapping table
CREATE TABLE public.product_event_mapping (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module_code TEXT NOT NULL,
  module_name TEXT NOT NULL,
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  event_code TEXT NOT NULL,
  event_name TEXT NOT NULL,
  target_audience target_audience_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_event_mapping ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all product event mappings"
  ON public.product_event_mapping
  FOR SELECT
  USING (true);

CREATE POLICY "Users can create product event mappings"
  ON public.product_event_mapping
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update product event mappings"
  ON public.product_event_mapping
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete product event mappings"
  ON public.product_event_mapping
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_product_event_mapping_updated_at
  BEFORE UPDATE ON public.product_event_mapping
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();