-- Add missing reference columns to tables
ALTER TABLE payment_requests 
ADD COLUMN IF NOT EXISTS payment_reference TEXT 
GENERATED ALWAYS AS ('PAY-REQ-' || id::text) STORED;

ALTER TABLE early_payment_requests
ADD COLUMN IF NOT EXISTS request_reference TEXT 
GENERATED ALWAYS AS ('EARLY-PAY-' || id::text) STORED;

-- Update notify_scf_users function to check both custom_users and user_profiles
DROP FUNCTION IF EXISTS notify_scf_users(TEXT, TEXT, TEXT) CASCADE;

CREATE OR REPLACE FUNCTION notify_scf_users(
  p_transaction_ref TEXT,
  p_transaction_type TEXT,
  p_message TEXT
) RETURNS void AS $$
DECLARE
  v_user_id UUID;
  v_emails TEXT[] := ARRAY[
    'souvikdomain@gmail.com',
    'souvikgenius@gmail.com',
    'souvik.chakraborty@adria-bt.com',
    'reda.oummouy@adria-bt.com'
  ];
  v_email TEXT;
BEGIN
  FOREACH v_email IN ARRAY v_emails LOOP
    -- Try to get user_id from custom_users first
    SELECT id INTO v_user_id
    FROM custom_users
    WHERE user_id = v_email
    LIMIT 1;
    
    -- If not found, try user_profiles (Supabase Auth users)
    IF v_user_id IS NULL THEN
      SELECT id INTO v_user_id
      FROM user_profiles
      WHERE email = v_email
      LIMIT 1;
    END IF;
    
    -- If user found, create notification
    IF v_user_id IS NOT NULL THEN
      INSERT INTO notifications (
        user_id,
        transaction_ref,
        transaction_type,
        message
      ) VALUES (
        v_user_id,
        p_transaction_ref,
        p_transaction_type,
        p_message
      );
    ELSE
      RAISE WARNING 'User not found: %', v_email;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Fix finance disbursement trigger to use correct column name
DROP TRIGGER IF EXISTS trigger_notify_finance_disbursement ON finance_disbursements;
DROP FUNCTION IF EXISTS notify_finance_disbursement() CASCADE;

CREATE OR REPLACE FUNCTION notify_finance_disbursement()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM notify_scf_users(
    NEW.disbursement_reference,
    'SCF Finance',
    'Manual finance disbursement created: ' || NEW.disbursement_reference ||
    ' for program ' || NEW.program_id || 
    ' (Finance Amount: ' || NEW.finance_amount || ' ' || NEW.finance_currency || 
    ', Total Repayment: ' || NEW.total_repayment_amount || ')'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_notify_finance_disbursement
AFTER INSERT ON finance_disbursements
FOR EACH ROW EXECUTE FUNCTION notify_finance_disbursement();