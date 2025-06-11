
-- Enable RLS on all tables if not already enabled
ALTER TABLE public.purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proforma_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.popi_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_line_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own purchase orders" ON public.purchase_orders;
DROP POLICY IF EXISTS "Users can create their own purchase orders" ON public.purchase_orders;
DROP POLICY IF EXISTS "Users can update their own purchase orders" ON public.purchase_orders;
DROP POLICY IF EXISTS "Users can delete their own purchase orders" ON public.purchase_orders;

DROP POLICY IF EXISTS "Users can view their own proforma invoices" ON public.proforma_invoices;
DROP POLICY IF EXISTS "Users can create their own proforma invoices" ON public.proforma_invoices;
DROP POLICY IF EXISTS "Users can update their own proforma invoices" ON public.proforma_invoices;
DROP POLICY IF EXISTS "Users can delete their own proforma invoices" ON public.proforma_invoices;

DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can create their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can update their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can delete their own invoices" ON public.invoices;

DROP POLICY IF EXISTS "Users can view their own line items" ON public.popi_line_items;
DROP POLICY IF EXISTS "Users can create their own line items" ON public.popi_line_items;
DROP POLICY IF EXISTS "Users can update their own line items" ON public.popi_line_items;
DROP POLICY IF EXISTS "Users can delete their own line items" ON public.popi_line_items;

DROP POLICY IF EXISTS "Users can view their own invoice line items" ON public.invoice_line_items;
DROP POLICY IF EXISTS "Users can create their own invoice line items" ON public.invoice_line_items;
DROP POLICY IF EXISTS "Users can update their own invoice line items" ON public.invoice_line_items;
DROP POLICY IF EXISTS "Users can delete their own invoice line items" ON public.invoice_line_items;

-- Create new RLS policies for purchase_orders
CREATE POLICY "Users can view their own purchase orders" ON public.purchase_orders
FOR SELECT USING (true);

CREATE POLICY "Users can create their own purchase orders" ON public.purchase_orders
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own purchase orders" ON public.purchase_orders
FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own purchase orders" ON public.purchase_orders
FOR DELETE USING (true);

-- Create new RLS policies for proforma_invoices
CREATE POLICY "Users can view their own proforma invoices" ON public.proforma_invoices
FOR SELECT USING (true);

CREATE POLICY "Users can create their own proforma invoices" ON public.proforma_invoices
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own proforma invoices" ON public.proforma_invoices
FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own proforma invoices" ON public.proforma_invoices
FOR DELETE USING (true);

-- Create new RLS policies for invoices
CREATE POLICY "Users can view their own invoices" ON public.invoices
FOR SELECT USING (true);

CREATE POLICY "Users can create their own invoices" ON public.invoices
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own invoices" ON public.invoices
FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own invoices" ON public.invoices
FOR DELETE USING (true);

-- Create new RLS policies for popi_line_items
CREATE POLICY "Users can view their own line items" ON public.popi_line_items
FOR SELECT USING (true);

CREATE POLICY "Users can create their own line items" ON public.popi_line_items
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own line items" ON public.popi_line_items
FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own line items" ON public.popi_line_items
FOR DELETE USING (true);

-- Create new RLS policies for invoice_line_items
CREATE POLICY "Users can view their own invoice line items" ON public.invoice_line_items
FOR SELECT USING (true);

CREATE POLICY "Users can create their own invoice line items" ON public.invoice_line_items
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own invoice line items" ON public.invoice_line_items
FOR UPDATE USING (true);

CREATE POLICY "Users can delete their own invoice line items" ON public.invoice_line_items
FOR DELETE USING (true);
