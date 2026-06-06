
-- 1) Prevent users from arbitrarily changing their couple_id
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
  -- Block direct changes to couple_id via standard UPDATEs.
  -- Joining/leaving a couple must go through a SECURITY DEFINER RPC.
  RAISE EXCEPTION 'couple_id cannot be changed directly. Use join_couple_with_invite() or leave_couple().';
END;
$$;

DROP TRIGGER IF EXISTS profiles_prevent_couple_id_change ON public.profiles;
CREATE TRIGGER profiles_prevent_couple_id_change
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_couple_id_change();

-- 2) Restrict invite_code column access. Revoke column from authenticated;
--    members will read couples via SELECT (other columns) but not invite_code.
REVOKE SELECT ON public.couples FROM authenticated;
GRANT SELECT (id, name, created_at, updated_at) ON public.couples TO authenticated;
GRANT ALL ON public.couples TO service_role;

-- 3) SECURITY DEFINER RPC to join a couple using an invite code,
--    and rotate the invite code immediately so it cannot be reused.
CREATE OR REPLACE FUNCTION public.join_couple_with_invite(_invite_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_couple_id uuid;
  v_user uuid := auth.uid();
  v_member_count int;
BEGIN
  IF v_user IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT id INTO v_couple_id FROM public.couples WHERE invite_code = _invite_code;
  IF v_couple_id IS NULL THEN
    RAISE EXCEPTION 'Invalid invite code';
  END IF;

  SELECT count(*) INTO v_member_count FROM public.profiles WHERE couple_id = v_couple_id;
  IF v_member_count >= 2 THEN
    RAISE EXCEPTION 'Couple is already full';
  END IF;

  -- Bypass the trigger by disabling it for this session-local update
  ALTER TABLE public.profiles DISABLE TRIGGER profiles_prevent_couple_id_change;
  UPDATE public.profiles SET couple_id = v_couple_id, updated_at = now() WHERE id = v_user;
  ALTER TABLE public.profiles ENABLE TRIGGER profiles_prevent_couple_id_change;

  -- Rotate invite code so it can't be reused
  UPDATE public.couples
  SET invite_code = substring(md5(random()::text) from 1 for 8), updated_at = now()
  WHERE id = v_couple_id;

  RETURN v_couple_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.join_couple_with_invite(text) TO authenticated;

-- 4) RPC for the user to retrieve their own couple's invite code (so partner can be invited)
CREATE OR REPLACE FUNCTION public.get_my_invite_code()
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_code text;
BEGIN
  SELECT c.invite_code INTO v_code
  FROM public.couples c
  JOIN public.profiles p ON p.couple_id = c.id
  WHERE p.id = auth.uid();
  RETURN v_code;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_invite_code() TO authenticated;
