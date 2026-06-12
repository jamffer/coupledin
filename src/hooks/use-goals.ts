import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "./use-profile";
import { toast } from "sonner";
import { z } from "zod";
import { useEffect } from "react";

export const goalSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  target_amount: z.coerce.number().positive("O valor alvo deve ser maior que zero"),
  saved_amount: z.coerce.number().min(0, "O valor salvo não pode ser negativo").optional(),
  deadline: z.date().optional().nullable(),
  image_url: z.string().optional().nullable(),
});

export type GoalFormValues = z.infer<typeof goalSchema>;

export interface Goal {
  id: string;
  couple_id: string;
  title: string;
  target_amount: number;
  saved_amount: number | null;
  deadline: string | null;
  image_url: string | null;
  created_at: string;
}

export function useGoals() {
  const { profile, isProfileLoading } = useProfile();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["goals", profile?.couple_id],
    queryFn: async () => {
      if (!profile?.couple_id) return [];

      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("couple_id", profile.couple_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Goal[];
    },
    enabled: !!profile?.couple_id,
    staleTime: 1000 * 60 * 5, // 5 minutes cache validity
    gcTime: 1000 * 60 * 30,    // 30 minutes garbage collection
  });

  useEffect(() => {
    if (!profile?.couple_id) return;

    const channel = supabase
      .channel("goals_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "goals",
          filter: `couple_id=eq.${profile.couple_id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["goals", profile.couple_id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.couple_id, queryClient]);

  return {
    ...query,
    isLoading: query.isLoading || isProfileLoading,
  };
}

export function useCreateGoal() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: GoalFormValues) => {
      if (!profile?.couple_id) throw new Error("Couple ID não encontrado");

      const { data, error } = await supabase
        .from("goals")
        .insert({
          couple_id: profile.couple_id,
          title: values.title,
          target_amount: values.target_amount,
          saved_amount: values.saved_amount || 0,
          deadline: values.deadline ? values.deadline.toISOString().split('T')[0] : null,
          image_url: values.image_url || null,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Goal;
    },
    onMutate: async (newGoal) => {
      const queryKey = ["goals", profile?.couple_id];
      await queryClient.cancelQueries({ queryKey });

      const previousGoals = queryClient.getQueryData<Goal[]>(queryKey);

      if (previousGoals) {
        queryClient.setQueryData<Goal[]>(queryKey, (old) => {
          const optimisticGoal: Goal = {
            id: `temp-${Date.now()}`,
            couple_id: profile?.couple_id || "",
            title: newGoal.title,
            target_amount: newGoal.target_amount,
            saved_amount: newGoal.saved_amount || 0,
            deadline: newGoal.deadline ? newGoal.deadline.toISOString() : null,
            image_url: newGoal.image_url || null,
            created_at: new Date().toISOString(),
          };
          return [optimisticGoal, ...(old || [])];
        });
      }

      return { previousGoals };
    },
    onError: (err, newGoal, context) => {
      console.error("Erro detalhado do Supabase ao criar meta:", err);
      if (context?.previousGoals) {
        queryClient.setQueryData(["goals", profile?.couple_id], context.previousGoals);
      }
      toast.error("Erro ao criar meta", { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", profile?.couple_id] });
    },
    onSuccess: () => {
      toast.success("Meta criada com sucesso!");
    },
  });
}

export function useUpdateGoal() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...values }: GoalFormValues & { id: string }) => {
      if (!profile?.couple_id) throw new Error("Couple ID não encontrado");

      const { data, error } = await supabase
        .from("goals")
        .update({
          title: values.title,
          target_amount: values.target_amount,
          saved_amount: values.saved_amount || 0,
          deadline: values.deadline ? values.deadline.toISOString().split('T')[0] : null,
          image_url: values.image_url || null,
        })
        .eq("id", id)
        .eq("couple_id", profile.couple_id)
        .select()
        .single();

      if (error) throw error;
      return data as Goal;
    },
    onMutate: async (updatedGoal) => {
      const queryKey = ["goals", profile?.couple_id];
      await queryClient.cancelQueries({ queryKey });

      const previousGoals = queryClient.getQueryData<Goal[]>(queryKey);

      if (previousGoals) {
        queryClient.setQueryData<Goal[]>(queryKey, (old) => {
          if (!old) return old;
          return old.map(goal => {
            if (goal.id === updatedGoal.id) {
              return {
                ...goal,
                title: updatedGoal.title,
                target_amount: updatedGoal.target_amount,
                saved_amount: updatedGoal.saved_amount || 0,
                deadline: updatedGoal.deadline ? updatedGoal.deadline.toISOString() : null,
                image_url: updatedGoal.image_url || null,
              };
            }
            return goal;
          });
        });
      }

      return { previousGoals };
    },
    onError: (err, updatedGoal, context) => {
      console.error("Erro detalhado do Supabase ao atualizar meta:", err);
      if (context?.previousGoals) {
        queryClient.setQueryData(["goals", profile?.couple_id], context.previousGoals);
      }
      toast.error("Erro ao atualizar meta", { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", profile?.couple_id] });
    },
    onSuccess: () => {
      toast.success("Meta atualizada com sucesso!");
    },
  });
}

export function useDeleteGoal() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!profile?.couple_id) throw new Error("Couple ID não encontrado");

      const { error } = await supabase
        .from("goals")
        .delete()
        .eq("id", id)
        .eq("couple_id", profile.couple_id);

      if (error) throw error;
      return id;
    },
    onMutate: async (deletedId) => {
      const queryKey = ["goals", profile?.couple_id];
      await queryClient.cancelQueries({ queryKey });

      const previousGoals = queryClient.getQueryData<Goal[]>(queryKey);

      if (previousGoals) {
        queryClient.setQueryData<Goal[]>(queryKey, (old) => {
          return old ? old.filter((goal) => goal.id !== deletedId) : [];
        });
      }

      return { previousGoals };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(["goals", profile?.couple_id], context.previousGoals);
      }
      toast.error("Erro ao excluir meta", { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", profile?.couple_id] });
    },
    onSuccess: () => {
      toast.success("Meta excluída com sucesso!");
    },
  });
}

export function useContributeToGoal() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId, amount, currentSavedAmount }: { goalId: string; amount: number; currentSavedAmount: number }) => {
      if (!profile?.couple_id) throw new Error("Couple ID não encontrado");

      // 1. Inserir a transação de aporte
      const { error: txError } = await supabase
        .from("transactions")
        .insert({
          couple_id: profile.couple_id,
          goal_id: goalId,
          type: "aporte_meta",
          amount: amount,
          description: "Aporte para meta",
          date: new Date().toISOString().split('T')[0],
          category: "Investimentos", // Categoria padrão ou de sistema
        });

      if (txError) throw txError;

      // 2. Atualizar o valor na tabela goals
      const newSavedAmount = currentSavedAmount + amount;
      const { data: goalData, error: goalError } = await supabase
        .from("goals")
        .update({ saved_amount: newSavedAmount })
        .eq("id", goalId)
        .eq("couple_id", profile.couple_id)
        .select()
        .single();

      if (goalError) throw goalError;
      
      return goalData;
    },
    onMutate: async ({ goalId, amount }) => {
      const queryKey = ["goals", profile?.couple_id];
      await queryClient.cancelQueries({ queryKey });

      const previousGoals = queryClient.getQueryData<Goal[]>(queryKey);

      if (previousGoals) {
        queryClient.setQueryData<Goal[]>(queryKey, (old) => {
          if (!old) return old;
          return old.map(goal => {
            if (goal.id === goalId) {
              return {
                ...goal,
                saved_amount: (goal.saved_amount || 0) + amount
              };
            }
            return goal;
          });
        });
      }

      return { previousGoals };
    },
    onError: (err, variables, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(["goals", profile?.couple_id], context.previousGoals);
      }
      toast.error("Erro ao realizar aporte", { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", profile?.couple_id] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
    },
    onSuccess: () => {
      toast.success("Aporte realizado com sucesso!");
    },
  });
}

