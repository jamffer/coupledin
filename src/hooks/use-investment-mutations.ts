import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "./use-profile";
import { EnrichedInvestment } from "./use-investment-portfolio";
import { toast } from "sonner";
import { calculateFixedIncomeCurrentValue } from "@/services/api/finance";

interface UpdatePayload {
  id: string;
  quantity: number;
  average_price: number;
  custom_rate: number;
}

export function useUpdateInvestment() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdatePayload) => {
      if (!profile?.couple_id) throw new Error("Couple ID não encontrado");

      const { data, error } = await supabase
        .from('investments')
        .update({
          quantity: payload.quantity,
          average_price: payload.average_price,
          custom_rate: payload.custom_rate,
          updated_at: new Date().toISOString(),
        })
        .eq('id', payload.id)
        .eq('couple_id', profile.couple_id) // Garantia RLS na query
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (updatedAsset) => {
      const queryKey = ["investments", profile?.couple_id];
      await queryClient.cancelQueries({ queryKey });

      const previousInvestments = queryClient.getQueryData<EnrichedInvestment[]>(queryKey);

      if (previousInvestments) {
        queryClient.setQueryData(queryKey, (old: EnrichedInvestment[]) => {
          return old.map(inv => {
            if (inv.id === updatedAsset.id) {
              // Recalcula os valores baseados no update
              const quantity = Number(updatedAsset.quantity);
              const average_price = Number(updatedAsset.average_price);
              const custom_rate = Number(updatedAsset.custom_rate);
              const total_invested = quantity * average_price;
              
              let current_price = inv.current_price;
              
              if (inv.asset_type === "FIXED_INCOME" && custom_rate > 0) {
                const totalVal = calculateFixedIncomeCurrentValue(
                  average_price,
                  quantity,
                  inv.purchase_date,
                  custom_rate
                );
                current_price = quantity > 0 ? totalVal / quantity : 0;
              }

              const current_value = quantity * current_price;
              const profit_loss_percentage = total_invested > 0 
                ? ((current_value / total_invested) - 1) * 100 
                : 0;

              return {
                ...inv,
                quantity: quantity,
                average_price: average_price,
                custom_rate: custom_rate,
                total_invested,
                current_value,
                profit_loss_percentage,
                current_price,
              };
            }
            return inv;
          });
        });
      }

      return { previousInvestments };
    },
    onError: (err, newAsset, context) => {
      if (context?.previousInvestments) {
        queryClient.setQueryData(["investments", profile?.couple_id], context.previousInvestments);
      }
      toast.error("Erro ao atualizar ativo", { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["investments", profile?.couple_id] });
    },
    onSuccess: () => {
      toast.success("Aporte atualizado com sucesso!");
    },
  });
}

export function useDeleteInvestment() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!profile?.couple_id) throw new Error("Couple ID não encontrado");

      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id)
        .eq('couple_id', profile.couple_id);

      if (error) throw error;
      return id;
    },
    onMutate: async (deletedId) => {
      const queryKey = ["investments", profile?.couple_id];
      await queryClient.cancelQueries({ queryKey });

      const previousInvestments = queryClient.getQueryData<EnrichedInvestment[]>(queryKey);

      if (previousInvestments) {
        queryClient.setQueryData(queryKey, (old: EnrichedInvestment[]) => {
          return old.filter(inv => inv.id !== deletedId);
        });
      }

      return { previousInvestments };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousInvestments) {
        queryClient.setQueryData(["investments", profile?.couple_id], context.previousInvestments);
      }
      toast.error("Erro ao excluir ativo", { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["investments", profile?.couple_id] });
    },
    onSuccess: () => {
      toast.success("Ativo removido da sua carteira!");
    },
  });
}
