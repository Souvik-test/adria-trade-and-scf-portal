-- Rollback: Re-add individual tenor columns and add calculated total days columns
ALTER TABLE scf_program_configurations
  ADD COLUMN IF NOT EXISTS min_tenor_years integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_tenor_months integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_tenor_days integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_tenor_years integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_tenor_months integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_tenor_days integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_tenor_total_days integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_tenor_total_days integer DEFAULT 0;

-- Drop the old check constraint if it exists
ALTER TABLE scf_program_configurations
  DROP CONSTRAINT IF EXISTS check_tenor_range;

-- Add new check constraint for total days
ALTER TABLE scf_program_configurations
  ADD CONSTRAINT check_tenor_total_days CHECK (
    min_tenor_total_days <= max_tenor_total_days OR max_tenor_total_days = 0
  );