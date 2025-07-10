-- Drop existing RLS policies for outward_documentary_collection_bills
DROP POLICY IF EXISTS "Users can create their own documentary collection bills" ON public.outward_documentary_collection_bills;
DROP POLICY IF EXISTS "Users can update their own documentary collection bills" ON public.outward_documentary_collection_bills;
DROP POLICY IF EXISTS "Users can view their own documentary collection bills" ON public.outward_documentary_collection_bills;
DROP POLICY IF EXISTS "Users can delete their own documentary collection bills" ON public.outward_documentary_collection_bills;

-- Create new RLS policies that work with the custom authentication system
CREATE POLICY "Custom users can create their own documentary collection bills" 
ON public.outward_documentary_collection_bills 
FOR INSERT 
WITH CHECK (
  user_id IN (
    SELECT id FROM public.custom_users 
    WHERE user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
  )
);

CREATE POLICY "Custom users can update their own documentary collection bills" 
ON public.outward_documentary_collection_bills 
FOR UPDATE 
USING (
  user_id IN (
    SELECT id FROM public.custom_users 
    WHERE user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
  )
);

CREATE POLICY "Custom users can view their own documentary collection bills" 
ON public.outward_documentary_collection_bills 
FOR SELECT 
USING (
  user_id IN (
    SELECT id FROM public.custom_users 
    WHERE user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
  )
);

CREATE POLICY "Custom users can delete their own documentary collection bills" 
ON public.outward_documentary_collection_bills 
FOR DELETE 
USING (
  user_id IN (
    SELECT id FROM public.custom_users 
    WHERE user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
  )
);