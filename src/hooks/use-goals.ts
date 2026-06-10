import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "./use-profile";
import { toast } from "sonner";
import { z } from "zod";

export const goalSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  target_amount: z.coerce.number().positive("O valor alvo deve ser maior que zero"),
  saved_amount: z.coerce.number().min(0, "O valor salvo não pode ser negativo").optional(),
  deadline: z.date().optional().nullable(),
});

export type GoalFormValues = z.infer<typeof goalSchema>;

export interface Goal {
  id: string;
  couple_id: string;
  title: string;
  target_amount: number;
  saved_amount: number | null;
  deadline: string | null;
  created_at: string;
}

export function useGoals() {
  const { profile } = useProfile();

  return useQuery({
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
  });
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
            created_at: new Date().toISOString(),
          };
          return [optimisticGoal, ...old];
        });
      }

      return { previousGoals };
    },
    onError: (err, newGoal, context) => {
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
