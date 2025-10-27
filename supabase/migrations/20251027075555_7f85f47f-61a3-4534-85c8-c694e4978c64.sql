-- Issue 1: Add product_centric column to scf_product_definitions
ALTER TABLE scf_product_definitions 
ADD COLUMN product_centric TEXT;

-- Issue 2: Update RLS policies for scf_invoices to show all transactions
DROP POLICY IF EXISTS "Users can view their own SCF invoices" ON scf_invoices;

CREATE POLICY "Users can view all SCF invoices"
ON scf_invoices
FOR SELECT
TO authenticated
USING (true);

-- Update RLS policies for invoice_disbursements
DROP POLICY IF EXISTS "Users can view disbursements" ON invoice_disbursements;

CREATE POLICY "Users can view all disbursements"
ON invoice_disbursements
FOR SELECT
TO authenticated
USING (true);

-- Update RLS policies for invoice_repayments
DROP POLICY IF EXISTS "Users can view their own repayments" ON invoice_repayments;

CREATE POLICY "Users can view all repayments"
ON invoice_repayments
FOR SELECT
TO authenticated
USING (true);