import React, { useState, useMemo, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ArrowRightLeft,
  TrendingDown,
  TrendingUp,
  HelpCircle,
  MessageCircle,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useFinanceStore, CATEGORY_ICONS, type Transaction } from "@/hooks/use-finance-store";
import { format, subMonths, startOfMonth, isSameMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

import { useProfile } from "@/hooks/use-profile";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios | CoupleDin" },
      { name: "description", content: "Análise de gastos e fechamento do mês do casal." },
    ],
  }),
  component: RelatoriosPage,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

type ReportPeriod = "Este Mês" | "Últimos 3 Meses" | "Este Ano";

function ChartXAxisTick({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) {
  if (x === undefined || y === undefined || !payload) return null;

  return (
    <text
      x={x}
      y={y + 16}
      textAnchor="middle"
      fill="#ffffff"
      className="text-[12px] font-black"
      style={{ filter: "drop-shadow(0 1px 2px hsl(var(--background)))" }}
    >
      {payload.value}
    </text>
  );
}

function ChartYAxisTick({
  x,
  y,
  payload,
}: {
  x?: number;
  y?: number;
  payload?: { value: number };
}) {
  if (x === undefined || y === undefined || !payload) return null;

  return (
    <text
      x={x - 8}
      y={y + 4}
      textAnchor="end"
      fill="#ffffff"
      className="text-[12px] font-black"
      style={{ filter: "drop-shadow(0 1px 2px hsl(var(--background)))" }}
    >
      {`R$${Number(payload.value) / 1000}k`}
    </text>
  );
}

function RelatoriosPage() {
  const { transactions, incomeJorge, incomeLilian } = useFinanceStore();
  const { user, loading: authLoading } = useAuth();
  const { profile, partnerProfile, isLoading: isProfileLoading } = useProfile();
  const navigate = useNavigate();

  const [isSettled, setIsSettled] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>("Este Mês");

  const userName = profile?.display_name || "Jorge";
  const partnerName = partnerProfile?.display_name || "Lilian";

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, authLoading, navigate]);

  // Cálculo de Despesas Conjuntas e Proporção
  const jointExpenses = transactions.filter((t) => t.division !== "Individual");
  const totalJoint = jointExpenses.reduce((acc, t) => acc + Math.abs(t.amount || 0), 0);

  const totalIncome = (incomeJorge || 0) + (incomeLilian || 0);
  const jorgeShare = totalIncome > 0 ? (incomeJorge || 0) / totalIncome : 0.5;

  const jorgeShouldPay = jointExpenses.reduce((acc, t) => {
    const share = t.division === "Conjunta 50/50" ? 0.5 : jorgeShare;
    return acc + Math.abs(t.amount || 0) * share;
  }, 0);

  const lilianShouldPay = totalJoint - jorgeShouldPay;
  const jorgePaid = jointExpenses
    .filter((t) => t.responsible === "Jorge")
    .reduce((acc, t) => acc + Math.abs(t.amount || 0), 0);

  const diff = jorgePaid - jorgeShouldPay;
  const settlementAmount = Math.abs(diff);

  const handleSettlementConfirm = () => {
    setIsSettled(true);
    setIsSettlementModalOpen(false);
    toast.success("Acerto realizado com sucesso!");
  };

  const handleShareSummary = () => {
    const summary = `Resumo Financeiro\nTotal Gastos Conjuntos: ${formatCurrency(totalJoint)}\nStatus: ${isSettled ? "Tudo quite!" : (diff < 0 ? "Jorge deve transferir" : "Lilian deve transferir") + " " + formatCurrency(Math.abs(settlementAmount))}`;
    navigator.clipboard.writeText(summary);
    toast.success("Resumo copiado para a área de transferência!");
  };

  const monthlyEvolutionData = useMemo(() => {
    const now = new Date();
    const monthlyBaseIncome = (incomeJorge || 0) + (incomeLilian || 0);

    const isIncome = (transaction: Transaction) =>
      transaction.type === "Entrada" ||
      transaction.type === "INCOME" ||
      (transaction.amount || 0) > 0;

    const isExpense = (transaction: Transaction) =>
      transaction.type === "Saída" ||
      transaction.type === "Débito" ||
      transaction.type === "Crédito" ||
      transaction.type === "EXPENSE" ||
      transaction.type === "expense" ||
      (transaction.amount || 0) < 0;

    const generateMonthlyData = (count: number) => {
      const data = [];
      for (let i = count - 1; i >= 0; i--) {
        const date = subMonths(now, i);
        const name = format(date, "MMM/yy", { locale: ptBR });

        const periodTxs = transactions.filter((t) => {
          const tDate = new Date(t.date);
          return isSameMonth(tDate, date);
        });

        const ganhosRegistrados = periodTxs
          .filter(isIncome)
          .reduce((acc, t) => acc + Math.abs(t.amount || 0), 0);
        const gastos = periodTxs
          .filter(isExpense)
          .reduce((acc, t) => acc + Math.abs(t.amount || 0), 0);
        const ganhos = ganhosRegistrados > 0 ? ganhosRegistrados : monthlyBaseIncome;

        data.push({ name, ganhos, gastos });
      }
      return data;
    };

    return {
      "Este Mês": generateMonthlyData(1),
      "Últimos 3 Meses": generateMonthlyData(3),
      "Este Ano": generateMonthlyData(12),
    };
  }, [transactions, incomeJorge, incomeLilian]);

  const hasGraphData = useMemo(() => {
    return monthlyEvolutionData[selectedPeriod].some((d) => d.gastos > 0 || d.ganhos > 0);
  }, [monthlyEvolutionData, selectedPeriod]);

  const topExpenses = useMemo(() => {
    return [...transactions]
      .filter((t) => t.type === "EXPENSE")
      .sort((a, b) => Math.abs(b.amount || 0) - Math.abs(a.amount || 0))
      .slice(0, 5);
  }, [transactions]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    const expensesOnly = transactions.filter((t) => (t.amount || 0) < 0);
    expensesOnly.forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount || 0);
    });
    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4);
  }, [transactions]);

  const totalExpensesAmount = useMemo(() => {
    return transactions
      .filter((t) => (t.amount || 0) < 0 || t.type === "EXPENSE")
      .reduce((acc, t) => acc + Math.abs(t.amount || 0), 0);
  }, [transactions]);

  const savingsRate = useMemo(() => {
    const actualIncome = transactions
      .filter((t) => t.type === "INCOME" || (t.amount || 0) > 0)
      .reduce((acc, t) => acc + (t.amount || 0), 0);
    const baseIncome = (incomeJorge || 0) + (incomeLilian || 0);
    const incomeToUse = actualIncome > 0 ? actualIncome : baseIncome;

    if (incomeToUse <= 0) return 0;
    const saved = incomeToUse - totalExpensesAmount;
    return Math.max(0, (saved / incomeToUse) * 100);
  }, [totalExpensesAmount, transactions, incomeJorge, incomeLilian]);

  const mostExpensiveCategory = useMemo(() => {
    if (categoryTotals.length === 0) return { name: "N/A", amount: 0 };
    return { name: categoryTotals[0][0], amount: categoryTotals[0][1] };
  }, [categoryTotals]);

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 pb-10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div variants={itemVariants}>
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary/60 mb-1">
              Análise Mensal
            </h2>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">Relatórios</h1>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-2">
            <Badge
              variant="outline"
              className="px-4 py-2 rounded-xl apple-glass border-primary/10 text-primary font-bold"
            >
              {format(new Date(), "MMMM, yyyy", { locale: ptBR })}
            </Badge>
          </motion.div>
        </div>

        {/* Section 1: Acerto de Contas */}
        <motion.div variants={itemVariants}>
          <Card className="apple-card overflow-hidden border-none shadow-2xl bg-gradient-to-br from-white to-primary/5 dark:from-[#1A1A1A] dark:to-primary/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary mb-1">
                <div
                  className={cn(
                    "p-2 rounded-xl transition-colors",
                    diff > 1
                      ? "bg-emerald-500/10 text-emerald-600"
                      : diff < -1
                        ? "bg-rose-500/10 text-rose-600"
                        : "bg-primary/10 text-primary",
                  )}
                >
                  <ArrowRightLeft size={20} />
                </div>
                <CardTitle className="text-xl">Fechamento do Mês</CardTitle>
              </div>
              <CardDescription>
                Cálculo automático baseado nas despesas conjuntas do mês.
              </CardDescription>
            </CardHeader>
            <CardContent className="-mt-4">
              <div className="apple-glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6 text-center md:text-left">
                  <div className="flex -space-x-4">
                    <Avatar className="w-16 h-16 border-4 border-white shadow-lg ring-1 ring-muted/20">
                      <AvatarImage
                        src={
                          profile?.avatar_url ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.display_name || "user"}`
                        }
                      />
                      <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center relative z-10 transition-colors",
                        isSettled
                          ? "bg-emerald-500 text-white"
                          : diff > 1
                            ? "bg-emerald-500/10 text-emerald-600"
                            : diff < -1
                              ? "bg-rose-500/10 text-rose-600"
                              : "bg-primary/10 text-primary",
                      )}
                    >
                      {isSettled ? (
                        <CheckCircle2 size={24} />
                      ) : (
                        <ArrowRightLeft size={24} className={cn(diff < -1 && "rotate-180")} />
                      )}
                    </div>
                    {partnerProfile ? (
                      <Avatar className="w-16 h-16 border-4 border-white shadow-lg ring-1 ring-muted/20">
                        <AvatarImage
                          src={
                            partnerProfile.avatar_url ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${partnerProfile.display_name || "partner"}`
                          }
                        />
                        <AvatarFallback>{partnerName.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-16 h-16 rounded-full border-4 border-dashed border-primary/40 bg-primary/5 flex items-center justify-center relative z-0">
                        <PlusCircle size={20} className="text-primary/40" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    {totalJoint === 0 ? (
                      <h3 className="text-xl font-bold tracking-tight">
                        Nenhum gasto conjunto este mês.
                      </h3>
                    ) : !partnerProfile ? (
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold tracking-tight text-amber-600">
                          Aguardando parceiro(a)
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Convide seu parceiro(a) nas configurações para habilitar o acerto de
                          contas automático.
                        </p>
                      </div>
                    ) : isSettled ? (
                      <h3 className="text-xl font-bold tracking-tight text-emerald-600">
                        Tudo quite! Mês resolvido.
                      </h3>
                    ) : Math.abs(diff) < 1 ? (
                      <h3 className="text-xl font-bold tracking-tight">
                        Tudo quite! Vocês estão empatados.
                      </h3>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold tracking-tight">
                          {diff < 0
                            ? `${userName}, você deve transferir`
                            : `${partnerName}, deve transferir`}
                        </h3>
                        <p
                          className={cn(
                            "text-3xl font-black text-primary dark:text-white",
                            diff < 0 ? "opacity-90" : "opacity-100",
                          )}
                        >
                          {formatCurrency(settlementAmount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          para {diff < 0 ? partnerName : userName} para igualar os gastos conjuntos.
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="h-px w-full md:w-px md:h-20 bg-border/40" />
                <div className="flex flex-col items-center md:items-end gap-3">
                  <div className="text-center md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Total Gastos Conjuntos
                    </p>
                    <p className="text-2xl font-black text-foreground">
                      {formatCurrency(totalJoint)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full h-10 w-10 border-emerald-100 text-emerald-600 hover:bg-emerald-50 active:scale-90 transition-all"
                            onClick={handleShareSummary}
                          >
                            <MessageCircle size={18} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Compartilhar resumo</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    {!isSettled && Math.abs(diff) >= 1 && (
                      <Button
                        className="rounded-full px-6 font-bold shadow-md hover:shadow-lg active:scale-95 transition-all gap-2"
                        onClick={() => setIsSettlementModalOpen(true)}
                      >
                        <CheckCircle2 size={16} />
                        Marcar como Resolvido
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section: Gráficos Interativos */}
        <motion.div variants={itemVariants}>
          <Card className="apple-card border-none shadow-sm overflow-hidden bg-white/50 dark:bg-black/20">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-0">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <TrendingUp size={20} className="text-primary" />
                  Ganhos x Gastos
                </CardTitle>
                <CardDescription>
                  Compare entradas e saídas mês a mês no período selecionado.
                </CardDescription>
              </div>
              <Tabs
                value={selectedPeriod}
                onValueChange={(val) => setSelectedPeriod(val as ReportPeriod)}
                className="w-full md:w-auto"
              >
                <TabsList className="grid grid-cols-3 apple-glass p-1 rounded-xl">
                  <TabsTrigger value="Este Mês" className="rounded-lg text-xs font-bold">
                    Mês
                  </TabsTrigger>
                  <TabsTrigger value="Últimos 3 Meses" className="rounded-lg text-xs font-bold">
                    3 Meses
                  </TabsTrigger>
                  <TabsTrigger value="Este Ano" className="rounded-lg text-xs font-bold">
                    Ano
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                {hasGraphData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyEvolutionData[selectedPeriod]}
                      margin={{ top: 20, right: 18, left: 4, bottom: 10 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                        opacity={0.65}
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        stroke="hsl(var(--border))"
                        tick={<ChartXAxisTick />}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        stroke="hsl(var(--border))"
                        tick={<ChartYAxisTick />}
                        tickFormatter={(value) => `R$${Number(value) / 1000}k`}
                        width={64}
                      />
                      <Legend
                        verticalAlign="top"
                        height={32}
                        iconType="circle"
                        formatter={(value) => (
                          <span className="text-xs font-black text-foreground">{value}</span>
                        )}
                      />
                      <RechartsTooltip
                        cursor={{ fill: "hsl(var(--muted))", opacity: 0.35 }}
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-2xl border border-border bg-popover p-3 text-xs text-popover-foreground shadow-2xl">
                                <p className="font-black mb-1 text-primary">{label}</p>
                                {payload.map((item) => (
                                  <p
                                    key={item.dataKey}
                                    className="flex items-center gap-2 font-bold"
                                  >
                                    <span
                                      className="h-2 w-2 rounded-full"
                                      style={{ backgroundColor: item.color }}
                                    />
                                    {item.name}: {formatCurrency(Number(item.value) || 0)}
                                  </p>
                                ))}
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        name="Ganhos"
                        dataKey="ganhos"
                        fill="#10b981"
                        radius={[7, 7, 0, 0]}
                        animationDuration={1500}
                      />
                      <Bar
                        name="Gastos"
                        dataKey="gastos"
                        fill="#f43f5e"
                        radius={[7, 7, 0, 0]}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="p-4 bg-muted rounded-full">
                      <TrendingUp size={32} className="text-muted-foreground opacity-20" />
                    </div>
                    <p className="text-sm text-muted-foreground max-w-[200px]">
                      Dados insuficientes para gerar o gráfico. Comece a registrar suas finanças
                      para ver sua evolução.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section: Métricas Inteligentes */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="apple-card border-none shadow-sm bg-gradient-to-br from-emerald-500/10 to-transparent">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-emerald-500/20 text-emerald-600 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-muted-foreground">Taxa de Poupança</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-emerald-600">
                    {savingsRate.toFixed(1)}%
                  </h3>
                  <p className="text-xs text-muted-foreground">do rendimento</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="apple-card border-none shadow-sm bg-gradient-to-br from-rose-500/10 to-transparent">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-4 bg-rose-500/20 text-rose-600 rounded-2xl">
                {React.createElement(CATEGORY_ICONS[mostExpensiveCategory.name] || HelpCircle, {
                  size: 24,
                })}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-muted-foreground">Mais Dispendiosa</p>
                <div className="flex justify-between items-baseline gap-2">
                  <h3 className="text-2xl font-black text-rose-600 truncate">
                    {mostExpensiveCategory.name}
                  </h3>
                </div>
                <p className="text-sm font-bold text-rose-600/80">
                  {formatCurrency(mostExpensiveCategory.amount)}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section 2: Resumo por Categoria */}
          <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
            <h3 className="text-lg font-bold px-1 flex items-center gap-2">
              <TrendingDown size={20} className="text-primary" />
              Gastos por Categoria
            </h3>
            <div className="grid gap-4">
              {categoryTotals.length > 0 ? (
                categoryTotals.map(([category, amount]) => {
                  const Icon = CATEGORY_ICONS[category] || HelpCircle;
                  const percentage =
                    totalExpensesAmount > 0 ? (amount / totalExpensesAmount) * 100 : 0;

                  return (
                    <Card
                      key={category}
                      className="apple-card apple-card-hover border-none shadow-sm group"
                    >
                      <CardContent className="p-5 flex items-center gap-4">
                        <div className="p-3 bg-muted rounded-2xl text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300">
                          <Icon size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-end mb-1">
                            <p className="text-sm font-bold truncate">{category}</p>
                            <p className="text-sm font-black">{formatCurrency(amount)}</p>
                          </div>
                          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-primary"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground p-4 text-center italic">
                  Ainda não há gastos registrados.
                </p>
              )}
            </div>
          </motion.div>

          {/* Section 3: Maiores Gastos */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="apple-card apple-card-hover h-full border-2 border-primary/5 dark:border-white/5">
              <CardHeader>
                <CardTitle>Top Maiores Gastos</CardTitle>
                <CardDescription>Os 5 maiores lançamentos do mês.</CardDescription>
              </CardHeader>
              <CardContent>
                {topExpenses.length > 0 ? (
                  <div className="space-y-4">
                    {topExpenses.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/30 transition-all border border-transparent hover:border-border/40"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-muted rounded-2xl text-muted-foreground">
                            {React.createElement(CATEGORY_ICONS[tx.category] || HelpCircle, {
                              size: 18,
                            })}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{tx.description}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">
                              {tx.category}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-black text-rose-600">
                          - {formatCurrency(Math.abs(tx.amount || 0))}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 py-12">
                    <p className="text-sm">Nenhuma transação registrada.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      <Dialog open={isSettlementModalOpen} onOpenChange={setIsSettlementModalOpen}>
        <DialogContent className="apple-card rounded-3xl">
          <DialogHeader>
            <DialogTitle>Confirmar Acerto de Contas</DialogTitle>
            <DialogDescription>
              Isso marcará as contas como resolvidas. Certifique-se de que a transferência de{" "}
              <span className="font-bold">{formatCurrency(settlementAmount)}</span> foi feita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              className="rounded-full"
              onClick={() => setIsSettlementModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button className="rounded-full" onClick={handleSettlementConfirm}>
              Confirmar Acerto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
