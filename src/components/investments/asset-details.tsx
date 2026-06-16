import { Activity, Building2, Coins, MoreVertical, Pencil, Trash2, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConsolidatedAsset } from "@/hooks/use-investment-portfolio";
import { Database } from "@/integrations/supabase/types";
import { cn, formatCurrency } from "@/lib/utils";

type RawInvestment = Database["public"]["Tables"]["investments"]["Row"];

interface AssetDetailsProps {
  asset: ConsolidatedAsset;
  portfolioTotal: number;
  onEdit: (asset: RawInvestment) => void;
  onDelete: (asset: RawInvestment, ticker: string) => void;
}

function buildEstimatedEvolution(asset: ConsolidatedAsset) {
  const sortedHistory = [...asset.history].sort((a, b) => {
    const first = new Date(a.purchase_date || a.created_at).getTime();
    const second = new Date(b.purchase_date || b.created_at).getTime();
    return first - second;
  });
  const startDate = new Date(
    sortedHistory[0]?.purchase_date || sortedHistory[0]?.created_at || Date.now(),
  );
  const endDate = new Date();
  const points = 8;
  const seed = asset.ticker.split("").reduce((sum, character) => sum + character.charCodeAt(0), 0);
  const startPrice = asset.average_price || asset.current_price;

  return Array.from({ length: points }, (_, index) => {
    const progress = index / (points - 1);
    const date = new Date(
      startDate.getTime() + (endDate.getTime() - startDate.getTime()) * progress,
    );
    const trend = startPrice + (asset.current_price - startPrice) * progress;
    const wave =
      Math.sin(progress * Math.PI) *
      Math.sin((progress * 4 + seed) * Math.PI) *
      Math.max(startPrice, 1) *
      0.06;

    return {
      date: date
        .toLocaleDateString("pt-BR", { month: "short", year: "2-digit" })
        .replace(" de ", "/"),
      price: Math.max(0, trend + wave),
    };
  });
}

export function AssetDetails({ asset, portfolioTotal, onEdit, onDelete }: AssetDetailsProps) {
  const allocation = portfolioTotal > 0 ? (asset.current_value / portfolioTotal) * 100 : 0;
  const isPositive = asset.profit_loss_percentage > 0;
  const isNegative = asset.profit_loss_percentage < 0;
  const evolution = buildEstimatedEvolution(asset);
  const AssetIcon =
    asset.asset_type === "CRYPTO"
      ? Coins
      : asset.asset_type === "FIXED_INCOME"
        ? Building2
        : Activity;

  return (
    <div className="space-y-5 py-2">
      <div className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-emerald-500/5 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
            <AssetIcon size={24} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Detalhes do ativo
            </p>
            <h3 className="text-2xl font-black uppercase tracking-tight">{asset.ticker}</h3>
            <p className="text-sm text-muted-foreground">{asset.asset_type.replace("_", " ")}</p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-muted-foreground">Cotação atual</p>
          <p className="text-2xl font-black">{formatCurrency(asset.current_price)}</p>
          <p
            className={cn(
              "text-sm font-bold",
              isPositive
                ? "text-emerald-500"
                : isNegative
                  ? "text-rose-500"
                  : "text-muted-foreground",
            )}
          >
            {isPositive ? "+" : ""}
            {asset.profit_loss_percentage.toFixed(2)}% na posição
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/40 bg-background/70">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold">Resumo do investimento</h4>
              <TrendingUp size={18} className="text-primary" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Quantidade</p>
                <strong>{asset.total_quantity}</strong>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Preço médio</p>
                <strong>{formatCurrency(asset.average_price)}</strong>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total aportado</p>
                <strong>{formatCurrency(asset.total_invested)}</strong>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Valor atual</p>
                <strong>{formatCurrency(asset.current_value)}</strong>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-background/70">
          <CardContent className="space-y-4 p-5">
            <div className="flex items-center justify-between">
              <h4 className="font-bold">Minha posição</h4>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-black text-primary">
                {allocation.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400"
                style={{ width: `${Math.min(allocation, 100)}%` }}
              />
            </div>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Resultado</p>
                <strong
                  className={cn(
                    "text-lg",
                    isPositive
                      ? "text-emerald-500"
                      : isNegative
                        ? "text-rose-500"
                        : "text-foreground",
                  )}
                >
                  {isPositive ? "+" : ""}
                  {formatCurrency(asset.profit_loss_value)}
                </strong>
              </div>
              <p className="max-w-[180px] text-right text-xs text-muted-foreground">
                Participação deste ativo no patrimônio atual da carteira.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/40 bg-background/70">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h4 className="font-bold">Evolução estimada do ativo</h4>
              <p className="text-xs text-muted-foreground">
                Projeção visual entre o preço médio e a cotação atual.
              </p>
            </div>
            <span className="text-xs font-medium text-amber-500">
              Ainda sem histórico oficial de bolsa
            </span>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolution} margin={{ top: 10, right: 8, left: -14, bottom: 0 }}>
                <defs>
                  <linearGradient id={`asset-evolution-${asset.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="hsl(var(--border))"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#888" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#888" }}
                  tickFormatter={(value) => `R$${Number(value).toFixed(0)}`}
                />
                <Tooltip
                  formatter={(value) => [formatCurrency(Number(value ?? 0)), "Preço estimado"]}
                  contentStyle={{
                    borderRadius: "14px",
                    border: "1px solid hsl(var(--border))",
                    background: "hsl(var(--background))",
                  }}
                />
                <ReferenceLine
                  y={asset.average_price}
                  stroke="#8b5cf6"
                  strokeDasharray="4 4"
                  label={{ value: "Preço médio", fill: "#8b5cf6", fontSize: 10 }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#14b8a6"
                  strokeWidth={3}
                  fill={`url(#asset-evolution-${asset.id})`}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div>
          <h4 className="font-bold">Histórico de aportes</h4>
          <p className="text-xs text-muted-foreground">
            {asset.history.length} lançamento(s) neste ativo.
          </p>
        </div>
        {asset.history.map((investment) => (
          <div
            key={investment.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-background p-3 transition-colors hover:border-border/80"
          >
            <div>
              <p className="text-sm font-bold">
                {new Date(investment.purchase_date || investment.created_at).toLocaleDateString(
                  "pt-BR",
                )}
              </p>
              <p className="text-xs font-medium text-muted-foreground">
                {Number(investment.quantity)} cotas a{" "}
                {formatCurrency(Number(investment.average_price))}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-bold sm:inline-block">
                {formatCurrency(Number(investment.quantity) * Number(investment.average_price))}
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    aria-label={`Ações do aporte de ${asset.ticker}`}
                  >
                    <MoreVertical size={14} className="text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="apple-card w-40 rounded-xl">
                  <DropdownMenuItem
                    className="cursor-pointer gap-2"
                    onClick={() => onEdit(investment)}
                  >
                    <Pencil size={14} />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 text-rose-500 focus:bg-rose-500/10 focus:text-rose-600"
                    onClick={() => onDelete(investment, asset.ticker)}
                  >
                    <Trash2 size={14} />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
