
-- 1. Add a new column 'process_type' to the transactions table
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS process_type TEXT;

-- 2. Update existing rows using the current product_type and (if possible) invoice_type logic

-- Export LC (was 'LC Amendment' or entries related to amendments)
UPDATE public.transactions
SET product_type = 'Export LC',
    process_type = 'Record Amendment Consent'
WHERE product_type = 'LC Amendment';

-- Import LC requests (example mappings)
UPDATE public.transactions
SET process_type = 'Request Issuance'
WHERE product_type = 'Import LC'
  AND (process_type IS NULL OR process_type = '');

-- PO/PI transactions
UPDATE public.transactions
SET process_type = 'Create'
WHERE product_type IN ('PO', 'PI')
  AND (process_type IS NULL OR process_type = '');

-- Invoice, Credit Note, Debit Note type processing
-- Set defaults to "Create" for now; code will cover further logic
UPDATE public.transactions
SET process_type = 'Create'
WHERE product_type IN ('Invoice', 'Credit Note', 'Debit Note')
  AND (process_type IS NULL OR process_type = '');

-- Ensure all new transactions require process_type
-- (Optionally, set a NOT NULL constraint if desired after migration)

-- Add index for process_type for faster queries/filtering
CREATE INDEX IF NOT EXISTS idx_transactions_process_type
ON public.transactions(process_type);

