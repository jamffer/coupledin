-- Migration: create RPC get_active_transaction_months
-- Returns distinct year-month pairs from the transactions table for a given couple,
-- ordered from most recent to oldest.

CREATE OR REPLACE FUNCTION public.get_active_transaction_months(_couple_id uuid)
RETURNS TABLE (year int, month int) AS $$
BEGIN
  RETURN QUERY
    SELECT
      EXTRACT(YEAR FROM t.date::date)::int AS year,
      EXTRACT(MONTH FROM t.date::date)::int AS month
    FROM public.transactions t
    WHERE t.couple_id = _couple_id
    GROUP BY 1, 2
    ORDER BY 1 DESC, 2 DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
