import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Mail, 
  Lock, 
  UserPlus, 
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Users,
  User as UserIcon,
  ArrowRight,
  RefreshCcw
} from "lucide-react";
import { useSpaceOnboardingStore, OnboardingStep } from "@/store/useSpaceOnboardingStore";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

import { z } from "zod";

const inviteCodeSchema = z.string()
  .min(6, "O código deve ter pelo menos 6 caracteres")
  .max(12, "O código é muito longo")
  .regex(/^[A-Z0-9]+$/, "O código deve conter apenas letras e números");

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar | CoupleDin" },
      { name: "description", content: "Faça login para gerenciar suas finanças a dois." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [authStep, setAuthStep] = useState<"auth" | "onboarding">("auth");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [inviteCodeInput, setInviteCodeInput] = useState("");
  const [generatedInviteCode, setGeneratedInviteCode] = useState("");
  const [copied, setCopied] = useState(false);
  
  const { user, session } = useAuth();
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
    [OnboardingStep.ERROR]: 0,
  }[step];

  useEffect(() => {
    if (user && !generatedInviteCode) {
      const storedName = localStorage.getItem("pending_onboarding_name");
      if (storedName) {
        supabase.from("profiles")
          .update({ display_name: storedName })
          .eq("id", user.id)
          .then(() => {
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
    
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("couple_id, display_name")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    if (profile?.couple_id && !forceOnboarding) {
      navigate({ to: "/" });
    } else {
      if (profile?.display_name) {
        setName(profile.display_name);
        setStep(OnboardingStep.IDLE);
      }
      setAuthStep("onboarding");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      if (name.trim()) {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("profiles")
            .update({ display_name: name.trim() })
            .eq("id", user.id);
        }
      }
    } catch (error: any) {
      toast.error("Erro ao entrar", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: name
          }
        }
      });
      if (error) throw error;
      
      // O perfil agora é criado automaticamente pelo trigger do banco de dados (handle_new_user)

      toast.success("Conta criada!", { description: "Continuando para a criação do espaço." });
      setStep(OnboardingStep.IDLE);
      setAuthStep("onboarding");
    } catch (error: any) {
      toast.error("Erro ao criar conta", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCouple = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    setStep(OnboardingStep.CREATING_SPACE);
    const toastId = toast.loading("Criando seu espaço...", { description: "Preparando o ambiente..." });
    
    try {
      const createPromise = supabase
        .rpc("create_couple", { _name: `${name}'s Couple` });

      const { data: coupleId, error: createError } = await createPromise;

      if (createError) throw createError;

      setStep(OnboardingStep.VALIDATING, "Gerando código de convite...");
      toast.loading("Gerando código de convite...", { id: toastId });
      
      const { data: inviteCode, error: codeError } = await supabase
        .rpc("get_my_invite_code");

      if (codeError) throw codeError;

      setGeneratedInviteCode(inviteCode || "");
      setStep(OnboardingStep.SUCCESS, "Espaço criado!");
      toast.success("Espaço criado!", { id: toastId, description: "Preparando o seu Dashboard..." });
      
      setTimeout(() => {
        navigate({ to: "/" });
      }, 1500);
    } catch (error: any) {
      console.error("Error creating space:", error);
      const isTimeout = error.name === 'AbortError';
      const errorMessage = isTimeout 
        ? "A conexão expirou. Tente novamente em um local com sinal melhor."
        : "Não conseguimos criar seu espaço. Verifique sua conexão e tente novamente.";
      
      setOnboardingError(errorMessage);
      toast.error("Erro ao criar espaço", { id: toastId, description: error.message });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleJoinCouple = async () => {
    if (!inviteCodeInput) return;

    // Client-side validation with Zod
    const validation = inviteCodeSchema.safeParse(inviteCodeInput.toUpperCase());
    if (!validation.success) {
      toast.error("Código inválido", { description: validation.error.issues[0].message });
      return;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    setStep(OnboardingStep.VALIDATING);
    const toastId = toast.loading("Verificando convite...", { description: "Buscando o espaço do seu parceiro..." });
    
    try {
      const joinPromise = supabase
        .rpc("join_couple_with_invite", { _invite_code: inviteCodeInput.toUpperCase() });

      const { data: coupleId, error: joinError } = await joinPromise;

      if (joinError) {
        // Map backend errors to friendly messages
        let friendlyMessage = "Ocorreu um erro ao entrar no espaço.";
        if (joinError.message.includes('INVITE_CODE_NOT_FOUND')) {
          friendlyMessage = "Código de convite não encontrado ou já utilizado.";
        } else if (joinError.message.includes('COUPLE_SPACE_FULL')) {
          friendlyMessage = "Este espaço já está completo (limite de 2 pessoas).";
        }
        throw new Error(friendlyMessage);
      }

      setStep(OnboardingStep.CONNECTING_REALTIME);
      toast.loading("Conectando ao banco de dados...", { id: toastId });
      
      setStep(OnboardingStep.SUCCESS, "Vinculado com sucesso!");
      toast.success("Vinculado com sucesso!", { id: toastId, description: "Preparando o seu Dashboard..." });
      
      setTimeout(() => {
        navigate({ to: "/" });
      }, 1000);
    } catch (error: any) {
      console.error("Error joining space:", error);
      const isTimeout = error.name === 'AbortError';
      const errorMessage = isTimeout 
        ? "A conexão expirou (timeout de 10s). Verifique sua internet."
        : (error.message || "Não conseguimos conectar a este espaço. Verifique o código e tente novamente.");
      
      setOnboardingError(errorMessage);
      toast.error("Erro ao entrar", { id: toastId, description: error.message });
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedInviteCode);
    setCopied(true);
    toast.success("Código copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoogleSignIn = async () => {
    if (!name.trim()) {
      toast.error("Por favor, informe seu nome primeiro.");
      return;
    }
    // We store the name in localStorage to pick it up after OAuth redirect
    localStorage.setItem("pending_onboarding_name", name.trim());
    
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/auth",
      });
      if (result.error) throw result.error;
    } catch (error: any) {
      toast.error("Erro ao entrar com Google", { description: error.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black p-4 relative overflow-hidden">
      {/* Progress Indicator */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-0 left-0 right-0 z-50 p-4 space-y-2 bg-white/10 backdrop-blur-md border-b border-white/20"
          >
            <div className="max-w-md mx-auto space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-white uppercase tracking-wider">
                <span>{message}</span>
                <span>{progressValue}%</span>
              </div>
              <Progress value={progressValue} className="h-1.5 bg-white/20" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 pointer-events-none transition-transform duration-300 ease-out"
        style={{
          background: 'linear-gradient(to bottom, #161616, #203F9A, #4E7CB2, #E84797, #94C2DA, #E7A0CC, #EFE8E0)'
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {authStep === "auth" ? (
            <motion.div
              key="auth-step"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="text-center space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex items-center justify-center"
                >
                  <div className="h-14 w-auto min-w-[140px]">
                    <img
                      src="/logo-coupledin.png"
                      alt="Logo CoupleDin"
                      className="h-full w-auto object-contain mx-auto"
                    />
                  </div>
                </motion.div>
                <p className="text-muted-foreground italic text-sm">Seu patrimônio, sonhos e planos em harmonia.</p>
              </div>

              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 apple-interactive p-1 rounded-2xl h-12 bg-muted/20 backdrop-blur-md">
                  <TabsTrigger value="login" className="rounded-xl data-[state=active]:shadow-md">Entrar</TabsTrigger>
                  <TabsTrigger value="register" className="rounded-xl data-[state=active]:shadow-md">Criar Conta</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Card className="apple-card overflow-hidden">
                    <CardHeader className="pt-8 pb-4">
                      <CardTitle className="text-xl font-bold">Bem-vindo de volta</CardTitle>
                      <CardDescription>Acesse sua conta para continuar.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pb-8">
                      <form onSubmit={handleSignIn} className="space-y-4">

                        <div className="space-y-2">
                          <Label htmlFor="email">E-mail</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input 
                              id="email" 
                              type="email" 
                              placeholder="seu@email.com" 
                              className="pl-10 h-12 rounded-xl"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Senha</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input 
                              id="password" 
                              type="password" 
                              className="pl-10 h-12 rounded-xl"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <Button className="w-full h-12 rounded-xl text-base font-bold shadow-lg" disabled={loading}>
                          {loading ? <Loader2 className="animate-spin" /> : "Entrar"}
                        </Button>
                      </form>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-muted" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="apple-glass px-4 text-muted-foreground font-medium italic">ou</span>
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full h-12 rounded-xl gap-3 border-muted hover:bg-muted/30 transition-all font-bold"
                        onClick={handleGoogleSignIn}
                      >
                        <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                        Entrar com Google
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="register">
                  <Card className="apple-card overflow-hidden">
                    <CardHeader className="pt-8 pb-4">
                      <CardTitle className="text-xl font-bold">Comece agora</CardTitle>
                      <CardDescription>Crie sua conta e conecte-se ao seu parceiro.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pb-8">
                      <form onSubmit={handleSignUp} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reg-name">Seu Nome</Label>
                          <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input 
                              id="reg-name" 
                              type="text" 
                              placeholder="Como quer ser chamado?" 
                              className="pl-10 h-12 rounded-xl"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-email">E-mail</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input 
                              id="reg-email" 
                              type="email" 
                              placeholder="seu@email.com" 
                              className="pl-10 h-12 rounded-xl"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-password">Senha</Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input 
                              id="reg-password" 
                              type="password" 
                              className="pl-10 h-12 rounded-xl"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <Button className="w-full h-12 rounded-xl text-base font-bold shadow-lg" disabled={loading}>
                          {loading ? <Loader2 className="animate-spin" /> : "Criar Minha Conta"}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            <motion.div
              key="onboarding-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-black tracking-tight text-foreground">
                  {step === OnboardingStep.ERROR ? "Oops!" : `Quase lá, ${name}!`}
                </h1>
                <p className="text-muted-foreground">
                  {step === OnboardingStep.ERROR 
                    ? "Algo não saiu como o esperado." 
                    : "Como você quer começar no CoupleDin?"}
                </p>
              </div>

              {step === OnboardingStep.ERROR ? (
                <Card className="apple-card p-8 text-center space-y-6 border-destructive/20 bg-destructive/5 backdrop-blur-md">
                  <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <AlertCircle size={32} />
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-bold text-foreground">Falha na conexão</CardTitle>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {onboardingError || 'Não conseguimos conectar a este espaço. Verifique o código e tente novamente.'}
                    </p>
                  </div>
                  <Button 
                    onClick={resetOnboarding} 
                    className="w-full h-12 rounded-xl font-bold gap-2 active:scale-95 transition-all shadow-md"
                  >
                    <RefreshCcw size={18} />
                    Tentar Novamente
                  </Button>
                </Card>
              ) : !generatedInviteCode ? (
                <div className="grid grid-cols-1 gap-4">
                  <Card className="apple-card hover:border-primary/50 transition-all cursor-pointer group" onClick={handleCreateCouple}>
                    <CardHeader className="p-6">
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Users size={24} />
                      </div>
                      <CardTitle className="text-lg">Criar um novo espaço</CardTitle>
                      <CardDescription>Crie um ambiente novo e convide seu parceiro(a).</CardDescription>
                    </CardHeader>
                  </Card>

                  <Card className="apple-card">
                    <CardHeader className="p-6 pb-4">
                      <div className="w-12 h-12 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center mb-4">
                        <UserPlus size={24} />
                      </div>
                      <CardTitle className="text-lg">Entrar em um espaço</CardTitle>
                      <CardDescription>Insira o código enviado pelo seu parceiro(a).</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pb-6 pt-0 space-y-4">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="EX: A1B2C3" 
                          className="h-12 rounded-xl font-mono uppercase tracking-widest text-center"
                          value={inviteCodeInput}
                          onChange={(e) => setInviteCodeInput(e.target.value)}
                        />
                        <Button className="h-12 rounded-xl px-6" onClick={handleJoinCouple} disabled={isProcessing || !inviteCodeInput}>
                          {isProcessing ? <Loader2 className="animate-spin" /> : "Entrar"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="apple-card border-emerald-500/30 bg-emerald-500/5 backdrop-blur-md">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Check size={32} />
                    </div>
                    <CardTitle className="text-2xl font-bold">Espaço Criado!</CardTitle>
                    <CardDescription>Compartilhe o código abaixo com seu parceiro.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-8 px-8">
                    <div className="bg-white/10 dark:bg-black/20 p-6 rounded-3xl border border-white/20 text-center relative overflow-hidden group">
                      <p className="text-4xl font-black tracking-[0.2em] font-mono text-primary animate-pulse">
                        {generatedInviteCode}
                      </p>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full hover:bg-primary/20"
                        onClick={copyToClipboard}
                      >
                        {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <Button className="w-full h-12 rounded-xl font-bold shadow-lg" onClick={() => navigate({ to: "/" })}>
                        Acessar Meu Dashboard
                        <ArrowRight size={18} className="ml-2" />
                      </Button>
                      <p className="text-[10px] text-center text-muted-foreground italic">
                        Seu parceiro aparecerá automaticamente assim que entrar com este código.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
