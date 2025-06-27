
-- Create table for outward bank guarantee requests
CREATE TABLE public.outward_bg_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  request_reference TEXT NOT NULL DEFAULT public.generate_transaction_ref('OBG'),
  status TEXT NOT NULL DEFAULT 'draft',
  
  -- MT 760 Tag 20: Sender's Reference
  senders_reference TEXT,
  
  -- MT 760 Tag 23: Bank Operation Code
  bank_operation_code TEXT,
  
  -- MT 760 Tag 31C: Date of Issue
  date_of_issue DATE,
  
  -- MT 760 Tag 31D: Date and Place of Expiry
  date_of_expiry DATE,
  place_of_expiry TEXT,
  
  -- MT 760 Tag 32B: Currency Code and Amount
  currency TEXT DEFAULT 'USD',
  guarantee_amount NUMERIC,
  
  -- MT 760 Tag 40A: Form of Documentary Credit
  form_of_guarantee TEXT,
  
  -- MT 760 Tag 40E: Applicable Rules
  applicable_rules TEXT DEFAULT 'URDG 758',
  
  -- MT 760 Tag 50: Applicant
  applicant_name TEXT,
  applicant_address TEXT,
  applicant_account_number TEXT,
  
  -- MT 760 Tag 59: Beneficiary
  beneficiary_name TEXT,
  beneficiary_address TEXT,
  beneficiary_bank_name TEXT,
  beneficiary_bank_address TEXT,
  beneficiary_bank_swift_code TEXT,
  
  -- MT 760 Tag 77C: Details of Guarantee
  guarantee_details TEXT,
  
  -- MT 760 Tag 77D: Terms and Conditions
  terms_and_conditions TEXT,
  
  -- MT 760 Tag 46A: Documents Required
  documents_required TEXT,
  
  -- Additional fields
  guarantee_type TEXT,
  contract_reference TEXT,
  underlying_contract_details TEXT,
  special_instructions TEXT,
  supporting_documents JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.outward_bg_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own outward BG requests" 
  ON public.outward_bg_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own outward BG requests" 
  ON public.outward_bg_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outward BG requests" 
  ON public.outward_bg_requests 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outward BG requests" 
  ON public.outward_bg_requests 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create supporting documents table
CREATE TABLE public.outward_bg_supporting_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  outward_bg_request_id UUID NOT NULL REFERENCES public.outward_bg_requests(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  file_type TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS for supporting documents
ALTER TABLE public.outward_bg_supporting_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage documents for their own BG requests" 
  ON public.outward_bg_supporting_documents 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.outward_bg_requests 
      WHERE id = outward_bg_supporting_documents.outward_bg_request_id 
      AND user_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at_outward_bg_requests
  BEFORE UPDATE ON public.outward_bg_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for transaction creation on submission
CREATE OR REPLACE FUNCTION public.handle_outward_bg_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only create transaction record when status changes to 'submitted'
  IF NEW.status = 'submitted' AND OLD.status != 'submitted' THEN
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
      'Bank Guarantee',
      'Outward BG Issuance',
      NEW.status,
      NEW.beneficiary_name,
      NEW.guarantee_amount,
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
      'Bank Guarantee',
      'Outward Bank Guarantee issuance request submitted - Reference: ' || NEW.request_reference
    );
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER handle_outward_bg_submission_trigger
  AFTER UPDATE ON public.outward_bg_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_outward_bg_submission();
