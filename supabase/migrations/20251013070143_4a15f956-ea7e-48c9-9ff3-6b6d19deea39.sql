-- Create SCF Product Definition table
CREATE TABLE public.scf_product_definitions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_code TEXT NOT NULL UNIQUE,
  product_name TEXT NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('Invoice Financing', 'Receivables Financing', 'Payables Financing', 'Purchase Order Financing', 'Inventory Financing', 'Dynamic Discounting')),
  product_description TEXT,
  is_active BOOLEAN DEFAULT true,
  base_currency TEXT DEFAULT 'USD',
  allowed_currencies TEXT[] DEFAULT ARRAY['USD']::TEXT[],
  min_transaction_amount NUMERIC DEFAULT 0,
  max_transaction_amount NUMERIC,
  finance_percentage_min NUMERIC DEFAULT 0,
  finance_percentage_max NUMERIC DEFAULT 100,
  margin_percentage_min NUMERIC DEFAULT 0,
  margin_percentage_max NUMERIC DEFAULT 100,
  tenor_min_days INTEGER DEFAULT 0,
  tenor_max_days INTEGER DEFAULT 365,
  grace_period_days INTEGER DEFAULT 0,
  interest_calculation_method TEXT CHECK (interest_calculation_method IN ('Simple', 'Compound', 'Flat Rate', 'Reducing Balance')),
  interest_rate_type TEXT CHECK (interest_rate_type IN ('Fixed', 'Variable', 'Floating')),
  base_interest_rate NUMERIC DEFAULT 0,
  spread_rate NUMERIC DEFAULT 0,
  penalty_rate NUMERIC DEFAULT 0,
  prepayment_allowed BOOLEAN DEFAULT false,
  prepayment_penalty_percentage NUMERIC DEFAULT 0,
  partial_payment_allowed BOOLEAN DEFAULT false,
  recourse_type TEXT CHECK (recourse_type IN ('Full Recourse', 'Limited Recourse', 'Non-Recourse')),
  approval_workflow TEXT CHECK (approval_workflow IN ('Single Level', 'Two Level', 'Three Level', 'Automated')),
  requires_insurance BOOLEAN DEFAULT false,
  insurance_percentage NUMERIC DEFAULT 0,
  documents_required TEXT[] DEFAULT ARRAY[]::TEXT[],
  eligibility_criteria JSONB DEFAULT '{}'::JSONB,
  fee_structure JSONB DEFAULT '{}'::JSONB,
  terms_and_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scf_product_definitions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own SCF product definitions"
  ON public.scf_product_definitions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SCF product definitions"
  ON public.scf_product_definitions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SCF product definitions"
  ON public.scf_product_definitions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SCF product definitions"
  ON public.scf_product_definitions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add trigger for updated_at timestamp
CREATE TRIGGER update_scf_product_definitions_updated_at
  BEFORE UPDATE ON public.scf_product_definitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_scf_product_definitions_product_code ON public.scf_product_definitions(product_code);
CREATE INDEX idx_scf_product_definitions_user_id ON public.scf_product_definitions(user_id);
CREATE INDEX idx_scf_product_definitions_is_active ON public.scf_product_definitions(is_active);