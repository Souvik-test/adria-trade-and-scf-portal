-- Create security definer function to check super user status (bypasses RLS)
CREATE OR REPLACE FUNCTION public.check_is_super_user(p_user_id UUID)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM custom_users 
    WHERE id = p_user_id AND is_super_user = true
  );
END;
$$;

-- Insert bootstrap super user SUP001 with password 123456
-- Note: Password will be verified via edge function which handles bcrypt
INSERT INTO public.custom_users (
  id,
  user_id,
  user_login_id,
  full_name,
  password_hash,
  is_super_user,
  corporate_id,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'SUP001',
  'SUP001',
  'Super Administrator',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.QLoHq5Oc6eUNDB1TlS', -- bcrypt hash of '123456'
  true,
  'TC001',
  now(),
  now()
) ON CONFLICT (user_login_id) DO UPDATE SET
  is_super_user = true,
  password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.QLoHq5Oc6eUNDB1TlS',
  updated_at = now();