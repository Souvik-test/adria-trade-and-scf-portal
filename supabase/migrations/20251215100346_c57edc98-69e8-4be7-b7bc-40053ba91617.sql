-- Create or replace function to get all product event mappings as shared configurations
CREATE OR REPLACE FUNCTION public.get_product_event_mappings()
RETURNS SETOF product_event_mapping
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Return ALL product event mappings as shared administrative configurations
  -- No user filtering - these are system-wide configurations
  RETURN QUERY
  SELECT *
  FROM product_event_mapping
  ORDER BY module_code ASC, product_code ASC, event_code ASC;
END;
$function$;

-- Update RLS policy to allow all authenticated users to view mappings
DROP POLICY IF EXISTS "Users can view product event mappings" ON product_event_mapping;
CREATE POLICY "All users can view product event mappings"
ON product_event_mapping
FOR SELECT
USING (true);

-- Keep insert/update policies for authenticated users
DROP POLICY IF EXISTS "Users can insert product event mappings" ON product_event_mapping;
CREATE POLICY "Users can insert product event mappings"
ON product_event_mapping
FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update product event mappings" ON product_event_mapping;
CREATE POLICY "Users can update product event mappings"
ON product_event_mapping
FOR UPDATE
USING (true);