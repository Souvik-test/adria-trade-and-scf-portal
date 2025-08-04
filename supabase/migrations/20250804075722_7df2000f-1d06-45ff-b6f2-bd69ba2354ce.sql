-- Drop existing RLS policies for outward_documentary_collection_bills
DROP POLICY IF EXISTS "Custom users can create their own documentary collection bills" ON public.outward_documentary_collection_bills;
DROP POLICY IF EXISTS "Custom users can view their own documentary collection bills" ON public.outward_documentary_collection_bills;
DROP POLICY IF EXISTS "Custom users can update their own documentary collection bills" ON public.outward_documentary_collection_bills;
DROP POLICY IF EXISTS "Custom users can delete their own documentary collection bills" ON public.outward_documentary_collection_bills;

-- Create new RLS policies using auth.uid() directly
CREATE POLICY "Users can create their own documentary collection bills" 
ON public.outward_documentary_collection_bills 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own documentary collection bills" 
ON public.outward_documentary_collection_bills 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own documentary collection bills" 
ON public.outward_documentary_collection_bills 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documentary collection bills" 
ON public.outward_documentary_collection_bills 
FOR DELETE 
USING (auth.uid() = user_id);