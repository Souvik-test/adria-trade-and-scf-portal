
-- Drop the existing RLS policy for SELECT operations
DROP POLICY IF EXISTS "Users can view their own import LC requests" ON public.import_lc_requests;

-- Create a new policy that allows users to view their own requests OR any submitted requests
CREATE POLICY "Users can view own requests or submitted requests" 
  ON public.import_lc_requests 
  FOR SELECT 
  USING (
    -- Users can view their own requests (any status)
    user_id IN (
      SELECT id FROM public.custom_users 
      WHERE user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
    )
    OR 
    -- Anyone can view submitted requests (for assignment purposes)
    status = 'submitted'
  );
