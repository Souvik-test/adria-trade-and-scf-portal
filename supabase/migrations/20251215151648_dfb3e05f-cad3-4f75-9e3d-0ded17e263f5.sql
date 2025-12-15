-- 1. Create get_all_transactions function to return all transactions (not user-filtered)
CREATE OR REPLACE FUNCTION public.get_all_transactions()
RETURNS SETOF transactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Return ALL transactions ordered by created_at
  -- All authenticated users can see all transactions
  RETURN QUERY
  SELECT * FROM transactions
  ORDER BY created_at DESC;
END;
$$;

-- 2. Add form_data column to transactions table to persist form data across stages
ALTER TABLE public.transactions 
ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT NULL;

-- 3. Update upsert_transaction function to accept and store form_data
CREATE OR REPLACE FUNCTION public.upsert_transaction(
  p_user_id uuid,
  p_transaction_ref text,
  p_product_type text,
  p_process_type text DEFAULT NULL,
  p_status text DEFAULT 'Submitted',
  p_customer_name text DEFAULT NULL,
  p_amount numeric DEFAULT NULL,
  p_currency text DEFAULT 'USD',
  p_created_by text DEFAULT NULL,
  p_initiating_channel text DEFAULT 'Portal',
  p_business_application text DEFAULT NULL,
  p_form_data jsonb DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_transaction_id uuid;
BEGIN
  -- Validate user exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user ID';
  END IF;
  
  -- Check if transaction already exists
  SELECT id INTO v_transaction_id
  FROM transactions
  WHERE transaction_ref = p_transaction_ref;
  
  IF v_transaction_id IS NOT NULL THEN
    -- Update existing transaction (preserve original user_id, update status and form_data)
    UPDATE transactions
    SET 
      status = p_status,
      amount = COALESCE(p_amount, amount),
      customer_name = COALESCE(p_customer_name, customer_name),
      form_data = COALESCE(p_form_data, form_data),
      updated_at = now()
    WHERE id = v_transaction_id;
  ELSE
    -- Insert new transaction
    INSERT INTO transactions (
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
      business_application,
      form_data,
      created_date,
      created_at,
      updated_at
    ) VALUES (
      p_user_id,
      p_transaction_ref,
      p_product_type,
      p_process_type,
      p_status,
      p_customer_name,
      p_amount,
      p_currency,
      p_created_by,
      p_initiating_channel,
      p_business_application,
      p_form_data,
      CURRENT_DATE,
      now(),
      now()
    )
    RETURNING id INTO v_transaction_id;
  END IF;
  
  RETURN v_transaction_id;
END;
$$;