-- Drop existing triggers and functions if they exist
DROP TRIGGER IF EXISTS trigger_notify_program_changes ON scf_program_configurations;
DROP TRIGGER IF EXISTS trigger_notify_invoice_creation ON scf_invoices;
DROP TRIGGER IF EXISTS trigger_notify_auto_disbursement ON invoice_disbursements;
DROP TRIGGER IF EXISTS trigger_notify_finance_disbursement ON finance_disbursements;
DROP TRIGGER IF EXISTS trigger_notify_payment_request ON payment_requests;
DROP TRIGGER IF EXISTS trigger_notify_early_payment_request ON early_payment_requests;
DROP TRIGGER IF EXISTS trigger_notify_repayment ON invoice_repayments;

DROP FUNCTION IF EXISTS notify_scf_users(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS notify_program_changes();
DROP FUNCTION IF EXISTS notify_invoice_creation();
DROP FUNCTION IF EXISTS notify_auto_disbursement();
DROP FUNCTION IF EXISTS notify_finance_disbursement();
DROP FUNCTION IF EXISTS notify_payment_request();
DROP FUNCTION IF EXISTS notify_early_payment_request();
DROP FUNCTION IF EXISTS notify_repayment();

-- 1. Create helper function to notify specific SCF users
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
    -- Get user_id from custom_users table
    SELECT id INTO v_user_id
    FROM custom_users
    WHERE user_id = v_email
    LIMIT 1;
    
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
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Program configuration notifications
CREATE OR REPLACE FUNCTION notify_program_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM notify_scf_users(
      NEW.program_id,
      'SCF Program',
      'New SCF program created: ' || NEW.program_name || ' (' || NEW.program_id || ')'
    );
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM notify_scf_users(
      NEW.program_id,
      'SCF Program',
      'SCF program updated: ' || NEW.program_name || ' (' || NEW.program_id || ')'
    );
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM notify_scf_users(
      OLD.program_id,
      'SCF Program',
      'SCF program deleted: ' || OLD.program_name || ' (' || OLD.program_id || ')'
    );
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_notify_program_changes
AFTER INSERT OR UPDATE OR DELETE ON scf_program_configurations
FOR EACH ROW EXECUTE FUNCTION notify_program_changes();

-- 3. Invoice creation notifications
CREATE OR REPLACE FUNCTION notify_invoice_creation()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM notify_scf_users(
    NEW.invoice_number,
    'SCF Invoice',
    'Invoice ' || NEW.invoice_number || ' created for program ' || NEW.program_id || 
    ' (Amount: ' || NEW.currency || ' ' || NEW.total_amount || ')'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_notify_invoice_creation
AFTER INSERT ON scf_invoices
FOR EACH ROW EXECUTE FUNCTION notify_invoice_creation();

-- 4. Auto-disbursement notifications
CREATE OR REPLACE FUNCTION notify_auto_disbursement()
RETURNS TRIGGER AS $$
DECLARE
  v_invoice_number TEXT;
BEGIN
  IF NEW.disbursement_status = 'completed' THEN
    SELECT invoice_number INTO v_invoice_number
    FROM scf_invoices
    WHERE id = NEW.scf_invoice_id;
    
    PERFORM notify_scf_users(
      NEW.loan_reference,
      'SCF Finance',
      'Auto-disbursement completed for invoice ' || COALESCE(v_invoice_number, 'Unknown') ||
      ' - Loan Ref: ' || NEW.loan_reference || ' (Amount: ' || NEW.disbursed_amount || ')'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_notify_auto_disbursement
AFTER INSERT ON invoice_disbursements
FOR EACH ROW 
WHEN (NEW.disbursement_status = 'completed')
EXECUTE FUNCTION notify_auto_disbursement();

-- 5. Manual finance disbursement notifications
CREATE OR REPLACE FUNCTION notify_finance_disbursement()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM notify_scf_users(
    NEW.disbursement_reference,
    'SCF Finance',
    'Manual finance disbursement created: ' || NEW.disbursement_reference ||
    ' for program ' || NEW.program_id || ' (Total: ' || NEW.total_disbursed_amount || ')'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_notify_finance_disbursement
AFTER INSERT ON finance_disbursements
FOR EACH ROW EXECUTE FUNCTION notify_finance_disbursement();

-- 6. Payment request notifications
CREATE OR REPLACE FUNCTION notify_payment_request()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM notify_scf_users(
    NEW.payment_reference,
    'SCF Payment',
    'Payment request created: ' || NEW.payment_reference ||
    ' for program ' || NEW.program_id || ' (Amount: ' || NEW.currency || ' ' || NEW.total_amount || ')'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_notify_payment_request
AFTER INSERT ON payment_requests
FOR EACH ROW EXECUTE FUNCTION notify_payment_request();

-- 7. Early payment request notifications
CREATE OR REPLACE FUNCTION notify_early_payment_request()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM notify_scf_users(
    NEW.request_reference,
    'SCF Early Payment',
    'Early payment request created: ' || NEW.request_reference ||
    ' for program ' || NEW.program_id || 
    ' (Discounted Amount: ' || NEW.currency || ' ' || NEW.total_discounted_amount || 
    ', Savings: ' || NEW.total_savings || ')'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_notify_early_payment_request
AFTER INSERT ON early_payment_requests
FOR EACH ROW EXECUTE FUNCTION notify_early_payment_request();

-- 8. Repayment notifications
CREATE OR REPLACE FUNCTION notify_repayment()
RETURNS TRIGGER AS $$
DECLARE
  v_repayment_type TEXT;
BEGIN
  v_repayment_type := CASE 
    WHEN NEW.repayment_mode = 'auto' THEN 'Auto-repayment'
    ELSE 'Manual repayment'
  END;
  
  PERFORM notify_scf_users(
    NEW.repayment_reference,
    'SCF Repayment',
    v_repayment_type || ' processed: ' || NEW.repayment_reference ||
    ' for loan ' || NEW.loan_reference ||
    ' (Amount: ' || NEW.currency || ' ' || NEW.repayment_amount || ')'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_notify_repayment
AFTER INSERT ON invoice_repayments
FOR EACH ROW EXECUTE FUNCTION notify_repayment();