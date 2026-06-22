import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";

export function useBudgets() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  const queryKey = ["budgets", profile?.couple_id];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!profile?.couple_id) return [];
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("couple_id", profile.couple_id)
        .order("category");
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.couple_id,
  });

  const saveBudget = useMutation({
    mutationFn: async (input: { category: string; monthly_limit: number }) => {
      if (!profile?.couple_id) throw new Error("Espaço do casal não encontrado.");
      const { error } = await supabase.from("budgets").upsert(
        { ...input, couple_id: profile.couple_id, updated_at: new Date().toISOString() },
        { onConflict: "couple_id,category" },
      );
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteBudget = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("budgets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { ...query, saveBudget, deleteBudget };
}

