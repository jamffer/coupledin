CREATE TABLE public.goals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id uuid NOT NULL REFERENCES public.couples(id) ON DELETE CASCADE,
  title text NOT NULL,
  target_amount numeric NOT NULL,
  saved_amount numeric DEFAULT 0,
  deadline date,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view goals of their couple"
  ON public.goals FOR SELECT
  USING (couple_id = get_my_couple_id());

CREATE POLICY "Users can insert goals for their couple"
  ON public.goals FOR INSERT
  WITH CHECK (couple_id = get_my_couple_id());

CREATE POLICY "Users can update goals of their couple"
  ON public.goals FOR UPDATE
  USING (couple_id = get_my_couple_id());

CREATE POLICY "Users can delete goals of their couple"
  ON public.goals FOR DELETE
  USING (couple_id = get_my_couple_id());
