import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "./use-profile";
import { toast } from "sonner";
import { z } from "zod";
import { useEffect } from "react";
import { Database } from "@/integrations/supabase/types";

type Investment = Database["public"]["Tables"]["investments"]["Row"];
type GoalInvestmentLink = Database["public"]["Tables"]["goal_investments"]["Row"];
type GoalInvestmentLinkWithInvestment = GoalInvestmentLink & {
  investments: Investment | null;
};

export const goalSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  target_amount: z.coerce.number().positive("O valor alvo deve ser maior que zero"),
  saved_amount: z.coerce.number().min(0, "O valor salvo não pode ser negativo").optional(),
  deadline: z.date().optional().nullable(),
  image_url: z.string().optional().nullable(),
  investment_ids: z.array(z.string()).optional(),
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
  linked_investments?: Investment[];
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
      const goals = data as Goal[];
      const goalIds = goals.map((goal) => goal.id);

      if (goalIds.length === 0) return goals;

      const { data: links, error: linksError } = await supabase
        .from("goal_investments")
        .select("*, investments(*)")
        .eq("couple_id", profile.couple_id)
        .in("goal_id", goalIds);

      if (linksError) throw linksError;

      const linksByGoal = ((links || []) as GoalInvestmentLinkWithInvestment[]).reduce<
        Record<string, Investment[]>
      >((acc, link) => {
        if (!link.investments) return acc;
        acc[link.goal_id] = [...(acc[link.goal_id] || []), link.investments];
        return acc;
      }, {});

      return goals.map((goal) => ({
        ...goal,
        linked_investments: linksByGoal[goal.id] || [],
      }));
    },
    enabled: !!profile?.couple_id,
    staleTime: 1000 * 60 * 5, // 5 minutes cache validity
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
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
        },
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

export function useGoalInvestmentOptions() {
  const { profile, isProfileLoading } = useProfile();

  const query = useQuery({
    queryKey: ["goal-investment-options", profile?.couple_id],
    enabled: !!profile?.couple_id,
    queryFn: async () => {
      if (!profile?.couple_id) return [];

      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .eq("couple_id", profile.couple_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Investment[];
    },
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...query,
    isLoading: query.isLoading || isProfileLoading,
  };
}

async function replaceGoalInvestmentLinks({
  goalId,
  coupleId,
  investmentIds,
}: {
  goalId: string;
  coupleId: string;
  investmentIds?: string[];
}) {
  const { error: deleteError } = await supabase
    .from("goal_investments")
    .delete()
    .eq("goal_id", goalId)
    .eq("couple_id", coupleId);

  if (deleteError) throw deleteError;

  if (!investmentIds || investmentIds.length === 0) return;

  const uniqueInvestmentIds = Array.from(new Set(investmentIds));
  const { error: insertError } = await supabase.from("goal_investments").insert(
    uniqueInvestmentIds.map((investmentId) => ({
      couple_id: coupleId,
      goal_id: goalId,
      investment_id: investmentId,
    })),
  );

  if (insertError) throw insertError;
}

export function useCreateGoal() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: GoalFormValues) => {
      if (!profile?.couple_id) throw new Error("Couple ID não encontrado");
      const { investment_ids, ...goalValues } = values;

      const { data, error } = await supabase
        .from("goals")
        .insert({
          couple_id: profile.couple_id,
          title: goalValues.title,
          target_amount: goalValues.target_amount,
          saved_amount: goalValues.saved_amount || 0,
          deadline: goalValues.deadline ? goalValues.deadline.toISOString().split("T")[0] : null,
          image_url: goalValues.image_url || null,
        })
        .select()
        .single();

      if (error) throw error;
      await replaceGoalInvestmentLinks({
        goalId: data.id,
        coupleId: profile.couple_id,
        investmentIds: investment_ids,
      });

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
            linked_investments: [],
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
      queryClient.invalidateQueries({ queryKey: ["goal-investment-options", profile?.couple_id] });
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
      const { investment_ids, ...goalValues } = values;

      const { data, error } = await supabase
        .from("goals")
        .update({
          title: goalValues.title,
          target_amount: goalValues.target_amount,
          saved_amount: goalValues.saved_amount || 0,
          deadline: goalValues.deadline ? goalValues.deadline.toISOString().split("T")[0] : null,
          image_url: goalValues.image_url || null,
        })
        .eq("id", id)
        .eq("couple_id", profile.couple_id)
        .select()
        .single();

      if (error) throw error;
      await replaceGoalInvestmentLinks({
        goalId: id,
        coupleId: profile.couple_id,
        investmentIds: investment_ids,
      });

      return data as Goal;
    },
    onMutate: async (updatedGoal) => {
      const queryKey = ["goals", profile?.couple_id];
      await queryClient.cancelQueries({ queryKey });

      const previousGoals = queryClient.getQueryData<Goal[]>(queryKey);

      if (previousGoals) {
        queryClient.setQueryData<Goal[]>(queryKey, (old) => {
          if (!old) return old;
          return old.map((goal) => {
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
      queryClient.invalidateQueries({ queryKey: ["goal-investment-options", profile?.couple_id] });
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
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-metrics"] });
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
    mutationFn: async ({
      goalId,
      amount,
      currentSavedAmount,
    }: {
      goalId: string;
      amount: number;
      currentSavedAmount: number;
    }) => {
      if (!profile?.couple_id) throw new Error("Couple ID não encontrado");

      // 1. Inserir a transação de aporte
      const { error: txError } = await supabase.from("transactions").insert({
        couple_id: profile.couple_id,
        goal_id: goalId,
        type: "aporte_meta",
        amount: amount,
        description: "Aporte para meta",
        date: new Date().toISOString().split("T")[0],
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
          return old.map((goal) => {
            if (goal.id === goalId) {
              return {
                ...goal,
                saved_amount: (goal.saved_amount || 0) + amount,
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
