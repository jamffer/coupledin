-- Rename credit_cards to cards
ALTER TABLE IF EXISTS public.credit_cards RENAME TO cards;

-- Update columns in cards table
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS couple_id UUID REFERENCES public.couples(id);
ALTER TABLE public.cards RENAME COLUMN user_id TO owner_id;
ALTER TABLE public.cards RENAME COLUMN total_limit TO limit_amount;
ALTER TABLE public.cards RENAME COLUMN last_digits TO last_four;

-- Ensure RLS is enabled
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist (they might have been named differently)
DROP POLICY IF EXISTS "Users can view their own cards" ON public.cards;
DROP POLICY IF EXISTS "Users can insert their own cards" ON public.cards;
DROP POLICY IF EXISTS "Users can update their own cards" ON public.cards;
DROP POLICY IF EXISTS "Users can delete their own cards" ON public.cards;

-- Create new RLS policies for cards based on couple_id
CREATE POLICY "Users can view couple cards" ON public.cards
    FOR SELECT TO authenticated
    USING (
        couple_id IN (
            SELECT couple_id FROM public.profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can insert couple cards" ON public.cards
    FOR INSERT TO authenticated
    WITH CHECK (
        couple_id IN (
            SELECT couple_id FROM public.profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can update couple cards" ON public.cards
    FOR UPDATE TO authenticated
    USING (
        couple_id IN (
            SELECT couple_id FROM public.profiles WHERE id = auth.uid()
        )
    )
    WITH CHECK (
        couple_id IN (
            SELECT couple_id FROM public.profiles WHERE id = auth.uid()
        )
    );

CREATE POLICY "Users can delete couple cards" ON public.cards
    FOR DELETE TO authenticated
    USING (
        couple_id IN (
            SELECT couple_id FROM public.profiles WHERE id = auth.uid()
        )
    );

-- Add card_id to transactions
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS card_id UUID REFERENCES public.cards(id);

-- Grants
GRANT ALL ON public.cards TO authenticated;
GRANT ALL ON public.cards TO service_role;
GRANT ALL ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
