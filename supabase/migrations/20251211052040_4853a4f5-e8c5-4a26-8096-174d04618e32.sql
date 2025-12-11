-- Add dropdown_values column to field_repository table
ALTER TABLE public.field_repository 
ADD COLUMN IF NOT EXISTS dropdown_values text[] DEFAULT NULL;