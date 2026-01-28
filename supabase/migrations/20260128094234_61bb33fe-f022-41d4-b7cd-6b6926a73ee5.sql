-- Add interest_treatment column to scf_program_configurations
ALTER TABLE public.scf_program_configurations 
ADD COLUMN IF NOT EXISTS interest_treatment text DEFAULT 'arrears' 
CHECK (interest_treatment IN ('arrears', 'advance'));

-- Add comment for documentation
COMMENT ON COLUMN public.scf_program_configurations.interest_treatment IS 'Interest Treatment: arrears = Interest in Arrears (not deducted from finance), advance = Interest in Advance (deducted from proceeds)';

-- Add interest_treatment column to finance_disbursements
ALTER TABLE public.finance_disbursements 
ADD COLUMN IF NOT EXISTS interest_treatment text DEFAULT 'arrears' 
CHECK (interest_treatment IN ('arrears', 'advance'));

-- Add proceeds_amount column to track net amount after interest deduction
ALTER TABLE public.finance_disbursements 
ADD COLUMN IF NOT EXISTS proceeds_amount numeric;

-- Add comment for documentation
COMMENT ON COLUMN public.finance_disbursements.interest_treatment IS 'Interest Treatment: arrears = Interest in Arrears, advance = Interest in Advance (interest deducted from proceeds)';