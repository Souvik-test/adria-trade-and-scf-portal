-- Create finance_disbursements table
CREATE TABLE IF NOT EXISTS public.finance_disbursements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  corporate_id TEXT NOT NULL,
  
  -- Program & Product
  program_id TEXT NOT NULL,
  program_name TEXT NOT NULL,
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  
  -- Invoice Selection
  selected_invoices JSONB NOT NULL DEFAULT '[]'::jsonb,
  invoice_currency TEXT NOT NULL DEFAULT 'USD',
  
  -- Finance Details
  finance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  finance_currency TEXT NOT NULL DEFAULT 'USD',
  exchange_rate NUMERIC(18, 6),
  finance_amount NUMERIC(18, 2) NOT NULL,
  finance_tenor_days INTEGER NOT NULL,
  finance_due_date DATE NOT NULL,
  
  -- Interest Details
  interest_rate_type TEXT NOT NULL CHECK (interest_rate_type IN ('manual', 'reference_rate')),
  interest_rate NUMERIC(10, 4) NOT NULL,
  reference_rate_code TEXT,
  reference_rate_margin NUMERIC(10, 4),
  interest_amount NUMERIC(18, 2) NOT NULL,
  total_repayment_amount NUMERIC(18, 2) NOT NULL,
  
  -- Repayment Details
  auto_repayment_enabled BOOLEAN NOT NULL DEFAULT false,
  repayment_mode TEXT NOT NULL CHECK (repayment_mode IN ('auto', 'manual')),
  repayment_party TEXT NOT NULL,
  repayment_account TEXT,
  
  -- Accounting Entries
  accounting_entries JSONB NOT NULL DEFAULT '[]'::jsonb,
  accounting_reference TEXT NOT NULL,
  
  -- Status & Tracking
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'disbursed', 'rejected')),
  disbursement_reference TEXT UNIQUE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add constraint for exchange rate
ALTER TABLE finance_disbursements
ADD CONSTRAINT check_exchange_rate 
  CHECK (
    (invoice_currency = finance_currency AND exchange_rate IS NULL) OR
    (invoice_currency != finance_currency AND exchange_rate IS NOT NULL AND exchange_rate > 0)
  );

-- Enable RLS
ALTER TABLE public.finance_disbursements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own disbursements" 
ON public.finance_disbursements 
FOR SELECT 
USING (user_id::text = (SELECT user_id FROM custom_users WHERE id::text = auth.uid()::text LIMIT 1));

CREATE POLICY "Users can create their own disbursements" 
ON public.finance_disbursements 
FOR INSERT 
WITH CHECK (user_id::text = (SELECT user_id FROM custom_users WHERE id::text = auth.uid()::text LIMIT 1));

CREATE POLICY "Users can update their own disbursements" 
ON public.finance_disbursements 
FOR UPDATE 
USING (user_id::text = (SELECT user_id FROM custom_users WHERE id::text = auth.uid()::text LIMIT 1));

-- Create indexes
CREATE INDEX idx_finance_disbursements_user_id ON public.finance_disbursements(user_id);
CREATE INDEX idx_finance_disbursements_program_id ON public.finance_disbursements(program_id);
CREATE INDEX idx_finance_disbursements_status ON public.finance_disbursements(status);
CREATE INDEX idx_finance_disbursements_finance_date ON public.finance_disbursements(finance_date);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_finance_disbursements_updated_at
BEFORE UPDATE ON public.finance_disbursements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();