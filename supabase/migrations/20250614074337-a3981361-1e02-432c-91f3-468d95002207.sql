
-- Fix RLS policies for import_lc_requests to work with the custom auth system
DROP POLICY IF EXISTS "Custom users can view their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Custom users can create their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Custom users can update their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Custom users can delete their own import LC requests" ON public.import_lc_requests;

-- Create new policies that work with the custom_users table directly
-- Allow users to view their own import LC requests
CREATE POLICY "Users can view their own import LC requests" 
  ON public.import_lc_requests 
  FOR SELECT 
  USING (
    user_id IN (
      SELECT id FROM public.custom_users 
      WHERE user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
    )
  );

-- Allow users to create their own import LC requests
CREATE POLICY "Users can create their own import LC requests" 
  ON public.import_lc_requests 
  FOR INSERT 
  WITH CHECK (
    user_id IN (
      SELECT id FROM public.custom_users 
      WHERE user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
    )
  );

-- Allow users to update their own import LC requests
CREATE POLICY "Users can update their own import LC requests" 
  ON public.import_lc_requests 
  FOR UPDATE 
  USING (
    user_id IN (
      SELECT id FROM public.custom_users 
      WHERE user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
    )
  );

-- Allow users to delete their own import LC requests
CREATE POLICY "Users can delete their own import LC requests" 
  ON public.import_lc_requests 
  FOR DELETE 
  USING (
    user_id IN (
      SELECT id FROM public.custom_users 
      WHERE user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
    )
  );

-- Update supporting documents policies too
DROP POLICY IF EXISTS "Custom users can manage their import LC documents" ON public.import_lc_supporting_documents;

CREATE POLICY "Users can manage their import LC documents" 
  ON public.import_lc_supporting_documents 
  FOR ALL 
  USING (
    import_lc_request_id IN (
      SELECT id FROM public.import_lc_requests 
      WHERE user_id IN (
        SELECT id FROM public.custom_users 
        WHERE user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
      )
    )
  );
