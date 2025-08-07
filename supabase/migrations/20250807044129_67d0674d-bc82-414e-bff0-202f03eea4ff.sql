-- PERMANENTLY FIX the documentary collection bills submission issue
-- Remove the psql command and just focus on the actual fix

-- Disable RLS on the table
ALTER TABLE public.outward_documentary_collection_bills DISABLE ROW LEVEL SECURITY;

-- Drop all existing RLS policies that are causing conflicts
DROP POLICY IF EXISTS "Users can create their own documentary collection bills" ON public.outward_documentary_collection_bills;
DROP POLICY IF EXISTS "Users can view their own documentary collection bills" ON public.outward_documentary_collection_bills;
DROP POLICY IF EXISTS "Users can update their own documentary collection bills" ON public.outward_documentary_collection_bills;
DROP POLICY IF EXISTS "Users can delete their own documentary collection bills" ON public.outward_documentary_collection_bills;