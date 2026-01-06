-- Create Static UI Registry table for Module, Product, Event pane mapping
CREATE TABLE IF NOT EXISTS static_ui_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_code TEXT NOT NULL,           -- 'TF', 'SCF', 'CL', 'CM'
  module_name TEXT NOT NULL,           -- 'Trade Finance', 'Supply Chain Finance'
  product_code TEXT NOT NULL,          -- 'ILC', 'ELC', 'REM', 'OBG', etc.
  product_name TEXT NOT NULL,          -- 'Import Letter of Credit', 'Remittance'
  event_code TEXT,                     -- 'ISS', 'AMD', 'PIO' (nullable for product-level)
  event_name TEXT,                     -- 'Issuance', 'Amendment'
  pane_code TEXT NOT NULL,             -- 'BASIC_LC_INFO', 'PAYMENT_HEADER'
  pane_name TEXT NOT NULL,             -- 'Basic LC Information', 'Payment Header'
  component_path TEXT NOT NULL,        -- 'import-lc/BasicLCInformationPane'
  pane_order INTEGER DEFAULT 0,        -- Display order within stage
  is_active BOOLEAN DEFAULT true,
  applicable_stages TEXT[],            -- ['Data Entry', 'Approval', 'Authorization']
  applicable_actor_types TEXT[],       -- ['Maker', 'Checker', 'Authorization']
  read_only_for_stages TEXT[],         -- ['Approval', 'Authorization']
  user_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_code, product_code, event_code, pane_code)
);

-- Create index for efficient lookups
CREATE INDEX idx_static_ui_registry_lookup 
ON static_ui_registry(module_code, product_code, event_code, is_active);

-- Enable RLS
ALTER TABLE static_ui_registry ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow all authenticated users to read
CREATE POLICY "Allow read for all users"
ON static_ui_registry FOR SELECT
USING (true);

-- Allow insert/update for authenticated users
CREATE POLICY "Allow insert for authenticated users"
ON static_ui_registry FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
ON static_ui_registry FOR UPDATE
USING (true);

-- Seed data for ILC panes
INSERT INTO static_ui_registry (module_code, module_name, product_code, product_name, event_code, event_name, pane_code, pane_name, component_path, pane_order, applicable_stages, applicable_actor_types, read_only_for_stages, user_id)
VALUES 
('TF', 'Trade Finance', 'ILC', 'Import Letter of Credit', 'ISS', 'Issuance', 'BASIC_LC_INFO', 'Basic LC Information', 'import-lc/BasicLCInformationPane', 1, ARRAY['Data Entry', 'Approval', 'Authorization'], ARRAY['Maker', 'Checker', 'Authorization'], ARRAY['Approval', 'Authorization'], '00000000-0000-0000-0000-000000000000'),
('TF', 'Trade Finance', 'ILC', 'Import Letter of Credit', 'ISS', 'Issuance', 'PARTY_DETAILS', 'Party Details', 'import-lc/PartyDetailsPane', 2, ARRAY['Data Entry', 'Approval', 'Authorization'], ARRAY['Maker', 'Checker', 'Authorization'], ARRAY['Approval', 'Authorization'], '00000000-0000-0000-0000-000000000000'),
('TF', 'Trade Finance', 'ILC', 'Import Letter of Credit', 'ISS', 'Issuance', 'LC_AMOUNT', 'LC Amount', 'import-lc/LCAmountPane', 3, ARRAY['Data Entry', 'Approval', 'Authorization'], ARRAY['Maker', 'Checker', 'Authorization'], ARRAY['Approval', 'Authorization'], '00000000-0000-0000-0000-000000000000'),
('TF', 'Trade Finance', 'ILC', 'Import Letter of Credit', 'ISS', 'Issuance', 'SHIPMENT_DETAILS', 'Shipment Details', 'import-lc/ShipmentDetailsPane', 4, ARRAY['Data Entry', 'Approval', 'Authorization'], ARRAY['Maker', 'Checker', 'Authorization'], ARRAY['Approval', 'Authorization'], '00000000-0000-0000-0000-000000000000'),
('TF', 'Trade Finance', 'ILC', 'Import Letter of Credit', 'ISS', 'Issuance', 'DOCUMENTS', 'Documents', 'import-lc/DocumentsPane', 5, ARRAY['Data Entry', 'Approval', 'Authorization'], ARRAY['Maker', 'Checker', 'Authorization'], ARRAY['Approval', 'Authorization'], '00000000-0000-0000-0000-000000000000'),
('TF', 'Trade Finance', 'ILC', 'Import Letter of Credit', 'ISS', 'Issuance', 'ADDITIONAL_CONDITIONS', 'Additional Conditions', 'import-lc/AdditionalConditionsPane', 6, ARRAY['Data Entry', 'Approval', 'Authorization'], ARRAY['Maker', 'Checker', 'Authorization'], ARRAY['Approval', 'Authorization'], '00000000-0000-0000-0000-000000000000'),
('TF', 'Trade Finance', 'ILC', 'Import Letter of Credit', 'ISS', 'Issuance', 'ACCOUNTING_ENTRIES', 'Accounting Entries', 'import-lc/AccountingEntriesPane', 7, ARRAY['Data Entry', 'Approval', 'Authorization'], ARRAY['Maker', 'Checker', 'Authorization'], ARRAY['Approval', 'Authorization'], '00000000-0000-0000-0000-000000000000'),
('TF', 'Trade Finance', 'ILC', 'Import Letter of Credit', 'ISS', 'Issuance', 'RELEASE_DOCUMENTS', 'Release Documents', 'import-lc/ReleaseDocumentsPane', 8, ARRAY['Data Entry', 'Approval', 'Authorization'], ARRAY['Maker', 'Checker', 'Authorization'], ARRAY['Approval', 'Authorization'], '00000000-0000-0000-0000-000000000000'),

