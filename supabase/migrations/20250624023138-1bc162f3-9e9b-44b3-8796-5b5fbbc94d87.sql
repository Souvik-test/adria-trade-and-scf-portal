
-- First, let's check what policies already exist
SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE tablename = 'export_lc_bills';

-- Drop existing policies if they exist and recreate them properly
DROP POLICY IF EXISTS "Users can view their own export LC bills" ON public.export_lc_bills;
DROP POLICY IF EXISTS "Users can view all submitted export LC bills" ON public.export_lc_bills;
DROP POLICY IF EXISTS "Users can create their own export LC bills" ON public.export_lc_bills;
DROP POLICY IF EXISTS "Users can update their own export LC bills" ON public.export_lc_bills;
DROP POLICY IF EXISTS "Users can delete their own export LC bills" ON public.export_lc_bills;

-- Recreate the policies with the correct logic
-- Users can view their own bills OR any submitted bills (for search in resolve discrepancies)
CREATE POLICY "Users can view export LC bills" 
  ON public.export_lc_bills 
  FOR SELECT 
  USING (auth.uid() = user_id OR status = 'submitted');

-- Users can create their own bills
CREATE POLICY "Users can create their own export LC bills" 
  ON public.export_lc_bills 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bills
CREATE POLICY "Users can update their own export LC bills" 
  ON public.export_lc_bills 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own bills
CREATE POLICY "Users can delete their own export LC bills" 
  ON public.export_lc_bills 
  FOR DELETE 
  USING (auth.uid() = user_id);
