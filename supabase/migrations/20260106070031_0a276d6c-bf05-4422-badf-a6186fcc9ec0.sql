-- Fix the function search_path security issue
CREATE OR REPLACE FUNCTION update_static_ui_registry_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;