import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";

export function useSettlements() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  const queryKey = ["settlements", profile?.couple_id];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!profile?.couple_id) return [];
      const { data, error } = await supabase
        .from("settlements")
        .select("*")
        .eq("couple_id", profile.couple_id)
        .order("month", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.couple_id,
  });

  const createSettlement = useMutation({
    mutationFn: async (input: {
      month: string;
      amount: number;
      payer_id: string;
      receiver_id: string;
    }) => {
      if (!profile?.couple_id) throw new Error("Espaço do casal não encontrado.");
      const { data, error } = await supabase
        .from("settlements")
        .insert({ ...input, couple_id: profile.couple_id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  const deleteSettlement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("settlements").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { ...query, createSettlement, deleteSettlement };
}

