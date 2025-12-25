-- Drop existing remittance tables (they are empty)
DROP TABLE IF EXISTS remittance_recipients CASCADE;
DROP TABLE IF EXISTS remittance_transfers CASCADE;

-- Create sequence for remittance transaction reference
CREATE SEQUENCE IF NOT EXISTS seq_remittance_tx_ref;

-- Create sequence for interbank settlement reference  
CREATE SEQUENCE IF NOT EXISTS seq_interbank_sttl_ref;

-- Create remittance_transactions table (for PACS.008 - Customer Credit Transfer)
CREATE TABLE remittance_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES custom_users(id),
  transaction_ref TEXT UNIQUE NOT NULL,
  transfer_type TEXT NOT NULL DEFAULT 'customer',
  direction TEXT NOT NULL DEFAULT 'outward',
  status TEXT NOT NULL DEFAULT 'draft',
  current_stage TEXT DEFAULT 'Data Entry',
  
  -- Payment Header (Pane 1)
  msg_ref TEXT,
  uetr TEXT,
  cre_dt TIMESTAMPTZ DEFAULT NOW(),
  sttlm_mtd TEXT,
  biz_svc TEXT,
  
  -- Ordering Customer (Pane 2)
  ord_name TEXT,
  ord_acct TEXT,
  ord_country TEXT,
  ord_state TEXT,
  ord_city TEXT,
  ord_addr1 TEXT,
  ord_addr2 TEXT,
  ord_post_code TEXT,
  ord_bic TEXT,
  
  -- Beneficiary Customer (Pane 3)
  ben_name TEXT,
  ben_acct TEXT,
  ben_country TEXT,
  ben_state TEXT,
  ben_city TEXT,
  ben_addr1 TEXT,
  ben_addr2 TEXT,
  ben_post_code TEXT,
  ben_bic TEXT,
  
  -- Amount & Charges (Pane 4)
  inst_amt NUMERIC(18,2),
  ccy TEXT DEFAULT 'USD',
  xchg_rate NUMERIC(18,6),
  chg_br TEXT,
  
  -- Routing & Settlement (Pane 5)
  instg_agt_bic TEXT,
  instd_agt_bic TEXT,
  intrmdy_agt_bic TEXT,
  
  -- Regulatory Compliance (Pane 6)
  purp_cd TEXT,
  src_funds TEXT,
  decl_flg BOOLEAN DEFAULT FALSE,
  aml_notes TEXT,
  
  -- Remittance Info (Pane 7)
  rmt_info TEXT,
  inv_ref TEXT,
  
  -- Linked PACS.009 (if COVE settlement)
  linked_pacs009_id UUID,
  
  -- Form data as JSONB for flexibility
  form_data JSONB,
  
  -- Corporate & User Info
  corporate_id TEXT DEFAULT 'TC001',
  created_by TEXT,
  
  -- Timestamps & Workflow
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  rejected_at TIMESTAMPTZ,
  rejected_by UUID,
  rejection_reason TEXT
);

-- Create interbank_settlements table (for PACS.009 - FI Credit Transfer)
CREATE TABLE interbank_settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES custom_users(id),
  settlement_ref TEXT UNIQUE NOT NULL,
  parent_pacs008_id UUID REFERENCES remittance_transactions(id),
  transfer_type TEXT NOT NULL DEFAULT 'fi',
  direction TEXT NOT NULL DEFAULT 'outward',
  status TEXT NOT NULL DEFAULT 'draft',
  current_stage TEXT DEFAULT 'Data Entry',
  
  -- Settlement Header (Pane 1)
  uetr TEXT,
  cre_dt TIMESTAMPTZ DEFAULT NOW(),
  sttlm_mtd TEXT,
  
  -- Instructing Agent (Pane 2)
  instg_agt_name TEXT,
  instg_agt_bic TEXT,
  instg_agt_country TEXT,
  instg_agt_state TEXT,
  instg_agt_city TEXT,
  instg_agt_addr1 TEXT,
  instg_agt_addr2 TEXT,
  instg_agt_post_code TEXT,
  
  -- Instructed Agent (Pane 3)
  instd_agt_name TEXT,
  instd_agt_bic TEXT,
  instd_agt_country TEXT,
  instd_agt_state TEXT,
  instd_agt_city TEXT,
  instd_agt_addr1 TEXT,
  instd_agt_addr2 TEXT,
  instd_agt_post_code TEXT,
  
  -- Settlement Amount (Pane 4)
  sttlm_amt NUMERIC(18,2),
  ccy TEXT DEFAULT 'USD',
  val_dt DATE,
  
  -- Cover Linkage (Pane 5)
  linked_pacs008_ref TEXT,
  linked_uetr TEXT,
  
  -- Settlement Instructions (Pane 6)
  instr_cd TEXT,
  addtl_info TEXT,
  
  -- Form data as JSONB
  form_data JSONB,
  
  -- Corporate & User Info
  corporate_id TEXT DEFAULT 'TC001',
  created_by TEXT,
  
  -- Timestamps & Workflow
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  approved_by UUID,
  rejected_at TIMESTAMPTZ,
  rejected_by UUID,
  rejection_reason TEXT
);

