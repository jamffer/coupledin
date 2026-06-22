import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format, startOfMonth } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";

export function useRecurringTransactions() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["recurring-transactions", profile?.couple_id],
    queryFn: async () => {
      if (!profile?.couple_id) return [];
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("couple_id", profile.couple_id)
        .eq("is_recurring", true)
        .is("recurrence_parent_id", null)
        .order("description");
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.couple_id,
  });

  useEffect(() => {
    const generateCurrentMonth = async () => {
      if (!profile?.couple_id || !query.data?.length) return;
      const month = format(startOfMonth(new Date()), "yyyy-MM-dd");

      for (const template of query.data) {
        if (template.recurrence_status !== "active") continue;
        if (format(startOfMonth(new Date(template.date)), "yyyy-MM-dd") === month) continue;
        const day = Math.min(template.recurrence_day || 1, 28);
        const date = `${month.slice(0, 8)}${String(day).padStart(2, "0")}`;
        await supabase.from("transactions").upsert(
          {
            description: template.description,
            notes: template.notes,
            amount: template.amount,
            date,
            category: template.category,
            responsible: template.responsible,
            responsible_id: template.responsible_id,
            division: template.division,
            type: template.type,
            user_id: template.user_id,
            couple_id: template.couple_id,
            card_id: template.card_id,
            billing_date: month,
            is_recurring: false,
            recurrence_parent_id: template.id,
            generated_for_month: month,
          },
          { onConflict: "recurrence_parent_id,generated_for_month", ignoreDuplicates: true },
        );
      }

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["active-months"] });
    };

    void generateCurrentMonth();
  }, [profile?.couple_id, query.data, queryClient]);

  return query;
}
