
-- 1. Table for Export LC Review Pre-adviced submissions
CREATE TABLE public.export_lc_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, -- Supabase Auth user id
  lc_reference text NOT NULL,
  issue_date date,
  expiry_date date,
  amount numeric,
  currency text,
  parties jsonb,
  lc_amount jsonb,
  shipment jsonb,
  documents jsonb,
  additional_conditions text,
  special_instructions text,
  action text NOT NULL, -- "accept" or "refuse"
  comments text,
  submitted_at timestamp with time zone DEFAULT now(),
  status text NOT NULL DEFAULT 'Submitted'
);

-- 2. RLS: Enable row-level security
ALTER TABLE public.export_lc_reviews ENABLE ROW LEVEL SECURITY;

-- Users can manage (SELECT/INSERT/UPDATE/DELETE) only their own rows
CREATE POLICY "User can access their own Export LC reviews"
  ON public.export_lc_reviews
  FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 3. Insert a record in 'transactions' on submit (if not already present)
-- Existing model: transactions table, with "Export LC" as product_type
CREATE OR REPLACE FUNCTION public.after_export_lc_review_submit()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.transactions (
    user_id,
    transaction_ref,
    product_type,
    status,
    customer_name,
    amount,
    currency,
    created_by,
    initiating_channel
  ) VALUES (
    NEW.user_id,
    NEW.lc_reference,
    'Export LC',
    NEW.status,
    (NEW.parties->>1->>'name'), -- Beneficiary (Exporter)
    NEW.amount,
    NEW.currency,
    current_setting('request.jwt.claim.email', true),
    'Portal'
  )
  ON CONFLICT (transaction_ref, user_id)
  DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for after insert on export_lc_reviews
DROP TRIGGER IF EXISTS trg_after_export_lc_review_submit ON public.export_lc_reviews;
CREATE TRIGGER trg_after_export_lc_review_submit
AFTER INSERT ON public.export_lc_reviews
FOR EACH ROW
EXECUTE PROCEDURE public.after_export_lc_review_submit();

-- 4. Notification: Leverage the same approach as existing transactions
-- The existing trigger on "transactions" inserts into "notifications", so inserting into transactions will generate a notification

