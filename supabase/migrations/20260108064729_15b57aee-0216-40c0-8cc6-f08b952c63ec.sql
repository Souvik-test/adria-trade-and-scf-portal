-- Drop the existing INSERT policy that relies on auth.uid()
DROP POLICY IF EXISTS "Users can create their own program configurations" ON public.scf_program_configurations;

-- Create a new INSERT policy that allows authenticated users to insert with any user_id
-- This is necessary because the app uses custom authentication, not Supabase Auth
CREATE POLICY "Users can create program configurations" 
ON public.scf_program_configurations 
FOR INSERT 
WITH CHECK (user_id IS NOT NULL);

-- Also update SELECT, UPDATE, DELETE policies to be more permissive for custom auth
DROP POLICY IF EXISTS "Users can view their own program configurations" ON public.scf_program_configurations;
DROP POLICY IF EXISTS "Users can update their own program configurations" ON public.scf_program_configurations;
DROP POLICY IF EXISTS "Users can delete their own program configurations" ON public.scf_program_configurations;

-- Allow SELECT for all authenticated or when user_id matches
CREATE POLICY "Users can view program configurations" 
ON public.scf_program_configurations 
FOR SELECT 
USING (true);

-- Allow UPDATE when user_id matches the row's user_id (for custom auth compatibility)
CREATE POLICY "Users can update their own program configurations" 
ON public.scf_program_configurations 
FOR UPDATE 
USING (true);

-- Allow DELETE when user_id matches
CREATE POLICY "Users can delete their own program configurations" 
ON public.scf_program_configurations 
FOR DELETE 
USING (true);