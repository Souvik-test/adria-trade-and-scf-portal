-- Add mapped_from_field_code column to field_repository table
-- This allows fields to auto-populate values from another field during transaction processing

ALTER TABLE field_repository 
ADD COLUMN IF NOT EXISTS mapped_from_field_code TEXT DEFAULT NULL;

COMMENT ON COLUMN field_repository.mapped_from_field_code IS 
  'Field code of another field whose value should auto-populate this field during transaction processing';