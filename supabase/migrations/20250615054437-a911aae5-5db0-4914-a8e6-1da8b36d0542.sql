
-- Fix after_export_lc_review_submit function JSON decoding error

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
    (NEW.parties->1->>'name'), -- Beneficiary (Exporter), fix array extraction
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
