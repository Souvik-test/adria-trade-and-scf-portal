-- Add new fields to scf_program_configurations table
ALTER TABLE scf_program_configurations
  -- Tenor structure changes
  ADD COLUMN IF NOT EXISTS min_tenor_years INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_tenor_months INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS min_tenor_days INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_tenor_years INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_tenor_months INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_tenor_days INTEGER DEFAULT 0,
  
  -- Disbursement parameters
  ADD COLUMN IF NOT EXISTS multiple_disbursement BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS max_disbursements_allowed INTEGER DEFAULT 1,
  ADD COLUMN IF NOT EXISTS auto_disbursement BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS holiday_treatment TEXT DEFAULT 'Next Business Day',
  
  -- Repayment parameters
  ADD COLUMN IF NOT EXISTS repayment_by TEXT DEFAULT 'Buyer',
  ADD COLUMN IF NOT EXISTS debit_account_number TEXT,
  ADD COLUMN IF NOT EXISTS auto_repayment BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS part_payment_allowed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS pre_payment_allowed BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS charge_penalty_on_prepayment BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS appropriation_sequence_after_due JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS appropriation_sequence_before_due JSONB DEFAULT '[]'::jsonb;

-- Remove old tenor fields (keep for now for backwards compatibility)
-- ALTER TABLE scf_program_configurations DROP COLUMN IF EXISTS min_tenor;
-- ALTER TABLE scf_program_configurations DROP COLUMN IF EXISTS max_tenor;
-- ALTER TABLE scf_program_configurations DROP COLUMN IF EXISTS min_tenor_unit;
-- ALTER TABLE scf_program_configurations DROP COLUMN IF EXISTS max_tenor_unit;

-- Remove old appropriation sequence field (keep for now for backwards compatibility)
-- ALTER TABLE scf_program_configurations DROP COLUMN IF EXISTS appropriation_sequence;