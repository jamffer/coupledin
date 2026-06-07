-- Adicionar novos campos na tabela cards
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS due_day INTEGER CHECK (due_day >= 1 AND due_day <= 31);
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS closing_day INTEGER CHECK (closing_day >= 1 AND closing_day <= 31);

-- Definir valores padrão para os cartões existentes
UPDATE public.cards SET due_day = 10 WHERE due_day IS NULL;
UPDATE public.cards SET closing_day = 5 WHERE closing_day IS NULL;

-- Tornar as colunas obrigatórias
ALTER TABLE public.cards ALTER COLUMN due_day SET NOT NULL;
ALTER TABLE public.cards ALTER COLUMN closing_day SET NOT NULL;

-- Adicionar nova coluna na tabela transactions
ALTER TABLE public.transactions ADD COLUMN IF NOT EXISTS billing_date DATE;

-- Preencher billing_date retroativamente baseado no date existente se card_id for NULL
UPDATE public.transactions SET billing_date = date_trunc('month', date)::DATE WHERE billing_date IS NULL;
