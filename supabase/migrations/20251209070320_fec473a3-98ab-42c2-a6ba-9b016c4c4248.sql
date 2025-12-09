-- Create state_master table
CREATE TABLE public.state_master (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  state_code_iso VARCHAR(10) NOT NULL UNIQUE,
  state_name VARCHAR(50) NOT NULL,
  country_code_iso2 VARCHAR(2) NOT NULL,
  status BOOLEAN NOT NULL DEFAULT true,
  user_id UUID NOT NULL,
  created_by VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_by VARCHAR(50),
  modified_at TIMESTAMP WITH TIME ZONE
);

-- Create city_master table
CREATE TABLE public.city_master (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_code VARCHAR(10) NOT NULL,
  city_name VARCHAR(50) NOT NULL,
  state_code_iso VARCHAR(10) NOT NULL,
  country_code_iso2 VARCHAR(2) NOT NULL,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  status BOOLEAN NOT NULL DEFAULT true,
  user_id UUID NOT NULL,
  created_by VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  modified_by VARCHAR(50),
  modified_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(city_code, state_code_iso)
);

-- Enable RLS on state_master
ALTER TABLE public.state_master ENABLE ROW LEVEL SECURITY;

-- RLS Policies for state_master
CREATE POLICY "Users can view all states" ON public.state_master
  FOR SELECT USING (true);

CREATE POLICY "Users can insert states" ON public.state_master
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update states" ON public.state_master
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete states" ON public.state_master
  FOR DELETE USING (true);

-- Enable RLS on city_master
ALTER TABLE public.city_master ENABLE ROW LEVEL SECURITY;

-- RLS Policies for city_master
CREATE POLICY "Users can view all cities" ON public.city_master
  FOR SELECT USING (true);

CREATE POLICY "Users can insert cities" ON public.city_master
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update cities" ON public.city_master
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete cities" ON public.city_master
  FOR DELETE USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_state_master_country ON public.state_master(country_code_iso2);
CREATE INDEX idx_state_master_name ON public.state_master(state_name);
CREATE INDEX idx_state_master_status ON public.state_master(status);

CREATE INDEX idx_city_master_state ON public.city_master(state_code_iso);
CREATE INDEX idx_city_master_country ON public.city_master(country_code_iso2);
CREATE INDEX idx_city_master_name ON public.city_master(city_name);
CREATE INDEX idx_city_master_status ON public.city_master(status);