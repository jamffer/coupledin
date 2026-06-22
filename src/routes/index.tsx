import * as React from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
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
import { useState, useEffect, useMemo, useCallback } from "react";
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
  HelpCircle,
  AlertCircle,
  RefreshCcw,
  Receipt,
  Loader2,
} from "lucide-react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { useFinanceStore, CATEGORY_ICONS, type Transaction } from "@/hooks/use-finance-store";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parse, isSameMonth, subMonths, startOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSpaceOnboardingStore, OnboardingStep } from "@/store/useSpaceOnboardingStore";
import { LoadingOverlay } from "@/components/onboarding/loading-overlay";
import { EmptyState } from "@/components/empty-state";
import { useActiveMonths } from "@/hooks/use-active-months";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | CoupleDin" },
      { name: "description", content: "Finanças do casal em um só lugar." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => {
    return {
      month: (search.month as string) || undefined,
      sheet: (search.sheet as string) || undefined,
    };
  },
  component: Dashboard,
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

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const navigate = useNavigate();
  const search = useSearch({ from: "/" });
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const { user, loading: authLoading } = useAuth();
  const { transactions, setTransactions } = useFinanceStore();
  const { profile, partnerProfile, isLoading: isProfileLoading } = useProfile();
  const { step, message, setStep, reset: resetOnboarding } = useSpaceOnboardingStore();

  const isProcessing =
    step === OnboardingStep.MOUNTING_DASHBOARD || step === OnboardingStep.CONNECTING_REALTIME;
  const progressValue = {
    [OnboardingStep.IDLE]: 0,
    [OnboardingStep.VALIDATING]: 20,
    [OnboardingStep.CREATING_SPACE]: 40,
    [OnboardingStep.CONNECTING_REALTIME]: 60,
    [OnboardingStep.MOUNTING_DASHBOARD]: 80,
    [OnboardingStep.SUCCESS]: 100,
    [OnboardingStep.ERROR]: 0,
  }[step];

  // Estados para os painéis laterais baseados na URL
  const activeSheet = (search.sheet as "balance" | "income" | "expenses" | "credit" | null) || null;
  const setActiveSheet = (sheet: string | null) => {
    navigate({
      search: { ...search, sheet: sheet || undefined },
    });
  };

  const selectedMonth = useMemo(() => {
    if (search.month) {
      return parse(search.month, "yyyy-MM", new Date());
    }
    return startOfMonth(new Date());
  }, [search.month]);

  const setSelectedMonth = (date: Date) => {
    navigate({
      search: { ...search, month: format(date, "yyyy-MM") },
    });
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate({ to: "/auth" });
      } else if (profile && !profile.couple_id) {
        navigate({ to: "/auth" });
      }
    }
  }, [user, authLoading, profile, navigate]);

  const fetchTransactions = useCallback(
    async (coupleId: string) => {
      try {
        setLoading(true);
        setError(false);

        const { data, error } = await supabase
          .from("transactions")
          .select("*, profiles!user_id(display_name, avatar_url)")
          .eq("couple_id", coupleId)
          .order("date", { ascending: false });

        if (error) throw error;

        if (data) {
          setTransactions(data as Transaction[]);
        }
      } catch (err: unknown) {
        console.error("Error fetching transactions:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    },
    [setTransactions],
  );

  useEffect(() => {
    let subscription: ReturnType<typeof supabase.channel> | undefined;

    if (profile?.couple_id) {
      setStep(OnboardingStep.CONNECTING_REALTIME);

      const coupleId = profile.couple_id;

      // Connect to Realtime first or in parallel
      const channel = supabase.channel(`dashboard-updates-${Math.random()}`).on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
          filter: `couple_id=eq.${coupleId}`,
        },
        () => {
          fetchTransactions(coupleId);
        },
      );

      // Subscribe and only finish loading after subscription is confirmed AND initial fetch is done
      channel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          setStep(OnboardingStep.MOUNTING_DASHBOARD);
          await fetchTransactions(coupleId);
          setStep(OnboardingStep.SUCCESS);

          // Reset onboarding state after a delay to clear the overlay
          setTimeout(resetOnboarding, 1000);
        }
      });

      subscription = channel;

      return () => {
        if (subscription) {
          supabase.removeChannel(subscription);
        }
      };
    } else if (profile && !profile.couple_id) {
      setLoading(false);
    }
  }, [profile?.couple_id, fetchTransactions]);

  useEffect(() => {
    if (!profile) {
      const timer = setTimeout(() => setLoading(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [profile]);

  // Meses ativos vindos do banco (apenas meses com transações reais)
  const { data: activeMonthsData, isLoading: isActiveMonthsLoading } = useActiveMonths();
  const availableMonths = useMemo(() => {
    return activeMonthsData?.map((m) => m.date) ?? [];
  }, [activeMonthsData]);

  // Filtragem de transações
  const filteredTransactions = useMemo(() => {
    if (!activeSheet) return [];

    let baseTransactions = [...transactions];

    // Para Faturas a Pagar (Crédito), não filtra por mês
    if (activeSheet === "credit") {
      return baseTransactions
        .filter((tx) => tx.type === "Crédito")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // Filtrar por tipo dependendo do card
    if (activeSheet === "income") {
      baseTransactions = baseTransactions.filter((tx) => tx.type === "Entrada");
    } else if (activeSheet === "expenses") {
      baseTransactions = baseTransactions.filter(
        (tx) => tx.type === "Débito" || tx.type === "Saída" || tx.type === "expense",
      );
    }

    // Filtrar pelo mês selecionado
    return baseTransactions
      .filter((tx) => tx && tx.date && isSameMonth(new Date(tx.date), selectedMonth))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [activeSheet, transactions, selectedMonth]);

  const totals = useMemo(() => {
    const now = new Date();
    const currentMonthTxs = transactions.filter(
      (tx) => tx && tx.date && isSameMonth(new Date(tx.date), now),
    );

    const balance = transactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);
    const income = currentMonthTxs
      .filter((tx) => tx?.type === "Entrada")
      .reduce((acc, tx) => acc + (tx?.amount || 0), 0);
    const expenses = currentMonthTxs
      .filter(
        (tx) =>
          tx?.type === "Débito" ||
          tx?.type === "Saída" ||
          tx?.type === "Crédito" ||
          tx?.type === "expense",
      )
      .reduce((acc, tx) => acc + Math.abs(tx?.amount || 0), 0);
    const credit = transactions
      .filter((tx) => tx?.type === "Crédito")
      .reduce((acc, tx) => acc + Math.abs(tx?.amount || 0), 0);

    return { balance, income, expenses, credit };
  }, [transactions]);

  const dashboardChartData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) =>
      subMonths(startOfMonth(new Date()), 5 - i),
    );

    return last6Months.map((month) => {
      const monthTxs = transactions.filter(
        (tx) => tx && tx.date && isSameMonth(new Date(tx.date), month),
      );
      const entradas = monthTxs
        .filter((tx) => tx.type === "Entrada")
        .reduce((acc, tx) => acc + (tx.amount || 0), 0);
      const saidas = monthTxs
        .filter(
          (tx) =>
            tx.type === "Débito" ||
            tx.type === "Saída" ||
            tx.type === "Crédito" ||
            tx.type === "expense",
        )
        .reduce((acc, tx) => acc + Math.abs(tx.amount || 0), 0);

      return {
        name: format(month, "MMM", { locale: ptBR }),
        entradas,
        saidas,
      };
    });
  }, [transactions]);

  const hasChartData = useMemo(() => {
    return dashboardChartData.some((d) => d.entradas > 0 || d.saidas > 0);
  }, [dashboardChartData]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                className="h-32 apple-card flex flex-col p-6 space-y-4 border-none shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <Skeleton className="w-20 h-4 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-32 h-8 rounded-lg" />
                </div>
              </Card>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 h-[450px] apple-card p-8 space-y-6 border-none shadow-sm">
              <div className="space-y-2">
                <Skeleton className="w-48 h-8 rounded-lg" />
                <Skeleton className="w-32 h-4 rounded-full" />
              </div>
              <Skeleton className="w-full h-full max-h-[300px] rounded-2xl" />
            </Card>
            <Card className="h-[450px] apple-card p-8 space-y-6 border-none shadow-sm">
              <Skeleton className="w-32 h-8 rounded-lg" />
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-full h-4 rounded-full" />
                    <Skeleton className="w-2/3 h-3 rounded-full" />
                  </div>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="h-[70vh] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <Card className="apple-card p-8 text-center space-y-6 border-destructive/20 bg-destructive/5">
              <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={32} />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-xl font-bold">
                  Não foi possível carregar os dados
                </CardTitle>
                <p className="text-muted-foreground">
                  Tivemos um problema de conexão ou o espaço não foi encontrado.
                </p>
              </div>
              <Button
                onClick={() => profile?.couple_id && fetchTransactions(profile.couple_id)}
                className="w-full h-12 rounded-xl font-bold gap-2 active:scale-95 transition-all"
                disabled={loading}
              >
                <RefreshCcw size={18} className={cn(loading && "animate-spin")} />
                {loading ? "Tentando conectar..." : "Tentar Novamente"}
              </Button>
            </Card>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  const renderTransactionItem = (tx: Transaction) => {
    const Icon = CATEGORY_ICONS[tx.category] || HelpCircle;
    const avatar =
      tx.profiles?.avatar_url;
    const responsibleName = tx.profiles?.display_name || tx.responsible;

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
              <span className="text-[10px] text-muted-foreground">
                {tx.date ? format(new Date(tx.date), "dd MMM, HH:mm", { locale: ptBR }) : ""}
              </span>
              <div className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                <img src={avatar} alt={responsibleName} className="w-3 h-3 rounded-full" />
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {responsibleName}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p
            className={cn(
              "text-sm font-bold",
              tx.type === "Entrada" ? "text-emerald-600" : "text-foreground",
            )}
          >
            {tx.type === "Entrada" ? "+" : "-"} {formatCurrency(Math.abs(tx.amount || 0))}
          </p>
          <p className="text-[10px] text-muted-foreground">{tx.category}</p>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <LoadingOverlay isVisible={isProcessing} message={message} progressValue={progressValue} />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Grid de Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            variants={itemVariants}
            onClick={() => setActiveSheet("balance")}
            className="cursor-pointer active:scale-95 transition-all"
          >
            <Card className="apple-card apple-card-hover group card-gradient-blue border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Wallet size={80} />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg text-white">
                    <Wallet size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/10 px-2 py-0.5 rounded-full">
                    Geral
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Saldo Total</p>
                  <h3 className="text-2xl font-bold tracking-tight text-white">
                    {formatCurrency(totals.balance)}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={itemVariants}
            onClick={() => setActiveSheet("income")}
            className="cursor-pointer active:scale-95 transition-all"
          >
            <Card className="apple-card apple-card-hover group card-gradient-light-blue border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ArrowUpRight size={80} />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg text-white">
                    <ArrowUpRight size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/10 px-2 py-0.5 rounded-full">
                    Mensal
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Entradas do Mês</p>
                  <h3 className="text-2xl font-bold tracking-tight text-white">
                    {formatCurrency(totals.income)}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={itemVariants}
            onClick={() => setActiveSheet("expenses")}
            className="cursor-pointer active:scale-95 transition-all"
          >
            <Card className="apple-card apple-card-hover group card-gradient-magenta border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ArrowDownRight size={80} />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg text-white">
                    <ArrowDownRight size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/10 px-2 py-0.5 rounded-full">
                    Débito
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Débitos</p>
                  <h3 className="text-2xl font-bold tracking-tight text-white">
                    {formatCurrency(totals.expenses)}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={itemVariants}
            onClick={() => setActiveSheet("credit")}
            className="cursor-pointer active:scale-95 transition-all"
          >
            <Card className="apple-card apple-card-hover group border-2 border-primary/20 dark:border-primary/40 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <CreditCard size={80} />
              </div>
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary dark:text-primary-foreground">
                    <CreditCard size={20} />
                  </div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-destructive">
                    Faturas a pagar
                  </p>
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">
                      {formatCurrency(totals.credit)}
                    </h3>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between items-center">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">
                      Tudo de crédito
                    </span>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                      Histórico Total
                    </span>
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
            <Card className="apple-card overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-bold">Fluxo de Caixa</CardTitle>
                  <p className="text-xs text-muted-foreground">Visão geral dos últimos 6 meses</p>
                </div>
              </CardHeader>
              <CardContent className="h-[350px] w-full pt-4 relative">
                {hasChartData ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={dashboardChartData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorSaidas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                        strokeOpacity={0.55}
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#888" }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#888" }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
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
                        name="Débitos"
                        type="monotone"
                        dataKey="saidas"
                        stroke="#f43f5e"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorSaidas)"
                      />
                    </AreaChart>
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
              </CardContent>
            </Card>
          </motion.div>

          {/* Transações Recentes */}
          <motion.div variants={itemVariants} id="recent-transactions">
            <Card className="apple-card apple-card-hover">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Lançamentos</CardTitle>
                  <p className="text-xs text-muted-foreground">Últimos registros do casal</p>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-6">
                  {transactions.length > 0 ? (
                    transactions.slice(0, 4).map((tx) => (
                      <div
                        key={tx.id}
                        onClick={() => setSelectedTx(tx)}
                        className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-2xl hover:bg-white/10 active:scale-95 transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-muted rounded-2xl text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            {React.createElement(CATEGORY_ICONS[tx.category] || Coffee, {
                              size: 18,
                            })}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{tx.description}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-muted-foreground">
                                {tx.date
                                  ? format(new Date(tx.date), "dd MMM, HH:mm", { locale: ptBR })
                                  : ""}
                              </span>
                              <div className="flex items-center gap-1 bg-muted/50 px-2 py-0.5 rounded-full">
                                <img
                                  src={
                                  tx.profiles?.avatar_url
                                  }
                                  alt={tx.profiles?.display_name || tx.responsible}
                                  className="w-3 h-3 rounded-full"
                                />
                                <span className="text-[10px] font-semibold text-muted-foreground">
                                  {tx.profiles?.display_name || tx.responsible}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={cn(
                              "text-sm font-bold",
                              tx.type === "Entrada" ? "text-emerald-600" : "text-foreground",
                            )}
                          >
                            {tx.type === "Entrada" ? "+" : "-"}{" "}
                            {formatCurrency(Math.abs(tx.amount || 0))}
                          </p>
                          <p className="text-[10px] text-muted-foreground">{tx.category}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <EmptyState
                      icon={Receipt}
                      title="Nenhuma transação ainda"
                      description="Comece a registrar seus gastos para ter controle total."
                      actionLabel="Adicionar meu primeiro lançamento"
                      onAction={() => navigate({ to: "/transacoes" })}
                      className="py-8 bg-transparent border-none"
                    />
                  )}
                </div>
                <Button
                  variant="ghost"
                  onClick={() => navigate({ to: "/transacoes" })}
                  className="w-full mt-8 text-xs font-bold text-muted-foreground hover:text-primary active:scale-95 transition-all"
                >
                  Ver extrato completo
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Painel Lateral de Detalhes do Card */}
      <Sheet open={!!activeSheet} onOpenChange={(open) => !open && setActiveSheet(null)}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md apple-card border-none bg-background/95 backdrop-blur-xl p-0 overflow-hidden flex flex-col"
        >
          <div className="p-6 pb-4 flex items-center justify-between border-b bg-muted/30">
            <SheetHeader className="text-left space-y-0.5">
              <SheetTitle className="text-xl font-black flex items-center gap-2">
                {activeSheet === "balance" && (
                  <>
                    <Wallet className="text-blue-500" /> Saldo Total
                  </>
                )}
                {activeSheet === "income" && (
                  <>
                    <ArrowUpRight className="text-emerald-500" /> Entradas
                  </>
                )}
                {activeSheet === "expenses" && (
                  <>
                    <ArrowDownRight className="text-rose-500" /> Débitos
                  </>
                )}
                {activeSheet === "credit" && (
                  <>
                    <CreditCard className="text-amber-500" /> Faturas a Pagar
                  </>
                )}
              </SheetTitle>
              <SheetDescription>
                {activeSheet === "credit"
                  ? "Todas as faturas de crédito em aberto"
                  : `Lançamentos de ${format(selectedMonth, "MMMM 'de' yyyy", { locale: ptBR })}`}
              </SheetDescription>
            </SheetHeader>

            {activeSheet !== "credit" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full gap-2 text-xs font-bold border-muted-foreground/20 hover:bg-muted/50 active:scale-95 transition-all"
                    disabled={isActiveMonthsLoading}
                  >
                    {isActiveMonthsLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" /> Carregando...
                      </>
                    ) : (
                      <>
                        Mês <ChevronDown size={14} />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="apple-card w-48">
                  {availableMonths.length === 0 ? (
                    <DropdownMenuItem
                      disabled
                      className="rounded-lg text-muted-foreground italic text-xs justify-center"
                    >
                      Nenhum período com registros
                    </DropdownMenuItem>
                  ) : (
                    availableMonths.map((month) => (
                      <DropdownMenuItem
                        key={month.toISOString()}
                        onClick={() => setSelectedMonth(month)}
                        className={cn(
                          "rounded-lg cursor-pointer",
                          isSameMonth(month, selectedMonth) &&
                            "bg-primary/10 text-primary font-bold",
                        )}
                      >
                        {format(month, "MMMM yyyy", { locale: ptBR })}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredTransactions.length > 0 ? (
              <div className="space-y-1">{filteredTransactions.map(renderTransactionItem)}</div>
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
                {formatCurrency(
                  filteredTransactions.reduce((acc, tx) => acc + (tx.amount || 0), 0),
                )}
              </p>
            </div>
            <Button
              variant="secondary"
              className="w-full rounded-2xl font-bold active:scale-95 transition-all"
              onClick={() => setActiveSheet(null)}
            >
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
            <DialogDescription className="sr-only">
              Visualização detalhada do gasto selecionado
            </DialogDescription>
          </DialogHeader>
          {selectedTx && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                    {React.createElement(CATEGORY_ICONS[selectedTx.category] || Coffee, {
                      size: 24,
                    })}
                  </div>
                  <div>
                    <p className="text-lg font-bold">{selectedTx.description}</p>
                    <p className="text-sm text-muted-foreground">{selectedTx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "text-xl font-black",
                      selectedTx.type === "Entrada" ? "text-emerald-600" : "text-foreground",
                    )}
                  >
                    {selectedTx.type === "Entrada" ? "+" : "-"}{" "}
                    {formatCurrency(Math.abs(selectedTx.amount || 0))}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedTx.date
                      ? format(new Date(selectedTx.date), "dd MMM, HH:mm", { locale: ptBR })
                      : ""}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="apple-interactive p-4 dark:bg-black/20">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">
                    Responsável
                  </p>
                  <div className="flex items-center gap-2">
                    <img
                      src={
                      selectedTx.profiles?.avatar_url
                      }
                      alt={selectedTx.profiles?.display_name || selectedTx.responsible}
                      className="w-6 h-6 rounded-full"
                    />
                    <p className="font-bold">
                      {selectedTx.profiles?.display_name || selectedTx.responsible}
                    </p>
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
            <Button
              variant="ghost"
              className="w-full rounded-xl active:scale-95 transition-all"
              onClick={() => setSelectedTx(null)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
