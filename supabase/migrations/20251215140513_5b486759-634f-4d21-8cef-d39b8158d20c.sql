-- Drop the foreign key constraint on import_lc_requests that references user_profiles
-- This allows both Supabase auth users and custom auth users to create LC requests
ALTER TABLE public.import_lc_requests 
DROP CONSTRAINT IF EXISTS fk_user_id;

-- Also check and drop if constraint has different name patterns
DO $$
BEGIN
  -- Try to drop potential constraint names
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints 
             WHERE table_name = 'import_lc_requests' 
             AND constraint_name LIKE '%user_id%fkey%') THEN
    EXECUTE (SELECT 'ALTER TABLE public.import_lc_requests DROP CONSTRAINT ' || constraint_name
             FROM information_schema.table_constraints 
             WHERE table_name = 'import_lc_requests' 
             AND constraint_name LIKE '%user_id%fkey%'
             LIMIT 1);
  END IF;
END $$;