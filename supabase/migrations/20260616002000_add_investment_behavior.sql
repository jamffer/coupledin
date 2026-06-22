CREATE TYPE public.investment_behavior AS ENUM (
  'DISTRIBUTES_INCOME',
  'ACCUMULATES_VALUE',
  'REINVESTS_AUTOMATICALLY',
  'FIXED_INCOME_MATURITY',
  'CRYPTOASSET',
  'OTHER'
);

ALTER TABLE public.investments
ADD COLUMN investment_behavior public.investment_behavior NOT NULL DEFAULT 'ACCUMULATES_VALUE';

UPDATE public.investments
SET investment_behavior = CASE
  WHEN asset_type = 'FIXED_INCOME' THEN 'FIXED_INCOME_MATURITY'::public.investment_behavior
  WHEN asset_type = 'CRYPTO' THEN 'CRYPTOASSET'::public.investment_behavior
  ELSE 'ACCUMULATES_VALUE'::public.investment_behavior
END
WHERE investment_behavior = 'ACCUMULATES_VALUE';
