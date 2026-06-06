import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plane, 
  Home, 
  ShieldCheck, 
  Plus, 
  TrendingUp, 
  PieChart as PieChartIcon,
  Wallet,
  ArrowUpRight,
  TrendingDown
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from "recharts";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/investimentos")({
  head: () => ({
    meta: [
      { title: "Investimentos | CoupleFinance" },
      { name: "description", content: "Acompanhe as metas e o patrimônio do casal." },
    ],
  }),
  component: InvestimentosPage,
});

const goals = [
  {
    id: 1,
    title: "Viagem para Europa",
    icon: Plane,
    iconColor: "text-blue-500 bg-blue-50",
    target: 20000,
    current: 5000,
    contributors: [
      { name: "Jorge", amount: 3000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
      { name: "Lilian", amount: 2000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella" },
    ]
  },
  {
    id: 2,
    title: "Reforma da Casa",
    icon: Home,
    iconColor: "text-orange-500 bg-orange-50",
    target: 15000,
    current: 12500,
    contributors: [
      { name: "Jorge", amount: 6000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
      { name: "Lilian", amount: 6500, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella" },
    ]
  },
  {
    id: 3,
    title: "Reserva de Emergência",
    icon: ShieldCheck,
    iconColor: "text-emerald-500 bg-emerald-50",
    target: 30000,
    current: 18000,
    contributors: [
      { name: "Jorge", amount: 9000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
      { name: "Lilian", amount: 9000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella" },
    ]
  }
];

const allocationData = [
  { name: "Renda Fixa", value: 45, color: "#10b981" },
  { name: "Ações", value: 25, color: "#3b82f6" },
  { name: "FIIs", value: 20, color: "#f59e0b" },
  { name: "Cripto", value: 10, color: "#8b5cf6" },
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

function InvestimentosPage() {
  const totalPatrimony = 85450.00;

  return (
    <DashboardLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10 pb-10"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Investimentos e Metas</h1>
            <p className="text-muted-foreground italic">Construindo o futuro em conjunto.</p>
          </div>
          <Button className="rounded-full shadow-sm gap-2 apple-interactive border-white/20">
            <Plus size={18} />
            Nova Meta
          </Button>
        </div>

        {/* Section 1: Metas em Comum */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-primary" />
            <h2 className="text-xl font-bold">Objetivos do Casal</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <motion.div key={goal.id} variants={itemVariants}>
                <Card className="apple-card apple-card-hover group overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className={cn("p-3 rounded-2xl", goal.iconColor)}>
                        <goal.icon size={24} />
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus size={18} />
                      </Button>
                    </div>
                    <CardTitle className="mt-4 text-lg">{goal.title}</CardTitle>
                    <CardDescription className="flex justify-between items-end mt-1">
                      <span className="text-foreground font-bold text-lg">
                        R$ {goal.current.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-xs">
                        alvo: R$ {goal.target.toLocaleString('pt-BR')}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                      <p className="text-[10px] text-right font-bold uppercase tracking-wider text-muted-foreground">
                        {Math.round((goal.current / goal.target) * 100)}% concluído
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/40">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                          {goal.contributors.map((c, i) => (
                            <Avatar key={i} className="w-7 h-7 border-2 border-background ring-1 ring-muted/20">
                              <AvatarImage src={c.avatar} />
                              <AvatarFallback>{c.name[0]}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        <div className="text-[10px] font-medium leading-tight">
                          {goal.contributors.map((c, i) => (
                            <span key={i} className="text-muted-foreground block">
                              {c.name}: <span className="text-foreground font-bold">{c.amount / 1000}k</span>
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="h-8 rounded-full text-xs font-bold px-4 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all">
                        Aportar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section 2: Carteira de Investimentos */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <PieChartIcon size={20} className="text-primary" />
            <h2 className="text-xl font-bold">Patrimônio Geral</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patrimonio Total Card */}
            <motion.div variants={itemVariants} className="lg:col-span-1 h-full">
              <div className="grid grid-cols-1 gap-6 h-full">
                <Card className="apple-card overflow-hidden relative bg-primary text-primary-foreground border-none">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Wallet size={120} />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-between h-full">
                    <div className="space-y-1 relative z-10">
                      <p className="text-sm font-medium opacity-80 uppercase tracking-widest">Patrimônio Total</p>
                      <h3 className="text-4xl font-black tracking-tight">R$ {totalPatrimony.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                    </div>
                    <div className="mt-8 flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-sm relative z-10">
                      <ArrowUpRight size={16} className="text-emerald-300" />
                      <span className="text-xs font-bold text-emerald-300">+8.5% este ano</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 gap-4">
                  <Card className="apple-card p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Investimentos Conjuntos</p>
                        <h4 className="text-xl font-bold text-foreground">R$ 45.200,00</h4>
                      </div>
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                        <TrendingUp size={20} />
                      </div>
                    </div>
                  </Card>
                  <Card className="apple-card p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Investimentos do Jorge</p>
                        <h4 className="text-xl font-bold text-foreground">R$ 22.150,00</h4>
                      </div>
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <TrendingUp size={20} />
                      </div>
                    </div>
                  </Card>
                  <Card className="apple-card p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Investimentos da Lilian</p>
                        <h4 className="text-xl font-bold text-foreground">R$ 18.100,00</h4>
                      </div>
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                        <TrendingUp size={20} />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </motion.div>

            {/* Allocation Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="apple-card h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Alocação da Carteira</CardTitle>
                  <CardDescription>Distribuição por classe de ativos</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center pt-0 min-h-[350px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                        formatter={(value) => `${value}%`}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        align="center"
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full mt-6 px-4">
                    {allocationData.map((item, i) => (
                      <div key={i} className="text-center space-y-1">
                        <p className="text-xs font-bold text-muted-foreground uppercase">{item.name}</p>
                        <p className="text-lg font-black" style={{ color: item.color }}>{item.value}%</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </DashboardLayout>
  );
}
