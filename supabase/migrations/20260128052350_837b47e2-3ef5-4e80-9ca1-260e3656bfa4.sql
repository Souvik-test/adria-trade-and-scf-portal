-- Drop and recreate the function without invoice_description column
DROP FUNCTION IF EXISTS public.get_invoice_by_number(TEXT);

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
    i.status,
    i.created_at,
    i.updated_at
  FROM scf_invoices i
  WHERE i.invoice_number = p_invoice_number;
END;
$$;