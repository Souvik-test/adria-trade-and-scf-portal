-- Insert a hardcoded user for souvikgenius@gmail.com if it doesn't exist
INSERT INTO public.custom_users (
  user_id, 
  user_login_id, 
  full_name, 
  password_hash,
  role_type,
  corporate_id
) 
SELECT 
  'souvikgenius@gmail.com',
  'souvikgenius@gmail.com', 
  'Souvik Genius',
  'dummy_hash',
  'All',
  'TC001'
WHERE NOT EXISTS (
  SELECT 1 FROM public.custom_users 
  WHERE user_login_id = 'souvikgenius@gmail.com' OR user_id = 'souvikgenius@gmail.com'
);