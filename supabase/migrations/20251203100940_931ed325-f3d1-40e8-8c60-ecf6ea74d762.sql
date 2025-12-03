-- Fix RLS policies by dropping existing ones first (using correct existing names)
-- For invoice_upload_batches - drop overly permissive policies

DROP POLICY IF EXISTS "Users can view their own upload batches" ON invoice_upload_batches;
DROP POLICY IF EXISTS "Users can create their own upload batches" ON invoice_upload_batches;
DROP POLICY IF EXISTS "Users can update their own upload batches" ON invoice_upload_batches;

-- Create properly scoped policies for invoice_upload_batches
CREATE POLICY "Users can view their own upload batches" 
ON invoice_upload_batches 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own upload batches" 
ON invoice_upload_batches 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own upload batches" 
ON invoice_upload_batches 
FOR UPDATE 
USING (user_id = auth.uid());

-- Fix RLS policies for invoice_upload_rejections
DROP POLICY IF EXISTS "Users can view rejections for their batches" ON invoice_upload_rejections;
DROP POLICY IF EXISTS "Users can create rejections" ON invoice_upload_rejections;
DROP POLICY IF EXISTS "Users can create rejections for their batches" ON invoice_upload_rejections;

-- Create properly scoped policies for invoice_upload_rejections
CREATE POLICY "Users can view rejections for their batches" 
ON invoice_upload_rejections 
FOR SELECT 
USING (
  batch_id IN (
    SELECT id FROM invoice_upload_batches WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create rejections for their batches" 
ON invoice_upload_rejections 
FOR INSERT 
WITH CHECK (
  batch_id IN (
    SELECT id FROM invoice_upload_batches WHERE user_id = auth.uid()
  )
);