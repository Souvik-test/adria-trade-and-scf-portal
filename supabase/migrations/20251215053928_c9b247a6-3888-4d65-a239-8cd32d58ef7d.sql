-- Set souvikgenius@gmail.com as super user for User Access Management access
UPDATE public.custom_users 
SET is_super_user = true 
WHERE user_id = 'souvikgenius@gmail.com';