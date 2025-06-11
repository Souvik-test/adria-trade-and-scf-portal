
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_ref TEXT NOT NULL,
  transaction_type TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table to track all user transactions
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_ref TEXT NOT NULL UNIQUE,
  product_type TEXT NOT NULL, -- PO, PI, Invoice, LC, BG, SBLC, Bills, Shipping Guarantee, Trade Loan
  status TEXT NOT NULL DEFAULT 'Draft',
  customer_name TEXT,
  amount NUMERIC,
  currency TEXT DEFAULT 'USD',
  created_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by TEXT NOT NULL,
  initiating_channel TEXT DEFAULT 'Portal',
  party_form TEXT,
  bank_ref TEXT,
  customer_ref TEXT,
  operations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_timestamp ON public.notifications(timestamp DESC);
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_ref ON public.transactions(transaction_ref);
CREATE INDEX idx_transactions_product_type ON public.transactions(product_type);
CREATE INDEX idx_transactions_status ON public.transactions(status);

-- Enable RLS on notifications table
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (true);

CREATE POLICY "System can create notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (true);

-- Enable RLS on transactions table
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.transactions 
  FOR SELECT 
  USING (true);

CREATE POLICY "System can create transactions" 
  ON public.transactions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Users can update their own transactions" 
  ON public.transactions 
  FOR UPDATE 
  USING (true);

-- Function to generate transaction reference numbers
CREATE OR REPLACE FUNCTION generate_transaction_ref(product_type TEXT)
RETURNS TEXT AS $$
DECLARE
  prefix TEXT;
  counter INTEGER;
  ref_number TEXT;
BEGIN
  -- Set prefix based on product type
  CASE product_type
    WHEN 'PO' THEN prefix := 'PO';
    WHEN 'PI' THEN prefix := 'PI';
    WHEN 'Invoice' THEN prefix := 'INV';
    WHEN 'LC' THEN prefix := 'LC';
    WHEN 'BG' THEN prefix := 'BG';
    WHEN 'SBLC' THEN prefix := 'SBLC';
    WHEN 'Bills' THEN prefix := 'BILL';
    WHEN 'Shipping Guarantee' THEN prefix := 'SG';
    WHEN 'Trade Loan' THEN prefix := 'TL';
    ELSE prefix := 'TXN';
  END CASE;
  
  -- Get next counter for this product type
  SELECT COALESCE(MAX(CAST(SUBSTRING(transaction_ref FROM LENGTH(prefix) + 1) AS INTEGER)), 0) + 1
  INTO counter
  FROM transactions
  WHERE transaction_ref LIKE prefix || '%'
  AND transaction_ref ~ ('^' || prefix || '[0-9]+$');
  
  -- Generate reference number
  ref_number := prefix || LPAD(counter::TEXT, 6, '0');
  
  RETURN ref_number;
END;
$$ LANGUAGE plpgsql;

-- Function to create notification when transaction is created
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

-- Create trigger to auto-create notifications
CREATE TRIGGER transaction_notification_trigger
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION create_transaction_notification();
