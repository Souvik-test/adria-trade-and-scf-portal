
-- Create table for storing inward BG amendment consent records
CREATE TABLE public.inward_bg_amendment_consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  guarantee_reference TEXT NOT NULL,
  amendment_number TEXT NOT NULL,
  consent_action TEXT NOT NULL CHECK (consent_action IN ('accept', 'refuse')),
  individual_consents JSONB NOT NULL DEFAULT '{}',
  rejection_reason TEXT,
  applicant_name TEXT,
  issuing_bank TEXT,
  guarantee_amount TEXT,
  currency TEXT,
  issue_date DATE,
  expiry_date DATE,
  beneficiary_name TEXT,
  status TEXT NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.inward_bg_amendment_consents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own amendment consents" 
  ON public.inward_bg_amendment_consents 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own amendment consents" 
  ON public.inward_bg_amendment_consents 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own amendment consents" 
  ON public.inward_bg_amendment_consents 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_inward_bg_amendment_consents_updated_at
  BEFORE UPDATE ON public.inward_bg_amendment_consents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for performance
CREATE INDEX idx_inward_bg_amendment_consents_user_id ON public.inward_bg_amendment_consents(user_id);
CREATE INDEX idx_inward_bg_amendment_consents_guarantee_ref ON public.inward_bg_amendment_consents(guarantee_reference);
