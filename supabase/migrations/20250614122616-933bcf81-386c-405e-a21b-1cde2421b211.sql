
-- Create a reusable function to generate unique transaction references per product type
create or replace function public.generate_transaction_ref(product_type text)
returns text
language plpgsql
as $$
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
$$;

-- Grant execute permission so the app can call it
grant execute on function public.generate_transaction_ref(text) to anon, authenticated, service_role;
