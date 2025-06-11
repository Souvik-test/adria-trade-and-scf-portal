
-- Drop and recreate the handle_new_user function with proper error handling
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
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
    CASE 
      WHEN NEW.raw_user_meta_data->>'product_linkage' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'product_linkage')::text[]::product_type[]
      ELSE ARRAY[]::product_type[]
    END
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error and still return NEW to not block signup
    RAISE WARNING 'Error creating user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$function$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
