-- Fix critical security vulnerability: Remove public access to submitted export LC bills
-- This was exposing sensitive financial data including bill amounts, LC references, and applicant information

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view export LC bills" ON public.export_lc_bills;

-- Create a secure policy that only allows users to view their own bills
CREATE POLICY "Users can view their own export LC bills only" 
ON public.export_lc_bills 
FOR SELECT 
USING (auth.uid() = user_id);

-- This removes the dangerous "OR (status = 'submitted')" condition that was allowing
-- any authenticated user to view all submitted bills from other users