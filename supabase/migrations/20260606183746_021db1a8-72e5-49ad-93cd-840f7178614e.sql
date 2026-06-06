-- Drop existing transaction policy to replace it
DROP POLICY IF EXISTS "Couple members can manage transactions" ON public.transactions;

-- 1. Anyone in the same couple can VIEW transactions
CREATE POLICY "Couple members can view shared transactions" ON public.transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.couple_id = transactions.couple_id
        )
    );

-- 2. Only the CREATOR can INSERT transactions (and they must belong to their couple)
CREATE POLICY "Users can create transactions for their couple" ON public.transactions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() AND profiles.couple_id = transactions.couple_id
        )
    );

-- 3. Only the CREATOR can UPDATE their own transactions
CREATE POLICY "Only creators can update their own transactions" ON public.transactions
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. Only the CREATOR can DELETE their own transactions
CREATE POLICY "Only creators can delete their own transactions" ON public.transactions
    FOR DELETE USING (auth.uid() = user_id);

-- Ensure profiles policy only allows self-edits (already exists but reinforcing)
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
CREATE POLICY "Users can view all profiles in their couple" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles AS my_profile
            WHERE my_profile.id = auth.uid() AND my_profile.couple_id = profiles.couple_id
        )
    );

CREATE POLICY "Users can only update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
