
-- Remove the foreign key constraint that's causing the issue
ALTER TABLE public.purchase_orders DROP CONSTRAINT IF EXISTS purchase_orders_user_id_fkey;
ALTER TABLE public.proforma_invoices DROP CONSTRAINT IF EXISTS proforma_invoices_user_id_fkey;
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_user_id_fkey;
ALTER TABLE public.popi_line_items DROP CONSTRAINT IF EXISTS popi_line_items_purchase_order_id_fkey;
ALTER TABLE public.popi_line_items DROP CONSTRAINT IF EXISTS popi_line_items_proforma_invoice_id_fkey;
ALTER TABLE public.invoice_line_items DROP CONSTRAINT IF EXISTS invoice_line_items_invoice_id_fkey;

-- Add proper foreign key constraints for our custom system
ALTER TABLE public.popi_line_items ADD CONSTRAINT popi_line_items_purchase_order_id_fkey 
FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE CASCADE;

ALTER TABLE public.popi_line_items ADD CONSTRAINT popi_line_items_proforma_invoice_id_fkey 
FOREIGN KEY (proforma_invoice_id) REFERENCES public.proforma_invoices(id) ON DELETE CASCADE;

ALTER TABLE public.invoice_line_items ADD CONSTRAINT invoice_line_items_invoice_id_fkey 
FOREIGN KEY (invoice_id) REFERENCES public.invoices(id) ON DELETE CASCADE;
