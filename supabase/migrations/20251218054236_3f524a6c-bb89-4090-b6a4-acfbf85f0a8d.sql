-- Add optional corporate fields for Adria TSCF Client users
ALTER TABLE public.custom_users
ADD COLUMN IF NOT EXISTS corporate_name text,
ADD COLUMN IF NOT EXISTS client_id text;

-- Update create function to accept optional corporate fields
CREATE OR REPLACE FUNCTION public.create_custom_user(
  p_requesting_user_id uuid,
  p_user_id text,
  p_user_login_id text,
  p_full_name text,
  p_password_hash text,
  p_business_applications text[],
  p_is_super_user boolean DEFAULT false,
  p_corporate_name text DEFAULT NULL,
  p_client_id text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_new_user_id UUID;
BEGIN
  -- Validate requesting user is super user
  IF NOT EXISTS (
    SELECT 1 FROM custom_users cu
    WHERE cu.id = p_requesting_user_id AND cu.is_super_user = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Super user privileges required';
  END IF;

  -- Check if user_id or user_login_id already exists
  IF EXISTS (
    SELECT 1 FROM custom_users
    WHERE user_id = p_user_id OR user_login_id = p_user_login_id
  ) THEN
    RAISE EXCEPTION 'User ID or Login ID already exists';
  END IF;

  INSERT INTO custom_users (
    user_id,
    user_login_id,
    full_name,
    password_hash,
    business_applications,
    is_super_user,
    corporate_id,
    corporate_name,
    client_id
  ) VALUES (
    p_user_id,
    p_user_login_id,
    p_full_name,
    p_password_hash,
    p_business_applications,
    p_is_super_user,
    'TC001',
    p_corporate_name,
    p_client_id
  )
  RETURNING id INTO v_new_user_id;

  RETURN v_new_user_id;
END;
$function$;

-- Update update function to accept optional corporate fields
CREATE OR REPLACE FUNCTION public.update_custom_user(
  p_requesting_user_id uuid,
  p_target_user_id uuid,
  p_full_name text DEFAULT NULL,
  p_business_applications text[] DEFAULT NULL,
  p_is_super_user boolean DEFAULT NULL,
  p_password_hash text DEFAULT NULL,
  p_corporate_name text DEFAULT NULL,
  p_client_id text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Validate requesting user is super user
  IF NOT EXISTS (
    SELECT 1 FROM custom_users cu
    WHERE cu.id = p_requesting_user_id AND cu.is_super_user = true
  ) THEN
    RAISE EXCEPTION 'Access denied: Super user privileges required';
  END IF;

  UPDATE custom_users
  SET
    full_name = COALESCE(p_full_name, full_name),
    business_applications = COALESCE(p_business_applications, business_applications),
    is_super_user = COALESCE(p_is_super_user, is_super_user),
    password_hash = COALESCE(p_password_hash, password_hash),
    corporate_name = COALESCE(p_corporate_name, corporate_name),
    client_id = COALESCE(p_client_id, client_id),
    updated_at = now()
  WHERE id = p_target_user_id;

  RETURN FOUND;
END;
$function$;
