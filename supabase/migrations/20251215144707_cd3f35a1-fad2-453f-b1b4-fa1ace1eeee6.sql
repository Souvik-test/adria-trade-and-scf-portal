-- Update the existing transaction that was created with wrong status
UPDATE transactions 
SET status = 'Submitted', initiating_channel = 'Bank'
WHERE transaction_ref = 'ILC-1765809134574-W0JZTM';