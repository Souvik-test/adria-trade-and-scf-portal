-- Create validation_rule table
CREATE TABLE public.validation_rule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_id VARCHAR(50) NOT NULL,
  product_code VARCHAR(50) NOT NULL,
  event_code VARCHAR(50) NOT NULL,
  validation_type VARCHAR(20) NOT NULL CHECK (validation_type IN ('ERROR', 'WARNING', 'INFO')),
  message TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 1,
  active_flag BOOLEAN NOT NULL DEFAULT true,
  created_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by VARCHAR(100),
  updated_at TIMESTAMP WITH TIME ZONE,
  user_id UUID NOT NULL,
  UNIQUE(rule_id)
);

-- Create validation_condition table
CREATE TABLE public.validation_condition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condition_id VARCHAR(50) NOT NULL,
  rule_id UUID NOT NULL REFERENCES public.validation_rule(id) ON DELETE CASCADE,
  field_code VARCHAR(100) NOT NULL,
  operator VARCHAR(20) NOT NULL CHECK (operator IN ('=', '<', '>', '<=', '>=', '<>', 'IN', 'NOT IN', 'CONTAINS', 'NOT CONTAINS', 'IS NULL', 'IS NOT NULL')),
  compare_value TEXT,
  compare_source VARCHAR(20) NOT NULL CHECK (compare_source IN ('CONSTANT', 'FIELD')) DEFAULT 'CONSTANT',
  join_type VARCHAR(5) CHECK (join_type IN ('AND', 'OR') OR join_type IS NULL),
  sequence INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(condition_id)
);

-- Create validation_execution_log table
CREATE TABLE public.validation_execution_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_id VARCHAR(50) NOT NULL,
  txn_id VARCHAR(100) NOT NULL,
  rule_id UUID NOT NULL REFERENCES public.validation_rule(id) ON DELETE CASCADE,
  validation_type VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  overridden_flag BOOLEAN NOT NULL DEFAULT false,
  overridden_by VARCHAR(100),
  overridden_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(log_id)
);

-- Enable RLS on all tables
ALTER TABLE public.validation_rule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_condition ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validation_execution_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for validation_rule
CREATE POLICY "Users can view all validation rules"
  ON public.validation_rule FOR SELECT
  USING (true);

CREATE POLICY "Users can insert validation rules"
  ON public.validation_rule FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update validation rules"
  ON public.validation_rule FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete validation rules"
  ON public.validation_rule FOR DELETE
  USING (true);

-- RLS policies for validation_condition
CREATE POLICY "Users can view all validation conditions"
  ON public.validation_condition FOR SELECT
  USING (true);

CREATE POLICY "Users can insert validation conditions"
  ON public.validation_condition FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update validation conditions"
  ON public.validation_condition FOR UPDATE
  USING (true);

CREATE POLICY "Users can delete validation conditions"
  ON public.validation_condition FOR DELETE
  USING (true);

-- RLS policies for validation_execution_log
CREATE POLICY "Users can view all validation execution logs"
  ON public.validation_execution_log FOR SELECT
  USING (true);

CREATE POLICY "Users can insert validation execution logs"
  ON public.validation_execution_log FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update validation execution logs"
  ON public.validation_execution_log FOR UPDATE
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_validation_rule_product_event ON public.validation_rule(product_code, event_code);
CREATE INDEX idx_validation_rule_active ON public.validation_rule(active_flag);
CREATE INDEX idx_validation_condition_rule_id ON public.validation_condition(rule_id);
CREATE INDEX idx_validation_execution_log_txn_id ON public.validation_execution_log(txn_id);
CREATE INDEX idx_validation_execution_log_rule_id ON public.validation_execution_log(rule_id);

