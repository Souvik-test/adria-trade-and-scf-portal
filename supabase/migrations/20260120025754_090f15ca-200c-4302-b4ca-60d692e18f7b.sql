-- Add pane_code column to validation_condition table
ALTER TABLE public.validation_condition 
ADD COLUMN IF NOT EXISTS pane_code character varying(100);

-- Drop and recreate get_validation_rules_with_conditions
DROP FUNCTION IF EXISTS public.get_validation_rules_with_conditions(uuid);

CREATE FUNCTION public.get_validation_rules_with_conditions(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_result json;
BEGIN
  SELECT json_agg(
    json_build_object(
      'id', vr.id,
      'rule_id', vr.rule_id,
      'product_code', vr.product_code,
      'event_code', vr.event_code,
      'validation_type', vr.validation_type,
      'message', vr.message,
      'priority', vr.priority,
      'active_flag', vr.active_flag,
      'created_by', vr.created_by,
      'created_at', vr.created_at,
      'updated_by', vr.updated_by,
      'updated_at', vr.updated_at,
      'conditions', COALESCE(
        (SELECT json_agg(
          json_build_object(
            'id', vc.id,
            'condition_id', vc.condition_id,
            'field_code', vc.field_code,
            'pane_code', vc.pane_code,
            'operator', vc.operator,
            'compare_value', vc.compare_value,
            'compare_source', vc.compare_source,
            'join_type', vc.join_type,
            'sequence', vc.sequence
          ) ORDER BY vc.sequence
        )
        FROM validation_condition vc
        WHERE vc.rule_id = vr.id
        ), '[]'::json
      )
    ) ORDER BY vr.priority, vr.created_at
  ) INTO v_result
  FROM validation_rule vr
  WHERE vr.user_id = p_user_id;
  
  RETURN COALESCE(v_result, '[]'::json);
END;
$$;

-- Drop and recreate insert_validation_rule_with_conditions
DROP FUNCTION IF EXISTS public.insert_validation_rule_with_conditions(uuid, text, text, text, text, text, integer, boolean, json);

CREATE FUNCTION public.insert_validation_rule_with_conditions(
  p_user_id uuid,
  p_rule_id text,
  p_product_code text,
  p_event_code text,
  p_validation_type text,
  p_message text,
  p_priority integer,
  p_active_flag boolean,
  p_conditions json
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_rule_id uuid;
  v_condition json;
BEGIN
  INSERT INTO validation_rule (
    user_id, rule_id, product_code, event_code, 
    validation_type, message, priority, active_flag, created_by
  )
  VALUES (
    p_user_id, p_rule_id, p_product_code, p_event_code,
    p_validation_type, p_message, p_priority, p_active_flag, p_user_id::text
  )
  RETURNING id INTO v_rule_id;
  
  FOR v_condition IN SELECT * FROM json_array_elements(p_conditions)
  LOOP
    INSERT INTO validation_condition (
      rule_id, condition_id, field_code, pane_code, operator,
      compare_value, compare_source, join_type, sequence
    )
    VALUES (
      v_rule_id,
      v_condition->>'condition_id',
      v_condition->>'field_code',
      v_condition->>'pane_code',
      v_condition->>'operator',
      v_condition->>'compare_value',
      COALESCE(v_condition->>'compare_source', 'CONSTANT'),
      v_condition->>'join_type',
      COALESCE((v_condition->>'sequence')::integer, 1)
    );
  END LOOP;
  
  RETURN v_rule_id;
END;
$$;

-- Drop and recreate update_validation_rule_with_conditions
DROP FUNCTION IF EXISTS public.update_validation_rule_with_conditions(uuid, uuid, text, text, text, text, integer, boolean, json);

CREATE FUNCTION public.update_validation_rule_with_conditions(
  p_user_id uuid,
  p_id uuid,
  p_product_code text,
  p_event_code text,
  p_validation_type text,
  p_message text,
  p_priority integer,
  p_active_flag boolean,
  p_conditions json
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_condition json;
BEGIN
  UPDATE validation_rule SET
    product_code = p_product_code,
    event_code = p_event_code,
    validation_type = p_validation_type,
    message = p_message,
    priority = p_priority,
    active_flag = p_active_flag,
    updated_by = p_user_id::text,
    updated_at = now()
  WHERE id = p_id AND user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  DELETE FROM validation_condition WHERE rule_id = p_id;
  
  FOR v_condition IN SELECT * FROM json_array_elements(p_conditions)
  LOOP
    INSERT INTO validation_condition (
      rule_id, condition_id, field_code, pane_code, operator,
      compare_value, compare_source, join_type, sequence
    )
    VALUES (
      p_id,
      v_condition->>'condition_id',
      v_condition->>'field_code',
      v_condition->>'pane_code',
      v_condition->>'operator',
      v_condition->>'compare_value',
      COALESCE(v_condition->>'compare_source', 'CONSTANT'),
      v_condition->>'join_type',
      COALESCE((v_condition->>'sequence')::integer, 1)
    );
  END LOOP;
  
  RETURN true;
END;
$$;