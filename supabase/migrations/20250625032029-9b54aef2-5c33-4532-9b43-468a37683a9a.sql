
-- Add bill_due_date column to export_lc_bills table
ALTER TABLE public.export_lc_bills 
ADD COLUMN bill_due_date date;

-- Add tenor and tenor_days columns for better bill management
ALTER TABLE public.export_lc_bills 
ADD COLUMN tenor text,
ADD COLUMN tenor_days integer;
