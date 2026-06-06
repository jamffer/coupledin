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
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
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
  Home
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
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | CoupleFinance" },
      { name: "description", content: "Finanças do casal em um só lugar." },
    ],
  }),
  component: Dashboard,
});

const chartData = [
  { name: "Jan", entradas: 4500, saidas: 3200 },
  { name: "Fev", entradas: 5200, saidas: 3800 },
  { name: "Mar", entradas: 4800, saidas: 4100 },
  { name: "Abr", entradas: 6100, saidas: 4300 },
  { name: "Mai", entradas: 5900, saidas: 3900 },
  { name: "Jun", entradas: 6500, saidas: 4200 },
];

const recentTransactions = [
  {
    id: 1,
    description: "Supermercado Extra",
    category: "Alimentação",
    icon: ShoppingBag,
    amount: -450.0,
    date: "Hoje, 14:20",
    user: "Jorge",
    userColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    description: "Salário Empresa X",
    category: "Renda",
    icon: TrendingUp,
    amount: 5500.0,
    date: "Ontem, 09:00",
    user: "Lilian",
    userColor: "bg-pink-100 text-pink-700",
  },
  {
    id: 3,
    description: "Starbucks",
    category: "Lazer",
    icon: Coffee,
    amount: -32.5,
    date: "04 Jun, 16:45",
    user: "Lilian",
    userColor: "bg-pink-100 text-pink-700",
  },
  {
    id: 4,
    description: "Posto Shell",
    category: "Transporte",
    icon: Car,
    amount: -220.0,
    date: "03 Jun, 11:30",
    user: "Jorge",
    userColor: "bg-blue-100 text-blue-700",
  },
];

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

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const scrollToTransactions = () => {
    const el = document.getElementById('recent-transactions');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

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
          <motion.div variants={itemVariants} onClick={scrollToTransactions} className="cursor-pointer active:scale-95 transition-all">
            <Card className="apple-card apple-card-hover group card-gradient-blue border-none">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg text-white">
                    <Wallet size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/10 px-2 py-0.5 rounded-full">Total</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Saldo Total</p>
                  <h3 className="text-2xl font-bold tracking-tight text-white">R$ 12.450,80</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} onClick={() => navigate({ to: '/transacoes' })} className="cursor-pointer active:scale-95 transition-all">
            <Card className="apple-card apple-card-hover group card-gradient-light-blue border-none">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg text-white">
                    <ArrowUpRight size={20} />
                  </div>
                  <span className="text-xs font-medium text-white/90">+12% vs mês ant.</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Entradas do Mês</p>
                  <h3 className="text-2xl font-bold tracking-tight text-white">R$ 6.500,00</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} onClick={() => navigate({ to: '/transacoes' })} className="cursor-pointer active:scale-95 transition-all">
            <Card className="apple-card apple-card-hover group card-gradient-magenta border-none">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg text-white">
                    <ArrowDownRight size={20} />
                  </div>
                  <span className="text-xs font-medium text-white/90">+5% vs mês ant.</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Saídas Totais</p>
                  <h3 className="text-2xl font-bold tracking-tight text-white">R$ 4.200,00</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} onClick={() => navigate({ to: '/cartoes' })} className="cursor-pointer active:scale-95 transition-all">
            <Card className="apple-card apple-card-hover group border-2 border-primary/20 dark:border-primary/40">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary dark:text-primary-foreground">
                    <CreditCard size={20} />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">Cartão de Crédito</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-destructive">Fatura a pagar</p>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">R$ 2.150,40</h3>
                  </div>
                  <div className="pt-2 border-t border-border flex justify-between items-center">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">Limite Disponível</span>
                    <span className="text-sm font-bold text-primary">R$ 8.500,00</span>
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
                  {recentTransactions.map((tx) => (
                    <div 
                      key={tx.id} 
                      onClick={() => setSelectedTx(tx)}
                      className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-2xl hover:bg-white/10 active:scale-95 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-muted rounded-2xl text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <tx.icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">{tx.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">{tx.date}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${tx.userColor}`}>
                              {tx.user}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${tx.amount < 0 ? 'text-foreground' : 'text-emerald-600'}`}>
                          {tx.amount < 0 ? '-' : '+'} R$ {Math.abs(tx.amount).toFixed(2)}
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

      {/* Detail Modal for Transactions */}
      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <DialogContent className="apple-card dark:bg-[#1A1A1A] border-border/40">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Detalhes da Transação</DialogTitle>
          </DialogHeader>
          {selectedTx && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-2xl text-primary">
                    <selectedTx.icon size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{selectedTx.description}</p>
                    <p className="text-sm text-muted-foreground">{selectedTx.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("text-xl font-black", selectedTx.amount < 0 ? "text-foreground" : "text-emerald-600")}>
                    {selectedTx.amount < 0 ? '-' : '+'} R$ {Math.abs(selectedTx.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">{selectedTx.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="apple-interactive p-4 dark:bg-black/20">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Responsável</p>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", selectedTx.user === 'Jorge' ? 'bg-blue-500' : 'bg-pink-500')} />
                    <p className="font-bold">{selectedTx.user}</p>
                  </div>
                </div>
                <div className="apple-interactive p-4 dark:bg-black/20">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Método</p>
                  <p className="font-bold">Cartão de Crédito</p>
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

