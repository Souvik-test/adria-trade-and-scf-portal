-- Step 1: Drop ALL existing RLS policies on finance_disbursements
DROP POLICY "Users can create their own disbursements" ON finance_disbursements;
DROP POLICY "Users can update their own disbursements" ON finance_disbursements;
DROP POLICY "Users can view their own disbursements" ON finance_disbursements;

-- Step 2: Change finance_disbursements.user_id column type from uuid to text
ALTER TABLE finance_disbursements 
ALTER COLUMN user_id TYPE text 
USING user_id::text;

-- Add comment explaining the column stores email/user_id string
COMMENT ON COLUMN finance_disbursements.user_id IS 'Stores the user_id (email) from custom_users table, not the auth UUID';

-- Step 3: Recreate RLS policies with correct logic for text-based user_id
CREATE POLICY "Users can view their own disbursements"
ON finance_disbursements
FOR SELECT
USING (
  user_id IN (
    SELECT user_id 
    FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  )
);

CREATE POLICY "Users can create their own disbursements"
ON finance_disbursements
FOR INSERT
WITH CHECK (
  user_id IN (
    SELECT user_id 
    FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  )
);

CREATE POLICY "Users can update their own disbursements"
ON finance_disbursements
FOR UPDATE
USING (
  user_id IN (
    SELECT user_id 
    FROM custom_users 
    WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  )
);