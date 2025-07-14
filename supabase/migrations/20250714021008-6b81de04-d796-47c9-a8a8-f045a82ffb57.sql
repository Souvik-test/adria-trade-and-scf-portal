
-- Create table for outward documentary collection discount/finance requests
CREATE TABLE public.outward_dc_discount_finance_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bill_reference TEXT NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('discount', 'finance')),
  
  -- Bill basic details (copied from bill search)
  bill_currency TEXT,
  bill_amount NUMERIC,
  submission_date DATE,
  due_date DATE,
  importer_name TEXT,
  importer_address TEXT,
  exporter_name TEXT,
  exporter_address TEXT,
  
  -- Discount request fields
  discount_percentage NUMERIC,
  proceed_amount NUMERIC,
  credit_account_number TEXT,
  
  -- Finance request fields
  finance_currency TEXT,
  finance_amount NUMERIC,
  finance_tenor_days INTEGER,
  finance_percentage NUMERIC,
  principal_amount NUMERIC,
  interest_amount NUMERIC,
  total_repayment_amount NUMERIC,
  repayment_account_number TEXT,
  
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.outward_dc_discount_finance_requests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Custom users can create their own discount/finance requests"
  ON public.outward_dc_discount_finance_requests
  FOR INSERT
  WITH CHECK (user_id IN (
    SELECT custom_users.id
    FROM custom_users
    WHERE custom_users.user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  ));

CREATE POLICY "Custom users can view their own discount/finance requests"
  ON public.outward_dc_discount_finance_requests
  FOR SELECT
  USING (user_id IN (
    SELECT custom_users.id
    FROM custom_users
    WHERE custom_users.user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  ));

CREATE POLICY "Custom users can update their own discount/finance requests"
  ON public.outward_dc_discount_finance_requests
  FOR UPDATE
  USING (user_id IN (
    SELECT custom_users.id
    FROM custom_users
    WHERE custom_users.user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  ));

CREATE POLICY "Custom users can delete their own discount/finance requests"
  ON public.outward_dc_discount_finance_requests
  FOR DELETE
  USING (user_id IN (
    SELECT custom_users.id
    FROM custom_users
    WHERE custom_users.user_id = ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text)
  ));

-- Insert dummy bill data for testing (using hardcoded user ID)
INSERT INTO public.outward_documentary_collection_bills (
  user_id,
  bill_reference,
  bill_currency,
  bill_amount,
  drawer_name,
  drawer_address,
  drawee_payer_name,
  drawee_payer_address,
  collecting_bank,
  collecting_bank_address,
  collecting_bank_swift_code,
  tenor_days,
  created_at,
  status
) VALUES 
(
  '8cceba0f-c1a9-4074-8dbc-be256e0cc448',
  'ODCBILL1',
  'USD',
  150000.00,
  'ABC Exports Ltd',
  '123 Export Street, Mumbai, India',
  'XYZ Imports Inc',
  '456 Import Avenue, New York, USA',
  'Chase Bank',
  '789 Financial District, New York, USA',
  'CHASUS33',
  90,
  '2024-01-15 10:00:00',
  'submitted'
),
(
  '8cceba0f-c1a9-4074-8dbc-be256e0cc448',
  'ODCBILL2',
  'EUR',
  75000.00,
  'DEF Trading Co',
  '456 Trade Plaza, Delhi, India',
  'GHI Corporation',
  '789 Business Park, London, UK',
  'HSBC Bank',
  '321 Banking Street, London, UK',
  'HBUKGB4B',
  60,
  '2024-01-20 14:30:00',
  'submitted'
),
(
  '8cceba0f-c1a9-4074-8dbc-be256e0cc448',
  'ODCBILL3',
  'USD',
  200000.00,
  'PQR Industries',
  '789 Industrial Area, Chennai, India',
  'STU Enterprises',
  '123 Commercial Zone, Los Angeles, USA',
  'Bank of America',
  '456 Corporate Center, Los Angeles, USA',
  'BOFAUS3N',
  120,
  '2024-02-01 09:15:00',
  'submitted'
),
(
  '8cceba0f-c1a9-4074-8dbc-be256e0cc448',
  'ODCBILL4',
  'GBP',
  95000.00,
  'MNO Textiles',
  '321 Textile Hub, Bangalore, India',
  'VWX Fashion Ltd',
  '654 Fashion District, Manchester, UK',
  'Barclays Bank',
  '987 Financial Center, Manchester, UK',
  'BARCGB22',
  75,
  '2024-02-10 11:45:00',
  'submitted'
),
(
  '8cceba0f-c1a9-4074-8dbc-be256e0cc448',
  'ODCBILL5',
  'USD',
  180000.00,
  'JKL Electronics',
  '654 Tech Park, Hyderabad, India',
  'RST Technologies',
  '321 Silicon Valley, San Francisco, USA',
  'Wells Fargo Bank',
  '159 Tech Boulevard, San Francisco, USA',
  'WFBIUS6S',
  105,
  '2024-02-15 16:20:00',
  'submitted'
);
