
-- Create table for resolve discrepancies submissions
CREATE TABLE public.resolve_discrepancies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  bill_reference TEXT NOT NULL,
  lc_reference TEXT,
  corporate_reference TEXT,
  applicant_name TEXT,
  issuing_bank TEXT,
  discrepancy_notification_date DATE,
  discrepancy_type TEXT,
  document_type TEXT,
  discrepancy_description TEXT,
  resolution_status TEXT,
  document_reupload_required TEXT,
  resolution_remarks TEXT,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.resolve_discrepancies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own resolve discrepancies records" 
  ON public.resolve_discrepancies 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own resolve discrepancies records" 
  ON public.resolve_discrepancies 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resolve discrepancies records" 
  ON public.resolve_discrepancies 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Add trigger to update updated_at timestamp
CREATE TRIGGER trigger_update_resolve_discrepancies_updated_at
  BEFORE UPDATE ON public.resolve_discrepancies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert transactions for submitted export LC bills into transactions table
INSERT INTO public.transactions (
  user_id,
  transaction_ref,
  product_type,
  process_type,
  status,
  customer_name,
  amount,
  currency,
  created_by,
  initiating_channel,
  created_date
)
SELECT 
  user_id,
  bill_reference,
  'EXPORT LC BILLS',
  'PRESENT BILL',
  status,
  applicant_name,
  bill_amount,
  bill_currency,
  (SELECT email FROM auth.users WHERE id = export_lc_bills.user_id),
  'Portal',
  created_at::date
FROM public.export_lc_bills 
WHERE status = 'submitted'
AND bill_reference NOT IN (
  SELECT transaction_ref FROM public.transactions WHERE product_type = 'EXPORT LC BILLS'
);
