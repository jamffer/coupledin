import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "./use-profile";
import { ConsolidatedAsset } from "./use-investment-portfolio";
import { toast } from "sonner";
import { calculateFixedIncomeCurrentValue } from "@/services/api/finance";

interface UpdatePayload {
  id: string;
  quantity: number;
  average_price: number;
  custom_rate: number;
  ticker?: string;
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
        .eq('couple_id', profile.couple_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (updatedAsset) => {
      const queryKey = ["investments", profile?.couple_id];
      await queryClient.cancelQueries({ queryKey });

      const previousInvestments = queryClient.getQueryData<ConsolidatedAsset[]>(queryKey);

      if (previousInvestments && updatedAsset.ticker) {
        queryClient.setQueryData(queryKey, (old: ConsolidatedAsset[]) => {
          return old.map(asset => {
            if (asset.ticker === updatedAsset.ticker) {
              // Atualiza o histórico
              const newHistory = asset.history.map(inv => {
                if (inv.id === updatedAsset.id) {
                  return {
                    ...inv,
                    quantity: updatedAsset.quantity,
                    average_price: updatedAsset.average_price,
                    custom_rate: updatedAsset.custom_rate
                  };
                }
                return inv;
              });

              // Recalcula totais do ativo consolidado
              let total_quantity = 0;
              let total_invested = 0;
              newHistory.forEach(inv => {
                const qty = Number(inv.quantity || 0);
                const price = Number(inv.average_price || 0);
                total_quantity += qty;
                total_invested += (qty * price);
              });

              const average_price = total_quantity > 0 ? total_invested / total_quantity : 0;
              let current_price = asset.current_price;

              if (asset.asset_type === "FIXED_INCOME") {
                const latest = newHistory[0];
                const customRate = Number(latest?.custom_rate || 0);
                if (customRate > 0) {
                  const totalVal = calculateFixedIncomeCurrentValue(
                    average_price,
                    total_quantity,
                    latest.purchase_date || new Date().toISOString(),
                    customRate
                  );
                  current_price = total_quantity > 0 ? totalVal / total_quantity : 0;
                }
              }

              const current_value = total_quantity * current_price;
              const profit_loss_value = current_value - total_invested;
              const profit_loss_percentage = total_invested > 0 
                ? (profit_loss_value / total_invested) * 100 
                : 0;

              return {
                ...asset,
                total_quantity,
                average_price,
                total_invested,
                current_price,
                current_value,
                profit_loss_value,
                profit_loss_percentage,
                history: newHistory
              };
            }
            return asset;
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
    mutationFn: async ({ id, ticker }: { id: string; ticker: string }) => {
      if (!profile?.couple_id) throw new Error("Couple ID não encontrado");

      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id)
        .eq('couple_id', profile.couple_id);

      if (error) throw error;
      return { id, ticker };
    },
    onMutate: async ({ id, ticker }) => {
      const queryKey = ["investments", profile?.couple_id];
      await queryClient.cancelQueries({ queryKey });

      const previousInvestments = queryClient.getQueryData<ConsolidatedAsset[]>(queryKey);

      if (previousInvestments) {
        queryClient.setQueryData(queryKey, (old: ConsolidatedAsset[]) => {
          return old.map(asset => {
            if (asset.ticker === ticker) {
              const newHistory = asset.history.filter(inv => inv.id !== id);
              
              if (newHistory.length === 0) {
                return null; // Será filtrado no final
              }

              let total_quantity = 0;
              let total_invested = 0;
              newHistory.forEach(inv => {
                const qty = Number(inv.quantity || 0);
                const price = Number(inv.average_price || 0);
                total_quantity += qty;
                total_invested += (qty * price);
              });

              const average_price = total_quantity > 0 ? total_invested / total_quantity : 0;
              let current_price = asset.current_price;

              if (asset.asset_type === "FIXED_INCOME") {
                const latest = newHistory[0];
                const customRate = Number(latest?.custom_rate || 0);
                if (customRate > 0) {
                  const totalVal = calculateFixedIncomeCurrentValue(
                    average_price,
                    total_quantity,
                    latest.purchase_date || new Date().toISOString(),
                    customRate
                  );
                  current_price = total_quantity > 0 ? totalVal / total_quantity : 0;
                }
              }

              const current_value = total_quantity * current_price;
              const profit_loss_value = current_value - total_invested;
              const profit_loss_percentage = total_invested > 0 
                ? (profit_loss_value / total_invested) * 100 
                : 0;

              return {
                ...asset,
                total_quantity,
                average_price,
                total_invested,
                current_value,
                profit_loss_value,
                profit_loss_percentage,
                history: newHistory
              };
            }
            return asset;
          }).filter(Boolean) as ConsolidatedAsset[];
        });
      }

      return { previousInvestments };
    },
    onError: (err, variables, context) => {
      if (context?.previousInvestments) {
        queryClient.setQueryData(["investments", profile?.couple_id], context.previousInvestments);
      }
      toast.error("Erro ao excluir ativo", { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["investments", profile?.couple_id] });
    },
    onSuccess: () => {
      toast.success("Aporte removido da carteira!");
    },
  });
}
