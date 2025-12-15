-- Temporarily store plaintext password for SUP001 so edge function can upgrade it to bcrypt on next login
UPDATE public.custom_users
SET password_hash = '123456'
WHERE user_login_id = 'SUP001';