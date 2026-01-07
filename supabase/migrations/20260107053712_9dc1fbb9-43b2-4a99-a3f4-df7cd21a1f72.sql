-- Add business_application and initiating_channel columns to remittance_transactions
ALTER TABLE remittance_transactions 
  ADD COLUMN IF NOT EXISTS business_application TEXT,
  ADD COLUMN IF NOT EXISTS initiating_channel TEXT;

-- Add business_application and initiating_channel columns to interbank_settlements  
ALTER TABLE interbank_settlements
  ADD COLUMN IF NOT EXISTS business_application TEXT,
  ADD COLUMN IF NOT EXISTS initiating_channel TEXT;

-- Update handle_remittance_submission trigger to use the new columns
CREATE OR REPLACE FUNCTION public.handle_remittance_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IN ('draft') THEN
    RETURN NEW;
  END IF;
  
  -- Only sync when status changes
  IF OLD IS NULL OR OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO transactions (
      user_id, transaction_ref, product_type, process_type, status,
      customer_name, amount, currency, created_by, 
      initiating_channel, business_application
    ) VALUES (
      NEW.user_id,
      NEW.transaction_ref,
      'Remittance',
      CASE WHEN NEW.transfer_type = 'customer' 
           THEN 'Customer Credit Transfer (pacs.008)' 
           ELSE 'FI Credit Transfer (pacs.009)' END,
      NEW.status,
      COALESCE(NEW.ord_name, NEW.ben_name),
      NEW.inst_amt,
      NEW.ccy,
      NEW.created_by,
      COALESCE(NEW.initiating_channel, 'Portal'),
      COALESCE(NEW.business_application, 'Adria TSCF Client')
    )
    ON CONFLICT (transaction_ref) DO UPDATE SET
      status = EXCLUDED.status,
      initiating_channel = EXCLUDED.initiating_channel,
      business_application = EXCLUDED.business_application,
      amount = EXCLUDED.amount,
      customer_name = EXCLUDED.customer_name;
  END IF;
  RETURN NEW;
END;
$$;

-- Update handle_interbank_submission trigger to use the new columns
CREATE OR REPLACE FUNCTION public.handle_interbank_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IN ('draft') THEN
    RETURN NEW;
  END IF;
  
  -- Only sync when status changes
  IF OLD IS NULL OR OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO transactions (
      user_id, transaction_ref, product_type, process_type, status,
      customer_name, amount, currency, created_by,
      initiating_channel, business_application
    ) VALUES (
      NEW.user_id,
      NEW.settlement_ref,
      'Remittance',
      'FI Credit Transfer (pacs.009)',
      NEW.status,
      NEW.instd_agt_name,
      NEW.sttlm_amt,
      NEW.ccy,
      NEW.created_by,
      COALESCE(NEW.initiating_channel, 'Portal'),
      COALESCE(NEW.business_application, 'Adria TSCF Client')
    )
    ON CONFLICT (transaction_ref) DO UPDATE SET
      status = EXCLUDED.status,
      initiating_channel = EXCLUDED.initiating_channel,
      business_application = EXCLUDED.business_application,
      amount = EXCLUDED.amount,
      customer_name = EXCLUDED.customer_name;
  END IF;
  RETURN NEW;
END;
$$;