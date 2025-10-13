-- Create SCF Invoices table
CREATE TABLE public.scf_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  invoice_type TEXT NOT NULL CHECK (invoice_type IN ('invoice', 'credit-note', 'debit-note')),
  program_id TEXT NOT NULL,
  program_name TEXT NOT NULL,
  invoice_number TEXT NOT NULL,
  invoice_date DATE,
  due_date DATE,
  purchase_order_number TEXT,
  purchase_order_currency TEXT,
  purchase_order_amount NUMERIC DEFAULT 0,
  purchase_order_date DATE,
  buyer_id TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  seller_id TEXT NOT NULL,
  seller_name TEXT NOT NULL,
  currency TEXT DEFAULT 'USD',
  subtotal NUMERIC DEFAULT 0,
  tax_amount NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC DEFAULT 0,
  payment_terms TEXT,
  notes TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create SCF Invoice Line Items table
CREATE TABLE public.scf_invoice_line_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scf_invoice_id UUID NOT NULL REFERENCES public.scf_invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  tax_rate NUMERIC DEFAULT 0,
  line_total NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.scf_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scf_invoice_line_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scf_invoices
CREATE POLICY "Users can view their own SCF invoices"
  ON public.scf_invoices
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own SCF invoices"
  ON public.scf_invoices
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own SCF invoices"
  ON public.scf_invoices
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own SCF invoices"
  ON public.scf_invoices
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for scf_invoice_line_items
CREATE POLICY "Users can view line items for their SCF invoices"
  ON public.scf_invoice_line_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.scf_invoices
      WHERE scf_invoices.id = scf_invoice_line_items.scf_invoice_id
      AND scf_invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create line items for their SCF invoices"
  ON public.scf_invoice_line_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.scf_invoices
      WHERE scf_invoices.id = scf_invoice_line_items.scf_invoice_id
      AND scf_invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update line items for their SCF invoices"
  ON public.scf_invoice_line_items
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.scf_invoices
      WHERE scf_invoices.id = scf_invoice_line_items.scf_invoice_id
      AND scf_invoices.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete line items for their SCF invoices"
  ON public.scf_invoice_line_items
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.scf_invoices
      WHERE scf_invoices.id = scf_invoice_line_items.scf_invoice_id
      AND scf_invoices.user_id = auth.uid()
    )
  );

-- Add trigger for updated_at timestamp
CREATE TRIGGER update_scf_invoices_updated_at
  BEFORE UPDATE ON public.scf_invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();