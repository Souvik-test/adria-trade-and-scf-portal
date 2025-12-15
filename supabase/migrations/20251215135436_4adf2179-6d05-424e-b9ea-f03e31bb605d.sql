-- Add business_application column to transactions
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS business_application text DEFAULT 'Adria TSCF Client';

-- Update insert_transaction function to include business_application
CREATE OR REPLACE FUNCTION public.insert_transaction(
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
  p_business_application text DEFAULT 'Adria TSCF Client'
)
RETURNS transactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result transactions;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user ID';
  END IF;
  
  INSERT INTO transactions (
    user_id, transaction_ref, product_type, process_type, status,
    customer_name, amount, currency, created_by, initiating_channel, business_application
  ) VALUES (
    p_user_id, p_transaction_ref, p_product_type, p_process_type, p_status,
    p_customer_name, p_amount, p_currency, p_created_by, p_initiating_channel, p_business_application
  )
  RETURNING * INTO result;
  
  RETURN result;
END;
$$;