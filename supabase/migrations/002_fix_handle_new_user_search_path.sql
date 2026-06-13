-- Fix handle_new_user trigger function to include search_path
-- Without SET search_path = 'public', the user_role type is not found
-- when GoTrue's supabase_auth_admin role invokes the trigger.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'patient'::public.user_role)
  );
  RETURN new;
END;
$$;
