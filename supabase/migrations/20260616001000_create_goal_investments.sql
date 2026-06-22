CREATE TABLE public.goal_investments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  goal_id uuid NOT NULL REFERENCES public.goals(id) ON DELETE CASCADE,
  investment_id uuid NOT NULL REFERENCES public.investments(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT goal_investments_goal_investment_unique UNIQUE (goal_id, investment_id)
);

ALTER TABLE public.goal_investments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view linked goal investments of their couple"
  ON public.goal_investments FOR SELECT
  USING (couple_id = get_my_couple_id());

CREATE POLICY "Users can insert linked goal investments for their couple"
  ON public.goal_investments FOR INSERT
  WITH CHECK (
    couple_id = get_my_couple_id()
    AND EXISTS (
      SELECT 1
      FROM public.goals
      WHERE goals.id = goal_investments.goal_id
        AND goals.couple_id = goal_investments.couple_id
    )
    AND EXISTS (
      SELECT 1
      FROM public.investments
      WHERE investments.id = goal_investments.investment_id
        AND investments.couple_id = goal_investments.couple_id
    )
  );

CREATE POLICY "Users can delete linked goal investments of their couple"
  ON public.goal_investments FOR DELETE
  USING (couple_id = get_my_couple_id());

CREATE INDEX idx_goal_investments_couple_id ON public.goal_investments(couple_id);
CREATE INDEX idx_goal_investments_goal_id ON public.goal_investments(goal_id);
CREATE INDEX idx_goal_investments_investment_id ON public.goal_investments(investment_id);