-- Enable RLS
ALTER TABLE remittance_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interbank_settlements ENABLE ROW LEVEL SECURITY;

-- Policies for remittance_transactions
CREATE POLICY "Users can view their own remittance transactions"
  ON remittance_transactions FOR SELECT
  USING (user_id IN (SELECT id FROM custom_users WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)));

CREATE POLICY "Users can create their own remittance transactions"
  ON remittance_transactions FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM custom_users WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)));

CREATE POLICY "Users can update their own remittance transactions"
  ON remittance_transactions FOR UPDATE
  USING (user_id IN (SELECT id FROM custom_users WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)));

-- Policies for interbank_settlements
CREATE POLICY "Users can view their own interbank settlements"
  ON interbank_settlements FOR SELECT
  USING (user_id IN (SELECT id FROM custom_users WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)));

CREATE POLICY "Users can create their own interbank settlements"
  ON interbank_settlements FOR INSERT
  WITH CHECK (user_id IN (SELECT id FROM custom_users WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)));

CREATE POLICY "Users can update their own interbank settlements"
  ON interbank_settlements FOR UPDATE
  USING (user_id IN (SELECT id FROM custom_users WHERE user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)));

-- Trigger function for auto-generating remittance transaction reference
CREATE OR REPLACE FUNCTION generate_remittance_tx_ref()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.transaction_ref IS NULL OR NEW.transaction_ref = '' THEN
    NEW.transaction_ref := 'REM-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                          LPAD(nextval('seq_remittance_tx_ref')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger function for auto-generating interbank settlement reference
CREATE OR REPLACE FUNCTION generate_interbank_sttl_ref()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.settlement_ref IS NULL OR NEW.settlement_ref = '' THEN
    NEW.settlement_ref := 'FIS-' || EXTRACT(YEAR FROM NOW()) || '-' || 
                         LPAD(nextval('seq_interbank_sttl_ref')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for auto-reference generation
CREATE TRIGGER set_remittance_tx_ref
  BEFORE INSERT ON remittance_transactions
  FOR EACH ROW EXECUTE FUNCTION generate_remittance_tx_ref();

CREATE TRIGGER set_interbank_sttl_ref
  BEFORE INSERT ON interbank_settlements
  FOR EACH ROW EXECUTE FUNCTION generate_interbank_sttl_ref();

-- Create triggers for updated_at
CREATE TRIGGER update_remittance_tx_updated_at
  BEFORE UPDATE ON remittance_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interbank_sttl_updated_at
  BEFORE UPDATE ON interbank_settlements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger function to insert into transactions table for dashboard visibility
CREATE OR REPLACE FUNCTION handle_remittance_submission()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('Pending Approval', 'Approved') AND 
     (OLD IS NULL OR OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO transactions (
      user_id, transaction_ref, product_type, process_type, status,
      customer_name, amount, currency, created_by, initiating_channel
    ) VALUES (
      NEW.user_id,
      NEW.transaction_ref,
      'Remittance',
      CASE WHEN NEW.transfer_type = 'customer' THEN 'Customer Credit Transfer (pacs.008)' ELSE 'FI Credit Transfer (pacs.009)' END,
      NEW.status,
      COALESCE(NEW.ord_name, NEW.ben_name),
      NEW.inst_amt,
      NEW.ccy,
      NEW.created_by,
      'Portal'
    )
    ON CONFLICT (transaction_ref) DO UPDATE SET
      status = EXCLUDED.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for dashboard integration
CREATE TRIGGER trigger_remittance_submission
  AFTER INSERT OR UPDATE ON remittance_transactions
  FOR EACH ROW EXECUTE FUNCTION handle_remittance_submission();

-- Trigger function for interbank settlements dashboard
CREATE OR REPLACE FUNCTION handle_interbank_submission()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('Pending Approval', 'Approved') AND 
     (OLD IS NULL OR OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO transactions (
      user_id, transaction_ref, product_type, process_type, status,
      customer_name, amount, currency, created_by, initiating_channel
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
      'Portal'
    )
    ON CONFLICT (transaction_ref) DO UPDATE SET
      status = EXCLUDED.status;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_interbank_submission
  AFTER INSERT OR UPDATE ON interbank_settlements
  FOR EACH ROW EXECUTE FUNCTION handle_interbank_submission();