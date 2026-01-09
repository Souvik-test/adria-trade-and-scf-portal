-- Drop and recreate get_all_transactions to include remittance_transactions table
DROP FUNCTION IF EXISTS public.get_all_transactions();

CREATE FUNCTION public.get_all_transactions()
RETURNS TABLE (
  id uuid,
  user_id uuid,
  transaction_ref text,
  product_type text,
  process_type text,
  status text,
  customer_name text,
  amount numeric,
  currency text,
  created_date date,
  created_by text,
  initiating_channel text,
  bank_ref text,
  customer_ref text,
  party_form text,
  operations text,
  business_application text,
  form_data jsonb,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  -- Standard transactions (excluding Remittance to avoid duplicates)
  SELECT 
    t.id, t.user_id, t.transaction_ref, t.product_type,
    t.process_type, t.status, t.customer_name, t.amount,
    t.currency, t.created_date, t.created_by, t.initiating_channel,
    t.bank_ref, t.customer_ref, t.party_form, t.operations,
    t.business_application, t.form_data, t.created_at, t.updated_at
  FROM transactions t
  WHERE t.product_type IS DISTINCT FROM 'Remittance'
  
  UNION ALL
  
  -- Remittance transactions from remittance_transactions table
  SELECT 
    rt.id, 
    rt.user_id, 
    rt.transaction_ref, 
    'Remittance'::text as product_type,
    CASE 
      WHEN rt.transfer_type = 'customer' THEN 'Customer Credit Transfer (pacs.008)'
      ELSE 'FI Credit Transfer (pacs.009)' 
    END as process_type,
    rt.status, 
    rt.ord_name as customer_name, 
    rt.inst_amt as amount,
    rt.ccy as currency, 
    rt.created_at::date as created_date,
    rt.created_by,
    rt.initiating_channel,
    NULL::text as bank_ref, 
    NULL::text as customer_ref,
    NULL::text as party_form, 
    NULL::text as operations,
    rt.business_application, 
    rt.form_data, 
    rt.created_at, 
    rt.updated_at
  FROM remittance_transactions rt
  
  ORDER BY created_at DESC;
END;
$$;