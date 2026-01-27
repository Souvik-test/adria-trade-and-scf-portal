-- Create a security definer function to insert SCF invoices for custom_users
-- This bypasses RLS since custom auth users don't have JWT claims
CREATE OR REPLACE FUNCTION public.insert_scf_invoice(
  p_user_id uuid,
  p_invoice_type text,
  p_program_id text,
  p_program_name text,
  p_invoice_number text,
  p_invoice_date date,
  p_due_date date,
  p_purchase_order_number text DEFAULT NULL,
  p_purchase_order_currency text DEFAULT NULL,
  p_purchase_order_amount numeric DEFAULT 0,
  p_purchase_order_date date DEFAULT NULL,
  p_buyer_id text DEFAULT NULL,
  p_buyer_name text DEFAULT NULL,
  p_seller_id text DEFAULT NULL,
  p_seller_name text DEFAULT NULL,
  p_currency text DEFAULT 'USD',
  p_subtotal numeric DEFAULT 0,
  p_tax_amount numeric DEFAULT 0,
  p_discount_amount numeric DEFAULT 0,
  p_total_amount numeric DEFAULT 0,
  p_payment_terms text DEFAULT NULL,
  p_notes text DEFAULT NULL,
  p_buyers_acceptance_required boolean DEFAULT false,
  p_status text DEFAULT 'draft'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invoice_id uuid;
BEGIN
  -- Validate that user_id exists in custom_users
  IF NOT EXISTS (SELECT 1 FROM public.custom_users WHERE id = p_user_id) THEN
    RAISE EXCEPTION 'Invalid user_id: user does not exist in custom_users';
  END IF;

  -- Insert the invoice
  INSERT INTO public.scf_invoices (
    user_id,
    invoice_type,
    program_id,
    program_name,
    invoice_number,
    invoice_date,
    due_date,
    purchase_order_number,
    purchase_order_currency,
    purchase_order_amount,
    purchase_order_date,
    buyer_id,
    buyer_name,
    seller_id,
    seller_name,
    currency,
    subtotal,
    tax_amount,
    discount_amount,
    total_amount,
    payment_terms,
    notes,
    buyers_acceptance_required,
    status
  ) VALUES (
    p_user_id,
    p_invoice_type,
    p_program_id,
    p_program_name,
    p_invoice_number,
    p_invoice_date,
    p_due_date,
    p_purchase_order_number,
    p_purchase_order_currency,
    p_purchase_order_amount,
    p_purchase_order_date,
    p_buyer_id,
    p_buyer_name,
    p_seller_id,
    p_seller_name,
    p_currency,
    p_subtotal,
    p_tax_amount,
    p_discount_amount,
    p_total_amount,
    p_payment_terms,
    p_notes,
    p_buyers_acceptance_required,
    p_status
  )
  RETURNING id INTO v_invoice_id;

  RETURN v_invoice_id;
END;
$$;