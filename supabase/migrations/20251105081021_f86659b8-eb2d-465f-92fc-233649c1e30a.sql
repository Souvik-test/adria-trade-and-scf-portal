-- Step 1: Create scf_user_role enum
CREATE TYPE scf_user_role AS ENUM ('Supplier', 'Buyer', 'Bank', 'Admin');

-- Step 2: Add scf_role column to custom_users
ALTER TABLE custom_users 
ADD COLUMN IF NOT EXISTS scf_role scf_user_role DEFAULT NULL;

-- Step 3: Ensure all 3 users exist and tag them
-- Insert Supplier if missing
INSERT INTO custom_users (user_id, password_hash, full_name, scf_role, corporate_id, user_login_id)
VALUES ('souvikdomain@gmail.com', 'temp_hash', 'Supplier User', 'Supplier', 'TC001', 'souvikdomain@gmail.com')
ON CONFLICT (user_id) DO UPDATE SET scf_role = 'Supplier';

-- Tag Buyer
UPDATE custom_users 
SET scf_role = 'Buyer' 
WHERE user_id = 'souvikgenius@gmail.com';

-- Tag Bank
UPDATE custom_users 
SET scf_role = 'Bank' 
WHERE user_id = 'souvik.chakraborty@adria-bt.com';

-- Step 4: Create new role-based notification function
CREATE OR REPLACE FUNCTION notify_scf_users_by_role(
  p_transaction_ref TEXT,
  p_transaction_type TEXT,
  p_message TEXT,
  p_notify_roles scf_user_role[],
  p_exclude_user_id UUID DEFAULT NULL
) RETURNS void AS $$
DECLARE
  v_user RECORD;
BEGIN
  FOR v_user IN 
    SELECT id, user_id, full_name, scf_role
    FROM custom_users
    WHERE scf_role = ANY(p_notify_roles)
      AND (p_exclude_user_id IS NULL OR id != p_exclude_user_id)
  LOOP
    INSERT INTO notifications (
      user_id,
      transaction_ref,
      transaction_type,
      message
    ) VALUES (
      v_user.id,
      p_transaction_ref,
      p_transaction_type,
      p_message
    );
    
    RAISE NOTICE 'Notification sent to: % (%, %)', 
      v_user.full_name, v_user.user_id, v_user.scf_role;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 5: Update all trigger functions

-- 5.1 Program Creation Notification
CREATE OR REPLACE FUNCTION notify_program_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM notify_scf_users_by_role(
      NEW.program_id,
      'SCF Program',
      'New SCF program created: ' || NEW.program_name || ' (ID: ' || NEW.program_id || ')',
      ARRAY['Supplier', 'Buyer']::scf_user_role[],
      NEW.user_id
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM notify_scf_users_by_role(
      NEW.program_id,
      'SCF Program',
      'SCF program updated: ' || NEW.program_name || ' (ID: ' || NEW.program_id || ')',
      ARRAY['Supplier', 'Buyer']::scf_user_role[],
      NEW.user_id
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM notify_scf_users_by_role(
      OLD.program_id,
      'SCF Program',
      'SCF program deleted: ' || OLD.program_name || ' (ID: ' || OLD.program_id || ')',
      ARRAY['Supplier', 'Buyer']::scf_user_role[],
      NULL
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5.2 Invoice Creation Notification
CREATE OR REPLACE FUNCTION notify_invoice_creation()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM notify_scf_users_by_role(
    NEW.invoice_number,
    'SCF Invoice',
    'Invoice ' || NEW.invoice_number || ' created under Program ' || NEW.program_id || 
    ' (Amount: ' || NEW.currency || ' ' || NEW.total_amount || ')',
    ARRAY['Bank', 'Buyer']::scf_user_role[],
    NEW.user_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5.3 Finance Request Notification
CREATE OR REPLACE FUNCTION notify_finance_disbursement()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM notify_scf_users_by_role(
    NEW.disbursement_reference,
    'SCF Finance Request',
    'Finance request created: ' || NEW.disbursement_reference ||
    ' for program ' || NEW.program_id || 
    ' (Amount: ' || NEW.finance_amount || ' ' || NEW.finance_currency || ')',
    ARRAY['Bank', 'Buyer']::scf_user_role[],
    NEW.user_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5.4 Auto-Disbursement Notification
CREATE OR REPLACE FUNCTION notify_auto_disbursement()
RETURNS TRIGGER AS $$
DECLARE
  v_invoice_number TEXT;
BEGIN
  IF NEW.disbursement_status = 'completed' AND (OLD.disbursement_status IS NULL OR OLD.disbursement_status != 'completed') THEN
    SELECT invoice_number INTO v_invoice_number
    FROM scf_invoices
    WHERE id = NEW.scf_invoice_id;
    
    PERFORM notify_scf_users_by_role(
      NEW.loan_reference,
      'SCF Finance',
      'Auto-disbursement completed for invoice ' || COALESCE(v_invoice_number, 'Unknown') ||
      ' - Loan Ref: ' || NEW.loan_reference || ' (Amount: ' || NEW.disbursed_amount || ')',
      ARRAY['Supplier', 'Buyer', 'Bank']::scf_user_role[],
      NULL
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5.5 Buyer Invoice Approval Notification
CREATE OR REPLACE FUNCTION notify_buyer_invoice_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'buyer_approved' AND (OLD.status IS NULL OR OLD.status != 'buyer_approved') THEN
    PERFORM notify_scf_users_by_role(
      NEW.invoice_number,
      'SCF Invoice - Buyer Approved',
      'Buyer approved invoice ' || NEW.invoice_number || ' under Program ' || NEW.program_id ||
      ' (Amount: ' || NEW.currency || ' ' || NEW.total_amount || ')',
      ARRAY['Supplier', 'Bank']::scf_user_role[],
      NEW.user_id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for buyer invoice approval
DROP TRIGGER IF EXISTS trigger_notify_buyer_invoice_approval ON scf_invoices;
CREATE TRIGGER trigger_notify_buyer_invoice_approval
AFTER UPDATE ON scf_invoices
FOR EACH ROW EXECUTE FUNCTION notify_buyer_invoice_approval();

-- 5.6 Payment Request Notification
CREATE OR REPLACE FUNCTION notify_payment_request()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM notify_scf_users_by_role(
    NEW.payment_reference,
    'SCF Payment Request',
    'Payment request created: ' || NEW.payment_reference ||
    ' for program ' || NEW.program_id || 
    ' (Amount: ' || NEW.currency || ' ' || NEW.total_amount || ')',
    ARRAY['Bank', 'Buyer']::scf_user_role[],
    NEW.user_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5.7 Early Payment Request Notification
CREATE OR REPLACE FUNCTION notify_early_payment_request()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM notify_scf_users_by_role(
    NEW.request_reference,
    'SCF Early Payment Request',
    'Early payment request created: ' || NEW.request_reference ||
    ' for program ' || NEW.program_id || 
    ' (Discounted Amount: ' || NEW.currency || ' ' || NEW.total_discounted_amount || 
    ', Savings: ' || NEW.total_savings || ')',
    ARRAY['Bank', 'Buyer']::scf_user_role[],
    NEW.user_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Step 6: Drop old hardcoded function
DROP FUNCTION IF EXISTS notify_scf_users(TEXT, TEXT, TEXT) CASCADE;