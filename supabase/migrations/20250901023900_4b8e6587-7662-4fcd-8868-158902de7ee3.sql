-- Fix critical security vulnerability in custom_users table
-- Replace overly permissive RLS policies with secure ones

-- Drop existing insecure policies
DROP POLICY IF EXISTS "Users can view their own data" ON public.custom_users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.custom_users;

-- Create secure SELECT policy - users can only see their own record
CREATE POLICY "Users can view only their own record" 
ON public.custom_users 
FOR SELECT 
USING (user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text));

-- Create secure UPDATE policy - users can only update their own record  
CREATE POLICY "Users can update only their own record" 
ON public.custom_users 
FOR UPDATE 
USING (user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text));

-- Keep the signup policy as is (it's needed for registration)
-- Note: "Anyone can signup" policy remains unchanged for user registration

-- Add additional security: prevent password_hash from being updated after creation
-- Create a trigger to prevent password hash modifications (except during signup)
CREATE OR REPLACE FUNCTION public.prevent_password_hash_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow password hash updates only if it's currently NULL (initial signup)
  IF OLD.password_hash IS NOT NULL AND NEW.password_hash != OLD.password_hash THEN
    RAISE EXCEPTION 'Direct password hash updates are not allowed for security reasons';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER prevent_password_hash_update_trigger
  BEFORE UPDATE ON public.custom_users
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_password_hash_update();

-- Create a secure function for password updates (if needed)
CREATE OR REPLACE FUNCTION public.update_user_password(old_password text, new_password text)
RETURNS boolean AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;