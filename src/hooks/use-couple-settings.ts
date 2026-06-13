import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useProfile } from "./use-profile";

export function useCoupleSettings() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["coupleSettings", profile?.couple_id],
    queryFn: async () => {
      if (!profile?.couple_id) return null;
      const { data, error } = await supabase
        .from("couples")
        .select("settings")
        .eq("id", profile.couple_id)
        .single();
      
      if (error) throw error;
      return data?.settings as any || { divisionModel: "proportional", incomeA: 0, incomeB: 0 };
    },
    enabled: !!profile?.couple_id,
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      if (!profile?.couple_id) throw new Error("No couple ID");
      const { error } = await supabase
        .from("couples")
        .update({ settings: newSettings } as any)
        .eq("id", profile.couple_id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupleSettings", profile?.couple_id] });
      toast.success("Configurações atualizadas com sucesso!");
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar configurações");
      console.error(error);
    }
  });

  return {
    settings,
    isLoading,
    useUpdateCoupleSettings: updateSettingsMutation
  };
}
