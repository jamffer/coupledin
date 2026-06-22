import type { Database } from "@/integrations/supabase/types";

export type InvestmentBehavior = Database["public"]["Enums"]["investment_behavior"];

export const DEFAULT_INVESTMENT_BEHAVIOR: InvestmentBehavior = "ACCUMULATES_VALUE";

export const INVESTMENT_BEHAVIOR_OPTIONS: Array<{
  value: InvestmentBehavior;
  label: string;
  shortLabel: string;
  description: string;
}> = [
  {
    value: "DISTRIBUTES_INCOME",
    label: "Distribui rendimentos",
    shortLabel: "Distribui",
    description: "Ativo que pode pagar dividendos, proventos ou rendimentos ao investidor.",
  },
  {
    value: "ACCUMULATES_VALUE",
    label: "Acumula valorização",
    shortLabel: "Acumula",
    description: "O ganho principal é esperado pela valorização e venda futura.",
  },
  {
    value: "REINVESTS_AUTOMATICALLY",
    label: "Reinveste automaticamente",
    shortLabel: "Reinveste",
    description: "Rendimentos são acumulados internamente ou reinvestidos no próprio produto.",
  },
  {
    value: "FIXED_INCOME_MATURITY",
    label: "Renda fixa com vencimento",
    shortLabel: "Vencimento",
    description: "Título com dinâmica de vencimento, taxa ou marcação própria.",
  },
  {
    value: "CRYPTOASSET",
    label: "Criptoativo",
    shortLabel: "Cripto",
    description: "Ativo digital cujo retorno depende principalmente de preço de mercado.",
  },
  {
    value: "OTHER",
    label: "Outro",
    shortLabel: "Outro",
    description: "Use quando o comportamento não se encaixar bem nas opções anteriores.",
  },
];

export function getDefaultInvestmentBehaviorByAssetType(assetType: string): InvestmentBehavior {
  if (assetType === "FIXED_INCOME") return "FIXED_INCOME_MATURITY";
  if (assetType === "CRYPTO") return "CRYPTOASSET";
  return DEFAULT_INVESTMENT_BEHAVIOR;
}

export function getInvestmentBehaviorOption(value?: string | null) {
  return (
    INVESTMENT_BEHAVIOR_OPTIONS.find((option) => option.value === value) ||
    INVESTMENT_BEHAVIOR_OPTIONS.find((option) => option.value === DEFAULT_INVESTMENT_BEHAVIOR)!
  );
}
