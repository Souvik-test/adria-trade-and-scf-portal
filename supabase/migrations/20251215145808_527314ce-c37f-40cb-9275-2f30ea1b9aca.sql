-- Create upsert function to avoid duplicate transaction_ref errors while preserving deterministic refs
CREATE OR REPLACE FUNCTION public.upsert_transaction(
  p_user_id uuid,
  p_transaction_ref text,
  p_product_type text,
  p_process_type text,
  p_status text,
  p_customer_name text DEFAULT NULL,
  p_amount numeric DEFAULT NULL,
  p_currency text DEFAULT 'USD',
  p_created_by text DEFAULT NULL,
  p_initiating_channel text DEFAULT 'Portal',
  p_business_application text DEFAULT NULL
)
RETURNS public.transactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  result public.transactions;
BEGIN
  -- Validate user exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM public.custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user ID';
  END IF;

  INSERT INTO public.transactions (
    user_id,
    transaction_ref,
    product_type,
    process_type,
    status,
    customer_name,
    amount,
    currency,
    created_by,
    initiating_channel,
    business_application
  ) VALUES (
    p_user_id,
    p_transaction_ref,
    p_product_type,
    p_process_type,
    p_status,
    p_customer_name,
    p_amount,
    p_currency,
    COALESCE(p_created_by, p_user_id::text),
    p_initiating_channel,
    p_business_application
  )
  ON CONFLICT (transaction_ref)
  DO UPDATE SET
    status = EXCLUDED.status,
    customer_name = EXCLUDED.customer_name,
    amount = EXCLUDED.amount,
    currency = EXCLUDED.currency,
    initiating_channel = EXCLUDED.initiating_channel,
    process_type = EXCLUDED.process_type,
    business_application = EXCLUDED.business_application,
    updated_at = now()
  WHERE public.transactions.user_id = p_user_id
  RETURNING * INTO result;

  IF result.id IS NULL THEN
    RAISE EXCEPTION 'Transaction reference already exists for another user';
  END IF;

  RETURN result;
END;
$$;