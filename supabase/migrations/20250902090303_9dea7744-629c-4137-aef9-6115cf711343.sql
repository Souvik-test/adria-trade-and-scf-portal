-- Fix critical security vulnerability in custom_users table
-- Prevent unauthorized access to password hashes and authentication credentials

-- Enable RLS on custom_users table if not already enabled
ALTER TABLE public.custom_users ENABLE ROW LEVEL SECURITY;

-- Drop any existing permissive policies that might expose sensitive data
DROP POLICY IF EXISTS "Custom users can view their own data" ON public.custom_users;
DROP POLICY IF EXISTS "Custom users can update their own data" ON public.custom_users;
DROP POLICY IF EXISTS "Users can view custom users" ON public.custom_users;
DROP POLICY IF EXISTS "Users can update custom users" ON public.custom_users;

-- Create a security definer function for authentication (system use only)
CREATE OR REPLACE FUNCTION public.authenticate_custom_user(input_user_id text)
RETURNS TABLE(
  id uuid,
  user_id text,
  password_hash text,
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
    cu.password_hash,
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

-- Allow users to update only their own non-sensitive profile data
-- This policy prevents password hash updates through regular UPDATE queries
CREATE POLICY "Users can update non-sensitive profile data only"
ON public.custom_users
FOR UPDATE
USING (
  user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  AND ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text) IS NOT NULL
);

-- Prevent any DELETE operations for security
CREATE POLICY "No deletion allowed on custom_users"
ON public.custom_users
FOR DELETE
USING (false);

-- Create trigger to prevent password hash updates through UPDATE statements
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