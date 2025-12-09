-- Create Country Master table for Foundational Data Library
CREATE TABLE public.country_master (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code_iso2 VARCHAR(2) NOT NULL UNIQUE,
  country_code_iso3 VARCHAR(3) NOT NULL,
  numeric_code VARCHAR(3),
  country_name VARCHAR(52) NOT NULL,
  region VARCHAR(30),
  sub_region VARCHAR(30),
  phone_code VARCHAR(5),
  status BOOLEAN NOT NULL DEFAULT true,
  user_id UUID NOT NULL,
  created_by VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_by VARCHAR(50),
  modified_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.country_master ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all countries"
ON public.country_master
FOR SELECT
USING (true);

CREATE POLICY "Users can insert countries"
ON public.country_master
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update countries"
ON public.country_master
FOR UPDATE
USING (true);

CREATE POLICY "Users can delete countries"
ON public.country_master
FOR DELETE
USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_country_master_modified_at
BEFORE UPDATE ON public.country_master
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster searches
CREATE INDEX idx_country_master_name ON public.country_master(country_name);
CREATE INDEX idx_country_master_iso2 ON public.country_master(country_code_iso2);
CREATE INDEX idx_country_master_status ON public.country_master(status);