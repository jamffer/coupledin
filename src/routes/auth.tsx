import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Heart, 
  Mail, 
  Lock, 
  UserPlus, 
  ArrowRight, 
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate({ to: "/" });
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
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            invite_code: inviteCode
          }
        }
      });
      if (error) throw error;
      toast.success("Conta criada!", { description: "Verifique seu e-mail para confirmar o cadastro." });
    } catch (error: any) {
      toast.error("Erro ao criar conta", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
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
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-primary text-primary-foreground shadow-xl mb-4">
            <Heart size={32} className="fill-current" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-foreground">Finanças a Dois</h1>
          <p className="text-muted-foreground italic">Seu patrimônio, sonhos e planos em harmonia.</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 apple-interactive p-1 rounded-2xl h-12">
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
                  <div className="space-y-2">
                    <Label htmlFor="invite" className="flex items-center gap-1.5">
                      Código de Convite
                      <AlertCircle size={14} className="text-muted-foreground" />
                    </Label>
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <Input 
                        id="invite" 
                        placeholder="Opcional" 
                        className="pl-10 h-12 rounded-xl"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground italic">Seu parceiro já usa o app? Peça o código dele.</p>
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
    </div>
  );
}
