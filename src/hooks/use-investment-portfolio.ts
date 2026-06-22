import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchBrapiQuote,
  fetchCryptoQuote,
  fetchTreasuryQuote,
  calculateFixedIncomeCurrentValue,
} from "@/services/api/finance";
import { useProfile } from "./use-profile";
import { Database } from "@/integrations/supabase/types";
import {
  getDefaultInvestmentBehaviorByAssetType,
  InvestmentBehavior,
} from "@/lib/investment-behavior";

type Investment = Database["public"]["Tables"]["investments"]["Row"];

export type ConsolidatedAsset = {
  id: string; // Used for react keys (e.g. ticker name)
  ticker: string;
  asset_type: "STOCK" | "FII" | "CRYPTO" | "FIXED_INCOME" | "OTHER";
  investment_behavior: InvestmentBehavior;
  total_quantity: number;
  average_price: number;
  total_invested: number;
  current_price: number;
  current_value: number;
  profit_loss_value: number;
  profit_loss_percentage: number;
  history: Investment[];
};

export function useInvestmentPortfolio() {
  const { profile } = useProfile();

  const query = useQuery({
    queryKey: ["investments", profile?.couple_id],
    enabled: !!profile?.couple_id,
    queryFn: async () => {
      const { data: rawInvestments, error } = await supabase
        .from("investments")
        .select("*")
        .eq("couple_id", profile!.couple_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!rawInvestments) return [];

      // 1. Group by ticker
      const grouped = rawInvestments.reduce(
        (acc, inv) => {
          const key = inv.ticker || "UNKNOWN";
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(inv);
          return acc;
        },
        {} as Record<string, Investment[]>,
      );

      // 2. Map and fetch current prices uniquely
      const consolidatedPromises = Object.entries(grouped).map(
        async ([ticker, history]): Promise<ConsolidatedAsset> => {
          const asset_type = history[0].asset_type as ConsolidatedAsset["asset_type"];
          const investment_behavior =
            history[0].investment_behavior || getDefaultInvestmentBehaviorByAssetType(asset_type);

          let total_quantity = 0;
          let total_invested = 0;
          let fallback_price = 0;

          // FIXED_INCOME generally doesn't group the same way if custom rates vary, but we'll group by ticker/name
          history.forEach((inv) => {
            const qty = Number(inv.quantity || 0);
            const price = Number(inv.average_price || 0);
            total_quantity += qty;
            total_invested += qty * price;
            fallback_price = price; // simplistic fallback
          });

          const average_price = total_quantity > 0 ? total_invested / total_quantity : 0;

          let current_price = average_price;

          try {
            if (asset_type === "STOCK" || asset_type === "FII") {
              const quote = await fetchBrapiQuote(ticker);
              if (quote !== null) current_price = quote;
            } else if (asset_type === "CRYPTO") {
              const quote = await fetchCryptoQuote(ticker);
              if (quote !== null) current_price = quote;
            } else if (asset_type === "FIXED_INCOME") {
              // Se houver histórico com taxa customizada, vamos simplificar avaliando o ativo mais recente
              const latest = history[0];
              const customRate = Number(latest.custom_rate || 0);
              if (customRate > 0) {
                const totalVal = calculateFixedIncomeCurrentValue(
                  average_price,
                  total_quantity,
                  latest.purchase_date || new Date().toISOString(),
                  customRate,
                );
                current_price = total_quantity > 0 ? totalVal / total_quantity : 0;
              } else {
                const quote = await fetchTreasuryQuote(ticker);
                if (quote !== null) current_price = quote;
              }
            }
          } catch (err) {
            console.error("Erro ao buscar cotação para", ticker, err);
            // Engole o erro graciosamente e mantem o preço médio como fallback
          }

          const current_value = total_quantity * current_price;
          const profit_loss_value = current_value - total_invested;
          const profit_loss_percentage =
            total_invested > 0 ? (profit_loss_value / total_invested) * 100 : 0;

          return {
            id: ticker,
            ticker,
            asset_type,
            investment_behavior,
            total_quantity,
            average_price,
            total_invested,
            current_price,
            current_value,
            profit_loss_value,
            profit_loss_percentage,
            history,
          };
        },
      );

      const results = await Promise.allSettled(consolidatedPromises);

      const consolidated: ConsolidatedAsset[] = [];
      results.forEach((res, index) => {
        if (res.status === "fulfilled") {
          consolidated.push(res.value);
        } else {
          // Em teoria o try/catch interno evita cair aqui, mas por segurança:
          const ticker = Object.keys(grouped)[index];
          const history = grouped[ticker];

          let total_quantity = 0;
          let total_invested = 0;
          history.forEach((inv) => {
            const qty = Number(inv.quantity || 0);
            total_quantity += qty;
            total_invested += qty * Number(inv.average_price || 0);
          });

          const average_price = total_quantity > 0 ? total_invested / total_quantity : 0;

          consolidated.push({
            id: ticker,
            ticker,
            asset_type: history[0].asset_type as ConsolidatedAsset["asset_type"],
            investment_behavior:
              history[0].investment_behavior ||
              getDefaultInvestmentBehaviorByAssetType(history[0].asset_type),
            total_quantity,
            average_price,
            total_invested,
            current_price: average_price,
            current_value: total_invested,
            profit_loss_value: 0,
            profit_loss_percentage: 0,
            history,
          });
        }
      });

      // Ordenar por valor atual (maior para menor)
      return consolidated.sort((a, b) => b.current_value - a.current_value);
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
    throwOnError: false,
  });

  const consolidatedInvestments = query.data || [];

  const totalPatrimony = consolidatedInvestments.reduce(
    (sum, asset) => sum + asset.current_value,
    0,
  );
  const totalInvested = consolidatedInvestments.reduce(
    (sum, asset) => sum + asset.total_invested,
    0,
  );

  const totalProfitPercentage = totalInvested > 0 ? (totalPatrimony / totalInvested - 1) * 100 : 0;

  const topAsset = consolidatedInvestments.length > 0 ? consolidatedInvestments[0] : null;

  return {
    ...query,
    investments: consolidatedInvestments,
    totalPatrimony,
    totalInvested,
    totalProfitPercentage,
    topAsset,
  };
}
