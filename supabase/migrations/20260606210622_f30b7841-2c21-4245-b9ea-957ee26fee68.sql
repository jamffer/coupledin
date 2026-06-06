CREATE TABLE public.credit_cards (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    total_limit DECIMAL(12,2) NOT NULL DEFAULT 0,
    card_type TEXT NOT NULL CHECK (card_type IN ('Meu Cartão', 'Cartão do Parceiro(a)', 'Cartão Conjunto')),
    last_digits TEXT,
    color TEXT DEFAULT 'card-gradient-blue',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Grant access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.credit_cards TO authenticated;
GRANT ALL ON public.credit_cards TO service_role;

-- Enable RLS
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can manage their own credit cards" 
ON public.credit_cards FOR ALL 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Couples policy: user can see cards of users who share the same couple_id
CREATE POLICY "Users can view partner's credit cards" 
ON public.credit_cards FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles p1
        JOIN public.profiles p2 ON p1.couple_id = p2.couple_id
        WHERE p1.id = auth.uid() AND p2.id = credit_cards.user_id AND p1.couple_id IS NOT NULL
    )
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_credit_cards_updated_at 
BEFORE UPDATE ON public.credit_cards 
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();