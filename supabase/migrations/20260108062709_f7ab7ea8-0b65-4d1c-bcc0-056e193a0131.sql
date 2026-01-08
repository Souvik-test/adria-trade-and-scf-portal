-- Phase 1: Add is_conventional column to scf_product_definitions
ALTER TABLE scf_product_definitions 
ADD COLUMN IF NOT EXISTS is_conventional BOOLEAN DEFAULT false;

-- Phase 2A: Insert SCF entries into product_event_definitions (SAP and BAP with DIS/REP events)
INSERT INTO product_event_definitions (module_code, product_code, product_name, event_code, event_name)
VALUES 
  ('SCF', 'SAP', 'Supplier/Seller Anchored Product', 'DIS', 'Disbursement'),
  ('SCF', 'SAP', 'Supplier/Seller Anchored Product', 'REP', 'Repayment'),
  ('SCF', 'BAP', 'Buyer Anchored Product', 'DIS', 'Disbursement'),
  ('SCF', 'BAP', 'Buyer Anchored Product', 'REP', 'Repayment')
ON CONFLICT DO NOTHING;

-- Phase 2B: Insert 10 conventional SCF products into scf_product_definitions
INSERT INTO scf_product_definitions (
  user_id, product_code, product_name, anchor_role, product_centric, is_active, is_conventional
)
VALUES 
  -- Seller/Supplier Anchored Products
  ('00000000-0000-0000-0000-000000000000', 'RF', 'Receivable Finance', 'Seller/Supplier', 'Seller/Supplier Centric', true, true),
  ('00000000-0000-0000-0000-000000000000', 'DDF', 'Dealer/Distributor Finance', 'Seller/Supplier', 'Seller/Supplier Centric', true, true),
  ('00000000-0000-0000-0000-000000000000', 'ID', 'Invoice Discounting', 'Seller/Supplier', 'Seller/Supplier Centric', true, true),
  ('00000000-0000-0000-0000-000000000000', 'FAC', 'Factoring', 'Seller/Supplier', 'Seller/Supplier Centric', true, true),
  ('00000000-0000-0000-0000-000000000000', 'FOR', 'Forfaiting', 'Seller/Supplier', 'Seller/Supplier Centric', true, true),
  ('00000000-0000-0000-0000-000000000000', 'IF', 'Inventory Finance', 'Seller/Supplier', 'Seller/Supplier Centric', true, true),
  -- Buyer Anchored Products
  ('00000000-0000-0000-0000-000000000000', 'APF', 'Approved Payable Finance', 'Buyer', 'Buyer Centric', true, true),
  ('00000000-0000-0000-0000-000000000000', 'DD', 'Dynamic Discounting', 'Buyer', 'Buyer Centric', true, true),
  ('00000000-0000-0000-0000-000000000000', 'VF', 'Vendor Finance', 'Buyer', 'Buyer Centric', true, true),
  ('00000000-0000-0000-0000-000000000000', 'POF', 'Purchase Order Financing', 'Buyer', 'Buyer Centric', true, true)
ON CONFLICT DO NOTHING;

-- Phase 3: Update RLS policies for scf_product_definitions
DROP POLICY IF EXISTS "Users can view their own products" ON scf_product_definitions;
DROP POLICY IF EXISTS "Users can insert their own products" ON scf_product_definitions;
DROP POLICY IF EXISTS "Users can update their own products" ON scf_product_definitions;
DROP POLICY IF EXISTS "Users can delete their own products" ON scf_product_definitions;

-- Allow viewing all products (conventional + custom)
CREATE POLICY "Users can view all products" 
ON scf_product_definitions FOR SELECT 
TO authenticated 
USING (true);

-- Restrict insert/update/delete to non-conventional products owned by user
CREATE POLICY "Users can insert their own non-conventional products" 
ON scf_product_definitions FOR INSERT 
TO authenticated 
WITH CHECK (is_conventional = false AND user_id = auth.uid());

CREATE POLICY "Users can update their own non-conventional products" 
ON scf_product_definitions FOR UPDATE 
TO authenticated 
USING (is_conventional = false AND user_id = auth.uid());

CREATE POLICY "Users can delete their own non-conventional products" 
ON scf_product_definitions FOR DELETE 
TO authenticated 
USING (is_conventional = false AND user_id = auth.uid());