-- User Access Management Feature (Fixed)

-- Create user_permissions table
CREATE TABLE IF NOT EXISTS public.user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.custom_users(id) ON DELETE CASCADE,
  module_code TEXT NOT NULL,
  product_code TEXT NOT NULL,
  event_code TEXT NOT NULL,
  stage_name TEXT DEFAULT '__ALL__',
  can_view BOOLEAN DEFAULT false,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  can_approve BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES public.custom_users(id),
  UNIQUE (user_id, module_code, product_code, event_code, stage_name)
);

-- Add is_super_user column to custom_users if not exists
ALTER TABLE public.custom_users ADD COLUMN IF NOT EXISTS is_super_user BOOLEAN DEFAULT false;

-- Enable RLS
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- Simple RLS policy - all operations through security definer functions
CREATE POLICY "Allow all through security definer" ON public.user_permissions
  FOR ALL USING (true) WITH CHECK (true);

-- Security definer function to check permissions
CREATE OR REPLACE FUNCTION public.has_permission(
  p_user_id UUID,
  p_module_code TEXT,
  p_product_code TEXT,
  p_event_code TEXT,
  p_permission_type TEXT,
  p_stage_name TEXT DEFAULT '__ALL__'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_has_permission BOOLEAN := false;
BEGIN
  -- Check if user is super user
  IF EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id AND is_super_user = true) THEN
    RETURN true;
  END IF;

  -- Check specific permission
  SELECT 
    CASE p_permission_type
      WHEN 'view' THEN can_view
      WHEN 'create' THEN can_create
      WHEN 'edit' THEN can_edit
      WHEN 'delete' THEN can_delete
      WHEN 'approve' THEN can_approve
      ELSE false
    END INTO v_has_permission
  FROM user_permissions
  WHERE user_id = p_user_id
    AND module_code = p_module_code
    AND product_code = p_product_code
    AND event_code = p_event_code
    AND (stage_name = p_stage_name OR stage_name = '__ALL__')
  LIMIT 1;

  RETURN COALESCE(v_has_permission, false);
END;
$$;

-- Function to get all managed users (for super users)
CREATE OR REPLACE FUNCTION public.get_all_managed_users(p_requesting_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id TEXT,
  full_name TEXT,
  user_login_id TEXT,
  corporate_id TEXT,
  role_type public.user_role_type,
  scf_role public.scf_user_role,
  is_super_user BOOLEAN,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate requesting user is super user
  IF NOT EXISTS (SELECT 1 FROM custom_users cu WHERE cu.id = p_requesting_user_id AND cu.is_super_user = true) THEN
    RAISE EXCEPTION 'Access denied: Super user privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    cu.id,
    cu.user_id,
    cu.full_name,
    cu.user_login_id,
    cu.corporate_id,
    cu.role_type,
    cu.scf_role,
    cu.is_super_user,
    cu.created_at
  FROM custom_users cu
  ORDER BY cu.full_name;
END;
$$;

-- Function to get user permissions
CREATE OR REPLACE FUNCTION public.get_user_permissions(p_requesting_user_id UUID, p_target_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  module_code TEXT,
  product_code TEXT,
  event_code TEXT,
  stage_name TEXT,
  can_view BOOLEAN,
  can_create BOOLEAN,
  can_edit BOOLEAN,
  can_delete BOOLEAN,
  can_approve BOOLEAN
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
    up.id,
    up.user_id,
    up.module_code,
    up.product_code,
    up.event_code,
    up.stage_name,
    up.can_view,
    up.can_create,
    up.can_edit,
    up.can_delete,
    up.can_approve
  FROM user_permissions up
  WHERE up.user_id = p_target_user_id
  ORDER BY up.module_code, up.product_code, up.event_code;
END;
$$;

-- Function to upsert user permission
CREATE OR REPLACE FUNCTION public.upsert_user_permission(
  p_requesting_user_id UUID,
  p_target_user_id UUID,
  p_module_code TEXT,
  p_product_code TEXT,
  p_event_code TEXT,
  p_stage_name TEXT DEFAULT NULL,
  p_can_view BOOLEAN DEFAULT false,
  p_can_create BOOLEAN DEFAULT false,
  p_can_edit BOOLEAN DEFAULT false,
  p_can_delete BOOLEAN DEFAULT false,
  p_can_approve BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_permission_id UUID;
BEGIN
  -- Validate requesting user is super user
  IF NOT EXISTS (SELECT 1 FROM custom_users cu WHERE cu.id = p_requesting_user_id AND cu.is_super_user = true) THEN
    RAISE EXCEPTION 'Access denied: Super user privileges required';
  END IF;

  INSERT INTO user_permissions (
    user_id, module_code, product_code, event_code, stage_name,
    can_view, can_create, can_edit, can_delete, can_approve, created_by
  ) VALUES (
    p_target_user_id, p_module_code, p_product_code, p_event_code, COALESCE(p_stage_name, '__ALL__'),
    p_can_view, p_can_create, p_can_edit, p_can_delete, p_can_approve, p_requesting_user_id
  )
  ON CONFLICT (user_id, module_code, product_code, event_code, stage_name)
  DO UPDATE SET
    can_view = EXCLUDED.can_view,
    can_create = EXCLUDED.can_create,
    can_edit = EXCLUDED.can_edit,
    can_delete = EXCLUDED.can_delete,
    can_approve = EXCLUDED.can_approve,
    updated_at = now()
  RETURNING id INTO v_permission_id;

  RETURN v_permission_id;
END;
$$;

-- Function to delete user permissions
CREATE OR REPLACE FUNCTION public.delete_user_permissions(
  p_requesting_user_id UUID,
  p_permission_ids UUID[]
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  -- Validate requesting user is super user
  IF NOT EXISTS (SELECT 1 FROM custom_users cu WHERE cu.id = p_requesting_user_id AND cu.is_super_user = true) THEN
    RAISE EXCEPTION 'Access denied: Super user privileges required';
  END IF;

  DELETE FROM user_permissions
  WHERE id = ANY(p_permission_ids);

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$;

-- Function to update super user status
CREATE OR REPLACE FUNCTION public.update_super_user_status(
  p_requesting_user_id UUID,
  p_target_user_id UUID,
  p_is_super_user BOOLEAN
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

  -- Prevent removing own super user status
  IF p_requesting_user_id = p_target_user_id AND p_is_super_user = false THEN
    RAISE EXCEPTION 'Cannot remove your own super user status';
  END IF;

  UPDATE custom_users
  SET is_super_user = p_is_super_user, updated_at = now()
  WHERE id = p_target_user_id;

  RETURN FOUND;
END;
$$;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_user_permissions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_user_permissions_updated_at_trigger ON public.user_permissions;
CREATE TRIGGER update_user_permissions_updated_at_trigger
  BEFORE UPDATE ON public.user_permissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_permissions_updated_at();