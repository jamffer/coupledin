import { useState, useMemo, useEffect } from "react";
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowRightLeft, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  HelpCircle,
  Smartphone,
  MessageCircle,
  CheckCircle2,
  Users,
  Calendar,
  DollarSign
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useFinanceStore, CATEGORY_ICONS, type Transaction, DIVISION_ICONS } from "@/hooks/use-finance-store";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios | CoupleFinance" },
      { name: "description", content: "Análise de gastos e fechamento do mês do casal." },
    ],
  }),
  component: RelatoriosPage,
});

const weeklyEvolutionData = {
  "Este Mês": [
    { name: "Sem 1", total: 1200 },
    { name: "Sem 2", total: 950 },
    { name: "Sem 3", total: 1400 },
    { name: "Sem 4", total: 800 },
  ],
  "Últimos 3 Meses": [
    { name: "Abril", total: 4200 },
    { name: "Maio", total: 3800 },
    { name: "Junho", total: 4350 },
  ],
  "Este Ano": [
    { name: "Jan", total: 3500 },
    { name: "Fev", total: 3200 },
    { name: "Mar", total: 4100 },
    { name: "Abr", total: 4200 },
    { name: "Mai", total: 3800 },
    { name: "Jun", total: 4350 },
  ]
};

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
  const navigate = useNavigate();

  // New States
  const [isSettled, setIsSettled] = useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<keyof typeof weeklyEvolutionData>("Este Mês");
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, authLoading]);

  const handleSettlementConfirm = () => {
    setIsSettled(true);
    setIsSettlementModalOpen(false);
    toast.success("Acerto realizado com sucesso!");
  };

  const handleShareSummary = () => {
    const summary = `Resumo Financeiro - Junho\nTotal Gastos Conjuntos: R$ ${totalJoint.toLocaleString('pt-BR')}\nStatus: ${isSettled ? 'Tudo quite!' : (diff < 0 ? "Jorge deve transferir" : "Lilian deve transferir") + " R$ " + settlementAmount.toLocaleString('pt-BR')}`;
    navigator.clipboard.writeText(summary);
    toast.success("Resumo copiado para a área de transferência!");
  };
  
  // Cálculo de Despesas Conjuntas e Proporção
  const jointExpenses = transactions.filter(t => t.division !== "Individual");
  const totalJoint = jointExpenses.reduce((acc, t) => acc + Math.abs(t.amount), 0);
  
  const totalIncome = incomeJorge + incomeLilian;
  const jorgeShare = totalIncome > 0 ? incomeJorge / totalIncome : 0.5;
  const lilianShare = totalIncome > 0 ? incomeLilian / totalIncome : 0.5;

  const jorgeShouldPay = jointExpenses.reduce((acc, t) => {
    const share = t.division === "Conjunta 50/50" ? 0.5 : jorgeShare;
    return acc + (Math.abs(t.amount) * share);
  }, 0);
  
  const lilianShouldPay = totalJoint - jorgeShouldPay;
  
  const jorgePaid = jointExpenses.filter(t => t.responsible === "Jorge").reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const lilianPaid = totalJoint - jorgePaid;
  
  const diff = jorgePaid - jorgeShouldPay; // Se positivo, Jorge pagou a mais. Se negativo, Jorge deve.
  const settlementAmount = Math.abs(diff);

  const topExpenses = useMemo(() => {
    return [...transactions]
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
      .slice(0, 5);
  }, [transactions]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions.forEach(t => {
      if (t.amount < 0) {
        totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount);
      }
    });
    return Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4);
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
              Junho, 2024
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
                <CardTitle className="text-xl">Fechamento de Junho</CardTitle>
              </div>
              <CardDescription>Cálculo automático baseado nas despesas conjuntas do mês.</CardDescription>
            </CardHeader>
            <CardContent className="-mt-4">
              <div className="apple-glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6 text-center md:text-left">
                  <div className="flex -space-x-4">
                    <Avatar className="w-16 h-16 border-4 border-white shadow-lg ring-1 ring-muted/20">
                      <AvatarImage src={userAvatars.Jorge} />
                      <AvatarFallback>JO</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center relative z-10 transition-colors",
                      isSettled ? "bg-emerald-500 text-white" : (diff > 1 ? "bg-emerald-500/10 text-emerald-600" : diff < -1 ? "bg-rose-500/10 text-rose-600" : "bg-primary/10 text-primary")
                    )}>
                      {isSettled ? <CheckCircle2 size={24} /> : <ArrowRightLeft size={24} className={cn(diff < -1 && "rotate-180")} />}
                    </div>
                    <Avatar className="w-16 h-16 border-4 border-white shadow-lg ring-1 ring-muted/20">
                      <AvatarImage src={userAvatars.Lilian} />
                      <AvatarFallback>LI</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-1">
                    {isSettled ? (
                      <h3 className="text-xl font-bold tracking-tight text-emerald-600">Tudo quite! Mês resolvido.</h3>
                    ) : Math.abs(diff) < 1 ? (
                      <h3 className="text-xl font-bold tracking-tight">Tudo quite! Vocês estão empatados.</h3>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold tracking-tight">
                          {diff < 0 ? "Jorge, você deve transferir" : "Lilian, você deve transferir"}
                        </h3>
                        <p className={cn(
                          "text-3xl font-black text-primary dark:text-white",
                          diff < 0 ? "opacity-90" : "opacity-100"
                        )}>
                          R$ {settlementAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-sm text-muted-foreground">para {diff < 0 ? "Lilian" : "o Jorge"} para igualar os gastos conjutos.</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="h-px w-full md:w-px md:h-20 bg-border/40" />
                <div className="flex flex-col items-center md:items-end gap-3">
                  <div className="text-center md:text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Gastos Conjuntos</p>
                    <p className="text-2xl font-black text-foreground">R$ {totalJoint.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
                        <TooltipContent>Compartilhar no WhatsApp</TooltipContent>
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
                              <p className="font-bold">Total: R$ {payload[0].value?.toLocaleString('pt-BR')}</p>
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
              {categoryTotals.map(([category, amount]) => {
                const Icon = CATEGORY_ICONS[category] || HelpCircle;
                const percentage = (amount / Math.abs(transactions.reduce((acc, t) => t.amount < 0 ? acc + t.amount : acc, 0))) * 100;
                
                return (
                  <Card key={category} className="apple-card apple-card-hover border-none shadow-sm group">
                    <CardContent className="p-5 flex items-center gap-4">
                      <div className="p-3 bg-muted rounded-2xl text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-end mb-1">
                          <p className="text-sm font-bold truncate">{category}</p>
                          <p className="text-sm font-black">R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
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
              })}
            </div>
          </motion.div>

          {/* Section 3: Maiores Gastos */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="apple-card apple-card-hover h-full border-2 border-primary/5 dark:border-white/5">
              <CardHeader>
                <CardTitle>Top Maiores Gastos</CardTitle>
                <CardDescription>As 5 transações mais pesadas do mês</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 px-0">
                <Table>
                  <TableHeader className="bg-muted/20 border-none">
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="pl-6 py-4 font-bold text-xs uppercase tracking-wider">Gasto</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-center">Quem</TableHead>
                      <TableHead className="pr-6 py-4 text-right font-bold text-xs uppercase tracking-wider">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topExpenses.map((expense) => {
                      const CategoryIcon = CATEGORY_ICONS[expense.category] || HelpCircle;
                      const avatarUrl = userAvatars[expense.responsible as keyof typeof userAvatars];

                      return (
                        <TableRow 
                          key={expense.id} 
                          className="group border-b border-border/40 hover:bg-muted/10 transition-colors cursor-pointer"
                          onClick={() => {
                            setSelectedTx(expense);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <TableCell className="pl-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <CategoryIcon size={16} />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold truncate leading-tight">{expense.description}</p>
                                <p className="text-[10px] text-muted-foreground">{expense.date} • {expense.category}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex justify-center">
                              <Avatar className="w-8 h-8 border border-white shadow-sm ring-1 ring-muted/20">
                                <AvatarImage src={avatarUrl} />
                                <AvatarFallback>{expense.responsible[0]}</AvatarFallback>
                              </Avatar>
                            </div>
                          </TableCell>
                          <TableCell className="pr-6 py-4 text-right font-black text-sm text-rose-500">
                            R$ {Math.abs(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {/* Settlement Confirmation Modal */}
          <Dialog open={isSettlementModalOpen} onOpenChange={setIsSettlementModalOpen}>
            <DialogContent className="sm:max-w-[425px] rounded-3xl apple-card">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ArrowRightLeft size={20} className="text-primary" />
                  Confirmar Acerto
                </DialogTitle>
                <DialogDescription className="pt-2">
                  Deseja zerar os saldos e marcar o mês como resolvido? Isso registrará uma transferência de ajuste no valor de <span className="font-bold text-foreground">R$ {settlementAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 mt-4">
                <Button variant="ghost" onClick={() => setIsSettlementModalOpen(false)} className="rounded-full">Cancelar</Button>
                <Button onClick={handleSettlementConfirm} className="rounded-full px-8 font-bold shadow-lg">Confirmar Transferência</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Transaction Detail Modal */}
          <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
            <DialogContent className="sm:max-w-[425px] rounded-3xl apple-card overflow-hidden p-0 border-none">
              {selectedTx && (
                <div className="relative">
                  <div className="bg-primary/5 p-8 text-center border-b border-primary/10">
                    <div className="mx-auto w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary mb-4">
                      {(() => {
                        const Icon = CATEGORY_ICONS[selectedTx.category] || HelpCircle;
                        return <Icon size={32} />;
                      })()}
                    </div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-1">{selectedTx.category}</h3>
                    <h2 className="text-2xl font-black tracking-tight">{selectedTx.description}</h2>
                    <p className="text-3xl font-black mt-4 text-primary">
                      R$ {Math.abs(selectedTx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <Calendar size={10} /> Data
                        </p>
                        <p className="text-sm font-bold">{selectedTx.date}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <Users size={10} /> Pagador
                        </p>
                        <div className="flex items-center gap-2">
                          <Avatar className="w-5 h-5 border shadow-sm">
                            <AvatarImage src={userAvatars[selectedTx.responsible as keyof typeof userAvatars]} />
                            <AvatarFallback>{selectedTx.responsible[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-bold">{selectedTx.responsible}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <ArrowRightLeft size={10} /> Divisão
                        </p>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const DivIcon = DIVISION_ICONS[selectedTx.division] || Split;
                            return <DivIcon size={14} className="text-primary" />;
                          })()}
                          <span className="text-sm font-bold">{selectedTx.division}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                          <DollarSign size={10} /> Tipo
                        </p>
                        <Badge variant="outline" className="text-[10px] font-bold uppercase rounded-lg">
                          {selectedTx.type}
                        </Badge>
                      </div>
                    </div>

                    <Button 
                      className="w-full rounded-2xl h-12 font-bold shadow-lg mt-4"
                      onClick={() => setIsDetailModalOpen(false)}
                    >
                      Fechar
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
}
