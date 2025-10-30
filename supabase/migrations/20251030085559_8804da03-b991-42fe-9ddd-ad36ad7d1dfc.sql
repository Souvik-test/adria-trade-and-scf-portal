-- Comprehensive fix: Recreate all manual transaction tables with proper UUID types
-- All tables are currently empty, so safe to drop and recreate

-- 1. Drop all tables and their policies
DROP TABLE IF EXISTS early_payment_requests CASCADE;
DROP TABLE IF EXISTS payment_requests CASCADE;
DROP TABLE IF EXISTS finance_disbursements CASCADE;

-- 2. Recreate finance_disbursements with UUID
CREATE TABLE finance_disbursements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  corporate_id TEXT NOT NULL,
  program_id TEXT NOT NULL,
  program_name TEXT NOT NULL,
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  selected_invoices JSONB NOT NULL DEFAULT '[]',
  invoice_currency TEXT NOT NULL DEFAULT 'USD',
  finance_date DATE NOT NULL,
  finance_currency TEXT NOT NULL DEFAULT 'USD',
  exchange_rate NUMERIC,
  finance_amount NUMERIC NOT NULL,
  finance_tenor_days INTEGER NOT NULL,
  finance_due_date DATE NOT NULL,
  interest_rate_type TEXT NOT NULL DEFAULT 'manual',
  interest_rate NUMERIC NOT NULL,
  reference_rate_code TEXT,
  reference_rate_margin NUMERIC,
  interest_amount NUMERIC NOT NULL,
  total_repayment_amount NUMERIC NOT NULL,
  auto_repayment_enabled BOOLEAN NOT NULL DEFAULT false,
  repayment_mode TEXT NOT NULL DEFAULT 'auto',
  repayment_party TEXT NOT NULL,
  repayment_account TEXT,
  accounting_entries JSONB NOT NULL DEFAULT '[]',
  accounting_reference TEXT NOT NULL,
  disbursement_reference TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE finance_disbursements ENABLE ROW LEVEL SECURITY;

-- 3. Recreate early_payment_requests with UUID
CREATE TABLE early_payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  program_id TEXT NOT NULL,
  invoice_ids UUID[] NOT NULL,
  total_original_amount NUMERIC NOT NULL,
  discount_percentage NUMERIC NOT NULL,
  total_discounted_amount NUMERIC NOT NULL,
  total_savings NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  estimated_payment_date DATE,
  remarks TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE early_payment_requests ENABLE ROW LEVEL SECURITY;

-- 4. Recreate payment_requests with UUID
CREATE TABLE payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  program_id TEXT NOT NULL,
  invoice_ids UUID[] NOT NULL,
  total_amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  requested_payment_date DATE,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for finance_disbursements
CREATE POLICY "Users can view their own disbursements" 
ON finance_disbursements FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own disbursements" 
ON finance_disbursements FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own disbursements" 
ON finance_disbursements FOR UPDATE 
USING (user_id = auth.uid());

-- 6. Create RLS policies for early_payment_requests
CREATE POLICY "Users can view their own early payment requests" 
ON early_payment_requests FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own early payment requests" 
ON early_payment_requests FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own early payment requests" 
ON early_payment_requests FOR UPDATE 
USING (user_id = auth.uid());

-- 7. Create RLS policies for payment_requests
CREATE POLICY "Users can view their own payment requests" 
ON payment_requests FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own payment requests" 
ON payment_requests FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own payment requests" 
ON payment_requests FOR UPDATE 
USING (user_id = auth.uid());