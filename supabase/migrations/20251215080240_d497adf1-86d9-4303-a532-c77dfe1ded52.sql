-- Create user_screen_permissions table for storing screen-level access
CREATE TABLE public.user_screen_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.custom_users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  screen_name TEXT NOT NULL,
  can_access BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, category, screen_name)
);

-- Enable RLS
ALTER TABLE public.user_screen_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view all screen permissions"
ON public.user_screen_permissions
FOR SELECT
USING (true);

CREATE POLICY "Super users can manage screen permissions"
ON public.user_screen_permissions
FOR ALL
USING (true);

-- Security definer function to upsert screen permissions
CREATE OR REPLACE FUNCTION public.upsert_user_screen_permissions(
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
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_requesting_user_id AND is_super_user = true) THEN
    RAISE EXCEPTION 'Access denied: Super user privileges required';
  END IF;

  -- Loop through permissions and upsert each
  FOR v_permission IN SELECT * FROM jsonb_array_elements(p_permissions)
  LOOP
    INSERT INTO user_screen_permissions (user_id, category, screen_name, can_access)
    VALUES (
      p_target_user_id,
      v_permission->>'category',
      v_permission->>'screen_name',
      (v_permission->>'can_access')::boolean
    )
    ON CONFLICT (user_id, category, screen_name)
    DO UPDATE SET
      can_access = (v_permission->>'can_access')::boolean,
      updated_at = now();
    
    v_count := v_count + 1;
  END LOOP;

  RETURN v_count;
END;
$$;

-- Security definer function to get screen permissions for a user
CREATE OR REPLACE FUNCTION public.get_user_screen_permissions(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  category TEXT,
  screen_name TEXT,
  can_access BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    usp.id,
    usp.user_id,
    usp.category,
    usp.screen_name,
    usp.can_access
  FROM user_screen_permissions usp
  WHERE usp.user_id = p_user_id;
END;
$$;

-- Function to check if user has screen access
CREATE OR REPLACE FUNCTION public.has_screen_access(p_user_id UUID, p_screen_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_super_user BOOLEAN;
  v_has_access BOOLEAN;
BEGIN
  -- Check if super user
  SELECT is_super_user INTO v_is_super_user FROM custom_users WHERE id = p_user_id;
  IF v_is_super_user = true THEN
    RETURN true;
  END IF;

  -- Check specific screen permission
  SELECT can_access INTO v_has_access
  FROM user_screen_permissions
  WHERE user_id = p_user_id AND screen_name = p_screen_name;

  RETURN COALESCE(v_has_access, false);
END;
$$;

-- Function to check if user has product access
CREATE OR REPLACE FUNCTION public.has_product_access(p_user_id UUID, p_product_code TEXT, p_event_code TEXT DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_super_user BOOLEAN;
  v_has_access BOOLEAN;
BEGIN
  -- Check if super user
  SELECT is_super_user INTO v_is_super_user FROM custom_users WHERE id = p_user_id;
  IF v_is_super_user = true THEN
    RETURN true;
  END IF;

  -- Check specific product permission
  IF p_event_code IS NULL THEN
    -- Check if user has any permission for this product
    SELECT EXISTS (
      SELECT 1 FROM user_permissions
      WHERE user_id = p_user_id 
        AND product_code = p_product_code
        AND (can_view = true OR can_create = true OR can_edit = true OR can_approve = true)
    ) INTO v_has_access;
  ELSE
    -- Check specific product-event permission
    SELECT EXISTS (
      SELECT 1 FROM user_permissions
      WHERE user_id = p_user_id 
        AND product_code = p_product_code
        AND event_code = p_event_code
        AND (can_view = true OR can_create = true OR can_edit = true OR can_approve = true)
    ) INTO v_has_access;
  END IF;

  RETURN COALESCE(v_has_access, false);
END;
$$;

-- Function to get all user permissions for caching
CREATE OR REPLACE FUNCTION public.get_all_user_permissions(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result JSONB;
  v_is_super_user BOOLEAN;
BEGIN
  -- Check if super user
  SELECT is_super_user INTO v_is_super_user FROM custom_users WHERE id = p_user_id;

  SELECT jsonb_build_object(
    'is_super_user', COALESCE(v_is_super_user, false),
    'product_permissions', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'product_code', product_code,
        'event_code', event_code,
        'stage_name', stage_name,
        'can_view', can_view,
        'can_create', can_create,
        'can_edit', can_edit,
        'can_approve', can_approve
      ))
      FROM user_permissions
      WHERE user_id = p_user_id
    ), '[]'::jsonb),
    'screen_permissions', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'category', category,
        'screen_name', screen_name,
        'can_access', can_access
      ))
      FROM user_screen_permissions
      WHERE user_id = p_user_id
    ), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END;
$$;