-- Fix RLS policies on scf_invoices: allow ONLY custom_users to transact, and correctly reference scf_invoices.user_id

DROP POLICY IF EXISTS "Users can create their own SCF invoices" ON public.scf_invoices;
CREATE POLICY "Users can create their own SCF invoices"
ON public.scf_invoices
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.custom_users cu
    WHERE cu.id = scf_invoices.user_id
  )
);

DROP POLICY IF EXISTS "Users can update their own SCF invoices" ON public.scf_invoices;
CREATE POLICY "Users can update their own SCF invoices"
ON public.scf_invoices
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.custom_users cu
    WHERE cu.id = scf_invoices.user_id
  )
);

DROP POLICY IF EXISTS "Users can delete their own SCF invoices" ON public.scf_invoices;
CREATE POLICY "Users can delete their own SCF invoices"
ON public.scf_invoices
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.custom_users cu
    WHERE cu.id = scf_invoices.user_id
  )
);