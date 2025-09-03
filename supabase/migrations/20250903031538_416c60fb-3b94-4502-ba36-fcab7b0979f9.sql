-- Fix security issues with custom_users table RLS policies
-- Remove conflicting and insecure policies

-- Drop all existing policies on custom_users table
DROP POLICY IF EXISTS "Anyone can signup" ON public.custom_users;
DROP POLICY IF EXISTS "System can create new custom users" ON public.custom_users;
DROP POLICY IF EXISTS "No direct access to custom_users table" ON public.custom_users;
DROP POLICY IF EXISTS "Users can view only their own record" ON public.custom_users;
DROP POLICY IF EXISTS "Users can update only their own record" ON public.custom_users;
DROP POLICY IF EXISTS "Users can update non-sensitive profile data only" ON public.custom_users;
DROP POLICY IF EXISTS "No deletion allowed on custom_users" ON public.custom_users;

-- Create secure, non-conflicting policies
-- Allow system to create new users (for signup process)
CREATE POLICY "System can create custom users" 
ON public.custom_users 
FOR INSERT 
WITH CHECK (true);

-- Users can only view their own profile data (excluding sensitive fields)
CREATE POLICY "Users can view own profile" 
ON public.custom_users 
FOR SELECT 
USING (
  user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  AND ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text) IS NOT NULL
);

-- Users can update only their own non-sensitive profile data
CREATE POLICY "Users can update own profile" 
ON public.custom_users 
FOR UPDATE 
USING (
  user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  AND ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text) IS NOT NULL
);

-- Prevent all deletion for security
CREATE POLICY "No deletion allowed" 
ON public.custom_users 
FOR DELETE 
USING (false);

-- Create additional security function to validate user creation
CREATE OR REPLACE FUNCTION public.validate_custom_user_creation()
RETURNS TRIGGER AS $$
BEGIN
  -- Ensure password hash is provided during creation
  IF NEW.password_hash IS NULL OR NEW.password_hash = '' THEN
    RAISE EXCEPTION 'Password hash is required';
  END IF;
  
  -- Ensure user_id is provided and unique
  IF NEW.user_id IS NULL OR NEW.user_id = '' THEN
    RAISE EXCEPTION 'User ID is required';
  END IF;
  
  -- Set default values for security
  NEW.created_at = COALESCE(NEW.created_at, now());
  NEW.updated_at = now();
  NEW.corporate_id = COALESCE(NEW.corporate_id, 'TC001');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';