-- Create Enum for Asset Types
CREATE TYPE public.asset_type AS ENUM ('STOCK', 'FII', 'CRYPTO', 'FIXED_INCOME');

-- Create investments table
CREATE TABLE public.investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    couple_id UUID NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
    asset_type public.asset_type NOT NULL,
    ticker TEXT NOT NULL,
    quantity NUMERIC NOT NULL CHECK (quantity >= 0),
    average_price NUMERIC NOT NULL CHECK (average_price >= 0),
    purchase_date DATE NOT NULL DEFAULT CURRENT_DATE,
    custom_rate NUMERIC, -- Stored as decimal percentage, e.g., 1.5 for 1.5%
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view investments of their couple"
    ON public.investments
    FOR SELECT
    USING (
        couple_id IN (
            SELECT couple_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can insert investments for their couple"
    ON public.investments
    FOR INSERT
    WITH CHECK (
        couple_id IN (
            SELECT couple_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can update investments of their couple"
    ON public.investments
    FOR UPDATE
    USING (
        couple_id IN (
            SELECT couple_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
    );

CREATE POLICY "Users can delete investments of their couple"
    ON public.investments
    FOR DELETE
    USING (
        couple_id IN (
            SELECT couple_id FROM public.profiles WHERE profiles.id = auth.uid()
        )
    );

-- Create index for performance
CREATE INDEX idx_investments_couple_id ON public.investments(couple_id);
