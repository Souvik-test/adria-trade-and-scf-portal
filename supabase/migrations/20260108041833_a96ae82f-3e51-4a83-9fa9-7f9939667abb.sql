-- Fix Issue 2: Update null initiating_channel values in remittance_transactions
UPDATE remittance_transactions 
SET 
  initiating_channel = 'Portal',
  business_application = 'Adria TSCF Client'
WHERE initiating_channel IS NULL;

-- Fix Issue 2: Update null initiating_channel values in transactions table
UPDATE transactions 
SET 
  initiating_channel = 'Portal',
  business_application = 'Adria TSCF Client'
WHERE product_type = 'Remittance' AND initiating_channel IS NULL;

-- Fix Issue 3: Update RemittanceStandardProcess template to support ClientPortal trigger type
UPDATE workflow_templates 
SET trigger_types = ARRAY['Manual', 'ClientPortal']
WHERE product_code = 'REM' AND event_code = 'PIO' AND template_name = 'RemittanceStandardProcess';