-- Requirement 1: Add rejection_reason column to invoice_disbursements
ALTER TABLE invoice_disbursements 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Requirement 2: Add override criteria columns to scf_program_configurations
ALTER TABLE scf_program_configurations 
ADD COLUMN IF NOT EXISTS override_limit_restrictions BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS override_tenor_calculation BOOLEAN DEFAULT FALSE;

-- Add comment for documentation
COMMENT ON COLUMN scf_program_configurations.override_limit_restrictions IS 'Allow invoice creation/upload even when Program, Anchor, or Counter Party limits are exceeded';
COMMENT ON COLUMN scf_program_configurations.override_tenor_calculation IS 'Allow invoice creation/upload even when invoice tenor is outside the program min/max tenor range';