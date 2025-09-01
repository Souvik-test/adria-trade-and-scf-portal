-- Fix remaining function search path security warnings
-- Update all remaining functions to have proper search_path settings

CREATE OR REPLACE FUNCTION public.generate_assignment_ref()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $function$
DECLARE
  next_val INTEGER;
  formatted_ref TEXT;
BEGIN
  -- Create sequence if it doesn't exist
  CREATE SEQUENCE IF NOT EXISTS seq_assignment_ref;
  
  -- Get next value
  SELECT nextval('seq_assignment_ref') INTO next_val;
  
  -- Format as ASG-YYYY-NNNNNN
  formatted_ref := 'ASG-' || EXTRACT(YEAR FROM NOW()) || '-' || lpad(next_val::text, 6, '0');
  
  RETURN formatted_ref;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_transaction_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.handle_assignment_submission()
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
    'Assignment Request',
    NEW.status,
    NEW.assignee_name,
    NEW.assignment_amount,
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
    'Assignment request submitted for ' || NEW.lc_reference || ' - Reference: ' || NEW.request_reference
  );
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_outward_bg_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
  -- Only create transaction record when status changes to 'submitted'
  IF NEW.status = 'submitted' AND OLD.status != 'submitted' THEN
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
      'Bank Guarantee',
      'Outward BG Issuance',
      NEW.status,
      NEW.beneficiary_name,
      NEW.guarantee_amount,
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
      'Bank Guarantee',
      'Outward Bank Guarantee issuance request submitted - Reference: ' || NEW.request_reference
    );
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_documentary_collection_bill_submission()
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
    NEW.bill_reference,
    'Documentary Collection',
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'Submit Bill'
      WHEN TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN 'Update Bill'
      ELSE 'Update Bill'
    END,
    NEW.status,
    NEW.drawee_payer_name,
    NEW.bill_amount,
    NEW.bill_currency,
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
    NEW.bill_reference,
    'Documentary Collection',
    CASE 
      WHEN TG_OP = 'INSERT' THEN 'Documentary collection bill submitted - Reference: ' || NEW.bill_reference
      WHEN TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN 'Documentary collection bill updated - Reference: ' || NEW.bill_reference
      ELSE 'Documentary collection bill updated - Reference: ' || NEW.bill_reference
    END
  );
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_transaction_ref(product_type text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $function$
declare
  sequence_name text;
  next_val integer;
  formatted_ref text;
begin
  -- Sequence name per product type (safe format)
  sequence_name := 'seq_' || regexp_replace(lower(product_type), '[^a-z0-9_]', '', 'g') || '_ref';

  -- Create the sequence if it does not exist
  execute format('create sequence if not exists %I', sequence_name);

  -- Get the next value from the sequence
  execute format('select nextval(%L)', sequence_name) into next_val;

  -- Format reference as "TYPE-000001"
  formatted_ref := upper(product_type) || '-' || lpad(next_val::text, 6, '0');
  return formatted_ref;
end;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    email, 
    full_name, 
    role, 
    department, 
    phone,
    corporate_id,
    user_login_id,
    role_type,
    product_linkage
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'LC_MAKER'),
    COALESCE(NEW.raw_user_meta_data->>'department', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'corporate_id', 'TC001'),
    COALESCE(NEW.raw_user_meta_data->>'user_login_id', ''),
    COALESCE((NEW.raw_user_meta_data->>'role_type')::user_role_type, 'Viewer'),
    COALESCE((NEW.raw_user_meta_data->>'product_linkage')::product_type[], ARRAY[]::product_type[])
  );
  RETURN NEW;
END;
$function$;

-- Update the newly created functions to also have proper search_path
CREATE OR REPLACE FUNCTION public.prevent_password_hash_update()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Allow password hash updates only if it's currently NULL (initial signup)
  IF OLD.password_hash IS NOT NULL AND NEW.password_hash != OLD.password_hash THEN
    RAISE EXCEPTION 'Direct password hash updates are not allowed for security reasons';
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_user_password(old_password text, new_password text)
RETURNS boolean 
LANGUAGE plpgsql 
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  current_user_id text;
  stored_hash text;
BEGIN
  -- Get current user ID from JWT
  current_user_id := ((current_setting('request.jwt.claims'::text, true))::json ->> 'user_id'::text);
  
  -- Get stored password hash
  SELECT password_hash INTO stored_hash 
  FROM public.custom_users 
  WHERE user_id = current_user_id;
  
  -- Verify old password (implement your password verification logic here)
  -- This is a placeholder - implement actual password verification
  IF stored_hash IS NULL THEN
    RETURN false;
  END IF;
  
  -- Update password hash (implement your password hashing logic here)
  -- This is a placeholder - implement actual password hashing
  UPDATE public.custom_users 
  SET password_hash = new_password, updated_at = now()
  WHERE user_id = current_user_id;
  
  RETURN true;
END;
$$;