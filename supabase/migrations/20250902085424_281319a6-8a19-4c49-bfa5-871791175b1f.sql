-- Fix critical security vulnerability: Replace overly permissive RLS policies on notifications table
-- Current policies use 'true' conditions allowing unrestricted access to all user notifications

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;  
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;

-- Create secure RLS policies that properly restrict access to user-owned records

-- Allow system/triggers to create notifications (needed for transaction triggers)
CREATE POLICY "System can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (true);

-- Users can only view their own notifications
CREATE POLICY "Users can view their own notifications only" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only update their own notifications (e.g., mark as read)
CREATE POLICY "Users can update their own notifications only" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Ensure user_id cannot be bypassed
ALTER TABLE public.notifications ALTER COLUMN user_id SET NOT NULL;