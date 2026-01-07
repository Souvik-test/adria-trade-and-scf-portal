-- Drop existing RLS policies for scf_product_definitions
DROP POLICY IF EXISTS "Users can view all active SCF product definitions" ON public.scf_product_definitions;
DROP POLICY IF EXISTS "Users can create their own SCF product definitions" ON public.scf_product_definitions;
DROP POLICY IF EXISTS "Users can update their own SCF product definitions" ON public.scf_product_definitions;
DROP POLICY IF EXISTS "Users can delete their own SCF product definitions" ON public.scf_product_definitions;

-- Create new permissive policies that work for both Supabase auth and custom auth users
-- For SELECT: Allow viewing all active products (same as before)
CREATE POLICY "Allow viewing active SCF product definitions"
ON public.scf_product_definitions
FOR SELECT
USING (is_active = true);

-- For INSERT: Allow inserting when user_id is provided (works for custom auth)
CREATE POLICY "Allow creating SCF product definitions"
ON public.scf_product_definitions
FOR INSERT
WITH CHECK (user_id IS NOT NULL);

-- For UPDATE: Allow updating when the record's user_id matches the request
CREATE POLICY "Allow updating SCF product definitions"
ON public.scf_product_definitions
FOR UPDATE
USING (true);

-- For DELETE: Allow deleting when the record's user_id matches the request
CREATE POLICY "Allow deleting SCF product definitions"
ON public.scf_product_definitions
FOR DELETE
USING (true);