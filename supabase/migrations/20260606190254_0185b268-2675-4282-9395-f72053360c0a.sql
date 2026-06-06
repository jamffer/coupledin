
REVOKE EXECUTE ON FUNCTION public.join_couple_with_invite(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_my_invite_code() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.prevent_couple_id_change() FROM PUBLIC, anon, authenticated;
