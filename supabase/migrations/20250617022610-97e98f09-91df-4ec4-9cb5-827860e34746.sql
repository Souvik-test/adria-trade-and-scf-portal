
-- Create table for LC Transfer requests
CREATE TABLE public.lc_transfer_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Basic LC Information
  lc_reference TEXT NOT NULL,
  issuing_bank TEXT,
  issuance_date DATE,
  applicant TEXT,
  currency TEXT DEFAULT 'USD',
  amount NUMERIC,
  expiry_date DATE,
  current_beneficiary TEXT,
  
  -- Transfer Details
  transfer_type TEXT CHECK (transfer_type IN ('Full', 'Partial')),
  transfer_conditions TEXT,
  
  -- New Beneficiaries (stored as JSON array)
  new_beneficiaries JSONB DEFAULT '[]'::jsonb,
  
  -- Documents
  required_documents TEXT[],
  supporting_documents JSONB DEFAULT '[]'::jsonb,
  required_documents_checked JSONB DEFAULT '{}'::jsonb,
  
  -- Status and metadata
  status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'pending', 'approved', 'rejected')),
  request_reference TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_profiles(id)
);

-- Enable RLS on the table
ALTER TABLE public.lc_transfer_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own LC transfer requests"
  ON public.lc_transfer_requests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own LC transfer requests"
  ON public.lc_transfer_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own LC transfer requests"
  ON public.lc_transfer_requests
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_lc_transfer_requests_updated_at
  BEFORE UPDATE ON public.lc_transfer_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to create transaction record and notification
CREATE OR REPLACE FUNCTION public.handle_lc_transfer_submission()
RETURNS TRIGGER AS $$
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
    NEW.request_reference,
    'Export LC',
    'LC Transfer',
    NEW.status,
    NEW.current_beneficiary,
    NEW.amount,
    NEW.currency,
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
    NEW.request_reference,
    'Export LC',
    'LC Transfer request submitted for ' || NEW.lc_reference || ' - Reference: ' || NEW.request_reference
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for LC transfer submissions
CREATE TRIGGER on_lc_transfer_submission
  AFTER INSERT ON public.lc_transfer_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_lc_transfer_submission();

-- Create function to generate LC transfer reference
CREATE OR REPLACE FUNCTION public.generate_lc_transfer_ref()
RETURNS TEXT AS $$
DECLARE
  next_val INTEGER;
  formatted_ref TEXT;
BEGIN
  -- Create sequence if it doesn't exist
  CREATE SEQUENCE IF NOT EXISTS seq_lc_transfer_ref;
  
  -- Get next value
  SELECT nextval('seq_lc_transfer_ref') INTO next_val;
  
  -- Format as TRF-YYYY-NNNNNN
  formatted_ref := 'TRF-' || EXTRACT(YEAR FROM NOW()) || '-' || lpad(next_val::text, 6, '0');
  
  RETURN formatted_ref;
END;
$$ LANGUAGE plpgsql;
