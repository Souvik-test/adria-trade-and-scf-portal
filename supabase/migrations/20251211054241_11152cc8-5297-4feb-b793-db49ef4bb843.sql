-- Add missing field_row and field_column columns to field_repository table
ALTER TABLE public.field_repository 
ADD COLUMN IF NOT EXISTS field_row integer DEFAULT 1;

ALTER TABLE public.field_repository 
ADD COLUMN IF NOT EXISTS field_column integer DEFAULT 1;