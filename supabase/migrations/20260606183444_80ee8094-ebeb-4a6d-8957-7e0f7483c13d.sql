-- Transactions table with couple isolation
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    description TEXT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL, -- 'Entrada', 'Débito', 'Crédito'
    responsible TEXT NOT NULL,
    division TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ensure RLS is enabled
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Grant permissions (safe to run multiple times)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.couples TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT ALL ON public.couples TO service_role;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.transactions TO service_role;

-- RLS Policies (using DO blocks to be safe if they exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can manage their own profile') THEN
        CREATE POLICY "Users can manage their own profile" ON public.profiles
            FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their linked couple') THEN
        CREATE POLICY "Users can view their linked couple" ON public.couples
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE profiles.id = auth.uid() AND profiles.couple_id = couples.id
                )
            );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Couple members can manage transactions') THEN
        CREATE POLICY "Couple members can manage transactions" ON public.transactions
            FOR ALL USING (
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE profiles.id = auth.uid() AND profiles.couple_id = transactions.couple_id
                )
            ) WITH CHECK (
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE profiles.id = auth.uid() AND profiles.couple_id = transactions.couple_id
                )
            );
    END IF;
END
$$;
