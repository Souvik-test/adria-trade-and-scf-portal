
-- Create table for Export LC Amendment Responses
CREATE TABLE public.export_lc_amendment_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, -- reference to user_profiles.id, not auth.users
  lc_reference text NOT NULL,
  amendment_number text NOT NULL,
  action text NOT NULL CHECK (action IN ('accept','refuse')),
  comments text,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'Submitted',
  additional_conditions text,
  parties jsonb,
  lc_amount jsonb,
  shipment jsonb,
  documents jsonb,
  special_instructions text,
  UNIQUE (user_id, lc_reference, amendment_number)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.export_lc_amendment_responses ENABLE ROW LEVEL SECURITY;

-- Allow users to select their own records
CREATE POLICY "Users can read their amendment responses"
  ON public.export_lc_amendment_responses
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to insert their amendment responses
CREATE POLICY "Users can insert their own amendment responses"
  ON public.export_lc_amendment_responses
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Allow users to update their own (if needed in the future)
CREATE POLICY "Users can update their own amendment responses"
  ON public.export_lc_amendment_responses
  FOR UPDATE
  USING (user_id = auth.uid());

-- Allow users to delete their own (if needed)
CREATE POLICY "Users can delete their own amendment responses"
  ON public.export_lc_amendment_responses
  FOR DELETE
  USING (user_id = auth.uid());

