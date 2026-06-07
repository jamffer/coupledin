-- Modifica a foreign key de transactions.user_id para referenciar public.profiles(id) ao invés de auth.users(id)
-- Isso permite joins automáticos no PostgREST entre transactions e profiles.

ALTER TABLE public.transactions DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;

ALTER TABLE public.transactions
ADD CONSTRAINT transactions_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.profiles(id) 
ON DELETE CASCADE;
