-- Add interest deduction method to program configuration
ALTER TABLE public.scf_program_configurations 
ADD COLUMN IF NOT EXISTS interest_deduction_method text DEFAULT 'proceeds' 
CHECK (interest_deduction_method IN ('proceeds', 'client_account'));

-- Add interest deduction method to finance disbursements
ALTER TABLE public.finance_disbursements 
ADD COLUMN IF NOT EXISTS interest_deduction_method text DEFAULT 'proceeds' 
CHECK (interest_deduction_method IN ('proceeds', 'client_account'));

-- Add interest debit account field
ALTER TABLE public.finance_disbursements 
ADD COLUMN IF NOT EXISTS interest_debit_account text;