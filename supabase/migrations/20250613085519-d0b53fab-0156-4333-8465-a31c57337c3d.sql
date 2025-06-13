
-- Update RLS policies for import_lc_requests to work with custom auth system
DROP POLICY IF EXISTS "Users can view their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Users can create their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Users can update their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Users can delete their own import LC requests" ON public.import_lc_requests;

-- Create new policies that work with custom_users table
CREATE POLICY "Custom users can view their own import LC requests" 
  ON public.import_lc_requests 
  FOR SELECT 
  USING (user_id IN (
    SELECT id FROM custom_users WHERE user_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Custom users can create their own import LC requests" 
  ON public.import_lc_requests 
  FOR INSERT 
  WITH CHECK (user_id IN (
    SELECT id FROM custom_users WHERE user_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Custom users can update their own import LC requests" 
  ON public.import_lc_requests 
  FOR UPDATE 
  USING (user_id IN (
    SELECT id FROM custom_users WHERE user_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Custom users can delete their own import LC requests" 
  ON public.import_lc_requests 
  FOR DELETE 
  USING (user_id IN (
    SELECT id FROM custom_users WHERE user_id = current_setting('app.current_user_id', true)
  ));

-- Update supporting documents policies too
DROP POLICY IF EXISTS "Users can manage their import LC documents" ON public.import_lc_supporting_documents;

CREATE POLICY "Custom users can manage their import LC documents" 
  ON public.import_lc_supporting_documents 
  FOR ALL 
  USING (
    import_lc_request_id IN (
      SELECT id FROM public.import_lc_requests 
      WHERE user_id IN (
        SELECT id FROM custom_users WHERE user_id = current_setting('app.current_user_id', true)
      )
    )
  );
