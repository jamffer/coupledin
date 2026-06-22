import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  CheckCircle2,
  GraduationCap,
  Home,
  Link2,
  MoreHorizontal,
  PiggyBank,
  Plane,
  Plus,
  Target,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { useGoals, Goal } from "@/hooks/use-goals";
import { NewGoalModal } from "@/components/investments/new-goal-modal";
import { ContributeToGoalModal } from "@/components/investments/contribute-to-goal-modal";
import { EditGoalModal } from "@/components/investments/edit-goal-modal";
import { ConsolidatedAsset, useInvestmentPortfolio } from "@/hooks/use-investment-portfolio";
import { Skeleton } from "@/components/ui/skeleton";
import confetti from "canvas-confetti";
import { differenceInDays, format, isValid } from "date-fns";
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

const goalAccentClasses = [
  {
    icon: Plane,
    label: "Viagem",
    color: "#a3ff5f",
    bg: "bg-lime-400/15 text-lime-300",
    progress: "[&>div]:bg-lime-400",
  },
  {
    icon: GraduationCap,
    label: "Educação",
    color: "#b9bdff",
    bg: "bg-indigo-400/15 text-indigo-300",
    progress: "[&>div]:bg-indigo-300",
  },
  {
    icon: Home,
    label: "Casa",
    color: "#ff796d",
    bg: "bg-rose-400/15 text-rose-300",
    progress: "[&>div]:bg-rose-300",
  },
  {
    icon: PiggyBank,
    label: "Reserva",
    color: "#fff875",
    bg: "bg-yellow-300/15 text-yellow-200",
    progress: "[&>div]:bg-yellow-200",
  },
  {
    icon: Target,
    label: "Sonho",
    color: "#5eead4",
    bg: "bg-teal-300/15 text-teal-200",
    progress: "[&>div]:bg-teal-300",
  },
];

function getGoalAccent(goal: Goal, index = 0) {
  const title = goal.title.toLowerCase();

  if (/(viagem|trip|japan|japão|férias|ferias)/i.test(title)) return goalAccentClasses[0];
  if (/(educa|curso|faculdade|escola|study|investment|invest)/i.test(title)) {
    return goalAccentClasses[1];
  }
  if (/(casa|apto|apartamento|moradia|reforma)/i.test(title)) return goalAccentClasses[2];
  if (/(reserva|emergência|emergencia|segurança|seguranca)/i.test(title)) {
    return goalAccentClasses[3];
  }

  return goalAccentClasses[index % goalAccentClasses.length];
}

function getDeadlineText(goal: Goal) {
  if (!goal.deadline) return "Sem prazo";

  const deadlineDate = new Date(goal.deadline);
  if (!isValid(deadlineDate)) return "Data inválida";

  const daysLeft = differenceInDays(deadlineDate, new Date());
  if (daysLeft < 0) return `Atrasada há ${Math.abs(daysLeft)} dias`;
  if (daysLeft === 0) return "Termina hoje";

  return `Até ${format(deadlineDate, "dd MMM", { locale: ptBR })}`;
}

function getInvestmentBaseValue(investment: NonNullable<Goal["linked_investments"]>[number]) {
  return Number(investment.quantity || 0) * Number(investment.average_price || 0);
}

function getLinkedInvestmentCurrentValue(
  investment: NonNullable<Goal["linked_investments"]>[number],
  portfolioInvestments: ConsolidatedAsset[],
) {
  const baseValue = getInvestmentBaseValue(investment);
  const consolidatedAsset = portfolioInvestments.find((asset) =>
    asset.history.some((historyItem) => historyItem.id === investment.id),
  );

  if (!consolidatedAsset || consolidatedAsset.total_invested <= 0) return baseValue;

  const proportionalWeight = baseValue / consolidatedAsset.total_invested;
  return consolidatedAsset.current_value * proportionalWeight;
}

function getGoalLinkedInvestmentsValue(goal: Goal, portfolioInvestments: ConsolidatedAsset[]) {
  return (goal.linked_investments || []).reduce(
    (acc, investment) => acc + getLinkedInvestmentCurrentValue(investment, portfolioInvestments),
    0,
  );
}

