import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router--zSI1aDr.mjs";
import { s as supabase } from "./client-CRCA7PsU.mjs";
import { C as Card, b as CardHeader, d as CardTitle, e as CardDescription, a as CardContent, B as Button } from "./card-DDGnP21B.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { L as LoaderCircle, H as Heart, h as Check, i as Copy, j as ArrowRight, D as Download, k as UserPlus, l as LayoutDashboard } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function InvitePage() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = reactExports.useState(null);
  const [copied, setCopied] = reactExports.useState(false);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (!user) {
      navigate({
        to: "/auth"
      });
      return;
    }
    const loadInviteCode = async () => {
      const {
        data: profile
      } = await supabase.from("profiles").select("couple_id").eq("id", user.id).maybeSingle();
      if (!profile?.couple_id) {
        navigate({
          to: "/auth"
        });
        return;
      }
      const {
        data: code
      } = await supabase.rpc("get_my_invite_code");
      setInviteCode(code);
      setIsLoading(false);
      const channel = supabase.channel("invite-page-detection").on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "profiles",
        filter: `couple_id=eq.${profile.couple_id}`
      }, async () => {
        if (!profile.couple_id) return;
        const {
          count
        } = await supabase.from("profiles").select("*", {
          count: "exact",
          head: true
        }).eq("couple_id", profile.couple_id);
        if (count !== null && count >= 2) {
          toast.success("Parceiro(a) conectado! Redirecionando...");
          setTimeout(() => navigate({
            to: "/"
          }), 1500);
        }
      }).subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    };
    loadInviteCode();
  }, [user, navigate]);
  const handleCopy = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      toast.success("Código copiado!");
      setTimeout(() => setCopied(false), 2e3);
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen flex items-center justify-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-primary" }) });
  }
  const steps = [{
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-5 h-5" }),
    title: "Baixe o App",
    description: "Peça para seu parceiro(a) acessar o site ou baixar o app."
  }, {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "w-5 h-5" }),
    title: "Insira o Código",
    description: "Ele(a) deve criar uma conta e inserir o código de convite."
  }, {
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutDashboard, { className: "w-5 h-5" }),
    title: "Comece a Usar",
    description: "Assim que ele(a) entrar, seu Dashboard será atualizado."
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 -z-10 pointer-events-none", style: {
      background: "linear-gradient(to bottom, #161616, #203F9A, #4E7CB2, #E84797, #94C2DA, #E7A0CC, #EFE8E0)",
      opacity: 0.8
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      y: 20
    }, animate: {
      opacity: 1,
      y: 0
    }, className: "w-full max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-8 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary text-primary-foreground shadow-xl mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 32, className: "fill-current" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black tracking-tight text-white", children: "Conecte seu Amor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/80", children: "Envie o convite para começar a gerenciar juntos." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card backdrop-blur-md bg-white/10 border-white/20 text-white overflow-hidden mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center pb-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Seu Código de Convite" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/60", children: "Válido para um único parceiro(a)" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8 pt-4 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 rounded-3xl p-8 border border-white/10 text-center relative group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-5xl font-black tracking-[0.2em] font-mono text-white animate-pulse", children: inviteCode }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "absolute right-4 top-1/2 -translate-y-1/2 rounded-full hover:bg-white/20 text-white", onClick: handleCopy, children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-6 h-6 text-emerald-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-6 h-6" }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full h-14 rounded-2xl text-lg font-bold shadow-lg gap-3 bg-white text-primary hover:bg-white/90", onClick: handleCopy, children: [
            copied ? "Copiado!" : "Copiar Código",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-5 h-5" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-bold px-2", children: "Como funciona:" }),
        steps.map((step, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          x: -20
        }, animate: {
          opacity: 1,
          x: 0
        }, transition: {
          delay: 0.1 * index
        }, className: "flex items-start gap-4 bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 mt-1", children: step.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", { className: "font-bold text-white", children: [
              index + 1,
              ". ",
              step.title
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/60 leading-relaxed", children: step.description })
          ] })
        ] }, index))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", className: "text-white hover:bg-white/10 rounded-xl gap-2", onClick: () => navigate({
        to: "/"
      }), children: [
        "Pular por enquanto",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-4 h-4" })
      ] }) })
    ] })
  ] });
}
export {
  InvitePage as component
};
