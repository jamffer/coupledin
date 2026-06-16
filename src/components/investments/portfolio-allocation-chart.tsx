import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConsolidatedAsset } from "@/hooks/use-investment-portfolio";
import { formatCurrency } from "@/lib/utils";

const ALLOCATION_COLORS = ["#2563eb", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];

interface PortfolioAllocationChartProps {
  assets: ConsolidatedAsset[];
  totalPatrimony: number;
}

export function PortfolioAllocationChart({
  assets,
  totalPatrimony,
}: PortfolioAllocationChartProps) {
  const chartData = assets.map((asset, index) => ({
    name: asset.ticker,
    value: asset.current_value,
    percentage: totalPatrimony > 0 ? (asset.current_value / totalPatrimony) * 100 : 0,
    color: ALLOCATION_COLORS[index % ALLOCATION_COLORS.length],
  }));

  return (
    <Card className="apple-card overflow-hidden border-border/40">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">Composição da carteira</CardTitle>
        <p className="text-xs text-muted-foreground">
          Participação de cada ativo no patrimônio investido.
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
                  <Cell key={entry.name} fill={entry.color} />
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
          {chartData.map((entry) => (
            <div
              key={entry.name}
              className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-muted/20 p-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-black uppercase">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(entry.value)}</p>
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
