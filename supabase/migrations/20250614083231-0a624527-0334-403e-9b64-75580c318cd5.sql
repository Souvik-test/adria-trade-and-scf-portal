
-- Remove old policies
DROP POLICY IF EXISTS "Users can view their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Users can create their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Users can update their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Users can delete their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Custom users can view their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Custom users can create their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Custom users can update their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Custom users can delete their own import LC requests" ON public.import_lc_requests;

-- Correct policies for your custom auth system:
-- Read (SELECT) access only for own requests
CREATE POLICY "Custom users can view their own import LC requests" 
  ON public.import_lc_requests 
  FOR SELECT 
  USING (
    user_id IN (
      SELECT id FROM public.custom_users 
      WHERE user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
    )
  );

-- Insert, only if acting as valid custom user
CREATE POLICY "Custom users can create their own import LC requests" 
  ON public.import_lc_requests 
  FOR INSERT 
  WITH CHECK (
    user_id IN (
      SELECT id FROM public.custom_users 
      WHERE user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
    )
  );

-- Update (edit) only own requests
CREATE POLICY "Custom users can update their own import LC requests" 
  ON public.import_lc_requests 
  FOR UPDATE 
  USING (
    user_id IN (
      SELECT id FROM public.custom_users 
      WHERE user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
    )
  );

-- Delete only own requests
CREATE POLICY "Custom users can delete their own import LC requests" 
  ON public.import_lc_requests 
  FOR DELETE 
  USING (
    user_id IN (
      SELECT id FROM public.custom_users 
      WHERE user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
    )
  );

-- Supporting documents: Reset policy for custom auth linkage as well
DROP POLICY IF EXISTS "Custom users can manage their import LC documents" ON public.import_lc_supporting_documents;
DROP POLICY IF EXISTS "Users can manage their import LC documents" ON public.import_lc_supporting_documents;

CREATE POLICY "Custom users can manage their import LC documents" 
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

