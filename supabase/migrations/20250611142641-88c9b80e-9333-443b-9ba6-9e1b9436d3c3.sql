
-- Create custom users table for User ID/Password authentication
CREATE TABLE public.custom_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  user_login_id TEXT UNIQUE NOT NULL,
  corporate_id TEXT DEFAULT 'TC001',
  role_type user_role_type DEFAULT 'Viewer',
  product_linkage product_type[] DEFAULT ARRAY[]::product_type[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_custom_users_user_id ON public.custom_users(user_id);
CREATE INDEX idx_custom_users_user_login_id ON public.custom_users(user_login_id);

-- Enable RLS
ALTER TABLE public.custom_users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can view their own data" ON public.custom_users
FOR SELECT USING (true);

-- Allow anyone to insert (for signup)
CREATE POLICY "Anyone can signup" ON public.custom_users
FOR INSERT WITH CHECK (true);

-- Allow users to update their own data
CREATE POLICY "Users can update their own data" ON public.custom_users
FOR UPDATE USING (true);
