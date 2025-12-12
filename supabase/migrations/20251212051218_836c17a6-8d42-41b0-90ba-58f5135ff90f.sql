-- Remove the old duplicate policies that only check auth.uid()
DROP POLICY IF EXISTS "Users can create their own field definitions" ON public.field_repository;
DROP POLICY IF EXISTS "Users can view their own field definitions" ON public.field_repository;
DROP POLICY IF EXISTS "Users can update their own field definitions" ON public.field_repository;
DROP POLICY IF EXISTS "Users can delete their own field definitions" ON public.field_repository;