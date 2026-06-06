
-- 1. Harden profiles UPDATE policy: prevent couple_id changes via direct update
DROP POLICY IF EXISTS "Users can only update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND couple_id IS NOT DISTINCT FROM (SELECT p.couple_id FROM public.profiles p WHERE p.id = auth.uid())
);

-- 2. Harden transactions UPDATE policy: prevent moving to another couple
DROP POLICY IF EXISTS "Only creators can update their own transactions" ON public.transactions;

CREATE POLICY "Only creators can update their own transactions"
ON public.transactions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND couple_id = public.get_my_couple_id()
);

-- 3. Revoke EXECUTE on internal trigger functions from public/authenticated
REVOKE EXECUTE ON FUNCTION public.prevent_couple_id_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
