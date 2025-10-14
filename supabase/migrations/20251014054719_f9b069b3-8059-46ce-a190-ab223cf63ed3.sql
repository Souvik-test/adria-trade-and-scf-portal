-- Create invoice_upload_batches table to track upload sessions
CREATE TABLE public.invoice_upload_batches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  upload_type TEXT NOT NULL CHECK (upload_type IN ('single', 'bulk')),
  total_rows INTEGER NOT NULL DEFAULT 0,
  successful_rows INTEGER NOT NULL DEFAULT 0,
  rejected_rows INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice_upload_rejections table to track rejected rows
CREATE TABLE public.invoice_upload_rejections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES public.invoice_upload_batches(id) ON DELETE CASCADE,
  row_number INTEGER NOT NULL,
  invoice_number TEXT,
  rejection_reason TEXT NOT NULL,
  raw_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice_scanned_documents table for scanned invoice images
CREATE TABLE public.invoice_scanned_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scf_invoice_id UUID REFERENCES public.scf_invoices(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoice_disbursements table to track auto-disbursements
CREATE TABLE public.invoice_disbursements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scf_invoice_id UUID NOT NULL REFERENCES public.scf_invoices(id) ON DELETE CASCADE,
  program_id TEXT NOT NULL,
  loan_reference TEXT NOT NULL UNIQUE,
  disbursed_amount NUMERIC(15,2) NOT NULL,
  finance_percentage NUMERIC(5,2) NOT NULL,
  disbursement_status TEXT NOT NULL DEFAULT 'pending' CHECK (disbursement_status IN ('pending', 'completed', 'failed')),
  accounting_entry_ref TEXT,
  disbursed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX idx_upload_batches_user_id ON public.invoice_upload_batches(user_id);
CREATE INDEX idx_upload_batches_status ON public.invoice_upload_batches(status);
CREATE INDEX idx_upload_rejections_batch_id ON public.invoice_upload_rejections(batch_id);
CREATE INDEX idx_scanned_documents_invoice_id ON public.invoice_scanned_documents(scf_invoice_id);
CREATE INDEX idx_disbursements_invoice_id ON public.invoice_disbursements(scf_invoice_id);
CREATE INDEX idx_disbursements_status ON public.invoice_disbursements(disbursement_status);

-- Enable Row Level Security
ALTER TABLE public.invoice_upload_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_upload_rejections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_scanned_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_disbursements ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invoice_upload_batches
CREATE POLICY "Users can view their own upload batches"
  ON public.invoice_upload_batches FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own upload batches"
  ON public.invoice_upload_batches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own upload batches"
  ON public.invoice_upload_batches FOR UPDATE
  USING (true);

-- RLS Policies for invoice_upload_rejections
CREATE POLICY "Users can view rejections for their batches"
  ON public.invoice_upload_rejections FOR SELECT
  USING (true);

CREATE POLICY "Users can create rejections"
  ON public.invoice_upload_rejections FOR INSERT
  WITH CHECK (true);

-- RLS Policies for invoice_scanned_documents
CREATE POLICY "Users can view their invoice documents"
  ON public.invoice_scanned_documents FOR SELECT
  USING (true);

CREATE POLICY "Users can create invoice documents"
  ON public.invoice_scanned_documents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can delete their invoice documents"
  ON public.invoice_scanned_documents FOR DELETE
  USING (true);

-- RLS Policies for invoice_disbursements
CREATE POLICY "Users can view disbursements"
  ON public.invoice_disbursements FOR SELECT
  USING (true);

CREATE POLICY "System can create disbursements"
  ON public.invoice_disbursements FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update disbursements"
  ON public.invoice_disbursements FOR UPDATE
  USING (true);

-- Create storage bucket for invoice documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('invoice-documents', 'invoice-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for invoice-documents bucket
CREATE POLICY "Users can upload invoice documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'invoice-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can view invoice documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'invoice-documents' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete invoice documents"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'invoice-documents' AND auth.role() = 'authenticated');