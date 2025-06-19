
-- Add issuing_bank column to import_lc_requests table
ALTER TABLE public.import_lc_requests 
ADD COLUMN issuing_bank TEXT;
