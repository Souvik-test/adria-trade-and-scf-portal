-- Remove ambiguous overloads for validation rule RPCs and recreate single canonical signatures.
DO $$
DECLARE r record;
BEGIN
  FOR r IN (
    SELECT p.oid::regprocedure AS sig
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname IN ('insert_validation_rule_with_conditions', 'update_validation_rule_with_conditions')
  ) LOOP
    EXECUTE 'DROP FUNCTION IF EXISTS ' || r.sig || ';';
  END LOOP;
END $$;

-- Canonical: use TEXT for codes/messages and JSONB for conditions
CREATE OR REPLACE FUNCTION public.insert_validation_rule_with_conditions(
  p_user_id uuid,
  p_rule_id text,
  p_product_code text,
  p_event_code text,
  p_validation_type text,
  p_message text,
  p_priority integer,
  p_active_flag boolean,
  p_conditions jsonb
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

  FOR v_condition IN
    SELECT * FROM json_array_elements(p_conditions::json)
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

CREATE OR REPLACE FUNCTION public.update_validation_rule_with_conditions(
  p_user_id uuid,
  p_id uuid,
  p_product_code text,
  p_event_code text,
  p_validation_type text,
  p_message text,
  p_priority integer,
  p_active_flag boolean,
  p_conditions jsonb
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

  FOR v_condition IN
    SELECT * FROM json_array_elements(p_conditions::json)
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