ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;
ALTER FUNCTION public.prevent_couple_id_change() SET search_path = public;
ALTER FUNCTION public.get_my_invite_code() SET search_path = public;
ALTER FUNCTION public.get_my_couple_id() SET search_path = public;
ALTER FUNCTION public.create_couple(text) SET search_path = public;
ALTER FUNCTION public.join_couple_with_invite(text) SET search_path = public;