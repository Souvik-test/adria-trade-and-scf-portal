-- Create security definer function for inserting product event mappings
CREATE OR REPLACE FUNCTION public.insert_product_event_mapping(
  p_user_id uuid,
  p_module_code text,
  p_module_name text,
  p_product_code text,
  p_product_name text,
  p_event_code text,
  p_event_name text,
  p_target_audience text[],
  p_business_application text[]
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
BEGIN
  -- Validate user exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id: user does not exist';
  END IF;

  INSERT INTO product_event_mapping (
    user_id, module_code, module_name, product_code, product_name,
    event_code, event_name, target_audience, business_application
  ) VALUES (
    p_user_id, p_module_code, p_module_name, p_product_code, p_product_name,
    p_event_code, p_event_name, p_target_audience, p_business_application
  )
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

-- Create security definer function for updating product event mappings
CREATE OR REPLACE FUNCTION public.update_product_event_mapping(
  p_user_id uuid,
  p_mapping_id uuid,
  p_module_code text,
  p_module_name text,
  p_product_code text,
  p_product_name text,
  p_event_code text,
  p_event_name text,
  p_target_audience text[],
  p_business_application text[]
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate user exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id: user does not exist';
  END IF;

  UPDATE product_event_mapping
  SET 
    module_code = p_module_code,
    module_name = p_module_name,
    product_code = p_product_code,
    product_name = p_product_name,
    event_code = p_event_code,
    event_name = p_event_name,
    target_audience = p_target_audience,
    business_application = p_business_application,
    updated_at = now()
  WHERE id = p_mapping_id;

  RETURN FOUND;
END;
$$;

-- Create security definer function for deleting product event mappings
CREATE OR REPLACE FUNCTION public.delete_product_event_mapping(
  p_user_id uuid,
  p_mapping_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate user exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id: user does not exist';
  END IF;

  DELETE FROM product_event_mapping WHERE id = p_mapping_id;

  RETURN FOUND;
END;
$$;

-- Create security definer function for fetching all product event mappings
CREATE OR REPLACE FUNCTION public.get_product_event_mappings(p_user_id uuid)
RETURNS SETOF product_event_mapping
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate user exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id: user does not exist';
  END IF;

  RETURN QUERY
  SELECT * FROM product_event_mapping
  ORDER BY module_code, product_code, event_code;
END;
$$;