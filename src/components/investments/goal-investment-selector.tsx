import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGoalInvestmentOptions } from "@/hooks/use-goals";
import { formatCurrency } from "@/lib/utils";
import { Database } from "@/integrations/supabase/types";
import { Link2, Wallet } from "lucide-react";

type Investment = Database["public"]["Tables"]["investments"]["Row"];

function getInvestmentAmount(investment: Investment) {
  return Number(investment.quantity || 0) * Number(investment.average_price || 0);
}

function getInvestmentLabel(investment: Investment) {
  const labels: Record<string, string> = {
    STOCK: "Renda variável",
    FII: "FII",
    CRYPTO: "Cripto",
    FIXED_INCOME: "Renda fixa",
  };

  return labels[investment.asset_type] || "Investimento";
}

export function GoalInvestmentSelector({
  value,
  onChange,
  disabled,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}) {
  const { data: investments = [], isLoading } = useGoalInvestmentOptions();

  const toggleInvestment = (investmentId: string) => {
    if (disabled) return;
    if (value.includes(investmentId)) {
      onChange(value.filter((id) => id !== investmentId));
      return;
    }
    onChange([...value, investmentId]);
  };

  return (
    <div className="space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-primary/10 p-2 text-primary">
          <Link2 size={18} />
        </div>
        <div>
          <p className="text-sm font-black">Vincular investimentos</p>
          <p className="text-xs text-muted-foreground">
            O valor dos investimentos selecionados entrará no progresso da meta.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-xl bg-background/60 p-3 text-xs font-bold text-muted-foreground">
          Carregando investimentos...
        </div>
      ) : investments.length === 0 ? (
        <div className="rounded-xl bg-background/60 p-3 text-xs text-muted-foreground">
          Nenhum investimento encontrado na carteira ainda.
        </div>
      ) : (
        <ScrollArea className="max-h-52 pr-3">
          <div className="space-y-2">
            {investments.map((investment) => {
              const checked = value.includes(investment.id);

              return (
                <button
                  key={investment.id}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-background/60 p-3 text-left transition-colors hover:bg-background"
                  onClick={() => toggleInvestment(investment.id)}
                  disabled={disabled}
                >
                  <Checkbox
                    checked={checked}
                    onClick={(event) => event.stopPropagation()}
                    onCheckedChange={() => toggleInvestment(investment.id)}
                  />
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                      <Wallet size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black">{investment.ticker}</p>
                      <p className="text-xs text-muted-foreground">
                        {getInvestmentLabel(investment)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black">
                      {formatCurrency(getInvestmentAmount(investment))}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      carteira
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
