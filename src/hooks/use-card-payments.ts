import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";

export function useCardPayments() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  const queryKey = ["card-payments", profile?.couple_id];

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      if (!profile?.couple_id) return [];
      const { data, error } = await supabase
        .from("card_payments")
        .select("*")
        .eq("couple_id", profile.couple_id)
        .order("billing_month", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.couple_id,
  });

  const payInvoice = useMutation({
    mutationFn: async (input: { card_id: string; billing_month: string; amount: number }) => {
      if (!profile?.couple_id) throw new Error("Espaço do casal não encontrado.");
      const { data, error } = await supabase
        .from("card_payments")
        .insert({ ...input, couple_id: profile.couple_id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
  });

  return { ...query, payInvoice };
}

