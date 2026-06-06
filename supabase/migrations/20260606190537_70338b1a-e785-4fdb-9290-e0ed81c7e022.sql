-- 1) Create a helper to get current user's couple_id without recursion
CREATE OR REPLACE FUNCTION public.get_my_couple_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT couple_id FROM public.profiles WHERE id = auth.uid();
$$;

-- 2) Fix recursion by replacing complex SELECT policies on profiles
DROP POLICY IF EXISTS "Users can view all profiles in their couple" ON public.profiles;
DROP POLICY IF EXISTS "Users can view partner profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view own or couple profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid() 
  OR 
  (couple_id IS NOT NULL AND couple_id = public.get_my_couple_id())
);

-- 3) Update the trigger to allow initial couple_id assignment
CREATE OR REPLACE FUNCTION public.prevent_couple_id_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow if couple_id is unchanged
  IF NEW.couple_id IS NOT DISTINCT FROM OLD.couple_id THEN
    RETURN NEW;
  END IF;

  -- Allow if OLD.couple_id is NULL (first time joining/creating)
  IF OLD.couple_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Block direct changes to couple_id after it has been set.
  RAISE EXCEPTION 'couple_id cannot be changed directly after being set. Use an authorized procedure.';
END;
$$;

-- 4) Create RPC to safely create a new couple
CREATE OR REPLACE FUNCTION public.create_couple(_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_couple_id uuid;
  v_user uuid := auth.uid();
  v_invite_code text;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if user already has a couple
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = v_user AND couple_id IS NOT NULL) THEN
    RAISE EXCEPTION 'User already belongs to a couple';
  END IF;

  v_invite_code := substring(md5(random()::text) from 1 for 8);

  INSERT INTO public.couples (name, invite_code)
  VALUES (_name, v_invite_code)
  RETURNING id INTO v_couple_id;

  UPDATE public.profiles
  SET couple_id = v_couple_id, updated_at = now()
  WHERE id = v_user;

  RETURN v_couple_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_couple(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_couple_id() TO authenticated;
