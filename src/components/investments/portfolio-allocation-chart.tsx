import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConsolidatedAsset } from "@/hooks/use-investment-portfolio";
import { formatCurrency } from "@/lib/utils";

const ALLOCATION_CATEGORIES = [
  {
    key: "fixed-income",
    name: "Renda fixa",
    color: "#f59e0b",
    matches: (asset: ConsolidatedAsset) => asset.asset_type === "FIXED_INCOME",
  },
  {
    key: "variable-income",
    name: "Renda variável",
    color: "#2563eb",
    matches: (asset: ConsolidatedAsset) =>
      (asset.asset_type === "STOCK" || asset.asset_type === "FII") && !isInternationalAsset(asset),
  },
  {
    key: "crypto",
    name: "Criptomoedas",
    color: "#8b5cf6",
    matches: (asset: ConsolidatedAsset) => asset.asset_type === "CRYPTO",
  },
  {
    key: "international",
    name: "Ativos internacionais",
    color: "#10b981",
    matches: (asset: ConsolidatedAsset) => isInternationalAsset(asset),
  },
] as const;

function isInternationalAsset(asset: ConsolidatedAsset) {
  const ticker = asset.ticker.toUpperCase().replace(/[^A-Z0-9]/g, "");

  // BDRs negociados na B3 costumam seguir padrões como AAPL34, MSFT34, NVDC34.
  return asset.asset_type === "STOCK" && /^[A-Z]{4,5}3[1-9]$/.test(ticker);
}

interface PortfolioAllocationChartProps {
  assets: ConsolidatedAsset[];
  totalPatrimony: number;
}

export function PortfolioAllocationChart({
  assets,
  totalPatrimony,
}: PortfolioAllocationChartProps) {
  const categoryData = ALLOCATION_CATEGORIES.map((category) => {
    const categoryAssets = assets.filter(category.matches);
    const value = categoryAssets.reduce((sum, asset) => sum + asset.current_value, 0);

    return {
      ...category,
      value,
      tickers: categoryAssets.map((asset) => asset.ticker).join(", "),
      percentage: totalPatrimony > 0 ? (value / totalPatrimony) * 100 : 0,
    };
  });
  const chartData = categoryData.filter((category) => category.value > 0);

  return (
    <Card className="apple-card overflow-hidden border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">Composição da carteira</CardTitle>
        <p className="text-xs text-muted-foreground">
          Percentual por classe: renda fixa, renda variável, cripto e BDRs/ativos internacionais.
        </p>
      </CardHeader>
      <CardContent className="grid gap-6 lg:grid-cols-[minmax(280px,0.9fr)_1.1fr] lg:items-center">
        <div
          className="relative h-[280px] w-full"
          aria-label="Gráfico de composição percentual da carteira"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={108}
                paddingAngle={3}
                stroke="transparent"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, _name, item) => [
                  `${formatCurrency(Number(value ?? 0))} (${Number(item.payload.percentage).toFixed(1)}%)`,
                  item.payload.name,
                ]}
                contentStyle={{
                  borderRadius: "14px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--background))",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Total
            </span>
            <strong className="text-lg font-black">{formatCurrency(totalPatrimony)}</strong>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {categoryData.map((entry) => (
            <div
              key={entry.key}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/20 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">{entry.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {entry.tickers || "Sem ativos"} · {formatCurrency(entry.value)}
                  </p>
                </div>
              </div>
              <strong className="text-sm tabular-nums">{entry.percentage.toFixed(1)}%</strong>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
