-- Drop existing RLS policies for transactions table
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "System can create transactions" ON public.transactions;

-- Create new RLS policies that support both Supabase Auth and Custom Auth
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (
  (auth.uid() = user_id) 
  OR 
  (user_id IN (
    SELECT id FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  ))
);

CREATE POLICY "Users can create their own transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (
  (auth.uid() = user_id) 
  OR 
  (user_id IN (
    SELECT id FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  ))
);

CREATE POLICY "Users can update their own transactions" 
ON public.transactions 
FOR UPDATE 
USING (
  (auth.uid() = user_id) 
  OR 
  (user_id IN (
    SELECT id FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  ))
);

-- Create security definer function for fetching transactions (bypasses RLS for custom auth)
CREATE OR REPLACE FUNCTION public.get_user_transactions(p_user_id uuid)
RETURNS SETOF transactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate user exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user ID';
  END IF;
  
  -- Return transactions for this user
  RETURN QUERY
  SELECT * FROM transactions
  WHERE user_id = p_user_id
  ORDER BY created_at DESC;
END;
$$;

-- Create security definer function for inserting transactions
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
  p_initiating_channel text DEFAULT 'Portal'
)
RETURNS transactions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result transactions;
BEGIN
  -- Validate user exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user ID';
  END IF;
  
  -- Insert the transaction
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
    initiating_channel
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
    p_initiating_channel
  )
  RETURNING * INTO result;
  
  RETURN result;
END;
$$;