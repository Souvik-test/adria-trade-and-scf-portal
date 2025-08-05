-- Option 1: Disable RLS on outward_documentary_collection_bills table temporarily
-- Since you're using custom authentication, the RLS policies that depend on auth.uid() won't work
-- We'll disable RLS and rely on application-level security for now

ALTER TABLE public.outward_documentary_collection_bills DISABLE ROW LEVEL SECURITY;

-- Note: This means the application code must handle user access control
-- The service already filters by user_id, so this should be secure at the application level