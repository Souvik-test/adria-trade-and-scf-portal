-- Phase 1: Add Early Payment Discount fields to scf_program_configurations table
ALTER TABLE scf_program_configurations
ADD COLUMN early_payment_discount_enabled BOOLEAN DEFAULT false,
ADD COLUMN default_discount_percentage NUMERIC(5,2) DEFAULT 0,
ADD COLUMN dynamic_discounting_enabled BOOLEAN DEFAULT false;

-- Add comments for clarity
COMMENT ON COLUMN scf_program_configurations.early_payment_discount_enabled IS 'Enables early payment discount feature for this program';
COMMENT ON COLUMN scf_program_configurations.default_discount_percentage IS 'Default discount percentage for early payment requests';
COMMENT ON COLUMN scf_program_configurations.dynamic_discounting_enabled IS 'Placeholder for future dynamic discounting feature';

-- Create early_payment_requests table
CREATE TABLE early_payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  program_id TEXT NOT NULL,
  invoice_ids JSONB NOT NULL,
  total_original_amount NUMERIC NOT NULL,
  discount_percentage NUMERIC(5,2) NOT NULL,
  total_discounted_amount NUMERIC NOT NULL,
  total_savings NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  estimated_payment_date DATE,
  remarks TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on early_payment_requests
ALTER TABLE early_payment_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for early_payment_requests
CREATE POLICY "Users can view their own early payment requests"
ON early_payment_requests
FOR SELECT
USING (
  user_id IN (
    SELECT user_id 
    FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  )
);

CREATE POLICY "Users can create their own early payment requests"
ON early_payment_requests
FOR INSERT
WITH CHECK (
  user_id IN (
    SELECT user_id 
    FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  )
);

CREATE POLICY "Users can update their own early payment requests"
ON early_payment_requests
FOR UPDATE
USING (
  user_id IN (
    SELECT user_id 
    FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  )
);

-- Create payment_requests table
CREATE TABLE payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  program_id TEXT NOT NULL,
  invoice_ids JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  requested_payment_date DATE,
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on payment_requests
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- RLS policies for payment_requests
CREATE POLICY "Users can view their own payment requests"
ON payment_requests
FOR SELECT
USING (
  user_id IN (
    SELECT user_id 
    FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  )
);

CREATE POLICY "Users can create their own payment requests"
ON payment_requests
FOR INSERT
WITH CHECK (
  user_id IN (
    SELECT user_id 
    FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  )
);

CREATE POLICY "Users can update their own payment requests"
ON payment_requests
FOR UPDATE
USING (
  user_id IN (
    SELECT user_id 
    FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  )
);

-- Add indexes for better performance
CREATE INDEX idx_early_payment_requests_user_id ON early_payment_requests(user_id);
CREATE INDEX idx_early_payment_requests_program_id ON early_payment_requests(program_id);
CREATE INDEX idx_early_payment_requests_status ON early_payment_requests(status);
CREATE INDEX idx_payment_requests_user_id ON payment_requests(user_id);
CREATE INDEX idx_payment_requests_program_id ON payment_requests(program_id);
CREATE INDEX idx_payment_requests_status ON payment_requests(status);