-- Create table for inward documentary collection bill payments
CREATE TABLE public.inward_documentary_collection_bill_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  
  -- SWIFT MT 400/416 Fields
  transaction_reference TEXT, -- :20: Transaction Reference Number
  related_reference TEXT, -- :21: Related Reference
  payment_date DATE, -- :32A: Date part
  currency TEXT DEFAULT 'USD', -- :32A: Currency Code
  amount NUMERIC, -- :32A: Amount
  
  -- Party Information
  ordering_customer_name TEXT, -- :50: Ordering Customer
  ordering_customer_address TEXT,
  ordering_customer_account TEXT,
  
  advising_bank_name TEXT, -- :57A/D: Advising Bank
  advising_bank_address TEXT,
  advising_bank_swift_code TEXT,
  
  beneficiary_name TEXT, -- :59: Beneficiary
  beneficiary_address TEXT,
  beneficiary_account TEXT,
  
  -- Additional Information
  remittance_information TEXT, -- :70: Remittance Information
  sender_to_receiver_info TEXT, -- :72: Sender to Receiver Information
  
  -- Collection Details
  collection_reference TEXT,
  bill_reference TEXT,
  drawee_name TEXT,
  drawer_name TEXT,
  
  -- Document Information
  supporting_documents JSONB DEFAULT '[]'::jsonb,
  
  -- Status and Timestamps
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.inward_documentary_collection_bill_payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can create their own inward DC bill payments"
ON public.inward_documentary_collection_bill_payments
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own inward DC bill payments"
ON public.inward_documentary_collection_bill_payments
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own inward DC bill payments"
ON public.inward_documentary_collection_bill_payments
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own inward DC bill payments"
ON public.inward_documentary_collection_bill_payments
FOR DELETE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_inward_dc_bill_payments_updated_at
BEFORE UPDATE ON public.inward_documentary_collection_bill_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create supporting documents table
CREATE TABLE public.inward_dc_bill_payment_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id UUID NOT NULL REFERENCES public.inward_documentary_collection_bill_payments(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT,
  file_type TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on documents table
ALTER TABLE public.inward_dc_bill_payment_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for documents
CREATE POLICY "Users can manage documents for their own payments"
ON public.inward_dc_bill_payment_documents
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.inward_documentary_collection_bill_payments 
  WHERE id = payment_id AND user_id = auth.uid()
));