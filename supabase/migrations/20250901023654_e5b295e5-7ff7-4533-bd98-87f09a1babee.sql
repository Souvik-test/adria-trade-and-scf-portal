-- Fix RLS issue for outward_documentary_collection_bills
ALTER TABLE public.outward_documentary_collection_bills ENABLE ROW LEVEL SECURITY;

-- Create policies for outward_documentary_collection_bills
CREATE POLICY "Users can view their own outward documentary collection bills" 
ON public.outward_documentary_collection_bills 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own outward documentary collection bills" 
ON public.outward_documentary_collection_bills 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outward documentary collection bills" 
ON public.outward_documentary_collection_bills 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outward documentary collection bills" 
ON public.outward_documentary_collection_bills 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create inward_dc_bill_acceptance_refusal table (recreate with correct structure)
CREATE TABLE public.inward_dc_bill_acceptance_refusal (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  bill_reference text NOT NULL,
  collection_reference text,
  document_value numeric,
  currency text DEFAULT 'USD',
  maturity_date date,
  principal_name text,
  principal_address text,
  beneficiary_name text,
  beneficiary_address text,
  collecting_bank text,
  remitting_bank text,
  payment_terms text,
  decision text CHECK (decision IN ('accept', 'refuse')),
  remarks text,
  internal_notes text,
  documents jsonb DEFAULT '[]'::jsonb,
  discrepancies jsonb DEFAULT '[]'::jsonb,
  status text DEFAULT 'submitted',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inward_dc_bill_acceptance_refusal ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own bill acceptance/refusal records" 
ON public.inward_dc_bill_acceptance_refusal 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bill acceptance/refusal records" 
ON public.inward_dc_bill_acceptance_refusal 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bill acceptance/refusal records" 
ON public.inward_dc_bill_acceptance_refusal 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Insert sample data
INSERT INTO public.inward_dc_bill_acceptance_refusal (user_id, bill_reference, collection_reference, document_value, currency, maturity_date, principal_name, principal_address, beneficiary_name, beneficiary_address, collecting_bank, remitting_bank, payment_terms, decision, status, documents, discrepancies) VALUES
('00000000-0000-0000-0000-000000000001', 'IBR-2024-001', 'DC240315001', 150000.00, 'USD', '2024-03-15', 'ABC Trading Corporation', '123 Business Street, New York, NY 10001, USA', 'XYZ International Ltd', '456 Commerce Road, London, EC1A 1BB, UK', 'Standard Chartered Bank', 'HSBC Bank USA', 'At sight', 'accept', 'submitted', 
'[{"id": "1", "name": "Commercial Invoice", "type": "Invoice", "uploadDate": "2024-01-15"}, {"id": "2", "name": "Bill of Lading", "type": "Transport", "uploadDate": "2024-01-15"}]'::jsonb,
'[{"id": "1", "type": "Document", "description": "Invoice amount mismatch", "severity": "high"}]'::jsonb),
('00000000-0000-0000-0000-000000000001', 'DC240315001', 'DC240316001', 75000.00, 'EUR', '2024-04-20', 'Global Exports Ltd', '789 Trade Center, Frankfurt, Germany', 'Regional Imports Inc', '321 Harbor View, Singapore', 'Deutsche Bank', 'DBS Bank', 'Days after sight', 'refuse', 'submitted',
'[{"id": "3", "name": "Packing List", "type": "Commercial", "uploadDate": "2024-01-16"}]'::jsonb,
'[{"id": "2", "type": "Date", "description": "Late presentation", "severity": "medium"}]'::jsonb),
('00000000-0000-0000-0000-000000000001', 'BILL-REF-12345', 'DC240317001', 200000.00, 'GBP', '2024-05-10', 'UK Manufacturing Co', '456 Industrial Park, Manchester, UK', 'American Distributors LLC', '123 Commerce Plaza, Chicago, IL, USA', 'Barclays Bank', 'JPMorgan Chase', 'At sight', 'accept', 'submitted',
'[{"id": "4", "name": "Certificate of Origin", "type": "Commercial", "uploadDate": "2024-01-17"}]'::jsonb,
'[]'::jsonb),
('00000000-0000-0000-0000-000000000001', 'IDC-240115-001', 'DC240318001', 120000.00, 'USD', '2024-06-30', 'Asian Suppliers Group', '88 Export Avenue, Hong Kong', 'European Buyers Ltd', '99 Import Street, Amsterdam, Netherlands', 'HSBC Hong Kong', 'ING Bank', '30 days after sight', 'refuse', 'submitted',
'[{"id": "5", "name": "Insurance Certificate", "type": "Insurance", "uploadDate": "2024-01-18"}]'::jsonb,
'[{"id": "3", "type": "Amount", "description": "Currency mismatch", "severity": "high"}]'::jsonb);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_inward_dc_bill_acceptance_refusal_updated_at
  BEFORE UPDATE ON public.inward_dc_bill_acceptance_refusal
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();