function getGoalEffectiveSavedAmount(goal: Goal, portfolioInvestments: ConsolidatedAsset[]) {
  const manualSaved = Number(goal.saved_amount || 0);
  const linkedValue = getGoalLinkedInvestmentsValue(goal, portfolioInvestments);

  if (manualSaved > 0 && linkedValue > 0) {
    const delta = Math.abs(manualSaved - linkedValue);
    const comparisonBase = Math.max(manualSaved, linkedValue);

    if (delta / comparisonBase <= 0.02) {
      return Math.max(manualSaved, linkedValue);
    }
  }

  return manualSaved + linkedValue;
}

function getGoalProgress(goal: Goal, portfolioInvestments: ConsolidatedAsset[]) {
  return Math.min(
    100,
    Math.round(
      (getGoalEffectiveSavedAmount(goal, portfolioInvestments) / (goal.target_amount || 1)) * 100,
    ),
  );
}

function GoalSummary({
  totalPlanned,
  totalSaved,
  overallProgress,
  activeGoals,
}: {
  totalPlanned: number;
  totalSaved: number;
  overallProgress: number;
  activeGoals: number;
}) {
  const ringStyle = {
    background: `conic-gradient(#a3ff5f 0deg ${overallProgress * 3.6}deg, rgba(185, 189, 255, 0.95) ${overallProgress * 3.6}deg ${Math.min(360, overallProgress * 3.6 + 54)}deg, rgba(255, 121, 109, 0.95) ${Math.min(360, overallProgress * 3.6 + 54)}deg ${Math.min(360, overallProgress * 3.6 + 92)}deg, rgba(255, 255, 255, 0.08) ${Math.min(360, overallProgress * 3.6 + 92)}deg 360deg)`,
  };

  return (
    <Card className="apple-card overflow-hidden border-none bg-gradient-to-br from-[#111111] via-[#171717] to-primary/10 shadow-2xl dark:from-[#0d0d0d] dark:via-[#171717] dark:to-primary/10">
      <CardContent className="grid gap-8 p-6 md:grid-cols-[320px,1fr] md:p-8">
        <div className="flex justify-center">
          <div
            className="relative flex h-72 w-72 items-center justify-center rounded-full p-6"
            style={ringStyle}
          >
            <div className="absolute inset-5 rounded-full border-[18px] border-[#111111]" />
            <div className="absolute inset-0 rounded-full shadow-[inset_0_0_50px_rgba(0,0,0,0.35)]" />
            <div className="relative z-10 flex h-44 w-44 flex-col items-center justify-center rounded-full bg-[#111111] text-center shadow-2xl">
              <span className="text-xs font-black uppercase tracking-widest text-white/45">
                Total acumulado
              </span>
              <span className="mt-2 text-3xl font-black text-white">
                {formatCurrency(totalSaved)}
              </span>
              <span className="mt-2 text-sm font-black text-lime-300">
                {overallProgress.toFixed(0)}% do plano
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-5">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary/70">
              Painel de economia
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground md:text-4xl">
              Seu plano para realizar os próximos sonhos
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Veja rapidamente quanto vocês já juntaram, quanto falta e quais metas estão ativas.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Planejado
              </p>
              <p className="mt-2 text-xl font-black text-foreground">
                {formatCurrency(totalPlanned)}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Acumulado
              </p>
              <p className="mt-2 text-xl font-black text-lime-300">{formatCurrency(totalSaved)}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Ativas
              </p>
              <p className="mt-2 text-xl font-black text-foreground">{activeGoals}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-muted-foreground">Progresso geral</span>
              <span>{overallProgress.toFixed(1)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3 bg-white/10 [&>div]:bg-lime-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GoalCard({
  goal,
  index,
  onContribute,
  onEdit,
  portfolioInvestments,
}: {
  goal: Goal;
  index: number;
  onContribute: () => void;
  onEdit: () => void;
  portfolioInvestments: ConsolidatedAsset[];
}) {
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const percentage = getGoalProgress(goal, portfolioInvestments);
  const isCompleted = percentage >= 100;
  const accent = getGoalAccent(goal, index);
  const Icon = accent.icon;
  const manualSavedAmount = Number(goal.saved_amount || 0);
  const linkedInvestmentsValue = getGoalLinkedInvestmentsValue(goal, portfolioInvestments);
  const linkedInvestments = goal.linked_investments || [];
  const savedAmount = getGoalEffectiveSavedAmount(goal, portfolioInvestments);
  const remainingAmount = Math.max(0, (goal.target_amount || 0) - savedAmount);

  useEffect(() => {
    if (isCompleted && !hasCelebrated) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#10b981", "#fbbf24", "#3b82f6"],
      });
      setHasCelebrated(true);
    }
  }, [isCompleted, hasCelebrated]);

  return (
    <Card className="apple-card apple-card-hover group overflow-hidden border-none bg-[#181818] shadow-lg transition-all duration-300 hover:-translate-y-1 dark:bg-[#181818]">
      <CardContent className="space-y-5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div className={cn("rounded-2xl p-3", accent.bg)}>
              <Icon size={22} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-black text-foreground">{goal.title}</h3>
              <p className="text-sm font-bold text-muted-foreground">{accent.label}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 rounded-full text-muted-foreground hover:bg-white/10 hover:text-foreground"
            onClick={onEdit}
            aria-label={`Editar meta ${goal.title}`}
          >
            <MoreHorizontal size={18} />
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-3xl bg-black/20 p-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Atual
            </p>
            <p className="mt-1 text-lg font-black text-foreground">{formatCurrency(savedAmount)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Alvo
            </p>
            <p className="mt-1 text-lg font-black text-foreground">
              {formatCurrency(goal.target_amount || 0)}
            </p>
          </div>
        </div>

        {linkedInvestments.length > 0 && (
          <div className="space-y-3 rounded-3xl border border-primary/10 bg-primary/5 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-black">
                <Link2 size={16} className="text-primary" />
                <span>Investimentos vinculados</span>
              </div>
              <span className="text-sm font-black text-primary">
                {formatCurrency(linkedInvestmentsValue)}
              </span>
            </div>
            <div className="space-y-2">
              {linkedInvestments.slice(0, 3).map((investment) => (
                <div
                  key={investment.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-background/60 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-xs font-black">{investment.ticker}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {investment.asset_type}
                    </p>
                  </div>
                  <p className="text-xs font-black">
                    {formatCurrency(
                      getLinkedInvestmentCurrentValue(investment, portfolioInvestments),
                    )}
                  </p>
                </div>
              ))}
              {linkedInvestments.length > 3 && (
                <p className="text-xs font-bold text-muted-foreground">
                  +{linkedInvestments.length - 3} investimentos vinculados
                </p>
              )}
            </div>
            {manualSavedAmount > 0 && (
              <p className="text-xs text-muted-foreground">
                Manual: {formatCurrency(manualSavedAmount)} · Investimentos:{" "}
                {formatCurrency(linkedInvestmentsValue)}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-black">
            <span className="text-muted-foreground">{percentage}% de progresso</span>
            <span className={isCompleted ? "text-emerald-300" : "text-foreground"}>
              {isCompleted ? "Concluída" : `Faltam ${formatCurrency(remainingAmount)}`}
            </span>
          </div>
          <Progress
            value={percentage}
            className={cn(
              "h-3 bg-white/10",
              isCompleted ? "[&>div]:bg-emerald-400" : accent.progress,
            )}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
            {isCompleted ? <CheckCircle2 size={16} /> : <CalendarDays size={16} />}
            <span>{getDeadlineText(goal)}</span>
          </div>

          <Button
            size="sm"
            className="h-10 rounded-full px-5 font-black shadow-md"
            style={{ backgroundColor: accent.color, color: "#101010" }}
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
  const { data: goals = [], isLoading } = useGoals();
  const { investments: portfolioInvestments } = useInvestmentPortfolio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contributeGoal, setContributeGoal] = useState<Goal | null>(null);
  const [editGoal, setEditGoal] = useState<Goal | null>(null);

  const goalsSummary = useMemo(() => {
    const totalPlanned = goals.reduce((acc, goal) => acc + (goal.target_amount || 0), 0);
    const totalSaved = goals.reduce(
      (acc, goal) => acc + getGoalEffectiveSavedAmount(goal, portfolioInvestments),
      0,
    );
    const overallProgress = totalPlanned > 0 ? Math.min(100, (totalSaved / totalPlanned) * 100) : 0;
    const activeGoals = goals.filter(
      (goal) => getGoalProgress(goal, portfolioInvestments) < 100,
    ).length;

    return {
      totalPlanned,
      totalSaved,
      overallProgress,
      activeGoals,
    };
  }, [goals, portfolioInvestments]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, authLoading, navigate]);

  return (
    <DashboardLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 pb-24 md:pb-10"
      >
        <motion.div
          variants={itemVariants}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary/60">
              Saving Plans
            </p>
            <h1 className="text-3xl font-black tracking-tight md:text-4xl">Metas e Sonhos</h1>
            <p className="mt-2 text-muted-foreground">
              Um painel simples para acompanhar os planos de economia do casal.
            </p>
          </div>

          <Button
            className="h-12 rounded-full px-6 font-black shadow-lg md:self-auto"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={18} />
            Nova meta
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="space-y-6">
            <Card className="apple-card border-none">
              <CardContent className="grid gap-8 p-6 md:grid-cols-[320px,1fr] md:p-8">
                <Skeleton className="mx-auto h-72 w-72 rounded-full" />
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48 rounded-xl" />
                  <Skeleton className="h-12 w-3/4 rounded-2xl" />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Skeleton className="h-24 rounded-3xl" />
                    <Skeleton className="h-24 rounded-3xl" />
                    <Skeleton className="h-24 rounded-3xl" />
                  </div>
                  <Skeleton className="h-3 w-full rounded-full" />
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="apple-card border-none p-5">
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-12 w-12 rounded-2xl" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4 rounded-lg" />
                        <Skeleton className="h-4 w-1/3 rounded-lg" />
                      </div>
                    </div>
                    <Skeleton className="h-24 rounded-3xl" />
                    <Skeleton className="h-3 rounded-full" />
                    <Skeleton className="h-10 rounded-full" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : goals.length > 0 ? (
          <>
            <motion.div variants={itemVariants}>
              <GoalSummary {...goalsSummary} />
            </motion.div>

            <section className="space-y-4">
              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between gap-4 px-1"
              >
                <div>
                  <h2 className="text-xl font-black">Minhas metas</h2>
                  <p className="text-sm text-muted-foreground">
                    Progresso individual de cada plano de economia.
                  </p>
                </div>
                <div className="hidden items-center gap-2 rounded-full bg-muted/60 px-4 py-2 text-xs font-black text-muted-foreground sm:flex">
                  <TrendingUp size={15} />
                  Progresso
                </div>
              </motion.div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {goals.map((goal, index) => (
                  <motion.div key={goal.id} variants={itemVariants}>
                    <GoalCard
                      goal={goal}
                      index={index}
                      onContribute={() => setContributeGoal(goal)}
                      onEdit={() => setEditGoal(goal)}
                      portfolioInvestments={portfolioInvestments}
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <EmptyState
            icon={Target}
            title="Nenhum cofre ou meta ainda"
            description="Crie metas para suas viagens, sonhos ou reserva de emergência."
            actionLabel="Criar minha primeira meta"
            onAction={() => setIsModalOpen(true)}
          />
        )}

        <Button
          className="fixed bottom-6 left-1/2 z-40 h-14 -translate-x-1/2 rounded-full px-8 font-black shadow-2xl md:hidden"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} />
          Nova meta
        </Button>

        <NewGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <ContributeToGoalModal
          goal={contributeGoal}
          isOpen={!!contributeGoal}
          onClose={() => setContributeGoal(null)}
        />

        <EditGoalModal goal={editGoal} isOpen={!!editGoal} onClose={() => setEditGoal(null)} />
      </motion.div>
    </DashboardLayout>
  );
}
