-- Create remittance_transfers table
CREATE TABLE public.remittance_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  transfer_reference TEXT NOT NULL UNIQUE,
  
  -- Direction & Type
  direction TEXT NOT NULL CHECK (direction IN ('outward', 'inward')),
  transfer_type TEXT CHECK (transfer_type IN ('a2a', 'beneficiary', 'multiple', 'international')),
  
  -- Account Details
  debit_account TEXT,
  credit_account TEXT,
  
  -- Amount
  amount NUMERIC(18,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  
  -- Execution
  execution_type TEXT NOT NULL CHECK (execution_type IN ('immediate', 'deferred', 'standing')),
  execution_date DATE,
  frequency TEXT,
  
  -- Beneficiary (for saved beneficiaries)
  beneficiary_id TEXT,
  
  -- Adhoc Beneficiary Details
  is_adhoc_beneficiary BOOLEAN DEFAULT false,
  adhoc_beneficiary_name TEXT,
  adhoc_account_or_iban TEXT,
  adhoc_bank_name TEXT,
  adhoc_bic_swift_code TEXT,
  adhoc_bank_address TEXT,
  adhoc_country TEXT,
  
  -- Inward Transfer External Details
  external_sender_name TEXT,
  external_sender_bank TEXT,
  
  -- Reference & Status
  transfer_reference_note TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'signed', 'processing', 'completed', 'failed', 'scheduled', 'cancelled')),
  
  -- Metadata
  corporate_id TEXT DEFAULT 'TC001',
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create remittance_recipients table for multiple recipients
CREATE TABLE public.remittance_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id UUID NOT NULL REFERENCES public.remittance_transfers(id) ON DELETE CASCADE,
  credit_account TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  amount NUMERIC(18,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_remittance_transfers_user ON public.remittance_transfers(user_id);
CREATE INDEX idx_remittance_transfers_status ON public.remittance_transfers(status);
CREATE INDEX idx_remittance_transfers_direction ON public.remittance_transfers(direction);
CREATE INDEX idx_remittance_recipients_transfer ON public.remittance_recipients(transfer_id);

-- Enable RLS
ALTER TABLE public.remittance_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.remittance_recipients ENABLE ROW LEVEL SECURITY;

-- RLS Policies for remittance_transfers
CREATE POLICY "Custom users can view their own remittance transfers"
ON public.remittance_transfers
FOR SELECT
USING (user_id IN (
  SELECT id FROM custom_users 
  WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
));

CREATE POLICY "Custom users can create their own remittance transfers"
ON public.remittance_transfers
FOR INSERT
WITH CHECK (user_id IN (
  SELECT id FROM custom_users 
  WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
));

CREATE POLICY "Custom users can update their own remittance transfers"
ON public.remittance_transfers
FOR UPDATE
USING (user_id IN (
  SELECT id FROM custom_users 
  WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
));

CREATE POLICY "Custom users can delete their own remittance transfers"
ON public.remittance_transfers
FOR DELETE
USING (user_id IN (
  SELECT id FROM custom_users 
  WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
));

-- RLS Policies for remittance_recipients
CREATE POLICY "Custom users can manage recipients via transfer ownership"
ON public.remittance_recipients
FOR ALL
USING (
  transfer_id IN (
    SELECT id FROM public.remittance_transfers 
    WHERE user_id IN (
      SELECT id FROM custom_users 
      WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
    )
  )
);

-- Create function for generating remittance reference
CREATE OR REPLACE FUNCTION public.generate_remittance_ref()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  next_val INTEGER;
  formatted_ref TEXT;
BEGIN
  CREATE SEQUENCE IF NOT EXISTS seq_remittance_ref;
  SELECT nextval('seq_remittance_ref') INTO next_val;
  formatted_ref := 'REM-' || EXTRACT(YEAR FROM NOW()) || '-' || lpad(next_val::text, 6, '0');
  RETURN formatted_ref;
END;
$function$;

-- Create trigger for updating updated_at
CREATE TRIGGER update_remittance_transfers_updated_at
BEFORE UPDATE ON public.remittance_transfers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();