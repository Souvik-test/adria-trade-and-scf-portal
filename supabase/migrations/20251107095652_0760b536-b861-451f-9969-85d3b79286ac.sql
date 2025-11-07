-- First, create a unique constraint on invoice_disbursements
ALTER TABLE invoice_disbursements 
ADD CONSTRAINT invoice_disbursements_invoice_loan_key 
UNIQUE (scf_invoice_id, loan_reference);

-- Function to sync finance disbursements to invoice disbursements
CREATE OR REPLACE FUNCTION sync_finance_to_invoice_disbursements()
RETURNS TRIGGER AS $$
DECLARE
  v_invoice RECORD;
  v_total_amount numeric;
BEGIN
  -- Only sync when status changes to approved or disbursed
  IF NEW.status IN ('approved', 'disbursed') AND 
     (OLD IS NULL OR OLD.status IS NULL OR OLD.status NOT IN ('approved', 'disbursed')) THEN
    
    -- Loop through selected invoices
    FOR v_invoice IN 
      SELECT 
        (value->>'invoice_id')::uuid as invoice_id,
        (value->>'amount')::numeric as amount,
        value->>'currency' as currency
      FROM jsonb_array_elements(NEW.selected_invoices)
    LOOP
      -- Get total amount of the invoice
      SELECT total_amount INTO v_total_amount
      FROM scf_invoices
      WHERE id = v_invoice.invoice_id;
      
      -- Create invoice_disbursements record
      INSERT INTO invoice_disbursements (
        scf_invoice_id,
        program_id,
        loan_reference,
        disbursed_amount,
        finance_percentage,
        disbursement_status,
        disbursed_at
      ) VALUES (
        v_invoice.invoice_id,
        NEW.program_id,
        NEW.disbursement_reference,
        v_invoice.amount,
        CASE WHEN v_total_amount > 0 THEN (v_invoice.amount / v_total_amount * 100) ELSE 0 END,
        CASE WHEN NEW.status = 'disbursed' THEN 'completed' ELSE 'pending' END,
        CASE WHEN NEW.status = 'disbursed' THEN now() ELSE NULL END
      )
      ON CONFLICT (scf_invoice_id, loan_reference) 
      DO UPDATE SET
        disbursement_status = CASE WHEN NEW.status = 'disbursed' THEN 'completed' ELSE 'pending' END,
        disbursed_at = CASE WHEN NEW.status = 'disbursed' THEN now() ELSE invoice_disbursements.disbursed_at END;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_sync_finance_disbursements ON finance_disbursements;
CREATE TRIGGER trigger_sync_finance_disbursements
AFTER INSERT OR UPDATE ON finance_disbursements
FOR EACH ROW EXECUTE FUNCTION sync_finance_to_invoice_disbursements();

-- Backfill existing finance disbursements to invoice_disbursements
INSERT INTO invoice_disbursements (
  scf_invoice_id,
  program_id,
  loan_reference,
  disbursed_amount,
  finance_percentage,
  disbursement_status,
  disbursed_at
)
SELECT 
  (invoice->>'invoice_id')::uuid as scf_invoice_id,
  fd.program_id,
  fd.disbursement_reference,
  (invoice->>'amount')::numeric as disbursed_amount,
  CASE 
    WHEN inv.total_amount > 0 THEN ((invoice->>'amount')::numeric / inv.total_amount * 100)
    ELSE 0 
  END as finance_percentage,
  CASE 
    WHEN fd.status = 'disbursed' THEN 'completed'
    WHEN fd.status = 'approved' THEN 'pending'
    ELSE 'pending'
  END as disbursement_status,
  CASE WHEN fd.status = 'disbursed' THEN fd.created_at ELSE NULL END as disbursed_at
FROM finance_disbursements fd
CROSS JOIN LATERAL jsonb_array_elements(fd.selected_invoices) as invoice
LEFT JOIN scf_invoices inv ON inv.id = (invoice->>'invoice_id')::uuid
WHERE fd.status IN ('approved', 'disbursed')
ON CONFLICT (scf_invoice_id, loan_reference) DO NOTHING;