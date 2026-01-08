-- Fix Issue 1: Update existing "Pending Approval" status to workflow-compatible format
UPDATE remittance_transactions 
SET status = 'Data Entry Completed-' || COALESCE(initiating_channel, 'Portal')
WHERE status = 'Pending Approval';

UPDATE interbank_settlements 
SET status = 'Data Entry Completed-' || COALESCE(initiating_channel, 'Portal')
WHERE status = 'Pending Approval';

-- Update existing "Approved" status to workflow-compatible format
UPDATE remittance_transactions 
SET status = 'Approval Completed-' || COALESCE(initiating_channel, 'Portal')
WHERE status = 'Approved';

UPDATE interbank_settlements 
SET status = 'Approval Completed-' || COALESCE(initiating_channel, 'Portal')
WHERE status = 'Approved';

-- Also update the transactions table for consistency
UPDATE transactions 
SET status = 'Data Entry Completed-' || COALESCE(initiating_channel, 'Portal')
WHERE product_type = 'Remittance' AND status = 'Pending Approval';

UPDATE transactions 
SET status = 'Approval Completed-' || COALESCE(initiating_channel, 'Portal')
WHERE product_type = 'Remittance' AND status = 'Approved';