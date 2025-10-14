-- Add missing columns to scf_program_configurations table

ALTER TABLE scf_program_configurations
ADD COLUMN IF NOT EXISTS program_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS program_name TEXT,
ADD COLUMN IF NOT EXISTS product_code TEXT,
ADD COLUMN IF NOT EXISTS product_name TEXT,
ADD COLUMN IF NOT EXISTS program_description TEXT,
ADD COLUMN IF NOT EXISTS program_currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS anchor_id TEXT,
ADD COLUMN IF NOT EXISTS anchor_name TEXT,
ADD COLUMN IF NOT EXISTS anchor_account TEXT,
ADD COLUMN IF NOT EXISTS anchor_limit_currency TEXT DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS anchor_party TEXT,
ADD COLUMN IF NOT EXISTS borrower_selection TEXT DEFAULT 'Anchor Party',
ADD COLUMN IF NOT EXISTS finance_tenor_unit TEXT DEFAULT 'days',
ADD COLUMN IF NOT EXISTS multiple_disbursement BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS max_disbursements_allowed INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS auto_disbursement BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS holiday_treatment TEXT DEFAULT 'Next Business Day',
ADD COLUMN IF NOT EXISTS repayment_by TEXT DEFAULT 'Buyer',
ADD COLUMN IF NOT EXISTS debit_account_number TEXT,
ADD COLUMN IF NOT EXISTS auto_repayment BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS part_payment_allowed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pre_payment_allowed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS charge_penalty_on_prepayment BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS appropriation_sequence_after_due JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS appropriation_sequence_before_due JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Create index on program_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_scf_program_configurations_program_id 
ON scf_program_configurations(program_id);

-- Create index on product_code for faster lookups
CREATE INDEX IF NOT EXISTS idx_scf_program_configurations_product_code 
ON scf_program_configurations(product_code);

-- Add constraint to ensure program_id is not null when set
ALTER TABLE scf_program_configurations
ADD CONSTRAINT check_program_id_not_empty 
CHECK (program_id IS NULL OR length(program_id) > 0);

-- Add constraint to ensure program_name is not null when set
ALTER TABLE scf_program_configurations
ADD CONSTRAINT check_program_name_not_empty 
CHECK (program_name IS NULL OR length(program_name) > 0);