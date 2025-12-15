-- Drop both password protection triggers
DROP TRIGGER IF EXISTS prevent_password_hash_update ON public.custom_users;
DROP TRIGGER IF EXISTS prevent_password_hash_update_trigger ON public.custom_users;