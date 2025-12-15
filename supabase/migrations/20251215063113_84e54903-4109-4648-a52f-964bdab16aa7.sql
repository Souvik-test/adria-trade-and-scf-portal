-- Create security definer function to get all custom users (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_all_custom_users()
RETURNS TABLE (
  id uuid,
  user_id text,
  user_login_id text,
  full_name text,
  business_applications text[],
  is_super_user boolean,
  created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    cu.id,
    cu.user_id,
    cu.user_login_id,
    cu.full_name,
    cu.business_applications,
    cu.is_super_user,
    cu.created_at
  FROM custom_users cu
  ORDER BY cu.full_name;
END;
$$;