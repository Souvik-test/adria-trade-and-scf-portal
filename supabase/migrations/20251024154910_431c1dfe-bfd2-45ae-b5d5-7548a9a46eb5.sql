-- Update RLS policies for scf_product_definitions
-- Allow all authenticated users to view all active products
DROP POLICY IF EXISTS "Users can view their own SCF product definitions" ON scf_product_definitions;

CREATE POLICY "Users can view all active SCF product definitions"
ON scf_product_definitions
FOR SELECT
TO authenticated
USING (is_active = true);

-- Update RLS policies for scf_program_configurations
-- Allow all authenticated users to view all active programs
DROP POLICY IF EXISTS "Users can view their own programs" ON scf_program_configurations;

CREATE POLICY "Users can view all active SCF programs"
ON scf_program_configurations
FOR SELECT
TO authenticated
USING (status = 'active');