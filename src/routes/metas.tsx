import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { useGoals, Goal } from "@/hooks/use-goals";
import { NewGoalModal } from "@/components/investments/new-goal-modal";
import { ContributeToGoalModal } from "@/components/investments/contribute-to-goal-modal";
import { Skeleton } from "@/components/ui/skeleton";
import confetti from "canvas-confetti";
import { formatDistanceToNow, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

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

function GoalCard({ goal, onContribute }: { goal: Goal, onContribute: () => void }) {
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const percentage = Math.min(100, Math.round(((goal?.saved_amount || 0) / (goal?.target_amount || 1)) * 100));
  const isCompleted = percentage >= 100;

  useEffect(() => {
    if (isCompleted && !hasCelebrated) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#fbbf24', '#3b82f6']
      });
      setHasCelebrated(true);
    }
  }, [isCompleted, hasCelebrated]);

  let temporalMessage = null;
  if (goal?.deadline) {
    const deadlineDate = new Date(goal.deadline);
    const daysLeft = differenceInDays(deadlineDate, new Date());
    if (daysLeft < 0) {
      temporalMessage = <span className="text-rose-300 font-semibold drop-shadow-md">Atrasada há {Math.abs(daysLeft)} dias</span>;
    } else if (daysLeft === 0) {
      temporalMessage = <span className="text-amber-300 font-semibold drop-shadow-md">Termina hoje!</span>;
    } else {
      temporalMessage = <span className="text-white/90 font-medium">Faltam {formatDistanceToNow(deadlineDate, { locale: ptBR })}</span>;
    }
  }

  return (
    <Card className="relative apple-card apple-card-hover group overflow-hidden border-none shadow-lg flex flex-col hover:scale-[1.02] transition-all duration-300 min-h-[220px]">
      {/* Background Image or Gradient */}
      <div 
        className={cn(
          "absolute inset-0 z-0",
          !goal?.image_url && "bg-gradient-to-br from-blue-600 to-indigo-800 dark:from-slate-800 dark:to-slate-900"
        )}
        style={goal?.image_url ? {
          backgroundImage: `url(${goal.image_url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : undefined}
      />
      
      {/* Overlay - Glassmorphism */}
      <div className={cn(
        "absolute inset-0 z-10 transition-all duration-300",
        goal?.image_url ? "bg-black/50 backdrop-blur-md group-hover:bg-black/40" : "bg-black/20"
      )} />

      <CardHeader className="relative z-20 pb-4">
        <div className="flex justify-between items-start">
          <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-md shadow-sm text-white">
            <Target size={24} />
          </div>
          {isCompleted && (
            <div className="bg-emerald-500/80 backdrop-blur-md text-white text-[10px] font-bold uppercase px-2 py-1 rounded-full shadow-sm">
              Concluída
            </div>
          )}
        </div>
        <CardTitle className="mt-4 text-xl font-bold text-white drop-shadow-md">
          {goal?.title}
        </CardTitle>
        <CardDescription className="flex flex-col gap-1 mt-1">
          <div className="flex justify-between items-end">
            <span className="font-bold text-2xl text-white drop-shadow-md">
              {formatCurrency(goal?.saved_amount || 0)}
            </span>
            <span className="text-xs text-white/80 font-medium">
              alvo: {formatCurrency(goal?.target_amount || 0)}
            </span>
          </div>
          {temporalMessage && (
            <div className="text-[10px] mt-1 bg-black/30 self-start px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">
              {temporalMessage}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-20 space-y-4 flex-1 flex flex-col justify-end pb-5">
        <div className="space-y-2">
          <Progress 
            value={percentage} 
            className={cn("h-2.5 bg-black/40 overflow-hidden", isCompleted ? "[&>div]:bg-emerald-400" : "[&>div]:bg-white")} 
          />
          <p className="text-[10px] text-right font-bold uppercase tracking-wider text-white/80 drop-shadow-sm">
            {percentage}% concluído
          </p>
        </div>

        <div className="flex items-center justify-end pt-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="h-9 rounded-full text-xs font-bold px-5 border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white backdrop-blur-md transition-all shadow-sm"
            onClick={onContribute}
          >
            Aportar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

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
                <motion.div key={goal?.id} variants={itemVariants}>
                  <GoalCard goal={goal} onContribute={() => setContributeGoal(goal)} />
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
