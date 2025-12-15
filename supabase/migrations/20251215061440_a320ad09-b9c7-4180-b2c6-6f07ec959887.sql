-- Add business_applications column to custom_users
ALTER TABLE public.custom_users 
ADD COLUMN IF NOT EXISTS business_applications TEXT[] DEFAULT '{}';

-- Update SUP001 with all business applications
UPDATE public.custom_users 
SET business_applications = ARRAY['Adria TSCF Client', 'Adria Process Orchestrator', 'Adria TSCF Bank']
WHERE user_login_id = 'SUP001';

-- Add Maker/Viewer/Checker columns to user_permissions
ALTER TABLE public.user_permissions
ADD COLUMN IF NOT EXISTS is_maker BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_viewer BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_checker BOOLEAN DEFAULT false;

-- Migrate existing data: can_create/can_edit → is_maker, can_view → is_viewer, can_approve → is_checker
UPDATE public.user_permissions SET
  is_maker = COALESCE(can_create, false) OR COALESCE(can_edit, false),
  is_viewer = COALESCE(can_view, false),
  is_checker = COALESCE(can_approve, false);

-- Create security definer function to create a new custom user
CREATE OR REPLACE FUNCTION public.create_custom_user(
  p_requesting_user_id UUID,
  p_user_id TEXT,
  p_user_login_id TEXT,
  p_full_name TEXT,
  p_password_hash TEXT,
  p_business_applications TEXT[],
  p_is_super_user BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_user_id UUID;
BEGIN
  -- Validate requesting user is super user
  IF NOT EXISTS (SELECT 1 FROM custom_users cu WHERE cu.id = p_requesting_user_id AND cu.is_super_user = true) THEN
    RAISE EXCEPTION 'Access denied: Super user privileges required';
  END IF;

  -- Check if user_id or user_login_id already exists
  IF EXISTS (SELECT 1 FROM custom_users WHERE user_id = p_user_id OR user_login_id = p_user_login_id) THEN
    RAISE EXCEPTION 'User ID or Login ID already exists';
  END IF;

  INSERT INTO custom_users (
    user_id, user_login_id, full_name, password_hash, business_applications, is_super_user, corporate_id
  ) VALUES (
    p_user_id, p_user_login_id, p_full_name, p_password_hash, p_business_applications, p_is_super_user, 'TC001'
  )
  RETURNING id INTO v_new_user_id;

  RETURN v_new_user_id;
END;
$$;

-- Create security definer function to update a custom user
CREATE OR REPLACE FUNCTION public.update_custom_user(
  p_requesting_user_id UUID,
  p_target_user_id UUID,
  p_full_name TEXT DEFAULT NULL,
  p_business_applications TEXT[] DEFAULT NULL,
  p_is_super_user BOOLEAN DEFAULT NULL,
  p_password_hash TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate requesting user is super user
  IF NOT EXISTS (SELECT 1 FROM custom_users cu WHERE cu.id = p_requesting_user_id AND cu.is_super_user = true) THEN
    RAISE EXCEPTION 'Access denied: Super user privileges required';
  END IF;

  UPDATE custom_users
  SET
    full_name = COALESCE(p_full_name, full_name),
    business_applications = COALESCE(p_business_applications, business_applications),
    is_super_user = COALESCE(p_is_super_user, is_super_user),
    password_hash = COALESCE(p_password_hash, password_hash),
    updated_at = now()
  WHERE id = p_target_user_id;

  RETURN FOUND;
END;
$$;

-- Create security definer function to delete a custom user
CREATE OR REPLACE FUNCTION public.delete_custom_user(
  p_requesting_user_id UUID,
  p_target_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate requesting user is super user
  IF NOT EXISTS (SELECT 1 FROM custom_users cu WHERE cu.id = p_requesting_user_id AND cu.is_super_user = true) THEN
    RAISE EXCEPTION 'Access denied: Super user privileges required';
  END IF;

  -- Prevent self-deletion
  IF p_requesting_user_id = p_target_user_id THEN
    RAISE EXCEPTION 'Cannot delete your own account';
  END IF;

  -- Delete user permissions first
  DELETE FROM user_permissions WHERE user_id = p_target_user_id;
  
  -- Delete the user
  DELETE FROM custom_users WHERE id = p_target_user_id;

  RETURN FOUND;
END;
$$;

-- Create security definer function to bulk upsert user permissions
CREATE OR REPLACE FUNCTION public.bulk_upsert_user_permissions(
  p_requesting_user_id UUID,
  p_target_user_id UUID,
  p_permissions JSONB
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_permission JSONB;
  v_count INTEGER := 0;
BEGIN
  -- Validate requesting user is super user
  IF NOT EXISTS (SELECT 1 FROM custom_users cu WHERE cu.id = p_requesting_user_id AND cu.is_super_user = true) THEN
    RAISE EXCEPTION 'Access denied: Super user privileges required';
  END IF;

  -- Delete existing permissions for this user
  DELETE FROM user_permissions WHERE user_id = p_target_user_id;

  -- Insert new permissions
  FOR v_permission IN SELECT * FROM jsonb_array_elements(p_permissions)
  LOOP
    INSERT INTO user_permissions (
      user_id, module_code, product_code, event_code, stage_name,
      is_maker, is_viewer, is_checker,
      can_view, can_create, can_edit, can_delete, can_approve,
      created_by
    ) VALUES (
      p_target_user_id,
      v_permission->>'module_code',
      v_permission->>'product_code',
      v_permission->>'event_code',
      COALESCE(v_permission->>'stage_name', '__ALL__'),
      COALESCE((v_permission->>'is_maker')::boolean, false),
      COALESCE((v_permission->>'is_viewer')::boolean, false),
      COALESCE((v_permission->>'is_checker')::boolean, false),
      COALESCE((v_permission->>'is_viewer')::boolean, false),
      COALESCE((v_permission->>'is_maker')::boolean, false),
      COALESCE((v_permission->>'is_maker')::boolean, false),
      false,
      COALESCE((v_permission->>'is_checker')::boolean, false),
      p_requesting_user_id
    );
    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$;

-- Create function to get full permission matrix for a user
CREATE OR REPLACE FUNCTION public.get_user_permission_matrix(
  p_requesting_user_id UUID,
  p_target_user_id UUID
)
RETURNS TABLE (
  module_code TEXT,
  product_code TEXT,
  event_code TEXT,
  stage_name TEXT,
  is_maker BOOLEAN,
  is_viewer BOOLEAN,
  is_checker BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate requesting user is super user or viewing own permissions
  IF p_requesting_user_id != p_target_user_id AND 
     NOT EXISTS (SELECT 1 FROM custom_users cu WHERE cu.id = p_requesting_user_id AND cu.is_super_user = true) THEN
    RAISE EXCEPTION 'Access denied: Cannot view other user permissions';
  END IF;

  RETURN QUERY
  SELECT 
    up.module_code,
    up.product_code,
    up.event_code,
    up.stage_name,
    up.is_maker,
    up.is_viewer,
    up.is_checker
  FROM user_permissions up
  WHERE up.user_id = p_target_user_id
  ORDER BY up.module_code, up.product_code, up.event_code, up.stage_name;
END;
$$;