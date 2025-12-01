-- Create table for product event master data (definitions available per module)
CREATE TABLE IF NOT EXISTS public.product_event_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_code TEXT NOT NULL,
  product_code TEXT NOT NULL,
  product_name TEXT NOT NULL,
  event_code TEXT NOT NULL,
  event_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(module_code, product_code, event_code)
);

-- Enable RLS
ALTER TABLE public.product_event_definitions ENABLE ROW LEVEL SECURITY;

-- RLS Policies - allow all users to read, only authenticated users to modify
CREATE POLICY "Anyone can view product event definitions"
  ON public.product_event_definitions
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert product event definitions"
  ON public.product_event_definitions
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update product event definitions"
  ON public.product_event_definitions
  FOR UPDATE
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete product event definitions"
  ON public.product_event_definitions
  FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Add trigger for updated_at
CREATE TRIGGER update_product_event_definitions_updated_at
  BEFORE UPDATE ON public.product_event_definitions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert TF module product event definitions
INSERT INTO public.product_event_definitions (module_code, product_code, product_name, event_code, event_name) VALUES
-- Import Letter of Credit
('TF', 'ILC', 'Import Letter of Credit', 'ISS', 'Issuance'),
('TF', 'ILC', 'Import Letter of Credit', 'AMD', 'Amendment'),
('TF', 'ILC', 'Import Letter of Credit', 'CAN', 'Cancellation'),
('TF', 'ILC', 'Import Letter of Credit', 'EXP', 'Expiry'),

-- Export Letter of Credit
('TF', 'ELC', 'Export Letter of Credit', 'ADV', 'Advise'),
('TF', 'ELC', 'Export Letter of Credit', 'CNF', 'Confirmation'),
('TF', 'ELC', 'Export Letter of Credit', 'RAC', 'Record Amendment Consent'),
('TF', 'ELC', 'Export Letter of Credit', 'TRF', 'Transfer'),
('TF', 'ELC', 'Export Letter of Credit', 'ASN', 'Assignment'),
('TF', 'ELC', 'Export Letter of Credit', 'REV', 'Review Pre-Advised LC'),

-- Outward Standby Letter of Credit
('TF', 'OSB', 'Outward Standby Letter of Credit', 'ISS', 'Issuance'),
('TF', 'OSB', 'Outward Standby Letter of Credit', 'AMD', 'Amendment'),
('TF', 'OSB', 'Outward Standby Letter of Credit', 'CLM', 'Claim'),
('TF', 'OSB', 'Outward Standby Letter of Credit', 'CNF', 'Confirmation'),
('TF', 'OSB', 'Outward Standby Letter of Credit', 'CAN', 'Cancellation'),
('TF', 'OSB', 'Outward Standby Letter of Credit', 'CLS', 'Close'),

-- Inward Standby Letter of Credit
('TF', 'ISB', 'Inward Standby Letter of Credit', 'ADV', 'Advise'),
('TF', 'ISB', 'Inward Standby Letter of Credit', 'AMD', 'Amendment'),
('TF', 'ISB', 'Inward Standby Letter of Credit', 'RAC', 'Record Amendment Consent'),
('TF', 'ISB', 'Inward Standby Letter of Credit', 'CLM', 'Claim'),
('TF', 'ISB', 'Inward Standby Letter of Credit', 'CAN', 'Cancellation'),

-- Inward Bank Guarantee
('TF', 'IBG', 'Inward Bank Guarantee', 'ADV', 'Advise'),
('TF', 'IBG', 'Inward Bank Guarantee', 'AMD', 'Amendment'),
('TF', 'IBG', 'Inward Bank Guarantee', 'RAC', 'Record Amendment Consent'),
('TF', 'IBG', 'Inward Bank Guarantee', 'CLM', 'Claim'),
('TF', 'IBG', 'Inward Bank Guarantee', 'CAN', 'Cancellation'),

-- Outward Bank Guarantee
('TF', 'OBG', 'Outward Bank Guarantee', 'ISS', 'Issuance'),
('TF', 'OBG', 'Outward Bank Guarantee', 'AMD', 'Amendment'),
('TF', 'OBG', 'Outward Bank Guarantee', 'CLM', 'Claim'),
('TF', 'OBG', 'Outward Bank Guarantee', 'CNF', 'Confirmation'),
('TF', 'OBG', 'Outward Bank Guarantee', 'CAN', 'Cancellation'),
('TF', 'OBG', 'Outward Bank Guarantee', 'CLS', 'Close'),

-- Bills Under Import LC
('TF', 'ILB', 'Bills Under Import LC', 'BLG', 'Bill Lodgement'),
('TF', 'ILB', 'Bills Under Import LC', 'ACC/REF', 'Acceptance / Refusal'),
('TF', 'ILB', 'Bills Under Import LC', 'SET', 'Process Bill Settlement'),
('TF', 'ILB', 'Bills Under Import LC', 'UPD', 'Update Bill'),

-- Bills Under LC (Export Bills / Negotiation Bills)
('TF', 'ELB', 'Bills Under LC (Export Bills / Negotiation Bills)', 'BLG', 'Lodgement'),
('TF', 'ELB', 'Bills Under LC (Export Bills / Negotiation Bills)', 'RES', 'Resolve Discrepancies'),
('TF', 'ELB', 'Bills Under LC (Export Bills / Negotiation Bills)', 'SET', 'Negotiation / Purchase / Discounting'),

-- Inward Documentary Collection Bills
('TF', 'IDC', 'Inward Documentary Collection Bills', 'BLR', 'Document/Bill Receipt'),
('TF', 'IDC', 'Inward Documentary Collection Bills', 'ACC/REF', 'Acceptance/Refusal'),
('TF', 'IDC', 'Inward Documentary Collection Bills', 'SET', 'Process Settlement'),

-- Outward Documentary Collection Bills
('TF', 'ODC', 'Outward Documentary Collection Bills', 'BLG', 'Bill Lodgement'),
('TF', 'ODC', 'Outward Documentary Collection Bills', 'UPD', 'Update Bill'),
('TF', 'ODC', 'Outward Documentary Collection Bills', 'SET', 'Process Settlement'),

-- Trade Loan
('TF', 'TRL', 'Trade Loan', 'CRE', 'Create Loan'),
('TF', 'TRL', 'Trade Loan', 'UPD', 'Update Loan'),
('TF', 'TRL', 'Trade Loan', 'SET', 'Repayment'),
('TF', 'TRL', 'Trade Loan', 'TRF', 'Transfer Loan'),
('TF', 'TRL', 'Trade Loan', 'WRF', 'Write-off'),

-- Shipping Guarantee
('TF', 'SHG', 'Shipping Guarantee', 'ISS', 'Issuance'),
('TF', 'SHG', 'Shipping Guarantee', 'AMD', 'Amendment'),
('TF', 'SHG', 'Shipping Guarantee', 'CLM', 'Claim / Discharge'),
('TF', 'SHG', 'Shipping Guarantee', 'CAN', 'Cancellation'),
('TF', 'SHG', 'Shipping Guarantee', 'LNK', 'Link/Delink'),

-- Remittance
('TF', 'REM', 'Remittance', 'PIO', 'Process Inward/Outward Remittance'),
('TF', 'REM', 'Remittance', 'RET', 'Return / Reject');