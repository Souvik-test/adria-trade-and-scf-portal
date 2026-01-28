-- Create security definer function to get invoice disbursements (bypasses RLS for custom auth)
CREATE OR REPLACE FUNCTION public.get_invoice_disbursements(
  p_invoice_ids uuid[] DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  scf_invoice_id uuid,
  program_id text,
  loan_reference text,
  disbursed_amount numeric,
  finance_percentage numeric,
  disbursement_status text,
  accounting_entry_ref text,
  disbursed_at timestamptz,
  created_at timestamptz,
  rejection_reason text,
  invoice_number text,
  invoice_currency text,
  invoice_due_date date,
  invoice_status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    d.id,
    d.scf_invoice_id,
    d.program_id,
    d.loan_reference,
    d.disbursed_amount,
    d.finance_percentage,
    d.disbursement_status,
    d.accounting_entry_ref,
    d.disbursed_at,
    d.created_at,
    d.rejection_reason,
    i.invoice_number,
    i.currency as invoice_currency,
    i.due_date as invoice_due_date,
    i.status as invoice_status
  FROM invoice_disbursements d
  INNER JOIN scf_invoices i ON d.scf_invoice_id = i.id
  WHERE (p_invoice_ids IS NULL OR d.scf_invoice_id = ANY(p_invoice_ids))
  ORDER BY d.disbursed_at DESC;
END;
$$;

-- Create security definer function to get invoice repayments (bypasses RLS for custom auth)
CREATE OR REPLACE FUNCTION public.get_invoice_repayments(
  p_invoice_ids uuid[] DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  scf_invoice_id uuid,
  program_id text,
  loan_reference text,
  repayment_reference text,
  repayment_amount numeric,
  principal_amount numeric,
  interest_amount numeric,
  penalty_amount numeric,
  repayment_date date,
  repayment_status text,
  repayment_mode text,
  currency text,
  remarks text,
  user_id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  invoice_number text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.id,
    r.scf_invoice_id,
    r.program_id,
    r.loan_reference,
    r.repayment_reference,
    r.repayment_amount,
    r.principal_amount,
    r.interest_amount,
    r.penalty_amount,
    r.repayment_date,
    r.repayment_status,
    r.repayment_mode,
    r.currency,
    r.remarks,
    r.user_id,
    r.created_at,
    r.updated_at,
    i.invoice_number
  FROM invoice_repayments r
  INNER JOIN scf_invoices i ON r.scf_invoice_id = i.id
  WHERE (p_invoice_ids IS NULL OR r.scf_invoice_id = ANY(p_invoice_ids))
  ORDER BY r.repayment_date DESC;
END;
$$;