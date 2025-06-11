
-- Remove the trigger that auto-generates transaction references
DROP TRIGGER IF EXISTS transaction_notification_trigger ON public.transactions;

-- Drop the function that generates transaction references (we don't need it)
DROP FUNCTION IF EXISTS public.generate_transaction_ref(text);

-- Recreate the notification trigger function without auto-generating references
CREATE OR REPLACE FUNCTION create_transaction_notification()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (
    user_id,
    transaction_ref,
    transaction_type,
    message
  ) VALUES (
    NEW.user_id,
    NEW.transaction_ref,
    NEW.product_type,
    'New ' || NEW.product_type || ' transaction created: ' || NEW.transaction_ref
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger to auto-create notifications (but not auto-generate references)
CREATE TRIGGER transaction_notification_trigger
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION create_transaction_notification();
