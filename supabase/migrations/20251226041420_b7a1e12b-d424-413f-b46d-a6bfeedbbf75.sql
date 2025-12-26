-- Fix RLS policies for remittance_transactions table
-- The issue is the policy uses custom_users lookup but we're passing the auth.uid() directly

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own remittance transactions" ON remittance_transactions;
DROP POLICY IF EXISTS "Users can create their own remittance transactions" ON remittance_transactions;
DROP POLICY IF EXISTS "Users can update their own remittance transactions" ON remittance_transactions;

-- Create new policies that support both auth.uid() and custom_users lookup
CREATE POLICY "Users can view their own remittance transactions"
ON remittance_transactions
FOR SELECT
USING (
  user_id = auth.uid() 
  OR user_id IN (
    SELECT id FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  )
);

CREATE POLICY "Users can create their own remittance transactions"
ON remittance_transactions
FOR INSERT
WITH CHECK (
  user_id = auth.uid() 
  OR user_id IN (
    SELECT id FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  )
);

CREATE POLICY "Users can update their own remittance transactions"
ON remittance_transactions
FOR UPDATE
USING (
  user_id = auth.uid() 
  OR user_id IN (
    SELECT id FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  )
);