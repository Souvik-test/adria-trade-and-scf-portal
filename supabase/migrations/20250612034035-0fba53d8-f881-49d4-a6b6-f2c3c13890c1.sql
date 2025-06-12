
-- Create Import LC requests table
CREATE TABLE public.import_lc_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- Basic LC Information
  popi_number TEXT,
  popi_type TEXT CHECK (popi_type IN ('PO', 'PI')),
  form_of_documentary_credit TEXT NOT NULL,
  corporate_reference TEXT NOT NULL,
  applicable_rules TEXT NOT NULL DEFAULT 'UCP Latest Version',
  lc_type TEXT,
  issue_date DATE,
  expiry_date DATE,
  place_of_expiry TEXT,
  
  -- Applicant Information
  applicant_name TEXT,
  applicant_address TEXT,
  applicant_account_number TEXT,
  
  -- Beneficiary Information
  beneficiary_name TEXT,
  beneficiary_address TEXT,
  beneficiary_bank_name TEXT,
  beneficiary_bank_address TEXT,
  beneficiary_bank_swift_code TEXT,
  advising_bank_swift_code TEXT,
  
  -- LC Amount and Terms
  lc_amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  tolerance TEXT,
  additional_amount NUMERIC DEFAULT 0,
  available_with TEXT,
  available_by TEXT,
  partial_shipments_allowed BOOLEAN DEFAULT false,
  transshipment_allowed BOOLEAN DEFAULT false,
  
  -- Shipment Details
  description_of_goods TEXT,
  port_of_loading TEXT,
  port_of_discharge TEXT,
  latest_shipment_date DATE,
  presentation_period TEXT,
  
  -- Document Requirements
  required_documents TEXT[], -- Array of document names
  additional_conditions TEXT,
  
  -- Status and metadata
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Foreign key reference
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES user_profiles(id)
);

-- Enable Row Level Security
ALTER TABLE public.import_lc_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own import LC requests" 
  ON public.import_lc_requests 
  FOR SELECT 
  USING (user_id IN (
    SELECT id FROM user_profiles WHERE user_login_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Users can create their own import LC requests" 
  ON public.import_lc_requests 
  FOR INSERT 
  WITH CHECK (user_id IN (
    SELECT id FROM user_profiles WHERE user_login_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Users can update their own import LC requests" 
  ON public.import_lc_requests 
  FOR UPDATE 
  USING (user_id IN (
    SELECT id FROM user_profiles WHERE user_login_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Users can delete their own import LC requests" 
  ON public.import_lc_requests 
  FOR DELETE 
  USING (user_id IN (
    SELECT id FROM user_profiles WHERE user_login_id = current_setting('app.current_user_id', true)
  ));

-- Create supporting documents table for file uploads
CREATE TABLE public.import_lc_supporting_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  import_lc_request_id UUID NOT NULL REFERENCES public.import_lc_requests(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  file_path TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for supporting documents
ALTER TABLE public.import_lc_supporting_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their import LC documents" 
  ON public.import_lc_supporting_documents 
  FOR ALL 
  USING (
    import_lc_request_id IN (
      SELECT id FROM public.import_lc_requests 
      WHERE user_id IN (
        SELECT id FROM user_profiles WHERE user_login_id = current_setting('app.current_user_id', true)
      )
    )
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_import_lc_requests_updated_at 
  BEFORE UPDATE ON public.import_lc_requests 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
