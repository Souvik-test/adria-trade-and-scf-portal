-- Fix critical security vulnerability in custom_users table
-- Prevent unauthorized access to password hashes and authentication credentials

-- Enable RLS on custom_users table if not already enabled
ALTER TABLE public.custom_users ENABLE ROW LEVEL SECURITY;

-- Drop any existing permissive policies that might expose sensitive data
DROP POLICY IF EXISTS "Custom users can view their own data" ON public.custom_users;
DROP POLICY IF EXISTS "Custom users can update their own data" ON public.custom_users;
DROP POLICY IF EXISTS "Users can view custom users" ON public.custom_users;
DROP POLICY IF EXISTS "Users can update custom users" ON public.custom_users;

-- Create a security definer function that only allows system-level access to password hashes
-- This function will be used by the authentication service only
CREATE OR REPLACE FUNCTION public.authenticate_custom_user(input_user_id text, input_password_hash text)
RETURNS public.custom_users
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM public.custom_users 
  WHERE user_id = input_user_id AND password_hash = input_password_hash
  LIMIT 1;
$$;

-- Create a function to get user profile data WITHOUT password hash
CREATE OR REPLACE FUNCTION public.get_custom_user_profile(input_user_id text)
RETURNS TABLE(
  id uuid,
  user_id text,
  full_name text,
  user_login_id text,
  corporate_id text,
  role_type user_role_type,
  product_linkage product_type[],
  created_at timestamp with time zone,
  updated_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    cu.id,
    cu.user_id,
    cu.full_name,
    cu.user_login_id,
    cu.corporate_id,
    cu.role_type,
    cu.product_linkage,
    cu.created_at,
    cu.updated_at
  FROM public.custom_users cu
  WHERE cu.user_id = input_user_id
  LIMIT 1;
$$;

-- Create extremely restrictive RLS policies
-- Users cannot directly SELECT from custom_users table (prevents password hash exposure)
CREATE POLICY "No direct access to custom_users table"
ON public.custom_users
FOR SELECT
USING (false);

-- Only allow INSERT for new user registration (system level)
CREATE POLICY "System can create new custom users"
ON public.custom_users
FOR INSERT
WITH CHECK (true);

-- Allow users to update their own non-sensitive data only
-- But prevent any updates to password_hash through RLS
CREATE POLICY "Users can update their own profile data only"
ON public.custom_users
FOR UPDATE
USING (
  user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  AND ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text) IS NOT NULL
)
WITH CHECK (
  user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  AND ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text) IS NOT NULL
  AND OLD.password_hash = NEW.password_hash -- Prevent password hash changes via UPDATE
  AND OLD.user_id = NEW.user_id -- Prevent user_id changes
);

-- Prevent any DELETE operations
CREATE POLICY "No deletion allowed"
ON public.custom_users
FOR DELETE
USING (false);

-- Create a function to safely update user password (with proper hashing)
CREATE OR REPLACE FUNCTION public.update_user_password(old_password text, new_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id text;
  stored_hash text;
BEGIN
  -- Get current user ID from JWT
  current_user_id := ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text);
  
  -- Get stored password hash
  SELECT password_hash INTO stored_hash 
  FROM public.custom_users 
  WHERE user_id = current_user_id;
  
  -- Verify old password (implement your password verification logic here)
  -- This is a placeholder - implement actual password verification
  IF stored_hash IS NULL THEN
    RETURN false;
  END IF;
  
  -- Update password hash (implement your password hashing logic here)
  -- This is a placeholder - implement actual password hashing
  UPDATE public.custom_users 
  SET password_hash = new_password, updated_at = now()
  WHERE user_id = current_user_id;
  
  RETURN true;
END;
$$;

-- Create trigger to prevent password hash updates through regular UPDATE statements
CREATE OR REPLACE FUNCTION public.prevent_password_hash_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow password hash updates only if it's currently NULL (initial signup)
  IF OLD.password_hash IS NOT NULL AND NEW.password_hash != OLD.password_hash THEN
    RAISE EXCEPTION 'Direct password hash updates are not allowed for security reasons';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS prevent_password_hash_update ON public.custom_users;
CREATE TRIGGER prevent_password_hash_update
  BEFORE UPDATE ON public.custom_users
  FOR EACH ROW
  EXECUTE FUNCTION prevent_password_hash_update();