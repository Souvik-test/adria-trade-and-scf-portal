-- Fix REM-2026-000013: Set correct originating channel to 'Bank' (created from Process Orchestrator)
UPDATE remittance_transactions 
SET initiating_channel = 'Bank', 
    business_application = 'Adria Process Orchestrator'
WHERE transaction_ref = 'REM-2026-000013';

UPDATE transactions 
SET initiating_channel = 'Bank',
    business_application = 'Adria Process Orchestrator'
WHERE transaction_ref = 'REM-2026-000013';