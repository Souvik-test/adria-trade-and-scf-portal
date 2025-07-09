
-- Create table for outward documentary collection bills
CREATE TABLE public.outward_documentary_collection_bills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  bill_reference TEXT NOT NULL,
  drawer_name TEXT,
  drawer_address TEXT,
  drawee_payer_name TEXT,
  drawee_payer_address TEXT,
  collecting_bank TEXT,
  collecting_bank_address TEXT,
  collecting_bank_swift_code TEXT,
  bill_currency TEXT DEFAULT 'USD',
  bill_amount NUMERIC,
  tenor_days INTEGER,
  presentation_instructions TEXT DEFAULT 'D/P',
  documents_against TEXT DEFAULT 'payment',
  special_instructions TEXT,
  protect_charges TEXT DEFAULT 'collect',
  interest_charges TEXT DEFAULT 'waive',
  supporting_documents JSONB DEFAULT '[]',
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.outward_documentary_collection_bills ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can create their own documentary collection bills" 
  ON public.outward_documentary_collection_bills 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own documentary collection bills" 
  ON public.outward_documentary_collection_bills 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own documentary collection bills" 
  ON public.outward_documentary_collection_bills 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documentary collection bills" 
  ON public.outward_documentary_collection_bills 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create trigger to auto-generate bill reference if not provided
CREATE OR REPLACE FUNCTION public.generate_documentary_collection_bill_ref()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_val INTEGER;
  formatted_ref TEXT;
BEGIN
  -- Create sequence if it doesn't exist
  CREATE SEQUENCE IF NOT EXISTS seq_doc_collection_bill_ref;
  
  -- Get next value
  SELECT nextval('seq_doc_collection_bill_ref') INTO next_val;
  
  -- Format as DOC-BILL-YYYY-NNNNNN
  formatted_ref := 'DOC-BILL-' || EXTRACT(YEAR FROM NOW()) || '-' || lpad(next_val::text, 6, '0');
  
  RETURN formatted_ref;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_documentary_collection_bill_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.bill_reference IS NULL OR NEW.bill_reference = '' THEN
    NEW.bill_reference := public.generate_documentary_collection_bill_ref();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_documentary_collection_bill_reference
  BEFORE INSERT ON public.outward_documentary_collection_bills
  FOR EACH ROW EXECUTE FUNCTION public.set_documentary_collection_bill_reference();

-- Create trigger to handle transaction and notification creation
CREATE OR REPLACE FUNCTION public.handle_documentary_collection_bill_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert transaction record
  INSERT INTO public.transactions (
    user_id,
    transaction_ref,
    product_type,
    process_type,
    status,
    customer_name,
    amount,
    currency,
    created_by,
    initiating_channel
  ) VALUES (
    NEW.user_id,
    NEW.bill_reference,
    'Documentary Collection',
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'Submit Bill'
      WHEN TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN 'Update Bill'
      ELSE 'Update Bill'
    END,
    NEW.status,
    NEW.drawee_payer_name,
    NEW.bill_amount,
    NEW.bill_currency,
    (SELECT email FROM auth.users WHERE id = NEW.user_id),
    'Portal'
  );
  
  -- Insert notification
  INSERT INTO public.notifications (
    user_id,
    transaction_ref,
    transaction_type,
    message
  ) VALUES (
    NEW.user_id,
    NEW.bill_reference,
    'Documentary Collection',
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'Documentary collection bill submitted - Reference: ' || NEW.bill_reference
      WHEN TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN 'Documentary collection bill updated - Reference: ' || NEW.bill_reference
      ELSE 'Documentary collection bill updated - Reference: ' || NEW.bill_reference
    END
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_documentary_collection_bill_submission
  AFTER INSERT OR UPDATE ON public.outward_documentary_collection_bills
  FOR EACH ROW EXECUTE FUNCTION public.handle_documentary_collection_bill_submission();
