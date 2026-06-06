import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  CheckCircle2, 
  Share2, 
  ArrowRightLeft, 
  TrendingUp, 
  AlertCircle,
  ShoppingBag,
  Coffee,
  Car,
  Home,
  HelpCircle,
  Smartphone
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFinanceStore, CATEGORY_ICONS, AVATARS } from "@/hooks/use-finance-store";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios | CoupleFinance" },
      { name: "description", content: "Análise de gastos e fechamento do mês do casal." },
    ],
  }),
  component: RelatoriosPage,
});

const weeklyEvolutionData = [
  { week: "Semana 1", atual: 1200, anterior: 1100 },
  { week: "Semana 2", atual: 950, anterior: 1300 },
  { week: "Semana 3", atual: 1400, anterior: 1050 },
  { week: "Semana 4", atual: 800, anterior: 1200 },
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

function RelatoriosPage() {
  const { transactions, incomeJorge, incomeLilian } = useFinanceStore();

  const categories = ["Alimentação", "Moradia", "Transporte", "Lazer", "Saúde", "Outros"];
  
  const categoryComparisonData = categories.map(cat => ({
    category: cat,
    Jorge: Math.abs(transactions.filter(t => t.category === cat && t.responsible === "Jorge" && t.amount < 0).reduce((acc, t) => acc + t.amount, 0)),
    Lilian: Math.abs(transactions.filter(t => t.category === cat && t.responsible === "Lilian" && t.amount < 0).reduce((acc, t) => acc + t.amount, 0)),
  }));

  const topExpenses = [...transactions]
    .filter(t => t.amount < 0)
    .sort((a, b) => a.amount - b.amount)
    .slice(0, 5);

  // Lógica de Acerto de Contas
  const jointExpenses = transactions.filter(t => t.division !== "Individual" && t.amount < 0);
  const totalJoint = jointExpenses.reduce((acc, t) => acc + Math.abs(t.amount), 0);
  
  // Proporção configurada
  const totalIncome = incomeJorge + incomeLilian;
  const jorgeShare = incomeJorge / totalIncome;
  const lilianShare = incomeLilian / totalIncome;
  
  const jorgeShouldPay = jointExpenses.reduce((acc, t) => {
    const share = t.division === "Conjunta 50/50" ? 0.5 : jorgeShare;
    return acc + (Math.abs(t.amount) * share);
  }, 0);
  
  const lilianShouldPay = totalJoint - jorgeShouldPay;
  
  const jorgePaid = jointExpenses.filter(t => t.responsible === "Jorge").reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const lilianPaid = totalJoint - jorgePaid;
  
  const diff = jorgePaid - jorgeShouldPay; // Se positivo, Jorge pagou a mais. Se negativo, Jorge deve.
  const settlementAmount = Math.abs(diff);

  return (
    <DashboardLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 pb-10"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Relatórios e Fechamento</h1>
          <p className="text-muted-foreground italic">Análise profunda e acerto de contas do casal.</p>
        </div>

        {/* Section 1: Acerto de Contas */}
        <motion.div variants={itemVariants}>
          <Card className={cn(
            "apple-card apple-card-hover overflow-hidden transition-colors duration-500",
            diff > 1 ? "bg-emerald-500/10" : diff < -1 ? "bg-rose-500/10" : ""
          )}>
            <CardHeader className={cn(
              "pb-8 transition-colors",
              diff > 1 ? "bg-emerald-500/5" : diff < -1 ? "bg-rose-500/5" : "bg-primary/5"
            )}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  diff > 1 ? "bg-emerald-100 text-emerald-600" : diff < -1 ? "bg-rose-100 text-rose-600" : "bg-primary/10 text-primary"
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
                      <AvatarImage src={AVATARS.Jorge} />
                      <AvatarFallback>JO</AvatarFallback>
                    </Avatar>
                    <div className={cn(
                      "w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center relative z-10 transition-colors",
                      diff > 1 ? "bg-emerald-100 text-emerald-600" : diff < -1 ? "bg-rose-100 text-rose-600" : "bg-primary/10 text-primary"
                    )}>
                      <ArrowRightLeft size={24} className={cn(diff < -1 && "rotate-180")} />
                    </div>
                    <Avatar className="w-16 h-16 border-4 border-white shadow-lg ring-1 ring-muted/20">
                      <AvatarImage src={AVATARS.Lilian} />
                      <AvatarFallback>LI</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-1">
                    {Math.abs(diff) < 1 ? (
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

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Button className="rounded-full gap-2 px-6 h-12 font-bold shadow-md hover:shadow-lg transition-all" disabled={Math.abs(diff) < 1}>
                    <CheckCircle2 size={18} />
                    Marcar como Resolvido
                  </Button>
                  <Button variant="outline" className="rounded-full gap-2 px-6 h-12 font-bold border-border/60 hover:bg-muted/50 transition-all">
                    <Share2 size={18} />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section 2: Análise de Categorias */}
          <motion.div variants={itemVariants}>
            <Card className="apple-card apple-card-hover h-full border-2 border-primary/5 dark:border-white/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle>Gastos por Pessoa</CardTitle>
                    <CardDescription>Comparação por categoria principal</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">Jorge</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <span className="text-[10px] font-bold uppercase text-muted-foreground">Lilian</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[350px] w-full pt-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="category" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#888' }}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#888' }} 
                    />
                    <Tooltip 
                      cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    />
                    <Bar dataKey="Jorge" fill="#1e1b4b" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="Lilian" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 3: Maiores Gastos */}
          <motion.div variants={itemVariants}>
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
                      const avatarUrl = AVATARS[expense.responsible] || AVATARS.Jorge;

                      return (
                        <TableRow key={expense.id} className="group border-b border-border/40 hover:bg-muted/10 transition-colors">
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
                          <TableCell className="text-center">
                            <Avatar className="w-6 h-6 inline-block ring-1 ring-muted/20">
                              <AvatarImage src={avatarUrl} />
                              <AvatarFallback>{expense.responsible[0]}</AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="pr-6 text-right font-black text-sm dark:text-white">
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

        {/* Section 4: Evolução de Despesas */}
        <motion.div variants={itemVariants}>
          <Card className="apple-card apple-card-hover">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <CardTitle>Evolução de Despesas Conjuntas</CardTitle>
                <CardDescription>Comparação semana a semana vs mês anterior</CardDescription>
              </div>
              <div className="hidden sm:flex gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Junho (Atual)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <span className="text-[10px] font-bold uppercase text-muted-foreground">Maio (Anterior)</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="h-[300px] w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyEvolutionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAtual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e1b4b" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1e1b4b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="week" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#888' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#888' }} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  />
                  <Area 
                    name="Atual"
                    type="monotone" 
                    dataKey="atual" 
                    stroke="#1e1b4b" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorAtual)" 
                  />
                  <Area 
                    name="Anterior"
                    type="monotone" 
                    dataKey="anterior" 
                    stroke="#94a3b8" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fill="none" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
