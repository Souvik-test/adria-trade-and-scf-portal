-- Security definer function to get invoice details by invoice number
CREATE OR REPLACE FUNCTION public.get_invoice_by_number(p_invoice_number TEXT)
RETURNS TABLE (
  id uuid,
  invoice_number text,
  invoice_type text,
  invoice_date date,
  due_date date,
  currency text,
  total_amount numeric,
  program_id text,
  program_name text,
  buyer_id text,
  buyer_name text,
  seller_id text,
  seller_name text,
  invoice_description text,
  status text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.invoice_number,
    i.invoice_type,
    i.invoice_date,
    i.due_date,
    i.currency,
    i.total_amount,
    i.program_id,
    i.program_name,
    i.buyer_id,
    i.buyer_name,
    i.seller_id,
    i.seller_name,
    i.invoice_description,
    i.status,
    i.created_at,
    i.updated_at
  FROM scf_invoices i
  WHERE i.invoice_number = p_invoice_number;
END;
$$;

-- Security definer function to get disbursement details by loan reference
CREATE OR REPLACE FUNCTION public.get_disbursement_by_loan_ref(p_loan_reference TEXT)
RETURNS TABLE (
  id uuid,
  scf_invoice_id uuid,
  program_id text,
  loan_reference text,
  disbursed_amount numeric,
  finance_percentage numeric,
  disbursement_status text,
  disbursed_at timestamptz,
  accounting_entry_ref text,
  created_at timestamptz,
  invoice_number text,
  invoice_currency text,
  invoice_total_amount numeric,
  invoice_due_date date,
  invoice_buyer_id text,
  invoice_buyer_name text,
  invoice_seller_id text,
  invoice_seller_name text,
  program_name text
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
    d.disbursed_at,
    d.accounting_entry_ref,
    d.created_at,
    i.invoice_number,
    i.currency,
    i.total_amount,
    i.due_date,
    i.buyer_id,
    i.buyer_name,
    i.seller_id,
    i.seller_name,
    p.program_name
  FROM invoice_disbursements d
  LEFT JOIN scf_invoices i ON d.scf_invoice_id = i.id
  LEFT JOIN scf_program_configurations p ON d.program_id = p.program_id
  WHERE d.loan_reference = p_loan_reference;
END;
$$;

-- Security definer function to get repayment details by repayment reference
CREATE OR REPLACE FUNCTION public.get_repayment_by_ref(p_repayment_reference TEXT)
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
  accounting_entry_ref text,
  remarks text,
  created_at timestamptz,
  invoice_number text,
  invoice_total_amount numeric,
  invoice_due_date date,
  program_name text
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
    r.accounting_entry_ref,
    r.remarks,
    r.created_at,
    i.invoice_number,
    i.total_amount,
    i.due_date,
    p.program_name
  FROM invoice_repayments r
  LEFT JOIN scf_invoices i ON r.scf_invoice_id = i.id
  LEFT JOIN scf_program_configurations p ON r.program_id = p.program_id
  WHERE r.repayment_reference = p_repayment_reference;
END;
$$;