-- Seed data for REM panes
('TF', 'Trade Finance', 'REM', 'Remittance', 'PIO', 'Process Inward/Outward', 'PAYMENT_HEADER', 'Payment Header', 'remittance/panes/PaymentHeaderPane', 1, ARRAY['Data Entry', 'Approval'], ARRAY['Maker', 'Checker'], ARRAY['Approval'], '00000000-0000-0000-0000-000000000000'),
('TF', 'Trade Finance', 'REM', 'Remittance', 'PIO', 'Process Inward/Outward', 'ORDERING_CUSTOMER', 'Ordering Customer', 'remittance/panes/OrderingCustomerPane', 2, ARRAY['Data Entry', 'Approval'], ARRAY['Maker', 'Checker'], ARRAY['Approval'], '00000000-0000-0000-0000-000000000000'),
('TF', 'Trade Finance', 'REM', 'Remittance', 'PIO', 'Process Inward/Outward', 'BENEFICIARY_CUSTOMER', 'Beneficiary Customer', 'remittance/panes/BeneficiaryCustomerPane', 3, ARRAY['Data Entry', 'Approval'], ARRAY['Maker', 'Checker'], ARRAY['Approval'], '00000000-0000-0000-0000-000000000000'),
('TF', 'Trade Finance', 'REM', 'Remittance', 'PIO', 'Process Inward/Outward', 'AMOUNT_CHARGES', 'Amount & Charges', 'remittance/panes/AmountChargesPane', 4, ARRAY['Data Entry', 'Approval'], ARRAY['Maker', 'Checker'], ARRAY['Approval'], '00000000-0000-0000-0000-000000000000'),
('TF', 'Trade Finance', 'REM', 'Remittance', 'PIO', 'Process Inward/Outward', 'ROUTING_SETTLEMENT', 'Routing & Settlement', 'remittance/panes/RoutingSettlementPane', 5, ARRAY['Data Entry', 'Approval'], ARRAY['Maker', 'Checker'], ARRAY['Approval'], '00000000-0000-0000-0000-000000000000'),
('TF', 'Trade Finance', 'REM', 'Remittance', 'PIO', 'Process Inward/Outward', 'REGULATORY_COMPLIANCE', 'Regulatory & Compliance', 'remittance/panes/RegulatoryCompliancePane', 6, ARRAY['Data Entry', 'Approval'], ARRAY['Maker', 'Checker'], ARRAY['Approval'], '00000000-0000-0000-0000-000000000000'),
('TF', 'Trade Finance', 'REM', 'Remittance', 'PIO', 'Process Inward/Outward', 'REMITTANCE_INFO', 'Remittance Information', 'remittance/panes/RemittanceInfoPane', 7, ARRAY['Data Entry', 'Approval'], ARRAY['Maker', 'Checker'], ARRAY['Approval'], '00000000-0000-0000-0000-000000000000'),
('TF', 'Trade Finance', 'REM', 'Remittance', 'PIO', 'Process Inward/Outward', 'ACCOUNTING_ENTRIES', 'Accounting Entries', 'remittance/panes/RemittanceAccountingEntriesPane', 8, ARRAY['Data Entry', 'Approval'], ARRAY['Maker', 'Checker'], ARRAY['Approval'], '00000000-0000-0000-0000-000000000000'),
('TF', 'Trade Finance', 'REM', 'Remittance', 'PIO', 'Process Inward/Outward', 'RELEASE_DOCUMENTS', 'Release Documents', 'remittance/panes/RemittanceReleaseDocumentsPane', 9, ARRAY['Data Entry', 'Approval'], ARRAY['Maker', 'Checker'], ARRAY['Approval'], '00000000-0000-0000-0000-000000000000');

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_static_ui_registry_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_static_ui_registry_updated_at
  BEFORE UPDATE ON static_ui_registry
  FOR EACH ROW
  EXECUTE FUNCTION update_static_ui_registry_updated_at();