-- Drop existing RLS policies on field_repository
DROP POLICY IF EXISTS "Users can create their own fields" ON public.field_repository;
DROP POLICY IF EXISTS "Users can view their own fields" ON public.field_repository;
DROP POLICY IF EXISTS "Users can update their own fields" ON public.field_repository;
DROP POLICY IF EXISTS "Users can delete their own fields" ON public.field_repository;

-- Create new RLS policies that support both Supabase auth and custom auth
CREATE POLICY "Users can create their own fields" 
ON public.field_repository 
FOR INSERT 
WITH CHECK (
  (user_id = auth.uid()) OR 
  (user_id IN (
    SELECT id FROM custom_users 
    WHERE custom_users.user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  ))
);

CREATE POLICY "Users can view their own fields" 
ON public.field_repository 
FOR SELECT 
USING (
  (user_id = auth.uid()) OR 
  (user_id IN (
    SELECT id FROM custom_users 
    WHERE custom_users.user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  ))
);

CREATE POLICY "Users can update their own fields" 
ON public.field_repository 
FOR UPDATE 
USING (
  (user_id = auth.uid()) OR 
  (user_id IN (
    SELECT id FROM custom_users 
    WHERE custom_users.user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  ))
);

CREATE POLICY "Users can delete their own fields" 
ON public.field_repository 
FOR DELETE 
USING (
  (user_id = auth.uid()) OR 
  (user_id IN (
    SELECT id FROM custom_users 
    WHERE custom_users.user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  ))
);