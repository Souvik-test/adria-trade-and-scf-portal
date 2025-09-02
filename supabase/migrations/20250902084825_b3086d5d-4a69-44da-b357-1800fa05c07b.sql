-- Fix critical security vulnerability: Remove overly permissive policy that allows any user to view submitted import LC requests
-- This was exposing sensitive financial data including LC amounts, bank details, and account numbers

-- Drop the dangerous policy that makes all submitted requests publicly readable
DROP POLICY IF EXISTS "Users can view own requests or submitted requests" ON public.import_lc_requests;

-- The remaining policy "Custom users can view their own import LC requests" already properly restricts access to user-owned records only
-- Verify the remaining policies are secure by checking they properly restrict to user_id ownership

-- Also ensure the user_id column cannot be bypassed
ALTER TABLE public.import_lc_requests ALTER COLUMN user_id SET NOT NULL;

-- Create a more secure policy for any legitimate cross-user access (if needed) 
-- This would be for admin users or specific business requirements
-- For now, keeping it restrictive to user-owned records only
CREATE POLICY "Users can only view their own import LC requests" 
ON public.import_lc_requests 
FOR SELECT 
USING (user_id IN ( 
  SELECT custom_users.id
  FROM custom_users
  WHERE (custom_users.user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text))
));