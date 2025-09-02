-- Fix potential security vulnerabilities in user_profiles table
-- Strengthen authentication controls and ensure proper validation of user identity

-- Ensure the foreign key constraint to auth.users is properly enforced
-- This prevents creating profiles for non-existent users
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_id_fkey;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure critical columns cannot be null to prevent security bypasses
ALTER TABLE public.user_profiles ALTER COLUMN id SET NOT NULL;
ALTER TABLE public.user_profiles ALTER COLUMN email SET NOT NULL;

-- Drop existing policies to recreate with stronger validation
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;

-- Create strengthened RLS policies with additional validation
CREATE POLICY "Users can insert their own profile only" 
ON public.user_profiles 
FOR INSERT 
WITH CHECK (
  auth.uid() = id 
  AND auth.uid() IS NOT NULL
  AND id IS NOT NULL
);

CREATE POLICY "Users can view their own profile only" 
ON public.user_profiles 
FOR SELECT 
USING (
  auth.uid() = id 
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can update their own profile only" 
ON public.user_profiles 
FOR UPDATE 
USING (
  auth.uid() = id 
  AND auth.uid() IS NOT NULL
) 
WITH CHECK (
  auth.uid() = id 
  AND auth.uid() IS NOT NULL
  AND id IS NOT NULL
);

-- Prevent users from changing their own ID (critical security measure)
CREATE OR REPLACE FUNCTION prevent_id_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.id != NEW.id THEN
    RAISE EXCEPTION 'Cannot change user profile ID for security reasons';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to prevent ID changes
DROP TRIGGER IF EXISTS prevent_profile_id_changes ON public.user_profiles;
CREATE TRIGGER prevent_profile_id_changes
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_id_changes();