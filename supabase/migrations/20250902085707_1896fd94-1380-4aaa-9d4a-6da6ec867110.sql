-- Fix critical security vulnerability: Remove overly permissive RLS policies on line items tables
-- These tables contain sensitive commercial data including pricing, quantities, and product descriptions

-- Fix invoice_line_items table
-- Drop overly permissive policies that use 'true' conditions
DROP POLICY IF EXISTS "Users can create their own invoice line items" ON public.invoice_line_items;
DROP POLICY IF EXISTS "Users can delete their own invoice line items" ON public.invoice_line_items;
DROP POLICY IF EXISTS "Users can update their own invoice line items" ON public.invoice_line_items;
DROP POLICY IF EXISTS "Users can view their own invoice line items" ON public.invoice_line_items;

-- Keep only the secure policies that check ownership through parent invoice
-- These policies already exist and properly restrict access:
-- - "Users can create invoice line items for their invoices"
-- - "Users can view invoice line items for their invoices" 
-- - "Users can update invoice line items for their invoices"
-- - "Users can delete invoice line items for their invoices"

-- Fix popi_line_items table
-- Drop overly permissive policies that use 'true' conditions
DROP POLICY IF EXISTS "Users can create their own line items" ON public.popi_line_items;
DROP POLICY IF EXISTS "Users can delete their own line items" ON public.popi_line_items;
DROP POLICY IF EXISTS "Users can update their own line items" ON public.popi_line_items;
DROP POLICY IF EXISTS "Users can view their own line items" ON public.popi_line_items;

-- Keep only the secure policies that check ownership through parent documents:
-- - "Users can create line items for their documents"
-- - "Users can view line items for their documents"
-- - "Users can update line items for their documents" 
-- - "Users can delete line items for their documents"

-- Ensure foreign key columns cannot be bypassed
ALTER TABLE public.invoice_line_items ALTER COLUMN invoice_id SET NOT NULL;
-- Note: popi_line_items has either purchase_order_id OR proforma_invoice_id, so we can't make both NOT NULL