-- Create trigger for updated_at
CREATE TRIGGER update_validation_rule_updated_at
  BEFORE UPDATE ON public.validation_rule
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create RPC function to get validation rules with conditions
CREATE OR REPLACE FUNCTION public.get_validation_rules_with_conditions(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  rule_id VARCHAR,
  product_code VARCHAR,
  event_code VARCHAR,
  validation_type VARCHAR,
  message TEXT,
  priority INTEGER,
  active_flag BOOLEAN,
  created_by VARCHAR,
  created_at TIMESTAMPTZ,
  updated_by VARCHAR,
  updated_at TIMESTAMPTZ,
  conditions JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate user exists
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE custom_users.id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;

  RETURN QUERY
  SELECT 
    vr.id,
    vr.rule_id,
    vr.product_code,
    vr.event_code,
    vr.validation_type,
    vr.message,
    vr.priority,
    vr.active_flag,
    vr.created_by,
    vr.created_at,
    vr.updated_by,
    vr.updated_at,
    COALESCE(
      (SELECT jsonb_agg(
        jsonb_build_object(
          'id', vc.id,
          'condition_id', vc.condition_id,
          'field_code', vc.field_code,
          'operator', vc.operator,
          'compare_value', vc.compare_value,
          'compare_source', vc.compare_source,
          'join_type', vc.join_type,
          'sequence', vc.sequence
        ) ORDER BY vc.sequence
      ) FROM validation_condition vc WHERE vc.rule_id = vr.id),
      '[]'::jsonb
    ) AS conditions
  FROM validation_rule vr
  ORDER BY vr.priority ASC, vr.created_at DESC;
END;
$$;

-- Create RPC function to insert validation rule with conditions
CREATE OR REPLACE FUNCTION public.insert_validation_rule_with_conditions(
  p_user_id UUID,
  p_rule_id VARCHAR,
  p_product_code VARCHAR,
  p_event_code VARCHAR,
  p_validation_type VARCHAR,
  p_message TEXT,
  p_priority INTEGER,
  p_active_flag BOOLEAN,
  p_conditions JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rule_uuid UUID;
  v_condition JSONB;
  v_seq INTEGER := 1;
BEGIN
  -- Validate user exists
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;

  -- Insert the rule
  INSERT INTO validation_rule (
    rule_id, product_code, event_code, validation_type, message, priority, active_flag, created_by, user_id
  ) VALUES (
    p_rule_id, p_product_code, p_event_code, p_validation_type, p_message, p_priority, p_active_flag,
    (SELECT user_login_id FROM custom_users WHERE id = p_user_id), p_user_id
  ) RETURNING id INTO v_rule_uuid;

  -- Insert conditions
  FOR v_condition IN SELECT * FROM jsonb_array_elements(p_conditions)
  LOOP
    INSERT INTO validation_condition (
      condition_id, rule_id, field_code, operator, compare_value, compare_source, join_type, sequence
    ) VALUES (
      COALESCE(v_condition->>'condition_id', 'COND_' || extract(epoch from now())::text || '_' || v_seq),
      v_rule_uuid,
      v_condition->>'field_code',
      v_condition->>'operator',
      v_condition->>'compare_value',
      COALESCE(v_condition->>'compare_source', 'CONSTANT'),
      v_condition->>'join_type',
      COALESCE((v_condition->>'sequence')::integer, v_seq)
    );
    v_seq := v_seq + 1;
  END LOOP;

  RETURN v_rule_uuid;
END;
$$;

-- Create RPC function to update validation rule with conditions
CREATE OR REPLACE FUNCTION public.update_validation_rule_with_conditions(
  p_user_id UUID,
  p_id UUID,
  p_product_code VARCHAR,
  p_event_code VARCHAR,
  p_validation_type VARCHAR,
  p_message TEXT,
  p_priority INTEGER,
  p_active_flag BOOLEAN,
  p_conditions JSONB
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_condition JSONB;
  v_seq INTEGER := 1;
BEGIN
  -- Validate user exists
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;

  -- Update the rule
  UPDATE validation_rule
  SET 
    product_code = p_product_code,
    event_code = p_event_code,
    validation_type = p_validation_type,
    message = p_message,
    priority = p_priority,
    active_flag = p_active_flag,
    updated_by = (SELECT user_login_id FROM custom_users WHERE id = p_user_id),
    updated_at = now()
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Delete existing conditions
  DELETE FROM validation_condition WHERE rule_id = p_id;

  -- Insert new conditions
  FOR v_condition IN SELECT * FROM jsonb_array_elements(p_conditions)
  LOOP
    INSERT INTO validation_condition (
      condition_id, rule_id, field_code, operator, compare_value, compare_source, join_type, sequence
    ) VALUES (
      COALESCE(v_condition->>'condition_id', 'COND_' || extract(epoch from now())::text || '_' || v_seq),
      p_id,
      v_condition->>'field_code',
      v_condition->>'operator',
      v_condition->>'compare_value',
      COALESCE(v_condition->>'compare_source', 'CONSTANT'),
      v_condition->>'join_type',
      COALESCE((v_condition->>'sequence')::integer, v_seq)
    );
    v_seq := v_seq + 1;
  END LOOP;

  RETURN true;
END;
$$;

-- Create RPC function to delete validation rule
CREATE OR REPLACE FUNCTION public.delete_validation_rule(p_user_id UUID, p_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate user exists
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;

  DELETE FROM validation_rule WHERE id = p_id;
  RETURN FOUND;
END;
$$;

-- Create RPC function to toggle rule active status
CREATE OR REPLACE FUNCTION public.toggle_validation_rule_active(p_user_id UUID, p_id UUID, p_active BOOLEAN)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate user exists
  IF NOT EXISTS (SELECT 1 FROM custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id';
  END IF;

  UPDATE validation_rule
  SET active_flag = p_active, updated_at = now(), updated_by = (SELECT user_login_id FROM custom_users WHERE id = p_user_id)
  WHERE id = p_id;

  RETURN FOUND;
END;
$$;