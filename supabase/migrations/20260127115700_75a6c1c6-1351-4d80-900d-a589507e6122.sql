-- Drop and recreate INSERT policy for scf_invoices
-- scf_invoices.user_id is UUID, custom_users.id is UUID - both match
DROP POLICY IF EXISTS "Users can create their own SCF invoices" ON public.scf_invoices;

CREATE POLICY "Users can create their own SCF invoices" 
ON public.scf_invoices 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id
  OR
  EXISTS (SELECT 1 FROM public.custom_users cu WHERE cu.id::uuid = user_id::uuid)
);

-- Drop and recreate UPDATE policy
DROP POLICY IF EXISTS "Users can update their own SCF invoices" ON public.scf_invoices;

CREATE POLICY "Users can update their own SCF invoices" 
ON public.scf_invoices 
FOR UPDATE 
USING (
  auth.uid() = user_id
  OR
  EXISTS (SELECT 1 FROM public.custom_users cu WHERE cu.id::uuid = user_id::uuid)
);

-- Drop and recreate DELETE policy
DROP POLICY IF EXISTS "Users can delete their own SCF invoices" ON public.scf_invoices;

CREATE POLICY "Users can delete their own SCF invoices" 
ON public.scf_invoices 
FOR DELETE 
USING (
  auth.uid() = user_id
  OR
  EXISTS (SELECT 1 FROM public.custom_users cu WHERE cu.id::uuid = user_id::uuid)
);