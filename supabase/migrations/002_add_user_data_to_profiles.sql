-- Add columns to store user data in profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Update the trigger function to get data from auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, email)
  VALUES (NEW.id, 'user', NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- For existing profiles, we can't easily get the metadata
-- But the registration flow should populate it via the trigger
-- Let's just ensure profiles have the email column populated from balances table if available
UPDATE public.profiles p
SET email = b.email
FROM public.balances b
WHERE p.id = b.user_id AND p.email IS NULL;
