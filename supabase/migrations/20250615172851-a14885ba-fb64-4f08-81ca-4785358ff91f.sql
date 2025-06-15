
-- Add is_transferable to import_lc_requests table
ALTER TABLE public.import_lc_requests
ADD COLUMN is_transferable BOOLEAN DEFAULT FALSE;

-- (Optionally add a comment for clarity)
COMMENT ON COLUMN public.import_lc_requests.is_transferable IS 'Indicates if the LC is transferable (true = Yes, false = No)';
