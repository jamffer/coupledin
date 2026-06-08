import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useFinanceStore, u as useProfile, D as DashboardLayout, P as ProfileAvatar, A as Avatar, g as AvatarImage, h as AvatarFallback, i as Dialog, j as DialogContent, k as DialogHeader, l as DialogTitle, m as DialogDescription } from "./layout-dashboard-irdFI0U9.mjs";
import { C as Card, a as CardContent, B as Button, b as CardHeader, d as CardTitle, e as CardDescription, c as cn } from "./card-DDGnP21B.mjs";
import { L as Label, I as Input } from "./label--mk1_jyu.mjs";
import { S as Switch$1, a as SwitchThumb } from "../_libs/radix-ui__react-switch.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { R as RadioGroup, a as RadioGroupItem } from "./radio-group-JRkNOusG.mjs";
import { u as useAuth } from "./router-r--sMQdH.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-CRCA7PsU.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { H as Heart, C as CirclePlus, r as Calendar, j as UserPlus, g as Check, s as ClipboardCopy, t as Scale, u as PiggyBank, I as Info, v as Bell, D as Download, w as ChevronRight, x as Settings2 } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/react-easy-crop.mjs";

const __rest = (s, e) => {
  const t = {};
  for (const p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (let i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
  return t;
};

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
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Switch$1,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      SwitchThumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Switch$1.displayName;
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
function ConfiguracoesPage() {
  const {
    incomeJorge,
    incomeLilian,
    setIncomes
  } = useFinanceStore();
  const {
    user,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const {
    profile,
    partnerProfile
  } = useProfile();
  const [inviteCode, setInviteCode] = reactExports.useState(null);
  const [showInviteDialog, setShowInviteDialog] = reactExports.useState(false);
  const [copied, setCopied] = reactExports.useState(false);
  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      toast.success("Código copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2e3);
    }
  };
  reactExports.useEffect(() => {
    if (!authLoading && !user) {
      navigate({
        to: "/auth"
      });
    }
  }, [user, authLoading]);
  reactExports.useEffect(() => {
    if (user) {
      supabase.rpc("get_my_invite_code").then(({
        data
      }) => {
        setInviteCode(data);
      });
    }
  }, [user]);
  const [divisionModel, setDivisionModel] = reactExports.useState("proportional");
  const [percentageA, setPercentageA] = reactExports.useState(60);
  const [percentageB, setPercentageB] = reactExports.useState(40);
  reactExports.useEffect(() => {
    if (divisionModel === "proportional") {
      const total = incomeJorge + incomeLilian;
      if (total > 0) {
        setPercentageA(Math.round(incomeJorge / total * 100));
        setPercentageB(Math.round(incomeLilian / total * 100));
      }
    } else {
      setPercentageA(50);
      setPercentageB(50);
    }
  }, [divisionModel, incomeJorge, incomeLilian]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "space-y-8 pb-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Configurações" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground italic", children: "Controle total sobre as regras financeiras do casal." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "apple-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex -space-x-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ProfileAvatar,
          {
            url: profile?.avatar_url || null,
            name: profile?.display_name || "ME",
            userId: user?.id || void 0,
            onUpdate: () => {
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full apple-glass border-4 border-white dark:border-[#1A1A1A] flex items-center justify-center relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 32, className: "fill-primary" }) }) }),
        partnerProfile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-24 h-24 border-4 border-white dark:border-[#1A1A1A] shadow-xl ring-1 ring-muted/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: partnerProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partnerProfile.display_name || "partner"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: partnerProfile.display_name?.substring(0, 2).toUpperCase() || "PA" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full border-4 border-dashed border-primary/40 bg-primary/5 flex items-center justify-center relative z-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 32, className: "text-primary/40" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 text-center md:text-left space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold", children: [
          profile?.display_name || "Você",
          partnerProfile?.display_name ? ` & ${partnerProfile.display_name}` : ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-muted dark:bg-muted/10 px-3 py-1 rounded-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14 }),
            "Início: ",
            profile?.created_at ? new Intl.DateTimeFormat("pt-BR", {
              day: "2-digit",
              month: "short",
              year: "numeric"
            }).format(new Date(profile.created_at)) : "..."
          ] }),
          partnerProfile ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse" }),
            "Conta Conectada"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-2 h-2 rounded-full bg-amber-500 animate-pulse" }),
            "Aguardando parceiro(a)"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "rounded-full gap-2 px-6 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all apple-interactive dark:border-white/10 active:scale-95", onClick: () => setShowInviteDialog(true), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 18 }),
          "Convidar Parceiro(a)"
        ] }),
        inviteCode && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center md:text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground uppercase font-bold tracking-widest", children: [
          "Código: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-mono", children: inviteCode })
        ] }) })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "apple-card overflow-hidden border-primary/20 bg-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-center md:text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-lg font-bold flex items-center gap-2 justify-center md:justify-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 20, className: "text-primary" }),
          "Código de Convite do Casal"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground italic", children: "Compartilhe este código para conectar seu parceiro(a) ao seu espaço." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-white dark:bg-black/40 p-2 pl-6 rounded-2xl border border-primary/20 shadow-inner group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl font-black font-mono tracking-widest text-primary uppercase", children: inviteCode || "••••••••" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "rounded-xl hover:bg-primary/10 transition-all active:scale-95", onClick: handleCopyCode, children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 20, className: "text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { size: 20, className: "text-primary" }) })
      ] })
    ] }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "border-b border-border/40 pb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-primary/10 rounded-lg text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Regras de Divisão de Despesas" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: 'Defina como as despesas marcadas como "Conjuntas" serão divididas.' })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8 space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(RadioGroup, { value: divisionModel, onValueChange: setDivisionModel, className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: "fixed", id: "fixed", className: "peer sr-only" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "fixed", className: cn("flex flex-col items-center justify-between rounded-2xl border-2 border-border p-6 hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all cursor-pointer h-full dark:bg-card dark:border-white/5", divisionModel === "fixed" && "border-primary bg-primary/5 dark:bg-primary/10 dark:border-primary/50"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 peer-data-[state=checked]:bg-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Scale, { size: 24, className: cn(divisionModel === "fixed" ? "text-primary" : "text-muted-foreground") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: "Divisão 50/50" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "Cada um paga metade exata das contas, independente da renda." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: "proportional", id: "proportional", className: "peer sr-only" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "proportional", className: cn("flex flex-col items-center justify-between rounded-2xl border-2 border-border p-6 hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all cursor-pointer h-full dark:bg-card dark:border-white/5", divisionModel === "proportional" && "border-primary bg-primary/5 dark:bg-primary/10 dark:border-primary/50"), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PiggyBank, { size: 24, className: cn(divisionModel === "proportional" ? "text-primary" : "text-muted-foreground") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: "Divisão Proporcional" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: "A divisão é calculada com base na renda mensal de cada um." })
              ] })
            ] })
          ] })
        ] }),
        divisionModel === "proportional" && /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          y: 10
        }, animate: {
          opacity: 1,
          y: 0
        }, className: "space-y-8 pt-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "incomeA", className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: [
                "Renda Mensal de ",
                profile?.display_name?.split(" ")[0] || "Você"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium", children: "R$" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "incomeA", type: "number", value: incomeJorge, onChange: (e) => setIncomes(Number(e.target.value), incomeLilian), className: "pl-10 h-12 rounded-xl border-muted focus:border-primary/50" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: "incomeB", className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: [
                "Renda Mensal de ",
                partnerProfile?.display_name?.split(" ")[0] || "Parceiro(a)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium", children: "R$" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "incomeB", type: "number", value: incomeLilian, onChange: (e) => setIncomes(incomeJorge, Number(e.target.value)), className: "pl-10 h-12 rounded-xl border-muted focus:border-primary/50" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/30 rounded-2xl p-6 md:p-8 space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end mb-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: "Resultado do Cálculo" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground italic", children: [
                  profile?.display_name?.split(" ")[0] || "Você",
                  " paga ",
                  percentageA,
                  "% / ",
                  partnerProfile?.display_name?.split(" ")[0] || "Parceiro(a)",
                  " paga ",
                  percentageB,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-primary" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase text-muted-foreground", children: profile?.display_name?.split(" ")[0] || "Você" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-rose-400" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase text-muted-foreground", children: partnerProfile?.display_name?.split(" ")[0] || "Parceiro(a)" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-4 w-full bg-muted dark:bg-black rounded-full overflow-hidden flex shadow-inner border-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
                width: 0
              }, animate: {
                width: `${percentageA}%`
              }, className: "h-full bg-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
                width: 0
              }, animate: {
                width: `${percentageB}%`
              }, className: "h-full bg-rose-400" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 bg-muted dark:bg-card p-4 rounded-xl border-border", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 16, className: "text-primary mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground leading-relaxed", children: [
                "Este percentual será aplicado automaticamente em todas as transações marcadas como ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: '"Divisão Proporcional"' }),
                " na tela de lançamentos."
              ] })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-primary/10 rounded-lg text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Preferências e Alertas" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 hover:bg-primary/10 rounded-xl transition-colors group cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold group-hover:text-primary transition-colors", children: "Notificações de Fatura" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic dark:text-muted-foreground", children: "Lembrar dias antes do vencimento." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { defaultChecked: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 hover:bg-primary/10 rounded-xl transition-colors group cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold group-hover:text-primary transition-colors", children: "Alertas de Orçamento" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic dark:text-muted-foreground", children: "Avisar quando passar de 80% do limite." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { defaultChecked: true })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2 hover:bg-primary/10 rounded-xl transition-colors group cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold group-hover:text-primary transition-colors", children: "Relatório Semanal" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground italic dark:text-muted-foreground", children: "Resumo por e-mail toda segunda-feira." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, {})
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-primary/10 rounded-lg text-primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 20 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Dados e Segurança" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-between h-14 px-6 rounded-2xl border-muted hover:bg-primary/5 hover:border-primary/30 transition-all group dark:border-white/5 apple-interactive dark:bg-card active:scale-[0.98]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 18, className: "text-muted-foreground group-hover:text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: "Exportar Dados (CSV)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase font-bold tracking-wider", children: "Histórico completo" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "text-muted-foreground" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full justify-between h-14 px-6 rounded-2xl border-muted hover:bg-primary/5 hover:border-primary/30 transition-all group dark:border-white/5 apple-interactive dark:bg-card active:scale-[0.98]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings2, { size: 18, className: "text-muted-foreground group-hover:text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: "Privacidade da Conta" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase font-bold tracking-wider", children: "Gestão de acessos" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 16, className: "text-muted-foreground" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl font-bold text-xs uppercase tracking-widest", children: "Desconectar Conta do Casal" }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showInviteDialog, onOpenChange: setShowInviteDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "apple-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Convidar Parceiro(a)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Compartilhe o código abaixo com seu parceiro para que ele(a) possa se conectar ao seu espaço." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-8 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-muted p-6 rounded-2xl mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl font-black tracking-widest font-mono text-primary animate-pulse uppercase", children: inviteCode || "Carregando..." }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full h-12 rounded-xl font-bold gap-2", onClick: handleCopyCode, children: [
          copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCopy, { size: 20 }),
          copied ? "Copiado!" : "Copiar Código"
        ] })
      ] })
    ] }) })
  ] }) });
}
export {
  ConfiguracoesPage as component
};
