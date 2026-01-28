-- Create security definer function to SELECT scf_invoices for custom auth users
-- This bypasses RLS since custom auth users don't have auth.uid()

CREATE OR REPLACE FUNCTION public.get_scf_invoices(
  p_from_date DATE DEFAULT NULL,
  p_to_date DATE DEFAULT NULL,
  p_invoice_number TEXT DEFAULT NULL,
  p_program_id TEXT DEFAULT NULL,
  p_program_name TEXT DEFAULT NULL,
  p_invoice_type TEXT DEFAULT NULL,
  p_status TEXT DEFAULT NULL,
  p_buyer_id TEXT DEFAULT NULL,
  p_buyer_name TEXT DEFAULT NULL,
  p_seller_id TEXT DEFAULT NULL,
  p_seller_name TEXT DEFAULT NULL,
  p_currency TEXT DEFAULT NULL,
  p_min_amount NUMERIC DEFAULT NULL,
  p_max_amount NUMERIC DEFAULT NULL,
  p_wildcard_search TEXT DEFAULT NULL
)
RETURNS SETOF public.scf_invoices
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM public.scf_invoices i
  WHERE
    (p_from_date IS NULL OR i.invoice_date >= p_from_date)
    AND (p_to_date IS NULL OR i.invoice_date <= p_to_date)
    AND (p_invoice_number IS NULL OR i.invoice_number ILIKE '%' || p_invoice_number || '%')
    AND (p_program_id IS NULL OR i.program_id = p_program_id)
    AND (p_program_name IS NULL OR i.program_name ILIKE '%' || p_program_name || '%')
    AND (p_invoice_type IS NULL OR i.invoice_type = p_invoice_type)
    AND (p_status IS NULL OR i.status = p_status)
    AND (p_buyer_id IS NULL OR i.buyer_id = p_buyer_id)
    AND (p_buyer_name IS NULL OR i.buyer_name ILIKE '%' || p_buyer_name || '%')
    AND (p_seller_id IS NULL OR i.seller_id = p_seller_id)
    AND (p_seller_name IS NULL OR i.seller_name ILIKE '%' || p_seller_name || '%')
    AND (p_currency IS NULL OR i.currency = p_currency)
    AND (p_min_amount IS NULL OR i.total_amount >= p_min_amount)
    AND (p_max_amount IS NULL OR i.total_amount <= p_max_amount)
    AND (
      p_wildcard_search IS NULL 
      OR i.invoice_number ILIKE '%' || p_wildcard_search || '%'
      OR i.program_id ILIKE '%' || p_wildcard_search || '%'
      OR i.program_name ILIKE '%' || p_wildcard_search || '%'
      OR i.buyer_name ILIKE '%' || p_wildcard_search || '%'
      OR i.seller_name ILIKE '%' || p_wildcard_search || '%'
      OR i.status ILIKE '%' || p_wildcard_search || '%'
    )
  ORDER BY i.invoice_date DESC;
END;
$$;