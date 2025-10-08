-- Create SCF Program Configuration table
CREATE TABLE public.scf_program_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- General Details
  program_id TEXT NOT NULL UNIQUE,
  program_name TEXT NOT NULL,
  product_code TEXT NOT NULL,
  program_description TEXT,
  program_limit NUMERIC NOT NULL,
  available_limit NUMERIC NOT NULL,
  effective_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  program_currency TEXT NOT NULL DEFAULT 'USD',
  
  -- Party Details
  anchor_name TEXT NOT NULL,
  anchor_account TEXT,
  counter_parties JSONB DEFAULT '[]'::jsonb,
  
  -- Finance Parameters
  finance_tenor INTEGER,
  finance_tenor_unit TEXT DEFAULT 'days',
  margin_percentage NUMERIC DEFAULT 0,
  finance_percentage NUMERIC DEFAULT 100,
  
  -- Disbursement Parameters
  disbursement_mode TEXT,
  disbursement_account TEXT,
  disbursement_conditions TEXT,
  
  -- Repayment Parameters
  repayment_mode TEXT,
  repayment_account TEXT,
  appropriation_sequence JSONB DEFAULT '[]'::jsonb,
  
  -- Insurance Details
  insurance_required BOOLEAN DEFAULT false,
  insurance_policies JSONB DEFAULT '[]'::jsonb,
  
  -- Fee Catalogue
  fee_catalogue JSONB DEFAULT '[]'::jsonb,
  flat_fee_config JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scf_program_configurations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own program configurations"
  ON public.scf_program_configurations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own program configurations"
  ON public.scf_program_configurations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own program configurations"
  ON public.scf_program_configurations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own program configurations"
  ON public.scf_program_configurations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_scf_program_configurations_updated_at
  BEFORE UPDATE ON public.scf_program_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();