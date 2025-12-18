-- Drop and recreate get_all_custom_users with new fields
DROP FUNCTION IF EXISTS public.get_all_custom_users();

CREATE OR REPLACE FUNCTION public.get_all_custom_users()
RETURNS TABLE (
  id UUID,
  user_id TEXT,
  user_login_id TEXT,
  full_name TEXT,
  business_applications TEXT[],
  is_super_user BOOLEAN,
  corporate_name TEXT,
  client_id TEXT,
  created_at TIMESTAMPTZ
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
    cu.corporate_name,
    cu.client_id,
    cu.created_at
  FROM public.custom_users cu
  ORDER BY cu.created_at DESC;
END;
$$;