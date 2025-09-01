-- Fix function search path security warnings
-- Add SECURITY DEFINER SET search_path to all functions for security

-- Update existing functions to have proper search_path settings
CREATE OR REPLACE FUNCTION public.generate_export_bill_ref()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $function$
DECLARE
  next_val INTEGER;
  formatted_ref TEXT;
BEGIN
  -- Create sequence if it doesn't exist
  CREATE SEQUENCE IF NOT EXISTS seq_export_bill_ref;
  
  -- Get next value
  SELECT nextval('seq_export_bill_ref') INTO next_val;
  
  -- Format as EXP-BILL-YYYY-NNNNNN
  formatted_ref := 'EXP-BILL-' || EXTRACT(YEAR FROM NOW()) || '-' || lpad(next_val::text, 6, '0');
  
  RETURN formatted_ref;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_export_bill_reference()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
  IF NEW.bill_reference IS NULL OR NEW.bill_reference = '' THEN
    NEW.bill_reference := public.generate_export_bill_ref();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_documentary_collection_bill_ref()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $function$
DECLARE
  next_val INTEGER;
  formatted_ref TEXT;
BEGIN
  -- Create sequence if it doesn't exist
  CREATE SEQUENCE IF NOT EXISTS seq_doc_collection_bill_ref;
  
  -- Get next value
  SELECT nextval('seq_doc_collection_bill_ref') INTO next_val;
  
  -- Format as DOC-BILL-YYYY-NNNNNN
  formatted_ref := 'DOC-BILL-' || EXTRACT(YEAR FROM NOW()) || '-' || lpad(next_val::text, 6, '0');
  
  RETURN formatted_ref;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_documentary_collection_bill_reference()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
  IF NEW.bill_reference IS NULL OR NEW.bill_reference = '' THEN
    NEW.bill_reference := public.generate_documentary_collection_bill_ref();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_lc_transfer_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
  -- Insert transaction record
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
    initiating_channel
  ) VALUES (
    NEW.user_id,
    NEW.request_reference,
    'Export LC',
    'LC Transfer',
    NEW.status,
    NEW.current_beneficiary,
    NEW.amount,
    NEW.currency,
    (SELECT email FROM auth.users WHERE id = NEW.user_id),
    'Portal'
  );
  
  -- Insert notification
  INSERT INTO public.notifications (
    user_id,
    transaction_ref,
    transaction_type,
    message
  ) VALUES (
    NEW.user_id,
    NEW.request_reference,
    'Export LC',
    'LC Transfer request submitted for ' || NEW.lc_reference || ' - Reference: ' || NEW.request_reference
  );
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_lc_transfer_ref()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $function$
DECLARE
  next_val INTEGER;
  formatted_ref TEXT;
BEGIN
  -- Create sequence if it doesn't exist
  CREATE SEQUENCE IF NOT EXISTS seq_lc_transfer_ref;
  
  -- Get next value
  SELECT nextval('seq_lc_transfer_ref') INTO next_val;
  
  -- Format as TRF-YYYY-NNNNNN
  formatted_ref := 'TRF-' || EXTRACT(YEAR FROM NOW()) || '-' || lpad(next_val::text, 6, '0');
  
  RETURN formatted_ref;
END;
$function$;