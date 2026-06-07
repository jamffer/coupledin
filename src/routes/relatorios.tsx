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
  DialogFooter 
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  Cell
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
      { title: "Relatórios | CoupleFinance" },
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
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

function RelatoriosPage() {
  const { transactions, incomeJorge, incomeLilian, userAvatars } = useFinanceStore();
  const { user, loading: authLoading } = useAuth();
  const { profile, partnerProfile, isLoading: isProfileLoading } = useProfile();
  const navigate = useNavigate();

  const [isSettled, setIsSettled] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<"Este Mês" | "Últimos 3 Meses" | "Este Ano">("Este Mês");

  const userName = profile?.display_name || "Jorge";
  const partnerName = partnerProfile?.display_name || "Lilian";

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, authLoading]);

  // Cálculo de Despesas Conjuntas e Proporção
  const jointExpenses = transactions.filter(t => t.division !== "Individual");
  const totalJoint = jointExpenses.reduce((acc, t) => acc + Math.abs(t.amount || 0), 0);

  
  const totalIncome = (incomeJorge || 0) + (incomeLilian || 0);
  const jorgeShare = totalIncome > 0 ? (incomeJorge || 0) / totalIncome : 0.5;
  
  const jorgeShouldPay = jointExpenses.reduce((acc, t) => {
    const share = t.division === "Conjunta 50/50" ? 0.5 : jorgeShare;
    return acc + (Math.abs(t.amount || 0) * share);
  }, 0);
  
  const lilianShouldPay = totalJoint - jorgeShouldPay;
  const jorgePaid = jointExpenses.filter(t => t.responsible === "Jorge").reduce((acc, t) => acc + Math.abs(t.amount || 0), 0);
  
  const diff = jorgePaid - jorgeShouldPay;
  const settlementAmount = Math.abs(diff);

  const handleSettlementConfirm = () => {
    setIsSettled(true);
    setIsSettlementModalOpen(false);
    toast.success("Acerto realizado com sucesso!");
  };

  const handleShareSummary = () => {
    const summary = `Resumo Financeiro\nTotal Gastos Conjuntos: ${formatCurrency(totalJoint)}\nStatus: ${isSettled ? 'Tudo quite!' : (diff < 0 ? "Jorge deve transferir" : "Lilian deve transferir") + " " + formatCurrency(Math.abs(settlementAmount))}`;
    navigator.clipboard.writeText(summary);
    toast.success("Resumo copiado para a área de transferência!");
  };

  const weeklyEvolutionData = useMemo(() => {
    const now = new Date();
    
    const generateData = (count: number, unit: 'month' | 'week') => {
      const data = [];
      for (let i = count - 1; i >= 0; i--) {
        const date = unit === 'month' ? subMonths(now, i) : new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        const name = unit === 'month' ? format(date, "MMM", { locale: ptBR }) : `Sem ${count - i}`;
        
        const periodTxs = transactions.filter(t => {
          const tDate = new Date(t.date);
          return unit === 'month' ? isSameMonth(tDate, date) : (tDate >= date && tDate < new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000));
        });
        
        const total = periodTxs.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
        data.push({ name, total });
      }
      return data;
    };

    return {
      "Este Mês": generateData(4, 'week'),
      "Últimos 3 Meses": generateData(3, 'month'),
      "Este Ano": generateData(6, 'month')
    };
  }, [transactions]);

  const hasGraphData = useMemo(() => {
    return weeklyEvolutionData[selectedPeriod].some(d => d.total > 0);
  }, [weeklyEvolutionData, selectedPeriod]);

  const topExpenses = useMemo(() => {
    return [...transactions]
      .sort((a, b) => Math.abs(b.amount || 0) - Math.abs(a.amount || 0))
      .slice(0, 5);
  }, [transactions]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    const expensesOnly = transactions.filter(t => (t.amount || 0) < 0);
    expensesOnly.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount || 0);
    });
    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4);
  }, [transactions]);

  const totalExpensesAmount = useMemo(() => {
    return transactions.filter(t => (t.amount || 0) < 0).reduce((acc, t) => acc + Math.abs(t.amount || 0), 0);
  }, [transactions]);

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
            <h2 className="text-sm font-bold uppercase tracking-widest text-primary/60 mb-1">Análise Mensal</h2>
            <h1 className="text-4xl font-black tracking-tighter text-foreground">Relatórios</h1>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex gap-2">
            <Badge variant="outline" className="px-4 py-2 rounded-xl apple-glass border-primary/10 text-primary font-bold">
              {format(new Date(), "MMMM, yyyy", { locale: ptBR })}
            </Badge>
          </motion.div>
        </div>

        {/* Section 1: Acerto de Contas */}
        <motion.div variants={itemVariants}>
          <Card className="apple-card overflow-hidden border-none shadow-2xl bg-gradient-to-br from-white to-primary/5 dark:from-[#1A1A1A] dark:to-primary/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-primary mb-1">
                <div className={cn(
                  "p-2 rounded-xl transition-colors",
                  diff > 1 ? "bg-emerald-500/10 text-emerald-600" : diff < -1 ? "bg-rose-500/10 text-rose-600" : "bg-primary/10 text-primary"
                )}>
                  <ArrowRightLeft size={20} />
                </div>
                <CardTitle className="text-xl">Fechamento do Mês</CardTitle>
              </div>
              <CardDescription>Cálculo automático baseado nas despesas conjuntas do mês.</CardDescription>
            </CardHeader>
            <CardContent className="-mt-4">
              <div className="apple-glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6 text-center md:text-left">
                  <div className="flex -space-x-4">
                    <Avatar className="w-16 h-16 border-4 border-white shadow-lg ring-1 ring-muted/20">
                      <AvatarImage src={profile?.avatar_url || userAvatars.Jorge} />
                      <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center relative z-10 transition-colors",
                      isSettled ? "bg-emerald-500 text-white" : (diff > 1 ? "bg-emerald-500/10 text-emerald-600" : diff < -1 ? "bg-rose-500/10 text-rose-600" : "bg-primary/10 text-primary")
                    )}>
                      {isSettled ? <CheckCircle2 size={24} /> : <ArrowRightLeft size={24} className={cn(diff < -1 && "rotate-180")} />}
                    </div>
                    {partnerProfile ? (
                      <Avatar className="w-16 h-16 border-4 border-white shadow-lg ring-1 ring-muted/20">
                        <AvatarImage src={partnerProfile.avatar_url || userAvatars.Lilian} />
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
                      <h3 className="text-xl font-bold tracking-tight">Nenhum gasto conjunto este mês.</h3>
                    ) : isSettled ? (
                      <h3 className="text-xl font-bold tracking-tight text-emerald-600">Tudo quite! Mês resolvido.</h3>
                    ) : Math.abs(diff) < 1 ? (
                      <h3 className="text-xl font-bold tracking-tight">Tudo quite! Vocês estão empatados.</h3>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold tracking-tight">
                          {diff < 0 ? `${userName}, você deve transferir` : `${partnerName}, deve transferir`}
                        </h3>
                        <p className={cn(
                          "text-3xl font-black text-primary dark:text-white",
                          diff < 0 ? "opacity-90" : "opacity-100"
                        )}>
                          {formatCurrency(settlementAmount)}
                        </p>
                        <p className="text-sm text-muted-foreground">para {diff < 0 ? partnerName : userName} para igualar os gastos conjuntos.</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="h-px w-full md:w-px md:h-20 bg-border/40" />
                <div className="flex flex-col items-center md:items-end gap-3">
                  <div className="text-center md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Gastos Conjuntos</p>
                    <p className="text-2xl font-black text-foreground">{formatCurrency(totalJoint)}</p>
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
                  Evolução de Gastos
                </CardTitle>
                <CardDescription>Acompanhe o ritmo dos gastos no período selecionado.</CardDescription>
              </div>
              <Tabs 
                value={selectedPeriod} 
                onValueChange={(val) => setSelectedPeriod(val as any)}
                className="w-full md:w-auto"
              >
                <TabsList className="grid grid-cols-3 apple-glass p-1 rounded-xl">
                  <TabsTrigger value="Este Mês" className="rounded-lg text-xs font-bold">Mês</TabsTrigger>
                  <TabsTrigger value="Últimos 3 Meses" className="rounded-lg text-xs font-bold">3 Meses</TabsTrigger>
                  <TabsTrigger value="Este Ano" className="rounded-lg text-xs font-bold">Ano</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="h-[300px] w-full">
                {hasGraphData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={weeklyEvolutionData[selectedPeriod]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: "hsl(var(--muted-foreground))" }}
                      />
                      <RechartsTooltip 
                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="apple-card p-3 shadow-xl border-none text-xs">
                                <p className="font-black mb-1 text-primary">{label}</p>
                                <p className="font-bold">Total: {formatCurrency(Number(payload[0].value) || 0)}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="total" 
                        radius={[6, 6, 0, 0]} 
                        animationDuration={1500}
                      >
                        {weeklyEvolutionData[selectedPeriod].map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill="hsl(var(--primary))" 
                            fillOpacity={0.8 + (index * 0.05)} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="p-4 bg-muted rounded-full">
                      <TrendingUp size={32} className="text-muted-foreground opacity-20" />
                    </div>
                    <p className="text-sm text-muted-foreground max-w-[200px]">
                      Dados insuficientes para gerar o gráfico. Comece a registrar suas finanças para ver sua evolução.
                    </p>
                  </div>
                )}
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
                  const percentage = totalExpensesAmount > 0 ? (amount / totalExpensesAmount) * 100 : 0;
                  
                  return (
                    <Card key={category} className="apple-card apple-card-hover border-none shadow-sm group">
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
                <p className="text-sm text-muted-foreground p-4 text-center italic">Ainda não há gastos registrados.</p>
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
                      <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted/30 transition-all border border-transparent hover:border-border/40">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-muted rounded-2xl text-muted-foreground">
                            {React.createElement(CATEGORY_ICONS[tx.category] || HelpCircle, { size: 18 })}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{tx.description}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{tx.category}</p>
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
              Isso marcará as contas como resolvidas. Certifique-se de que a transferência de <span className="font-bold">{formatCurrency(settlementAmount)}</span> foi feita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" className="rounded-full" onClick={() => setIsSettlementModalOpen(false)}>Cancelar</Button>
            <Button className="rounded-full" onClick={handleSettlementConfirm}>Confirmar Acerto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
