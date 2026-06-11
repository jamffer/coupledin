-- 1) Adicionar coluna image_url à tabela goals
ALTER TABLE public.goals 
ADD COLUMN image_url text;

-- 2) Adicionar coluna goal_id à tabela transactions
ALTER TABLE public.transactions 
ADD COLUMN goal_id uuid REFERENCES public.goals(id) ON DELETE SET NULL;

-- 3) Criar bucket público 'goal_covers'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('goal_covers', 'goal_covers', true)
ON CONFLICT (id) DO NOTHING;

-- 4) Políticas de RLS para o bucket 'goal_covers'
CREATE POLICY "Public Access to Goal Covers" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'goal_covers');

CREATE POLICY "Authenticated users can upload goal covers" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'goal_covers'
);

CREATE POLICY "Authenticated users can update goal covers" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (
  bucket_id = 'goal_covers'
);

CREATE POLICY "Authenticated users can delete goal covers" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
  bucket_id = 'goal_covers'
);
