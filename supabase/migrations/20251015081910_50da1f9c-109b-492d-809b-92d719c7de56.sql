-- Step 1: Migrate existing data from split fields to consolidated fields
UPDATE scf_program_configurations
SET 
  min_tenor = COALESCE(min_tenor_years, 0) * 365 + COALESCE(min_tenor_months, 0) * 30 + COALESCE(min_tenor_days, 0),
  max_tenor = COALESCE(max_tenor_years, 0) * 365 + COALESCE(max_tenor_months, 0) * 30 + COALESCE(max_tenor_days, 0)
WHERE min_tenor IS NULL OR max_tenor IS NULL;

-- Step 2: Set unit to 'days' for all records (since we're calculating in days)
UPDATE scf_program_configurations
SET 
  min_tenor_unit = 'days',
  max_tenor_unit = 'days'
WHERE min_tenor_unit IS NULL OR max_tenor_unit IS NULL;

-- Step 3: Drop the redundant year/month/day columns
ALTER TABLE scf_program_configurations
  DROP COLUMN IF EXISTS min_tenor_years,
  DROP COLUMN IF EXISTS min_tenor_months,
  DROP COLUMN IF EXISTS min_tenor_days,
  DROP COLUMN IF EXISTS max_tenor_years,
  DROP COLUMN IF EXISTS max_tenor_months,
  DROP COLUMN IF EXISTS max_tenor_days;

-- Step 4: Add NOT NULL constraints and defaults for the consolidated fields
ALTER TABLE scf_program_configurations
  ALTER COLUMN min_tenor SET DEFAULT 0,
  ALTER COLUMN max_tenor SET DEFAULT 0,
  ALTER COLUMN min_tenor_unit SET DEFAULT 'days',
  ALTER COLUMN max_tenor_unit SET DEFAULT 'days';

-- Step 5: Add a check constraint to ensure min <= max
ALTER TABLE scf_program_configurations
  ADD CONSTRAINT check_tenor_range 
  CHECK (min_tenor <= max_tenor OR max_tenor = 0);