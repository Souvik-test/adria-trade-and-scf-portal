
-- Fix the foreign key constraint in assignment_requests table to reference user_profiles instead of auth.users
ALTER TABLE public.assignment_requests DROP CONSTRAINT IF EXISTS assignment_requests_user_id_fkey;

-- Add the correct foreign key constraint
ALTER TABLE public.assignment_requests 
ADD CONSTRAINT assignment_requests_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.user_profiles(id);

-- Also ensure RLS policies are properly set up for assignment_requests
DROP POLICY IF EXISTS "Users can view their own assignment requests" ON public.assignment_requests;
DROP POLICY IF EXISTS "Users can create their own assignment requests" ON public.assignment_requests;
DROP POLICY IF EXISTS "Users can update their own assignment requests" ON public.assignment_requests;

CREATE POLICY "Users can view their own assignment requests" 
  ON public.assignment_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assignment requests" 
  ON public.assignment_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assignment requests" 
  ON public.assignment_requests 
  FOR UPDATE 
  USING (auth.uid() = user_id);
