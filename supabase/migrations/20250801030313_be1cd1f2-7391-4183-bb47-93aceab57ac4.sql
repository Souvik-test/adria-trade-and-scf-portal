-- Create a proper user_profiles table linked to Supabase Auth
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  user_login_id TEXT NOT NULL,
  corporate_id TEXT NOT NULL DEFAULT 'TC001',
  role_type user_role_type NOT NULL DEFAULT 'Viewer',
  product_linkage product_type[] DEFAULT ARRAY[]::product_type[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Update RLS policies for outward_documentary_collection_bills to use auth.uid() directly
DROP POLICY IF EXISTS "Custom users can create their own documentary collection bills" ON public.outward_documentary_collection_bills;
DROP POLICY IF EXISTS "Custom users can view their own documentary collection bills" ON public.outward_documentary_collection_bills;
DROP POLICY IF EXISTS "Custom users can update their own documentary collection bills" ON public.outward_documentary_collection_bills;
DROP POLICY IF EXISTS "Custom users can delete their own documentary collection bills" ON public.outward_documentary_collection_bills;

-- Create new simplified RLS policies using auth.uid()
CREATE POLICY "Users can create their own documentary collection bills" ON public.outward_documentary_collection_bills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own documentary collection bills" ON public.outward_documentary_collection_bills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own documentary collection bills" ON public.outward_documentary_collection_bills
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documentary collection bills" ON public.outward_documentary_collection_bills
  FOR DELETE USING (auth.uid() = user_id);

-- Update import_lc_requests RLS policies to use auth.uid() directly
DROP POLICY IF EXISTS "Custom users can create their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Custom users can view their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Custom users can update their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Custom users can delete their own import LC requests" ON public.import_lc_requests;
DROP POLICY IF EXISTS "Users can view own requests or submitted requests" ON public.import_lc_requests;

-- Create new simplified RLS policies for import_lc_requests
CREATE POLICY "Users can create their own import LC requests" ON public.import_lc_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own or submitted import LC requests" ON public.import_lc_requests
  FOR SELECT USING (auth.uid() = user_id OR status = 'submitted');

CREATE POLICY "Users can update their own import LC requests" ON public.import_lc_requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own import LC requests" ON public.import_lc_requests
  FOR DELETE USING (auth.uid() = user_id);

-- Update import_lc_supporting_documents RLS policies
DROP POLICY IF EXISTS "Custom users can manage their import LC documents" ON public.import_lc_supporting_documents;

CREATE POLICY "Users can manage their import LC documents" ON public.import_lc_supporting_documents
  FOR ALL USING (
    import_lc_request_id IN (
      SELECT id FROM import_lc_requests WHERE user_id = auth.uid()
    )
  );

-- Create trigger to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id, 
    full_name, 
    user_login_id, 
    corporate_id, 
    role_type, 
    product_linkage
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'user_login_id', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'corporate_id', 'TC001'),
    COALESCE((NEW.raw_user_meta_data->>'role_type')::user_role_type, 'Viewer'),
    COALESCE((NEW.raw_user_meta_data->>'product_linkage')::product_type[], ARRAY[]::product_type[])
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();