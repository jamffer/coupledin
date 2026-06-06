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
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar | CoupleFinance" },
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

  useEffect(() => {
    if (user) {
      checkProfileStatus();
    }
  }, [user]);

  const checkProfileStatus = async () => {
    if (!user) return;
    
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("couple_id")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    if (profile?.couple_id) {
      navigate({ to: "/" });
    } else {
      setAuthStep("onboarding");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Effect will handle redirection or onboarding
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
      
      // Auto-create profile record via trigger or manual insert if needed
      // For this demo, let's assume we need to create the profile record
      if (data.user) {
        await supabase.from("profiles").insert({
          id: data.user.id,
          display_name: name
        });
      }

      toast.success("Conta criada!", { description: "Verifique seu e-mail ou continue para o onboarding." });
      setAuthStep("onboarding");
    } catch (error: any) {
      toast.error("Erro ao criar conta", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCouple = async () => {
    setLoading(true);
    try {
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const { data: couple, error: coupleError } = await supabase
        .from("couples")
        .insert({ invite_code: inviteCode, name: `${name}'s Couple` })
        .select()
        .single();

      if (coupleError) throw coupleError;

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ couple_id: couple.id })
        .eq("id", user!.id);

      if (profileError) throw profileError;

      setGeneratedInviteCode(inviteCode);
      toast.success("Espaço criado!", { description: "Compartilhe o código com seu parceiro." });
    } catch (error: any) {
      toast.error("Erro ao criar espaço", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinCouple = async () => {
    if (!inviteCodeInput) return;
    setLoading(true);
    try {
      const { data: couple, error: coupleError } = await supabase
        .from("couples")
        .select("id")
        .eq("invite_code", inviteCodeInput.toUpperCase())
        .single();

      if (coupleError || !couple) throw new Error("Código de convite inválido.");

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ couple_id: couple.id })
        .eq("id", user!.id);

      if (profileError) throw profileError;

      toast.success("Vinculado com sucesso!", { description: "Bem-vindo ao espaço do casal." });
      navigate({ to: "/" });
    } catch (error: any) {
      toast.error("Erro ao entrar", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedInviteCode);
    setCopied(true);
    toast.success("Código copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoogleSignIn = async () => {
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
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary text-primary-foreground shadow-xl mb-4">
                  <Heart size={32} className="fill-current" />
                </div>
                <h1 className="text-3xl font-black tracking-tight text-foreground">CoupleFinance</h1>
                <p className="text-muted-foreground italic">Seu patrimônio, sonhos e planos em harmonia.</p>
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
                <h1 className="text-2xl font-black tracking-tight text-foreground">Quase lá, {name}!</h1>
                <p className="text-muted-foreground">Como você quer começar no CoupleFinance?</p>
              </div>

              {!generatedInviteCode ? (
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
                        <Button className="h-12 rounded-xl px-6" onClick={handleJoinCouple} disabled={loading || !inviteCodeInput}>
                          {loading ? <Loader2 className="animate-spin" /> : "Entrar"}
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
