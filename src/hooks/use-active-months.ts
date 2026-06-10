import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { startOfMonth } from "date-fns";

export interface ActiveMonth {
  year: number;
  month: number;
  /** Pre-built Date object (first day of that month) for easy integration */
  date: Date;
}

/**
 * Fetches the distinct months that have at least one transaction for the
 * authenticated couple. Tries the Supabase RPC first; if it hasn't been
 * deployed yet, falls back to deriving months from the local transactions
 * array already in the Zustand store.
 *
 * @returns React Query result with `data: ActiveMonth[]`
 */
export function useActiveMonths() {
  const { profile } = useProfile();
  const coupleId = profile?.couple_id;

  return useQuery<ActiveMonth[]>({
    queryKey: ["active-months", coupleId],
    queryFn: async (): Promise<ActiveMonth[]> => {
      if (!coupleId) return [];

      try {
        // Try the RPC first (requires the migration to be deployed)
        const { data, error } = await supabase.rpc(
          "get_active_transaction_months",
          { _couple_id: coupleId }
        );

        if (error) throw error;

        return (data as { year: number; month: number }[]).map((row) => ({
          year: row.year,
          month: row.month,
          date: new Date(row.year, row.month - 1, 1), // JS months are 0-indexed
        }));
      } catch (rpcError) {
        // Fallback: derive from the transactions table directly via PostgREST
        console.warn(
          "[useActiveMonths] RPC not available, falling back to PostgREST query",
          rpcError
        );

        const { data: txData, error: txError } = await supabase
          .from("transactions")
          .select("date")
          .eq("couple_id", coupleId);

        if (txError) throw txError;

        // Derive unique year-month pairs
        const seen = new Set<string>();
        const months: ActiveMonth[] = [];

        for (const tx of txData || []) {
          if (!tx.date) continue;
          const d = new Date(tx.date);
          const key = `${d.getFullYear()}-${d.getMonth()}`;
          if (!seen.has(key)) {
            seen.add(key);
            months.push({
              year: d.getFullYear(),
              month: d.getMonth() + 1,
              date: startOfMonth(d),
            });
          }
        }

        // Sort most recent first
        months.sort((a, b) => {
          if (a.year !== b.year) return b.year - a.year;
          return b.month - a.month;
        });

        return months;
      }
    },
    enabled: !!coupleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
