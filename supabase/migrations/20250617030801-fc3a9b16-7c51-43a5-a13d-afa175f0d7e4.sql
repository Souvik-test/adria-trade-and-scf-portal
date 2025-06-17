
-- Create table for assignment requests
CREATE TABLE public.assignment_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- LC Information
  lc_reference TEXT NOT NULL,
  issuing_bank TEXT,
  issuance_date DATE,
  applicant TEXT,
  currency TEXT DEFAULT 'USD',
  amount NUMERIC,
  expiry_date DATE,
  current_beneficiary TEXT,
  
  -- Assignment Details
  assignment_type TEXT DEFAULT 'Assignment of Proceeds',
  assignment_amount NUMERIC,
  assignment_percentage NUMERIC,
  assignment_conditions TEXT,
  assignment_purpose TEXT,
  
  -- Assignee Information
  assignee_name TEXT,
  assignee_address TEXT,
  assignee_country TEXT,
  assignee_bank_name TEXT,
  assignee_bank_address TEXT,
  assignee_swift_code TEXT,
  assignee_account_number TEXT,
  
  -- Documents
  required_documents TEXT[],
  supporting_documents JSONB DEFAULT '[]'::jsonb,
  required_documents_checked JSONB DEFAULT '{}'::jsonb,
  
  -- Status and metadata
  status TEXT DEFAULT 'Submitted',
  request_reference TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for assignment_requests
ALTER TABLE public.assignment_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own assignment requests" 
  ON public.assignment_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assignment requests" 
  ON public.assignment_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assignment requests" 
  ON public.assignment_requests 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create function to generate assignment request reference
CREATE OR REPLACE FUNCTION public.generate_assignment_ref()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_val INTEGER;
  formatted_ref TEXT;
BEGIN
  -- Create sequence if it doesn't exist
  CREATE SEQUENCE IF NOT EXISTS seq_assignment_ref;
  
  -- Get next value
  SELECT nextval('seq_assignment_ref') INTO next_val;
  
  -- Format as ASG-YYYY-NNNNNN
  formatted_ref := 'ASG-' || EXTRACT(YEAR FROM NOW()) || '-' || lpad(next_val::text, 6, '0');
  
  RETURN formatted_ref;
END;
$$;

-- Create trigger function to handle assignment submissions
CREATE OR REPLACE FUNCTION public.handle_assignment_submission()
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
    NEW.request_reference,
    'Export LC',
    'Assignment Request',
    NEW.status,
    NEW.assignee_name,
    NEW.assignment_amount,
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
    'Assignment request submitted for ' || NEW.lc_reference || ' - Reference: ' || NEW.request_reference
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for assignment submissions
CREATE TRIGGER trigger_assignment_submission
  AFTER INSERT ON public.assignment_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_assignment_submission();

-- Add updated_at trigger
CREATE TRIGGER trigger_assignment_updated_at
  BEFORE UPDATE ON public.assignment_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
