import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  CreditCard, 
  ArrowUpRight, 
  ArrowDownRight,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  ChevronDown,
  Clock,
  HelpCircle
} from "lucide-react";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useFinanceStore, CATEGORY_ICONS, AVATARS } from "@/hooks/use-finance-store";
import { format, parse, isSameMonth, subMonths, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/")({
 head: () => ({
   meta: [
     { title: "Dashboard | CoupleFinance" },
     { name: "description", content: "Finanças do casal em um só lugar." },
   ],
 }),
 component: Dashboard,
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

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedTx, setSelectedTx] = useState<any>(null);
  const { transactions } = useFinanceStore();
  
  // Estados para os painéis laterais
  const [activeSheet, setActiveSheet] = useState<'balance' | 'income' | 'expenses' | 'credit' | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<Date>(startOfMonth(new Date()));

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Gerar lista de meses para o dropdown (últimos 12 meses)
  const availableMonths = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => subMonths(startOfMonth(new Date()), i));
  }, []);

  // Filtragem de transações
  const filteredTransactions = useMemo(() => {
    if (!activeSheet) return [];
    
    let baseTransactions = [...transactions];
    
    // Para Faturas a Pagar (Crédito), não filtra por mês
    if (activeSheet === 'credit') {
      return baseTransactions
        .filter(tx => tx.type === 'Crédito')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // Filtrar por tipo dependendo do card
    if (activeSheet === 'income') {
      baseTransactions = baseTransactions.filter(tx => tx.type === 'Entrada');
    } else if (activeSheet === 'expenses') {
      baseTransactions = baseTransactions.filter(tx => tx.type === 'Débito');
    }

    // Filtrar pelo mês selecionado
    return baseTransactions
      .filter(tx => isSameMonth(new Date(tx.date), selectedMonth))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeSheet, transactions, selectedMonth]);

  const totals = useMemo(() => {
    const now = new Date();
    const currentMonthTxs = transactions.filter(tx => isSameMonth(new Date(tx.date), now));
    
    const balance = transactions.reduce((acc, tx) => acc + (tx.type === 'Entrada' ? tx.amount : tx.amount), 0);
    const income = currentMonthTxs.filter(tx => tx.type === 'Entrada').reduce((acc, tx) => acc + tx.amount, 0);
    const expenses = currentMonthTxs.filter(tx => tx.type === 'Débito').reduce((acc, tx) => acc + Math.abs(tx.amount), 0);
    const credit = transactions.filter(tx => tx.type === 'Crédito').reduce((acc, tx) => acc + Math.abs(tx.amount), 0);

    return { balance, income, expenses, credit };
  }, [transactions]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 apple-card flex flex-col p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="w-10 h-10 bg-muted rounded-lg animate-pulse" />
                  <div className="w-20 h-4 bg-muted rounded animate-pulse" />
                </div>
                <div className="w-32 h-8 bg-muted rounded animate-pulse" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[450px] apple-card p-8 space-y-4">
              <div className="w-48 h-8 bg-muted rounded animate-pulse" />
              <div className="w-full h-full bg-muted/50 rounded-2xl animate-pulse" />
            </div>
            <div className="h-[450px] apple-card p-8 space-y-6">
              <div className="w-32 h-8 bg-muted rounded animate-pulse" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-2xl animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="w-full h-4 bg-muted rounded animate-pulse" />
                    <div className="w-2/3 h-3 bg-muted rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const renderTransactionItem = (tx: any) => {
    const Icon = CATEGORY_ICONS[tx.category] || HelpCircle;
    const avatar = AVATARS[tx.responsible];

    return (
      <div 
        key={tx.id} 
        onClick={() => setSelectedTx(tx)}
        className="flex items-center justify-between group cursor-pointer p-3 rounded-2xl hover:bg-accent/50 active:scale-95 transition-all border border-transparent hover:border-border/50"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-muted rounded-2xl text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
            <Icon size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold truncate">{tx.description}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-muted-foreground">{format(new Date(tx.date), "dd MMM, HH:mm", { locale: ptBR })}</span>
              <div className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                <img src={avatar} alt={tx.responsible} className="w-3 h-3 rounded-full" />
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {tx.responsible}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className={cn(
            "text-sm font-bold",
            tx.type === 'Entrada' ? 'text-emerald-600' : 'text-foreground'
          )}>
            {tx.type === 'Entrada' ? '+' : '-'} R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[10px] text-muted-foreground">{tx.category}</p>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Grid de Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div variants={itemVariants} onClick={() => setActiveSheet('balance')} className="cursor-pointer active:scale-95 transition-all">
            <Card className="apple-card apple-card-hover group card-gradient-blue border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet size={80} />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg text-white">
                    <Wallet size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/10 px-2 py-0.5 rounded-full">Geral</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Saldo Total</p>
                  <h3 className="text-2xl font-bold tracking-tight text-white">R$ {totals.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} onClick={() => setActiveSheet('income')} className="cursor-pointer active:scale-95 transition-all">
            <Card className="apple-card apple-card-hover group card-gradient-light-blue border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ArrowUpRight size={80} />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg text-white">
                    <ArrowUpRight size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/10 px-2 py-0.5 rounded-full">Mensal</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Entradas do Mês</p>
                  <h3 className="text-2xl font-bold tracking-tight text-white">R$ {totals.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} onClick={() => setActiveSheet('expenses')} className="cursor-pointer active:scale-95 transition-all">
            <Card className="apple-card apple-card-hover group card-gradient-magenta border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ArrowDownRight size={80} />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg text-white">
                    <ArrowDownRight size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/10 px-2 py-0.5 rounded-full">Débito</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Saídas (Débito)</p>
                  <h3 className="text-2xl font-bold tracking-tight text-white">R$ {totals.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} onClick={() => setActiveSheet('credit')} className="cursor-pointer active:scale-95 transition-all">
            <Card className="apple-card apple-card-hover group border-2 border-primary/20 dark:border-primary/40 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <CreditCard size={80} />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary dark:text-primary-foreground">
                    <CreditCard size={20} />
                  </div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-destructive">Faturas a pagar</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">R$ {totals.credit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between items-center">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">Tudo de crédito</span>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">Histórico Total</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Seções de Gráfico e Transações */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Gráfico */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="apple-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Fluxo de Caixa</CardTitle>
                  <p className="text-xs text-muted-foreground">Visão geral dos últimos 6 meses</p>
                </div>
              </CardHeader>
              <CardContent className="h-[350px] w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#888' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#888' }} 
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    />
                    <Legend verticalAlign="top" height={36} iconType="circle" />
                    <Area 
                      name="Entradas"
                      type="monotone" 
                      dataKey="entradas" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorEntradas)" 
                    />
                    <Area 
                      name="Saídas"
                      type="monotone" 
                      dataKey="saidas" 
                      stroke="#f43f5e" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorSaidas)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transações Recentes */}
          <motion.div variants={itemVariants} id="recent-transactions">
            <Card className="apple-card apple-card-hover">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Transações</CardTitle>
                  <p className="text-xs text-muted-foreground">Últimos registros do casal</p>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-6">
                  {transactions.slice(0, 4).map((tx) => (
                    <div 
                      key={tx.id} 
                      onClick={() => setSelectedTx(tx)}
                      className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-2xl hover:bg-white/10 active:scale-95 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-muted rounded-2xl text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          {React.createElement(CATEGORY_ICONS[tx.category] || Coffee, { size: 18 })}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{tx.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">{format(new Date(tx.date), "dd MMM, HH:mm", { locale: ptBR })}</span>
                            <div className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                              <img src={AVATARS[tx.responsible]} alt={tx.responsible} className="w-3 h-3 rounded-full" />
                              <span className="text-[10px] font-semibold text-muted-foreground">
                                {tx.responsible}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={cn(
                          "text-sm font-bold",
                          tx.type === 'Entrada' ? 'text-emerald-600' : 'text-foreground'
                        )}>
                          {tx.type === 'Entrada' ? '+' : '-'} R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-[10px] text-muted-foreground">{tx.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" onClick={() => navigate({ to: '/transacoes' })} className="w-full mt-8 text-xs font-bold text-muted-foreground hover:text-primary active:scale-95 transition-all">
                  Ver extrato completo
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Painel Lateral de Detalhes do Card */}
      <Sheet open={!!activeSheet} onOpenChange={(open) => !open && setActiveSheet(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md apple-card border-none bg-background/95 backdrop-blur-xl p-0 overflow-hidden flex flex-col">
          <div className="p-6 pb-4 flex items-center justify-between border-b bg-muted/30">
            <SheetHeader className="text-left space-y-0.5">
              <SheetTitle className="text-xl font-black flex items-center gap-2">
                {activeSheet === 'balance' && <><Wallet className="text-blue-500" /> Saldo Total</>}
                {activeSheet === 'income' && <><ArrowUpRight className="text-emerald-500" /> Entradas</>}
                {activeSheet === 'expenses' && <><ArrowDownRight className="text-rose-500" /> Saídas (Débito)</>}
                {activeSheet === 'credit' && <><CreditCard className="text-amber-500" /> Faturas a Pagar</>}
              </SheetTitle>
              <SheetDescription>
                {activeSheet === 'credit' 
                  ? 'Todas as faturas de crédito em aberto' 
                  : `Transações de ${format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}`}
              </SheetDescription>
            </SheetHeader>
            
            {activeSheet !== 'credit' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full gap-2 text-xs font-bold border-muted-foreground/20 hover:bg-muted/50 active:scale-95 transition-all">
                    Mês <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="apple-card w-48">
                  {availableMonths.map((month) => (
                    <DropdownMenuItem 
                      key={month.toISOString()} 
                      onClick={() => setSelectedMonth(month)}
                      className={cn(
                        "rounded-lg cursor-pointer",
                        isSameMonth(month, selectedMonth) && "bg-primary/10 text-primary font-bold"
                      )}
                    >
                      {format(month, "MMMM yyyy", { locale: ptBR })}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredTransactions.length > 0 ? (
              <div className="space-y-1">
                {filteredTransactions.map(renderTransactionItem)}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 opacity-50">
                <div className="p-6 bg-muted rounded-full">
                  <Clock size={40} />
                </div>
                <p className="text-sm font-medium">Nenhuma transação encontrada</p>
              </div>
            )}
          </div>

          <div className="p-6 border-t bg-muted/20">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-bold text-muted-foreground uppercase">Resumo do Período</p>
              <p className="text-lg font-black">
                R$ {filteredTransactions.reduce((acc, tx) => acc + (tx.type === 'Entrada' ? tx.amount : -Math.abs(tx.amount)), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <Button variant="secondary" className="w-full rounded-2xl font-bold active:scale-95 transition-all" onClick={() => setActiveSheet(null)}>
              Fechar Painel
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Detail Modal for Transactions */}
      <Dialog open={!!selectedTx} onOpenChange={(open: boolean) => !open && setSelectedTx(null)}>
        <DialogContent className="apple-card dark:bg-[#1A1A1A] border-border/40">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Detalhes da Transação</DialogTitle>
            <DialogDescription className="sr-only">Visualização detalhada do gasto selecionado</DialogDescription>
          </DialogHeader>
          {selectedTx && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                    {React.createElement(CATEGORY_ICONS[selectedTx.category] || Coffee, { size: 24 })}
                  </div>
                  <div>
                    <p className="text-lg font-bold">{selectedTx.description}</p>
                    <p className="text-sm text-muted-foreground">{selectedTx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("text-xl font-black", selectedTx.type === 'Entrada' ? "text-emerald-600" : "text-foreground")}>
                    {selectedTx.type === 'Entrada' ? '+' : '-'} R$ {Math.abs(selectedTx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground">{format(new Date(selectedTx.date), "dd MMM, HH:mm", { locale: ptBR })}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="apple-interactive p-4 dark:bg-black/20">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Responsável</p>
                  <div className="flex items-center gap-2">
                    <img src={AVATARS[selectedTx.responsible]} alt={selectedTx.responsible} className="w-6 h-6 rounded-full" />
                    <p className="font-bold">{selectedTx.responsible}</p>
                  </div>
                </div>
                <div className="apple-interactive p-4 dark:bg-black/20">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Tipo</p>
                  <p className="font-bold">{selectedTx.type}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" className="w-full rounded-xl active:scale-95 transition-all" onClick={() => setSelectedTx(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}


