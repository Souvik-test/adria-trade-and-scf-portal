-- Fix critical security vulnerability: Update RLS policies to restrict access to user-owned records only

-- Drop existing overly permissive policies for invoices table
DROP POLICY IF EXISTS "Users can create their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can delete their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can update their own invoices" ON public.invoices;
DROP POLICY IF EXISTS "Users can view their own invoices" ON public.invoices;

-- Create secure RLS policies for invoices table
CREATE POLICY "Users can create their own invoices" 
ON public.invoices 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own invoices" 
ON public.invoices 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own invoices" 
ON public.invoices 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own invoices" 
ON public.invoices 
FOR DELETE 
USING (auth.uid() = user_id);

-- Drop existing overly permissive policies for purchase_orders table
DROP POLICY IF EXISTS "Users can create their own purchase orders" ON public.purchase_orders;
DROP POLICY IF EXISTS "Users can delete their own purchase orders" ON public.purchase_orders;
DROP POLICY IF EXISTS "Users can update their own purchase orders" ON public.purchase_orders;
DROP POLICY IF EXISTS "Users can view their own purchase orders" ON public.purchase_orders;

-- Create secure RLS policies for purchase_orders table
CREATE POLICY "Users can create their own purchase orders" 
ON public.purchase_orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own purchase orders" 
ON public.purchase_orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own purchase orders" 
ON public.purchase_orders 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own purchase orders" 
ON public.purchase_orders 
FOR DELETE 
USING (auth.uid() = user_id);

-- Drop existing overly permissive policies for proforma_invoices table
DROP POLICY IF EXISTS "Users can create their own proforma invoices" ON public.proforma_invoices;
DROP POLICY IF EXISTS "Users can delete their own proforma invoices" ON public.proforma_invoices;
DROP POLICY IF EXISTS "Users can update their own proforma invoices" ON public.proforma_invoices;
DROP POLICY IF EXISTS "Users can view their own proforma invoices" ON public.proforma_invoices;

-- Create secure RLS policies for proforma_invoices table
CREATE POLICY "Users can create their own proforma invoices" 
ON public.proforma_invoices 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own proforma invoices" 
ON public.proforma_invoices 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own proforma invoices" 
ON public.proforma_invoices 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own proforma invoices" 
ON public.proforma_invoices 
FOR DELETE 
USING (auth.uid() = user_id);

-- Drop existing overly permissive policies for transactions table
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;

-- Create secure RLS policies for transactions table
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" 
ON public.transactions 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Make user_id columns NOT NULL to prevent security bypasses
ALTER TABLE public.invoices ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.purchase_orders ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.proforma_invoices ALTER COLUMN user_id SET NOT NULL;