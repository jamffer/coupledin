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
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/metas")({
  head: () => ({
    meta: [
      { title: "Metas | CoupleFinance" },
      { name: "description", content: "Acompanhe as metas do casal." },
    ],
  }),
  component: MetasPage,
});

const goals = [
  {
    id: 1,
    title: "Viagem para Europa",
    icon: Plane,
    iconColor: "text-blue-500 bg-blue-500/10",
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
    iconColor: "text-orange-500 bg-orange-500/10",
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
    iconColor: "text-emerald-500 bg-emerald-500/10",
    target: 30000,
    current: 18000,
    contributors: [
      { name: "Jorge", amount: 9000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" },
      { name: "Lilian", amount: 9000, avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella" },
    ]
  }
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

function MetasPage() {
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
            <h1 className="text-2xl font-bold tracking-tight">Metas e Sonhos</h1>
            <p className="text-muted-foreground italic">Planejando o futuro passo a passo.</p>
          </div>
          <Button className="rounded-full shadow-sm gap-2 apple-interactive border-white/20">
            <Plus size={18} />
            Nova Meta
          </Button>
        </div>

        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals.map((goal) => (
              <motion.div key={goal.id} variants={itemVariants}>
                <Card className="apple-card apple-card-hover group overflow-hidden border-2 border-primary/5 dark:border-white/5">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className={cn("p-3 rounded-2xl", goal.iconColor)}>
                        <goal.icon size={24} />
                      </div>
                      <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus size={18} />
                      </Button>
                    </div>
                    <CardTitle className="mt-4 text-lg font-bold">{goal.title}</CardTitle>
                    <CardDescription className="flex justify-between items-end mt-1">
                      <span className="text-foreground font-bold text-lg dark:text-white">
                        R$ {goal.current.toLocaleString('pt-BR')}
                      </span>
                      <span className="text-xs dark:text-white/60">
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
                              {c.name}: <span className="text-foreground font-bold dark:text-white">{c.amount / 1000}k</span>
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
      </motion.div>
    </DashboardLayout>
  );
}
