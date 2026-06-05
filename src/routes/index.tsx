import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    user: "Felipe",
    userColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 2,
    description: "Salário Empresa X",
    category: "Renda",
    icon: TrendingUp,
    amount: 5500.0,
    date: "Ontem, 09:00",
    user: "Beatriz",
    userColor: "bg-pink-100 text-pink-700",
  },
  {
    id: 3,
    description: "Starbucks",
    category: "Lazer",
    icon: Coffee,
    amount: -32.5,
    date: "04 Jun, 16:45",
    user: "Beatriz",
    userColor: "bg-pink-100 text-pink-700",
  },
  {
    id: 4,
    description: "Posto Shell",
    category: "Transporte",
    icon: Car,
    amount: -220.0,
    date: "03 Jun, 11:30",
    user: "Felipe",
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
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Wallet size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Total</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Saldo Total</p>
                  <h3 className="text-2xl font-bold tracking-tight">R$ 12.450,80</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                    <ArrowUpRight size={20} />
                  </div>
                  <span className="text-xs font-medium text-emerald-600">+12% vs mês ant.</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Entradas do Mês</p>
                  <h3 className="text-2xl font-bold tracking-tight text-emerald-600">R$ 6.500,00</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                    <ArrowDownRight size={20} />
                  </div>
                  <span className="text-xs font-medium text-rose-600">+5% vs mês ant.</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Saídas Totais</p>
                  <h3 className="text-2xl font-bold tracking-tight text-rose-600">R$ 4.200,00</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                    <CreditCard size={20} />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">Cartão de Crédito</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-rose-500">Fatura a pagar</p>
                    <h3 className="text-xl font-bold tracking-tight text-rose-600">R$ 2.150,40</h3>
                  </div>
                  <div className="pt-2 border-t border-border/50 flex justify-between items-center">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase">Limite Disponível</span>
                    <span className="text-sm font-bold text-emerald-600">R$ 8.500,00</span>
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
            <Card className="border-none shadow-sm bg-white h-full">
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
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm bg-white h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold">Transações</CardTitle>
                  <p className="text-xs text-muted-foreground">Últimos registros do casal</p>
                </div>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-6">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between group">
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
                <Button variant="ghost" className="w-full mt-8 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  Ver extrato completo
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}

