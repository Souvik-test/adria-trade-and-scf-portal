-- Add new fields to scf_program_configurations table for enhanced program configuration

-- Add product and anchor related fields
ALTER TABLE public.scf_program_configurations
ADD COLUMN IF NOT EXISTS product_name text,
ADD COLUMN IF NOT EXISTS anchor_id text,
ADD COLUMN IF NOT EXISTS anchor_limit numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS anchor_available_limit numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS anchor_limit_currency text DEFAULT 'USD',
ADD COLUMN IF NOT EXISTS anchor_party text;

-- Add borrower and tenor fields
ALTER TABLE public.scf_program_configurations
ADD COLUMN IF NOT EXISTS borrower_selection text DEFAULT 'Anchor Party',
ADD COLUMN IF NOT EXISTS min_tenor integer,
ADD COLUMN IF NOT EXISTS min_tenor_unit text DEFAULT 'days',
ADD COLUMN IF NOT EXISTS max_tenor integer,
ADD COLUMN IF NOT EXISTS max_tenor_unit text DEFAULT 'days';

-- Add grace period and stale period
ALTER TABLE public.scf_program_configurations
ADD COLUMN IF NOT EXISTS grace_days integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS stale_period integer DEFAULT 0;

-- Add assignment fields
ALTER TABLE public.scf_program_configurations
ADD COLUMN IF NOT EXISTS assignment_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS assignment_percentage numeric DEFAULT 0;

-- Add unaccepted invoice finance fields
ALTER TABLE public.scf_program_configurations
ADD COLUMN IF NOT EXISTS unaccepted_invoice_finance_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS unaccepted_invoice_percentage numeric DEFAULT 0;

-- Add recourse fields
ALTER TABLE public.scf_program_configurations
ADD COLUMN IF NOT EXISTS recourse_enabled boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS recourse_percentage numeric DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN public.scf_program_configurations.product_name IS 'Auto-populated product name based on product code';
COMMENT ON COLUMN public.scf_program_configurations.anchor_id IS 'Unique identifier for the anchor party';
COMMENT ON COLUMN public.scf_program_configurations.anchor_limit IS 'Credit limit for the anchor party';
COMMENT ON COLUMN public.scf_program_configurations.anchor_available_limit IS 'Available credit limit for the anchor party';
COMMENT ON COLUMN public.scf_program_configurations.borrower_selection IS 'Either Anchor Party or Counter Party based on product code';
COMMENT ON COLUMN public.scf_program_configurations.grace_days IS 'Number of days added to maturity date where interest is still charged';
COMMENT ON COLUMN public.scf_program_configurations.stale_period IS 'Period in days after which documents become stale';
COMMENT ON COLUMN public.scf_program_configurations.assignment_enabled IS 'Whether assignment of proceeds is enabled';
COMMENT ON COLUMN public.scf_program_configurations.assignment_percentage IS 'Percentage allowed for assignment if enabled';
COMMENT ON COLUMN public.scf_program_configurations.unaccepted_invoice_finance_enabled IS 'Whether unaccepted invoice financing is allowed';
COMMENT ON COLUMN public.scf_program_configurations.unaccepted_invoice_percentage IS 'Percentage allowed for unaccepted invoice finance';
COMMENT ON COLUMN public.scf_program_configurations.recourse_enabled IS 'Whether recourse is enabled';
COMMENT ON COLUMN public.scf_program_configurations.recourse_percentage IS 'Percentage for recourse if enabled';