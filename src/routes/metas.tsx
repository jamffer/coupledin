import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Plus, 
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { toast } from "sonner";
import { useGoals, Goal } from "@/hooks/use-goals";
import { NewGoalModal } from "@/components/investments/new-goal-modal";
import { ContributeToGoalModal } from "@/components/investments/contribute-to-goal-modal";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/metas")({
  head: () => ({
    meta: [
      { title: "Metas | CoupleDin" },
      { name: "description", content: "Acompanhe as metas do casal." },
    ],
  }),
  component: MetasPage,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function MetasPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: goals, isLoading } = useGoals();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contributeGoal, setContributeGoal] = useState<Goal | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, authLoading]);

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
          {goals && goals.length > 0 && (
            <Button 
              className="rounded-full shadow-sm gap-2 apple-interactive border-white/20"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={18} />
              Nova Meta
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="apple-card overflow-hidden border-2 border-primary/5 dark:border-white/5 space-y-6 p-6">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-12 w-12 rounded-2xl" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4 rounded-lg" />
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-7 w-1/3 rounded-md" />
                    <Skeleton className="h-4 w-1/4 rounded-md" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-2 w-full rounded-full" />
                  <div className="flex justify-end">
                    <Skeleton className="h-3 w-16 rounded-md" />
                  </div>
                </div>
                <div className="flex justify-end pt-2 border-t border-border/40">
                  <Skeleton className="h-8 w-20 rounded-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : goals && goals.length > 0 ? (
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <motion.div key={goal.id} variants={itemVariants}>
                  <Card className="apple-card apple-card-hover group overflow-hidden border-2 border-primary/5 dark:border-white/5 flex flex-col">
                    {goal.image_url && (
                      <div className="w-full h-32 relative overflow-hidden">
                        <img 
                          src={goal.image_url} 
                          alt={goal.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}
                    <CardHeader className={`pb-4 ${goal.image_url ? '-mt-12 relative z-10' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div className={`p-3 rounded-2xl ${goal.image_url ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-blue-500/10 text-blue-500'}`}>
                          <Target size={24} className={goal.image_url ? 'text-blue-500' : ''} />
                        </div>
                        <Button variant="ghost" size="icon" className={`rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${goal.image_url ? 'bg-background/80 backdrop-blur-md hover:bg-background' : ''}`}>
                          <Plus size={18} />
                        </Button>
                      </div>
                      <CardTitle className={`mt-4 text-lg font-bold ${goal.image_url ? 'text-white drop-shadow-md' : ''}`}>{goal.title}</CardTitle>
                      <CardDescription className="flex justify-between items-end mt-1">
                        <span className={`font-bold text-lg ${goal.image_url ? 'text-white drop-shadow-md' : 'text-foreground dark:text-white'}`}>
                          {formatCurrency(goal.saved_amount || 0)}
                        </span>
                        <span className={`text-xs ${goal.image_url ? 'text-white/80' : 'dark:text-white/60'}`}>
                          alvo: {formatCurrency(goal.target_amount)}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex-1 flex flex-col justify-end">
                      <div className="space-y-2">
                        <Progress value={((goal.saved_amount || 0) / goal.target_amount) * 100} className="h-2" />
                        <p className="text-[10px] text-right font-bold uppercase tracking-wider text-muted-foreground">
                          {Math.round(((goal.saved_amount || 0) / goal.target_amount) * 100)}% concluído
                        </p>
                      </div>

                      <div className="flex items-center justify-end pt-2 border-t border-border/40">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 rounded-full text-xs font-bold px-4 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all"
                          onClick={() => setContributeGoal(goal)}
                        >
                          Aportar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        ) : (
          <EmptyState 
            icon={Target}
            title="Nenhum cofre ou meta ainda"
            description="Crie metas para suas viagens, sonhos ou reserva de emergência."
            actionLabel="Criar minha primeira meta"
            onAction={() => setIsModalOpen(true)}
          />
        )}
        
        <NewGoalModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
        
        <ContributeToGoalModal 
          goal={contributeGoal}
          isOpen={!!contributeGoal}
          onClose={() => setContributeGoal(null)}
        />
      </motion.div>
    </DashboardLayout>
  );
}
