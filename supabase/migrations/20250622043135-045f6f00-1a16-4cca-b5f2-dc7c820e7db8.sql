
-- Create table for Export LC Bills - Present Bills
CREATE TABLE public.export_lc_bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  bill_reference TEXT NOT NULL UNIQUE,
  lc_reference TEXT NOT NULL,
  corporate_reference TEXT,
  lc_currency TEXT DEFAULT 'USD',
  lc_amount NUMERIC,
  lc_expiry_place TEXT,
  lc_expiry_date DATE,
  applicant_name TEXT,
  issuing_bank TEXT,
  bill_amount NUMERIC,
  bill_currency TEXT DEFAULT 'USD',
  bill_date DATE,
  submission_type TEXT DEFAULT 'manual', -- manual, upload, contextual
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for Export LC Bill documents
CREATE TABLE public.export_lc_bill_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  export_lc_bill_id UUID REFERENCES public.export_lc_bills(id) ON DELETE CASCADE NOT NULL,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for Export LC Bill line items/details
CREATE TABLE public.export_lc_bill_line_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  export_lc_bill_id UUID REFERENCES public.export_lc_bills(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  line_total NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.export_lc_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_lc_bill_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_lc_bill_line_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for export_lc_bills
CREATE POLICY "Users can view their own export LC bills" 
  ON public.export_lc_bills 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own export LC bills" 
  ON public.export_lc_bills 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own export LC bills" 
  ON public.export_lc_bills 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own export LC bills" 
  ON public.export_lc_bills 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for export_lc_bill_documents
CREATE POLICY "Users can view documents for their export LC bills" 
  ON public.export_lc_bill_documents 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.export_lc_bills 
    WHERE id = export_lc_bill_documents.export_lc_bill_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create documents for their export LC bills" 
  ON public.export_lc_bill_documents 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.export_lc_bills 
    WHERE id = export_lc_bill_documents.export_lc_bill_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update documents for their export LC bills" 
  ON public.export_lc_bill_documents 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.export_lc_bills 
    WHERE id = export_lc_bill_documents.export_lc_bill_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete documents for their export LC bills" 
  ON public.export_lc_bill_documents 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.export_lc_bills 
    WHERE id = export_lc_bill_documents.export_lc_bill_id 
    AND user_id = auth.uid()
  ));

-- Create RLS policies for export_lc_bill_line_items
CREATE POLICY "Users can view line items for their export LC bills" 
  ON public.export_lc_bill_line_items 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.export_lc_bills 
    WHERE id = export_lc_bill_line_items.export_lc_bill_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create line items for their export LC bills" 
  ON public.export_lc_bill_line_items 
  FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.export_lc_bills 
    WHERE id = export_lc_bill_line_items.export_lc_bill_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update line items for their export LC bills" 
  ON public.export_lc_bill_line_items 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM public.export_lc_bills 
    WHERE id = export_lc_bill_line_items.export_lc_bill_id 
    AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete line items for their export LC bills" 
  ON public.export_lc_bill_line_items 
  FOR DELETE 
  USING (EXISTS (
    SELECT 1 FROM public.export_lc_bills 
    WHERE id = export_lc_bill_line_items.export_lc_bill_id 
    AND user_id = auth.uid()
  ));

-- Create function to generate bill reference
CREATE OR REPLACE FUNCTION public.generate_export_bill_ref()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_val INTEGER;
  formatted_ref TEXT;
BEGIN
  -- Create sequence if it doesn't exist
  CREATE SEQUENCE IF NOT EXISTS seq_export_bill_ref;
  
  -- Get next value
  SELECT nextval('seq_export_bill_ref') INTO next_val;
  
  -- Format as EXP-BILL-YYYY-NNNNNN
  formatted_ref := 'EXP-BILL-' || EXTRACT(YEAR FROM NOW()) || '-' || lpad(next_val::text, 6, '0');
  
  RETURN formatted_ref;
END;
$$;

-- Add trigger to auto-generate bill reference
CREATE OR REPLACE FUNCTION public.set_export_bill_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.bill_reference IS NULL OR NEW.bill_reference = '' THEN
    NEW.bill_reference := public.generate_export_bill_ref();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_export_bill_reference
  BEFORE INSERT ON public.export_lc_bills
  FOR EACH ROW
  EXECUTE FUNCTION public.set_export_bill_reference();

-- Add trigger to update updated_at timestamp
CREATE TRIGGER trigger_update_export_lc_bills_updated_at
  BEFORE UPDATE ON public.export_lc_bills
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
