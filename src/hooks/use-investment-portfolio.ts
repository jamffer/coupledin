import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchBrapiQuote, fetchCryptoQuote, fetchTreasuryQuote, calculateFixedIncomeCurrentValue } from "@/services/api/finance";
import { useProfile } from "./use-profile";
import { Database } from "@/integrations/supabase/types";

type Investment = Database["public"]["Tables"]["investments"]["Row"];

export type EnrichedInvestment = Investment & {
  current_price: number;
  total_invested: number;
  current_value: number;
  profit_loss_percentage: number;
};

export function useInvestmentPortfolio() {
  const { profile } = useProfile();

  const query = useQuery({
    queryKey: ["investments", profile?.couple_id],
    enabled: !!profile?.couple_id,
    queryFn: async () => {
      const { data: investments, error } = await supabase
        .from("investments")
        .select("*")
        .eq("couple_id", profile!.couple_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!investments) return [];

      // Mapeia ativos e busca preços simultaneamente (Promise.allSettled evita falha geral)
      const enrichedPromises = investments.map(async (inv): Promise<EnrichedInvestment> => {
        let current_price = Number(inv.average_price || 0);

        if (inv.asset_type === "STOCK" || inv.asset_type === "FII") {
          const quote = await fetchBrapiQuote(inv.ticker || "");
          if (quote !== null) current_price = quote;
        } else if (inv.asset_type === "CRYPTO") {
          const quote = await fetchCryptoQuote(inv.ticker || "");
          if (quote !== null) current_price = quote;
        } else if (inv.asset_type === "FIXED_INCOME") {
          const customRate = Number(inv.custom_rate || 0);
          if (customRate > 0) {
            // Título Privado (CDB/LCI com taxa mensal manual)
            const totalVal = calculateFixedIncomeCurrentValue(
              Number(inv.average_price || 0),
              Number(inv.quantity || 0),
              inv.purchase_date || new Date().toISOString(),
              customRate
            );
            current_price = Number(inv.quantity || 0) > 0 ? totalVal / Number(inv.quantity || 1) : 0;
          } else {
            // Tesouro Direto (Busca na Brapi)
            const quote = await fetchTreasuryQuote(inv.ticker || "");
            if (quote !== null) current_price = quote;
          }
        }

        const quantity = Number(inv.quantity || 0);
        const average_price = Number(inv.average_price || 0);
        const total_invested = quantity * average_price;
        const current_value = quantity * current_price;
        
        const profit_loss_percentage = total_invested > 0 
          ? ((current_value / total_invested) - 1) * 100 
          : 0;

        return {
          ...inv,
          current_price,
          total_invested,
          current_value,
          profit_loss_percentage,
        };
      });

      const results = await Promise.allSettled(enrichedPromises);
      
      const enriched: EnrichedInvestment[] = results.map((res, index) => {
        if (res.status === "fulfilled") {
          return res.value;
        } else {
          console.error("Falha ao enriquecer ativo", investments[index].ticker, res.reason);
          // Fallback para não quebrar a carteira caso haja um throw inesperado
          const inv = investments[index];
          const quantity = Number(inv.quantity);
          const average_price = Number(inv.average_price);
          const total_invested = quantity * average_price;
          return {
            ...inv,
            current_price: average_price,
            total_invested,
            current_value: total_invested,
            profit_loss_percentage: 0,
          };
        }
      });

      return enriched;
    },
    staleTime: 1000 * 60 * 5, // 5 minutos de cache no React Query
    refetchInterval: 1000 * 60 * 5, // Atualização a cada 5 minutos
    throwOnError: false,
  });

  const enrichedInvestments = query.data || [];
  
  const totalPatrimony = enrichedInvestments.reduce((sum, inv) => sum + inv.current_value, 0);
  const totalInvested = enrichedInvestments.reduce((sum, inv) => sum + inv.total_invested, 0);
  
  const totalProfitPercentage = totalInvested > 0 
    ? ((totalPatrimony / totalInvested) - 1) * 100 
    : 0;

  return {
    ...query,
    investments: enrichedInvestments,
    totalPatrimony,
    totalInvested,
    totalProfitPercentage,
  };
}
