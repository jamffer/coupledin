import { r as reactExports, j as jsxRuntimeExports, R as React } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-Dl0zekrI.mjs";
import { a as useFinanceStore, u as useProfile, D as DashboardLayout, A as Avatar, g as AvatarImage, h as AvatarFallback, T as TooltipProvider, o as Tooltip, p as TooltipTrigger, q as TooltipContent, C as CATEGORY_ICONS, i as Dialog, j as DialogContent, k as DialogHeader, l as DialogTitle, m as DialogDescription, n as DialogFooter } from "./layout-dashboard-BPAzyFdL.mjs";
import { C as Card, b as CardHeader, c as cn, d as CardTitle, e as CardDescription, a as CardContent, f as formatCurrency, B as Button } from "./card-DDGnP21B.mjs";
import { B as Badge } from "./badge-DrsED2vf.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger } from "./tabs-0rhnvL4x.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { f as format, b as subMonths, i as isSameMonth, c as ptBR } from "../_libs/date-fns.mjs";
import { A as ArrowRightLeft, c as CircleCheck, C as CirclePlus, M as MessageCircle, d as TrendingUp, e as TrendingDown, a as CircleQuestionMark } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, B as BarChart, C as CartesianGrid, X as XAxis, Y as YAxis, T as Tooltip$1, a as Bar, b as Cell } from "../_libs/recharts.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client-CRCA7PsU.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./label-BKMEXiM6.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/react-easy-crop.mjs";
import "../_libs/normalize-wheel.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-slider.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/zustand.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/es-toolkit.mjs";
import "../_libs/reselect.mjs";
import "../_libs/react-is.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/reduxjs__toolkit.mjs";
import "../_libs/redux.mjs";
import "../_libs/immer.mjs";
import "../_libs/redux-thunk.mjs";
import "../_libs/react-redux.mjs";
import "../_libs/use-sync-external-store.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const itemVariants = {
  hidden: {
    y: 20,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1
  }
};
function RelatoriosPage() {
  const {
    transactions,
    incomeJorge,
    incomeLilian
  } = useFinanceStore();
  const {
    user,
    loading: authLoading
  } = useAuth();
  const {
    profile,
    partnerProfile
  } = useProfile();
  const navigate = useNavigate();
  const [isSettled, setIsSettled] = reactExports.useState(false);
  const [isSettlementModalOpen, setIsSettlementModalOpen] = reactExports.useState(false);
  const [selectedPeriod, setSelectedPeriod] = reactExports.useState("Este Mês");
  const userName = profile?.display_name || "Jorge";
  const partnerName = partnerProfile?.display_name || "Lilian";
  reactExports.useEffect(() => {
    if (!authLoading && !user) {
      navigate({
        to: "/auth"
      });
    }
  }, [user, authLoading]);
  const jointExpenses = transactions.filter((t) => t.division !== "Individual");
  const totalJoint = jointExpenses.reduce((acc, t) => acc + Math.abs(t.amount || 0), 0);
  const totalIncome = (incomeJorge || 0) + (incomeLilian || 0);
  const jorgeShare = totalIncome > 0 ? (incomeJorge || 0) / totalIncome : 0.5;
  const jorgeShouldPay = jointExpenses.reduce((acc, t) => {
    const share = t.division === "Conjunta 50/50" ? 0.5 : jorgeShare;
    return acc + Math.abs(t.amount || 0) * share;
  }, 0);
  const jorgePaid = jointExpenses.filter((t) => t.responsible === "Jorge").reduce((acc, t) => acc + Math.abs(t.amount || 0), 0);
  const diff = jorgePaid - jorgeShouldPay;
  const settlementAmount = Math.abs(diff);
  const handleSettlementConfirm = () => {
    setIsSettled(true);
    setIsSettlementModalOpen(false);
    toast.success("Acerto realizado com sucesso!");
  };
  const handleShareSummary = () => {
    const summary = `Resumo Financeiro
Total Gastos Conjuntos: ${formatCurrency(totalJoint)}
Status: ${isSettled ? "Tudo quite!" : (diff < 0 ? "Jorge deve transferir" : "Lilian deve transferir") + " " + formatCurrency(Math.abs(settlementAmount))}`;
    navigator.clipboard.writeText(summary);
    toast.success("Resumo copiado para a área de transferência!");
  };
  const weeklyEvolutionData = reactExports.useMemo(() => {
    const now = /* @__PURE__ */ new Date();
    const generateData = (count, unit) => {
      const data = [];
      for (let i = count - 1; i >= 0; i--) {
        const date = unit === "month" ? subMonths(now, i) : new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1e3);
        const name = unit === "month" ? format(date, "MMM", {
          locale: ptBR
        }) : `Sem ${count - i}`;
        const periodTxs = transactions.filter((t) => {
          const tDate = new Date(t.date);
          return unit === "month" ? isSameMonth(tDate, date) : tDate >= date && tDate < new Date(date.getTime() + 7 * 24 * 60 * 60 * 1e3);
        });
        const total = periodTxs.filter((t) => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
        data.push({
          name,
          total
        });
      }
      return data;
    };
    return {
      "Este Mês": generateData(4, "week"),
      "�altimos 3 Meses": generateData(3, "month"),
      "Este Ano": generateData(6, "month")
    };
  }, [transactions]);
  const hasGraphData = reactExports.useMemo(() => {
    return weeklyEvolutionData[selectedPeriod].some((d) => d.total > 0);
  }, [weeklyEvolutionData, selectedPeriod]);
  const topExpenses = reactExports.useMemo(() => {
    return [...transactions].sort((a, b) => Math.abs(b.amount || 0) - Math.abs(a.amount || 0)).slice(0, 5);
  }, [transactions]);
  const categoryTotals = reactExports.useMemo(() => {
    const totals = {};
    const expensesOnly = transactions.filter((t) => (t.amount || 0) < 0);
    expensesOnly.forEach((t) => {
      totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount || 0);
    });
    return Object.entries(totals).sort(([, a], [, b]) => b - a).slice(0, 4);
  }, [transactions]);
  const totalExpensesAmount = reactExports.useMemo(() => {
    return transactions.filter((t) => (t.amount || 0) < 0).reduce((acc, t) => acc + Math.abs(t.amount || 0), 0);
  }, [transactions]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DashboardLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "space-y-8 pb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: itemVariants, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold uppercase tracking-widest text-primary/60 mb-1", children: "Análise Mensal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-black tracking-tighter text-foreground", children: "Relatórios" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "px-4 py-2 rounded-xl apple-glass border-primary/10 text-primary font-bold", children: format(/* @__PURE__ */ new Date(), "MMMM, yyyy", {
          locale: ptBR
        }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card overflow-hidden border-none shadow-2xl bg-gradient-to-br from-white to-primary/5 dark:from-[#1A1A1A] dark:to-primary/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-primary mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("p-2 rounded-xl transition-colors", diff > 1 ? "bg-emerald-500/10 text-emerald-600" : diff < -1 ? "bg-rose-500/10 text-rose-600" : "bg-primary/10 text-primary"), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xl", children: "Fechamento do Mês" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Cálculo automático baseado nas despesas conjuntas do mês." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "-mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "apple-glass rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6 text-center md:text-left", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex -space-x-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-16 h-16 border-4 border-white shadow-lg ring-1 ring-muted/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.display_name || "user"}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: userName.substring(0, 2).toUpperCase() })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("w-16 h-16 rounded-full border-4 border-white shadow-lg flex items-center justify-center relative z-10 transition-colors", isSettled ? "bg-emerald-500 text-white" : diff > 1 ? "bg-emerald-500/10 text-emerald-600" : diff < -1 ? "bg-rose-500/10 text-rose-600" : "bg-primary/10 text-primary"), children: isSettled ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 24 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRightLeft, { size: 24, className: cn(diff < -1 && "rotate-180") }) }),
              partnerProfile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-16 h-16 border-4 border-white shadow-lg ring-1 ring-muted/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: partnerProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partnerProfile.display_name || "partner"}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: partnerName.substring(0, 2).toUpperCase() })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full border-4 border-dashed border-primary/40 bg-primary/5 flex items-center justify-center relative z-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 20, className: "text-primary/40" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: totalJoint === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold tracking-tight", children: "Nenhum gasto conjunto este mês." }) : !partnerProfile ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold tracking-tight text-amber-600", children: "Aguardando parceiro(a)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Convide seu parceiro(a) nas configurações para habilitar o acerto de contas automático." })
            ] }) : isSettled ? /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold tracking-tight text-emerald-600", children: "Tudo quite! Mês resolvido." }) : Math.abs(diff) < 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold tracking-tight", children: "Tudo quite! Vocês estão empatados." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold tracking-tight", children: diff < 0 ? `${userName}, você deve transferir` : `${partnerName}, deve transferir` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: cn("text-3xl font-black text-primary dark:text-white", diff < 0 ? "opacity-90" : "opacity-100"), children: formatCurrency(settlementAmount) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
                "para ",
                diff < 0 ? partnerName : userName,
                " para igualar os gastos conjuntos."
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px w-full md:w-px md:h-20 bg-border/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center md:items-end gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center md:text-right", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-muted-foreground", children: "Total Gastos Conjuntos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-black text-foreground", children: formatCurrency(totalJoint) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", className: "rounded-full h-10 w-10 border-emerald-100 text-emerald-600 hover:bg-emerald-50 active:scale-90 transition-all", onClick: handleShareSummary, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { size: 18 }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: "Compartilhar resumo" })
              ] }) }),
              !isSettled && Math.abs(diff) >= 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "rounded-full px-6 font-bold shadow-md hover:shadow-lg active:scale-95 transition-all gap-2", onClick: () => setIsSettlementModalOpen(true), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 16 }),
                "Marcar como Resolvido"
              ] })
            ] })
          ] })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card border-none shadow-sm overflow-hidden bg-white/50 dark:bg-black/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xl flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 20, className: "text-primary" }),
              "Evolução de Gastos"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Acompanhe o ritmo dos gastos no período selecionado." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: selectedPeriod, onValueChange: (val) => setSelectedPeriod(val), className: "w-full md:w-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid grid-cols-3 apple-glass p-1 rounded-xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "Este Mês", className: "rounded-lg text-xs font-bold", children: "Mês" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "�altimos 3 Meses", className: "rounded-lg text-xs font-bold", children: "3 Meses" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "Este Ano", className: "rounded-lg text-xs font-bold", children: "Ano" })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[300px] w-full", children: hasGraphData ? /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: weeklyEvolutionData[selectedPeriod], margin: {
          top: 10,
          right: 10,
          left: -20,
          bottom: 0
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "rgba(0,0,0,0.05)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name", axisLine: false, tickLine: false, tick: {
            fontSize: 10,
            fontWeight: 700,
            fill: "hsl(var(--muted-foreground))"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { axisLine: false, tickLine: false, tick: {
            fontSize: 10,
            fontWeight: 700,
            fill: "hsl(var(--muted-foreground))"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip$1, { cursor: {
            fill: "rgba(0,0,0,0.02)"
          }, content: ({
            active,
            payload,
            label
          }) => {
            if (active && payload && payload.length) {
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "apple-card p-3 shadow-xl border-none text-xs", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-black mb-1 text-primary", children: label }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold", children: [
                  "Total: ",
                  formatCurrency(Number(payload[0].value) || 0)
                ] })
              ] });
            }
            return null;
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "total", radius: [6, 6, 0, 0], animationDuration: 1500, children: weeklyEvolutionData[selectedPeriod].map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: "hsl(var(--primary))", fillOpacity: 0.8 + index * 0.05 }, `cell-${index}`)) })
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col items-center justify-center text-center p-8 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 bg-muted rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 32, className: "text-muted-foreground opacity-20" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-[200px]", children: "Dados insuficientes para gerar o gráfico. Comece a registrar suas finanças para ver sua evolução." })
        ] }) }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: itemVariants, className: "lg:col-span-1 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold px-1 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { size: 20, className: "text-primary" }),
            "Gastos por Categoria"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: categoryTotals.length > 0 ? categoryTotals.map(([category, amount]) => {
            const Icon = CATEGORY_ICONS[category] || CircleQuestionMark;
            const percentage = totalExpensesAmount > 0 ? amount / totalExpensesAmount * 100 : 0;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "apple-card apple-card-hover border-none shadow-sm group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-5 flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-muted rounded-2xl text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 20 }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold truncate", children: category }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-black", children: formatCurrency(amount) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-1.5 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
                  width: 0
                }, animate: {
                  width: `${percentage}%`
                }, transition: {
                  duration: 1,
                  delay: 0.5
                }, className: "h-full bg-primary" }) })
              ] })
            ] }) }, category);
          }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground p-4 text-center italic", children: "Ainda não há gastos registrados." }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, className: "lg:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card apple-card-hover h-full border-2 border-primary/5 dark:border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Top Maiores Gastos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Os 5 maiores lançamentos do mês." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: topExpenses.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: topExpenses.map((tx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3 rounded-2xl hover:bg-muted/30 transition-all border border-transparent hover:border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-muted rounded-2xl text-muted-foreground", children: React.createElement(CATEGORY_ICONS[tx.category] || CircleQuestionMark, {
                size: 18
              }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: tx.description }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase font-black tracking-widest", children: tx.category })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-black text-rose-600", children: [
              "- ",
              formatCurrency(Math.abs(tx.amount || 0))
            ] })
          ] }, tx.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Nenhuma transação registrada." }) }) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isSettlementModalOpen, onOpenChange: setIsSettlementModalOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "apple-card rounded-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Confirmar Acerto de Contas" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
          "Isso marcará as contas como resolvidas. Certifique-se de que a transferência de ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold", children: formatCurrency(settlementAmount) }),
          " foi feita."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "rounded-full", onClick: () => setIsSettlementModalOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "rounded-full", onClick: handleSettlementConfirm, children: "Confirmar Acerto" })
      ] })
    ] }) })
  ] });
}
export {
  RelatoriosPage as component
};
