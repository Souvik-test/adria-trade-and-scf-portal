-- Add is_active column to pane_section_mappings table
ALTER TABLE public.pane_section_mappings 
ADD COLUMN is_active boolean NOT NULL DEFAULT true;