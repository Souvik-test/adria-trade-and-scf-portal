-- Create invoice_repayments table for tracking finance repayment transactions
CREATE TABLE public.invoice_repayments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  repayment_reference TEXT NOT NULL UNIQUE,
  loan_reference TEXT NOT NULL,
  scf_invoice_id UUID NOT NULL REFERENCES scf_invoices(id) ON DELETE CASCADE,
  program_id TEXT NOT NULL,
  repayment_date DATE NOT NULL,
  repayment_amount NUMERIC NOT NULL,
  principal_amount NUMERIC NOT NULL,
  interest_amount NUMERIC NOT NULL,
  penalty_amount NUMERIC DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  repayment_mode TEXT,
  repayment_status TEXT NOT NULL DEFAULT 'completed',
  accounting_entry_ref TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.invoice_repayments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own repayments"
ON public.invoice_repayments FOR SELECT
USING (user_id IN (
  SELECT id FROM custom_users 
  WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
));

CREATE POLICY "System can create repayments"
ON public.invoice_repayments FOR INSERT
WITH CHECK (true);

CREATE POLICY "System can update repayments"
ON public.invoice_repayments FOR UPDATE
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_invoice_repayments_updated_at
BEFORE UPDATE ON public.invoice_repayments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Performance indexes
CREATE INDEX idx_scf_invoices_program_date ON scf_invoices(program_id, invoice_date);
CREATE INDEX idx_disbursements_program_date ON invoice_disbursements(program_id, disbursed_at);
CREATE INDEX idx_repayments_program_date ON invoice_repayments(program_id, repayment_date);
CREATE INDEX idx_repayments_invoice ON invoice_repayments(scf_invoice_id);
CREATE INDEX idx_repayments_loan_ref ON invoice_repayments(loan_reference);