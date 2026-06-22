-- CoupleDin usability roadmap: settlements, card payments, budgets and recurring transactions.

ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS responsible_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_recurring boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS recurrence_rule text,
  ADD COLUMN IF NOT EXISTS recurrence_day integer CHECK (recurrence_day BETWEEN 1 AND 31),
  ADD COLUMN IF NOT EXISTS recurrence_status text NOT NULL DEFAULT 'active'
    CHECK (recurrence_status IN ('active', 'paused', 'cancelled')),
  ADD COLUMN IF NOT EXISTS recurrence_parent_id uuid REFERENCES public.transactions(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS generated_for_month date;

UPDATE public.transactions
SET responsible_id = user_id
WHERE responsible_id IS NULL;

UPDATE public.transactions
SET type = CASE
  WHEN type IN ('Saída', 'EXPENSE', 'expense') AND card_id IS NOT NULL THEN 'Crédito'
  WHEN type IN ('Saída', 'EXPENSE', 'expense') THEN 'Débito'
  WHEN type = 'INCOME' THEN 'Entrada'
  ELSE type
END;

CREATE UNIQUE INDEX IF NOT EXISTS transactions_recurring_month_unique
  ON public.transactions (recurrence_parent_id, generated_for_month)
  WHERE recurrence_parent_id IS NOT NULL AND generated_for_month IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  month date NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  payer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  settled_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT settlements_distinct_people CHECK (payer_id <> receiver_id),
  CONSTRAINT settlements_one_per_month UNIQUE (couple_id, month)
);

CREATE TABLE IF NOT EXISTS public.card_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  card_id uuid NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  billing_month date NOT NULL,
  amount numeric NOT NULL CHECK (amount >= 0),
  paid_at timestamptz NOT NULL DEFAULT now(),
  paid_by uuid NOT NULL DEFAULT auth.uid() REFERENCES public.profiles(id) ON DELETE CASCADE,
  CONSTRAINT card_payments_one_per_invoice UNIQUE (card_id, billing_month)
);

CREATE TABLE IF NOT EXISTS public.budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  category text NOT NULL,
  monthly_limit numeric NOT NULL CHECK (monthly_limit > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT budgets_one_per_category UNIQUE (couple_id, category)
);

ALTER TABLE public.settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couple members can view settlements"
  ON public.settlements FOR SELECT TO authenticated
  USING (couple_id = public.get_my_couple_id());
CREATE POLICY "Couple members can create settlements"
  ON public.settlements FOR INSERT TO authenticated
  WITH CHECK (couple_id = public.get_my_couple_id() AND created_by = auth.uid());
CREATE POLICY "Couple members can delete settlements"
  ON public.settlements FOR DELETE TO authenticated
  USING (couple_id = public.get_my_couple_id());

CREATE POLICY "Couple members can view card payments"
  ON public.card_payments FOR SELECT TO authenticated
  USING (couple_id = public.get_my_couple_id());
CREATE POLICY "Couple members can create card payments"
  ON public.card_payments FOR INSERT TO authenticated
  WITH CHECK (couple_id = public.get_my_couple_id() AND paid_by = auth.uid());
CREATE POLICY "Couple members can delete card payments"
  ON public.card_payments FOR DELETE TO authenticated
  USING (couple_id = public.get_my_couple_id());

CREATE POLICY "Couple members can view budgets"
  ON public.budgets FOR SELECT TO authenticated
  USING (couple_id = public.get_my_couple_id());
CREATE POLICY "Couple members can create budgets"
  ON public.budgets FOR INSERT TO authenticated
  WITH CHECK (couple_id = public.get_my_couple_id());
CREATE POLICY "Couple members can update budgets"
  ON public.budgets FOR UPDATE TO authenticated
  USING (couple_id = public.get_my_couple_id())
  WITH CHECK (couple_id = public.get_my_couple_id());
CREATE POLICY "Couple members can delete budgets"
  ON public.budgets FOR DELETE TO authenticated
  USING (couple_id = public.get_my_couple_id());

GRANT SELECT, INSERT, DELETE ON public.settlements TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.card_payments TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.budgets TO authenticated;

