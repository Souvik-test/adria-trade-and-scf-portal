-- Fix RLS for SCF invoice line items to support custom auth users (no auth.uid())

DROP POLICY IF EXISTS "Users can create line items for their SCF invoices" ON public.scf_invoice_line_items;
CREATE POLICY "Users can create line items for their SCF invoices"
ON public.scf_invoice_line_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.scf_invoices i
    JOIN public.custom_users cu ON cu.id = i.user_id
    WHERE i.id = scf_invoice_line_items.scf_invoice_id
  )
);

DROP POLICY IF EXISTS "Users can view line items for their SCF invoices" ON public.scf_invoice_line_items;
CREATE POLICY "Users can view line items for their SCF invoices"
ON public.scf_invoice_line_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.scf_invoices i
    JOIN public.custom_users cu ON cu.id = i.user_id
    WHERE i.id = scf_invoice_line_items.scf_invoice_id
  )
);

DROP POLICY IF EXISTS "Users can update line items for their SCF invoices" ON public.scf_invoice_line_items;
CREATE POLICY "Users can update line items for their SCF invoices"
ON public.scf_invoice_line_items
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.scf_invoices i
    JOIN public.custom_users cu ON cu.id = i.user_id
    WHERE i.id = scf_invoice_line_items.scf_invoice_id
  )
);

DROP POLICY IF EXISTS "Users can delete line items for their SCF invoices" ON public.scf_invoice_line_items;
CREATE POLICY "Users can delete line items for their SCF invoices"
ON public.scf_invoice_line_items
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.scf_invoices i
    JOIN public.custom_users cu ON cu.id = i.user_id
    WHERE i.id = scf_invoice_line_items.scf_invoice_id
  )
);