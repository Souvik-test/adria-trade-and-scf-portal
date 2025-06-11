
-- Create enum types for user roles and products
CREATE TYPE user_role_type AS ENUM ('Maker', 'Checker', 'Viewer', 'All');

CREATE TYPE product_type AS ENUM (
  'Import LC',
  'Export LC', 
  'Import Bills',
  'Export Bills',
  'Outward BG/SBLC',
  'Inward BG/SBLC',
  'Shipping Guarantee',
  'Import Loan',
  'Export Loan'
);

-- Update user_profiles table to include corporate structure
ALTER TABLE user_profiles 
ADD COLUMN corporate_id TEXT DEFAULT 'TC001',
ADD COLUMN user_login_id TEXT UNIQUE,
ADD COLUMN role_type user_role_type DEFAULT 'Viewer',
ADD COLUMN product_linkage product_type[];

-- Create Purchase Orders table
CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  po_number TEXT NOT NULL,
  po_date DATE,
  vendor_supplier TEXT,
  expected_delivery_date DATE,
  shipping_address TEXT,
  billing_address TEXT,
  same_as_shipping BOOLEAN DEFAULT false,
  payment_terms TEXT,
  currency TEXT DEFAULT 'USD',
  terms_of_sale TEXT,
  subtotal DECIMAL(15,2) DEFAULT 0,
  total_tax DECIMAL(15,2) DEFAULT 0,
  shipping_cost DECIMAL(15,2) DEFAULT 0,
  grand_total DECIMAL(15,2) DEFAULT 0,
  bank_details TEXT,
  notes TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Proforma Invoices table
CREATE TABLE proforma_invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pi_number TEXT NOT NULL,
  pi_date DATE,
  valid_until_date DATE,
  buyer_name TEXT,
  buyer_id TEXT,
  shipping_address TEXT,
  billing_address TEXT,
  same_as_shipping BOOLEAN DEFAULT false,
  payment_terms TEXT,
  currency TEXT DEFAULT 'USD',
  terms_of_sale TEXT,
  subtotal DECIMAL(15,2) DEFAULT 0,
  total_tax DECIMAL(15,2) DEFAULT 0,
  shipping_cost DECIMAL(15,2) DEFAULT 0,
  grand_total DECIMAL(15,2) DEFAULT 0,
  bank_details TEXT,
  notes TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create line items table for PO/PI
CREATE TABLE popi_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,
  proforma_invoice_id UUID REFERENCES proforma_invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  discount DECIMAL(5,2) DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  line_total DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Invoices table
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_type TEXT NOT NULL CHECK (invoice_type IN ('invoice', 'credit-note', 'debit-note')),
  invoice_number TEXT NOT NULL,
  invoice_date DATE,
  due_date DATE,
  purchase_order_number TEXT,
  purchase_order_currency TEXT,
  purchase_order_amount DECIMAL(15,2),
  purchase_order_date DATE,
  customer_name TEXT,
  customer_address TEXT,
  customer_contact TEXT,
  currency TEXT DEFAULT 'USD',
  subtotal DECIMAL(15,2) DEFAULT 0,
  tax_amount DECIMAL(15,2) DEFAULT 0,
  discount_amount DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) DEFAULT 0,
  payment_terms TEXT,
  notes TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create invoice line items table
CREATE TABLE invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  tax_rate DECIMAL(5,2) DEFAULT 0,
  line_total DECIMAL(15,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE proforma_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE popi_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_line_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for purchase_orders
CREATE POLICY "Users can view their own purchase orders" ON purchase_orders
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own purchase orders" ON purchase_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own purchase orders" ON purchase_orders
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own purchase orders" ON purchase_orders
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for proforma_invoices
CREATE POLICY "Users can view their own proforma invoices" ON proforma_invoices
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own proforma invoices" ON proforma_invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own proforma invoices" ON proforma_invoices
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own proforma invoices" ON proforma_invoices
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for invoices
CREATE POLICY "Users can view their own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own invoices" ON invoices
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own invoices" ON invoices
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own invoices" ON invoices
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for line items (both POPI and invoice)
CREATE POLICY "Users can view line items for their documents" ON popi_line_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM purchase_orders po WHERE po.id = purchase_order_id AND po.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM proforma_invoices pi WHERE pi.id = proforma_invoice_id AND pi.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create line items for their documents" ON popi_line_items
  FOR INSERT WITH CHECK (
    (purchase_order_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM purchase_orders po WHERE po.id = purchase_order_id AND po.user_id = auth.uid()
    )) OR
    (proforma_invoice_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM proforma_invoices pi WHERE pi.id = proforma_invoice_id AND pi.user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can update line items for their documents" ON popi_line_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM purchase_orders po WHERE po.id = purchase_order_id AND po.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM proforma_invoices pi WHERE pi.id = proforma_invoice_id AND pi.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete line items for their documents" ON popi_line_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM purchase_orders po WHERE po.id = purchase_order_id AND po.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM proforma_invoices pi WHERE pi.id = proforma_invoice_id AND pi.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view invoice line items for their invoices" ON invoice_line_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM invoices i WHERE i.id = invoice_id AND i.user_id = auth.uid())
  );

CREATE POLICY "Users can create invoice line items for their invoices" ON invoice_line_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM invoices i WHERE i.id = invoice_id AND i.user_id = auth.uid())
  );

CREATE POLICY "Users can update invoice line items for their invoices" ON invoice_line_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM invoices i WHERE i.id = invoice_id AND i.user_id = auth.uid())
  );

CREATE POLICY "Users can delete invoice line items for their invoices" ON invoice_line_items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM invoices i WHERE i.id = invoice_id AND i.user_id = auth.uid())
  );

-- Update the handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    email, 
    full_name, 
    role, 
    department, 
    phone,
    corporate_id,
    user_login_id,
    role_type,
    product_linkage
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'LC_MAKER'),
    COALESCE(NEW.raw_user_meta_data->>'department', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'corporate_id', 'TC001'),
    COALESCE(NEW.raw_user_meta_data->>'user_login_id', ''),
    COALESCE((NEW.raw_user_meta_data->>'role_type')::user_role_type, 'Viewer'),
    COALESCE((NEW.raw_user_meta_data->>'product_linkage')::product_type[], ARRAY[]::product_type[])
  );
  RETURN NEW;
END;
$function$;
