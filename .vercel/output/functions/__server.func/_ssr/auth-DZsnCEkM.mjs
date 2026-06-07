import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useSpaceOnboardingStore, O as OnboardingStep } from "./useSpaceOnboardingStore-jZywpvXW.mjs";
import { P as Progress } from "./progress-DPF4PGs9.mjs";
import { C as Card, b as CardHeader, d as CardTitle, e as CardDescription, a as CardContent, B as Button } from "./card-DDGnP21B.mjs";
import { L as Label, I as Input } from "./label--mk1_jyu.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-0rhnvL4x.mjs";
import { s as supabase } from "./client-CRCA7PsU.mjs";
import { c as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useAuth } from "./router-r--sMQdH.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
import { H as Heart, G as Mail, J as Lock, L as LoaderCircle, K as User, N as CircleAlert, O as RefreshCcw, U as Users, j as UserPlus, g as Check, h as Copy, i as ArrowRight } from "../_libs/lucide-react.mjs";
import { c as string } from "../_libs/zod.mjs";
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
import "../_libs/zustand.mjs";
import "../_libs/radix-ui__react-progress.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const lovableAuth = createLovableAuth();
const lovable = {
  auth: {
    signInWithOAuth: async (provider, opts) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        redirect_uri: opts?.redirect_uri,
        extraParams: {
          ...opts?.extraParams
        }
      });
      if (result.redirected) {
        return result;
      }
      if (result.error) {
        return result;
      }
      try {
        await supabase.auth.setSession(result.tokens);
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
      return result;
    }
  }
};
const inviteCodeSchema = string().min(6, "O código deve ter pelo menos 6 caracteres").max(12, "O código é muito longo").regex(/^[A-Z0-9]+$/, "O código deve conter apenas letras e números");
function AuthPage() {
  const [loading, setLoading] = reactExports.useState(false);
  const [authStep, setAuthStep] = reactExports.useState("auth");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [name, setName] = reactExports.useState("");
  const [inviteCodeInput, setInviteCodeInput] = reactExports.useState("");
  const [generatedInviteCode, setGeneratedInviteCode] = reactExports.useState("");
  const [copied, setCopied] = reactExports.useState(false);
  const {
    user,
    session
  } = useAuth();
  const navigate = useNavigate();
  const {
    step,
    message,
    error: onboardingError,
    setStep,
    setError: setOnboardingError,
    reset: resetOnboarding
  } = useSpaceOnboardingStore();
  const isProcessing = step !== OnboardingStep.IDLE && step !== OnboardingStep.ERROR && step !== OnboardingStep.SUCCESS;
  const progressValue = {
    [OnboardingStep.IDLE]: 0,
    [OnboardingStep.VALIDATING]: 20,
    [OnboardingStep.CREATING_SPACE]: 40,
    [OnboardingStep.CONNECTING_REALTIME]: 60,
    [OnboardingStep.MOUNTING_DASHBOARD]: 80,
    [OnboardingStep.SUCCESS]: 100,
    [OnboardingStep.ERROR]: 0
  }[step];
  reactExports.useEffect(() => {
    if (user && !generatedInviteCode) {
      const storedName = localStorage.getItem("pending_onboarding_name");
      if (storedName) {
        supabase.from("profiles").update({
          display_name: storedName
        }).eq("id", user.id).then(() => {
          localStorage.removeItem("pending_onboarding_name");
          checkProfileStatus();
        });
      } else {
        checkProfileStatus();
      }
    }
  }, [user, generatedInviteCode]);
  const checkProfileStatus = async (forceOnboarding = false) => {
    if (!user) return;
    const {
      data: profile,
      error
    } = await supabase.from("profiles").select("couple_id, display_name").eq("id", user.id).maybeSingle();
    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }
    if (profile?.couple_id && !forceOnboarding) {
      navigate({
        to: "/"
      });
    } else {
      if (profile?.display_name) {
        setName(profile.display_name);
        setStep(OnboardingStep.IDLE);
      }
      setAuthStep("onboarding");
    }
  };
  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      if (name.trim()) {
        const {
          data: {
            user: user2
          }
        } = await supabase.auth.getUser();
        if (user2) {
          await supabase.from("profiles").update({
            display_name: name.trim()
          }).eq("id", user2.id);
        }
      }
    } catch (error) {
      toast.error("Erro ao entrar", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });
      if (error) throw error;
      toast.success("Conta criada!", {
        description: "Continuando para a criação do espaço."
      });
      setStep(OnboardingStep.IDLE);
      setAuthStep("onboarding");
    } catch (error) {
      toast.error("Erro ao criar conta", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };
  const handleCreateCouple = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1e4);
    setStep(OnboardingStep.CREATING_SPACE);
    const toastId = toast.loading("Criando seu espaço...", {
      description: "Preparando o ambiente..."
    });
    try {
      const createPromise = supabase.rpc("create_couple", {
        _name: `${name}'s Couple`
      });
      const {
        data: coupleId,
        error: createError
      } = await createPromise;
      if (createError) throw createError;
      setStep(OnboardingStep.VALIDATING, "Gerando código de convite...");
      toast.loading("Gerando código de convite...", {
        id: toastId
      });
      const {
        data: inviteCode,
        error: codeError
      } = await supabase.rpc("get_my_invite_code");
      if (codeError) throw codeError;
      setGeneratedInviteCode(inviteCode || "");
      setStep(OnboardingStep.SUCCESS, "Espaço criado!");
      toast.success("Espaço criado!", {
        id: toastId,
        description: "Preparando o seu Dashboard..."
      });
      setTimeout(() => {
        navigate({
          to: "/"
        });
      }, 1500);
    } catch (error) {
      console.error("Error creating space:", error);
      const isTimeout = error.name === "AbortError";
      const errorMessage = isTimeout ? "A conexão expirou. Tente novamente em um local com sinal melhor." : "Não conseguimos criar seu espaço. Verifique sua conexão e tente novamente.";
      setOnboardingError(errorMessage);
      toast.error("Erro ao criar espaço", {
        id: toastId,
        description: error.message
      });
    } finally {
      clearTimeout(timeoutId);
    }
  };
  const handleJoinCouple = async () => {
    if (!inviteCodeInput) return;
    const validation = inviteCodeSchema.safeParse(inviteCodeInput.toUpperCase());
    if (!validation.success) {
      toast.error("Código inválido", {
        description: validation.error.issues[0].message
      });
      return;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1e4);
    setStep(OnboardingStep.VALIDATING);
    const toastId = toast.loading("Verificando convite...", {
      description: "Buscando o espaço do seu parceiro..."
    });
    try {
      const joinPromise = supabase.rpc("join_couple_with_invite", {
        _invite_code: inviteCodeInput.toUpperCase()
      });
      const {
        data: coupleId,
        error: joinError
      } = await joinPromise;
      if (joinError) {
        let friendlyMessage = "Ocorreu um erro ao entrar no espaço.";
        if (joinError.message.includes("INVITE_CODE_NOT_FOUND")) {
          friendlyMessage = "Código de convite não encontrado ou já utilizado.";
        } else if (joinError.message.includes("COUPLE_SPACE_FULL")) {
          friendlyMessage = "Este espaço já está completo (limite de 2 pessoas).";
        }
        throw new Error(friendlyMessage);
      }
      setStep(OnboardingStep.CONNECTING_REALTIME);
      toast.loading("Conectando ao banco de dados...", {
        id: toastId
      });
      setStep(OnboardingStep.SUCCESS, "Vinculado com sucesso!");
      toast.success("Vinculado com sucesso!", {
        id: toastId,
        description: "Preparando o seu Dashboard..."
      });
      setTimeout(() => {
        navigate({
          to: "/"
        });
      }, 1e3);
    } catch (error) {
      console.error("Error joining space:", error);
      const isTimeout = error.name === "AbortError";
      const errorMessage = isTimeout ? "A conexão expirou (timeout de 10s). Verifique sua internet." : error.message || "Não conseguimos conectar a este espaço. Verifique o código e tente novamente.";
      setOnboardingError(errorMessage);
      toast.error("Erro ao entrar", {
        id: toastId,
        description: error.message
      });
    } finally {
      clearTimeout(timeoutId);
    }
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedInviteCode);
    setCopied(true);
    toast.success("Código copiado!");
    setTimeout(() => setCopied(false), 2e3);
  };
  const handleGoogleSignIn = async () => {
    if (!name.trim()) {
      toast.error("Por favor, informe seu nome primeiro.");
      return;
    }
    localStorage.setItem("pending_onboarding_name", name.trim());
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/auth"
      });
      if (result.error) throw result.error;
    } catch (error) {
      toast.error("Erro ao entrar com Google", {
        description: error.message
      });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black p-4 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isProcessing && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      y: -20
    }, animate: {
      opacity: 1,
      y: 0
    }, exit: {
      opacity: 0,
      y: -20
    }, className: "fixed top-0 left-0 right-0 z-50 p-4 space-y-2 bg-white/10 backdrop-blur-md border-b border-white/20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md mx-auto space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-xs font-bold text-white uppercase tracking-wider", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: message }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          progressValue,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progressValue, className: "h-1.5 bg-white/20" })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 -z-10 pointer-events-none transition-transform duration-300 ease-out", style: {
      background: "linear-gradient(to bottom, #161616, #203F9A, #4E7CB2, #E84797, #94C2DA, #E7A0CC, #EFE8E0)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: {
      opacity: 0,
      scale: 0.95
    }, animate: {
      opacity: 1,
      scale: 1
    }, className: "w-full max-w-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: authStep === "auth" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      x: -20
    }, animate: {
      opacity: 1,
      x: 0
    }, exit: {
      opacity: 0,
      x: 20
    }, className: "space-y-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary text-primary-foreground shadow-xl mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 32, className: "fill-current" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black tracking-tight text-foreground", children: "CoupleFinance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground italic", children: "Seu patrimônio, sonhos e planos em harmonia." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "login", className: "w-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2 mb-8 apple-interactive p-1 rounded-2xl h-12 bg-muted/20 backdrop-blur-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "login", className: "rounded-xl data-[state=active]:shadow-md", children: "Entrar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "register", className: "rounded-xl data-[state=active]:shadow-md", children: "Criar Conta" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "login", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pt-8 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xl font-bold", children: "Bem-vindo de volta" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Acesse sua conta para continuar." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6 pb-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSignIn, className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", children: "E-mail" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", size: 18 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "email", type: "email", placeholder: "seu@email.com", className: "pl-10 h-12 rounded-xl", value: email, onChange: (e) => setEmail(e.target.value), required: true })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Senha" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", size: 18 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", type: "password", className: "pl-10 h-12 rounded-xl", value: password, onChange: (e) => setPassword(e.target.value), required: true })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full h-12 rounded-xl text-base font-bold shadow-lg", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : "Entrar" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-full border-t border-muted" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "apple-glass px-4 text-muted-foreground font-medium italic", children: "ou" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "w-full h-12 rounded-xl gap-3 border-muted hover:bg-muted/30 transition-all font-bold", onClick: handleGoogleSignIn, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: "https://www.google.com/favicon.ico", className: "w-4 h-4", alt: "Google" }),
              "Entrar com Google"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "register", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card overflow-hidden", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pt-8 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xl font-bold", children: "Comece agora" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Crie sua conta e conecte-se ao seu parceiro." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-6 pb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSignUp, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reg-name", children: "Seu Nome" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "reg-name", type: "text", placeholder: "Como quer ser chamado?", className: "pl-10 h-12 rounded-xl", value: name, onChange: (e) => setName(e.target.value), required: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reg-email", children: "E-mail" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "reg-email", type: "email", placeholder: "seu@email.com", className: "pl-10 h-12 rounded-xl", value: email, onChange: (e) => setEmail(e.target.value), required: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reg-password", children: "Senha" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", size: 18 }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "reg-password", type: "password", className: "pl-10 h-12 rounded-xl", value: password, onChange: (e) => setPassword(e.target.value), required: true })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full h-12 rounded-xl text-base font-bold shadow-lg", disabled: loading, children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : "Criar Minha Conta" })
          ] }) })
        ] }) })
      ] })
    ] }, "auth-step") : /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
      opacity: 0,
      x: 20
    }, animate: {
      opacity: 1,
      x: 0
    }, exit: {
      opacity: 0,
      x: -20
    }, className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-black tracking-tight text-foreground", children: step === OnboardingStep.ERROR ? "Oops!" : `Quase lá, ${name}!` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: step === OnboardingStep.ERROR ? "Algo não saiu como o esperado." : "Como você quer começar no CoupleFinance?" })
      ] }),
      step === OnboardingStep.ERROR ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card p-8 text-center space-y-6 border-destructive/20 bg-destructive/5 backdrop-blur-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { size: 32 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xl font-bold text-foreground", children: "Falha na conexão" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm leading-relaxed", children: onboardingError || "Não conseguimos conectar a este espaço. Verifique o código e tente novamente." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: resetOnboarding, className: "w-full h-12 rounded-xl font-bold gap-2 active:scale-95 transition-all shadow-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCcw, { size: 18 }),
          "Tentar Novamente"
        ] })
      ] }) : !generatedInviteCode ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "apple-card hover:border-primary/50 transition-all cursor-pointer group", onClick: handleCreateCouple, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 24 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: "Criar um novo espaço" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Crie um ambiente novo e convide seu parceiro(a)." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "p-6 pb-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { size: 24 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg", children: "Entrar em um espaço" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Insira o código enviado pelo seu parceiro(a)." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-6 pb-6 pt-0 space-y-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "EX: A1B2C3", className: "h-12 rounded-xl font-mono uppercase tracking-widest text-center", value: inviteCodeInput, onChange: (e) => setInviteCodeInput(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "h-12 rounded-xl px-6", onClick: handleJoinCouple, disabled: isProcessing || !inviteCodeInput, children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin" }) : "Entrar" })
          ] }) })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 32 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl font-bold", children: "Espaço Criado!" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Compartilhe o código abaixo com seu parceiro." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6 pb-8 px-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/10 dark:bg-black/20 p-6 rounded-3xl border border-white/20 text-center relative overflow-hidden group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-4xl font-black tracking-[0.2em] font-mono text-primary animate-pulse", children: generatedInviteCode }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "absolute right-4 top-1/2 -translate-y-1/2 rounded-full hover:bg-primary/20", onClick: copyToClipboard, children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 20, className: "text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 20 }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "w-full h-12 rounded-xl font-bold shadow-lg", onClick: () => navigate({
              to: "/"
            }), children: [
              "Acessar Meu Dashboard",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 18, className: "ml-2" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-center text-muted-foreground italic", children: "Seu parceiro aparecerá automaticamente assim que entrar com este código." })
          ] })
        ] })
      ] })
    ] }, "onboarding-step") }) })
  ] });
}
export {
  AuthPage as component
};
