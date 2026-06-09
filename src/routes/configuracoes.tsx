import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileAvatar } from "@/components/profile-avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  RadioGroup, 
  RadioGroupItem 
} from "@/components/ui/radio-group";
import { 
  UserPlus, 
  Calendar, 
  Settings2, 
  Download, 
  Bell, 
  Scale, 
  PiggyBank,
  Heart,
  ChevronRight,
  Info,
  ClipboardCopy,
  Check,
  PlusCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { useFinanceStore } from "@/hooks/use-finance-store";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "ConfiguraÃ§Ãµes | CoupleDin" },
      { name: "description", content: "Gerencie as regras financeiras e o perfil do casal." },
    ],
  }),
  component: ConfiguracoesPage,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

function ConfiguracoesPage() {
  const { incomeJorge, incomeLilian, setIncomes } = useFinanceStore();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { profile, partnerProfile, isLoading: isProfileLoading } = useProfile();
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      toast.success("CÃ³digo copiado para a Ã¡rea de transferÃªncia!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) {
      supabase.rpc("get_my_invite_code").then(({ data }) => {
        setInviteCode(data as string);
      });
    }
  }, [user]);
  const [divisionModel, setDivisionModel] = useState("proportional");
  const [percentageA, setPercentageA] = useState(60);
  const [percentageB, setPercentageB] = useState(40);

  useEffect(() => {
    if (divisionModel === "proportional") {
      const total = incomeJorge + incomeLilian;
      if (total > 0) {
        setPercentageA(Math.round((incomeJorge / total) * 100));
        setPercentageB(Math.round((incomeLilian / total) * 100));
      }
    } else {
      setPercentageA(50);
      setPercentageB(50);
    }
  }, [divisionModel, incomeJorge, incomeLilian]);

  return (
    <DashboardLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 pb-10"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">ConfiguraÃ§Ãµes</h1>
          <p className="text-muted-foreground italic">Controle total sobre as regras financeiras do casal.</p>
        </div>

        {/* Section 1: Perfil do Casal */}
        <motion.div variants={itemVariants}>
          <Card className="apple-card overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex -space-x-6">
                   <ProfileAvatar 
                     url={profile?.avatar_url || null} 
                     name={profile?.display_name || "ME"} 
                     userId={user?.id || undefined}
                     onUpdate={() => {}} // Now handled via React Query invalidation in the modal
                   />
                  <div className="w-24 h-24 rounded-full apple-glass border-4 border-white dark:border-[#1A1A1A] flex items-center justify-center relative z-10">
                    <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Heart size={32} className="fill-primary" />
                    </div>
                  </div>
                  {partnerProfile ? (
                    <Avatar className="w-24 h-24 border-4 border-white dark:border-[#1A1A1A] shadow-xl ring-1 ring-muted/20">
                      <AvatarImage src={partnerProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partnerProfile.display_name || "partner"}`} />
                      <AvatarFallback>{partnerProfile.display_name?.substring(0, 2).toUpperCase() || "PA"}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-dashed border-primary/40 bg-primary/5 flex items-center justify-center relative z-0">
                      <PlusCircle size={32} className="text-primary/40" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                  <h2 className="text-2xl font-bold">
                    {profile?.display_name || "VocÃª"}
                    {partnerProfile?.display_name ? ` & ${partnerProfile.display_name}` : ""}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5 bg-muted dark:bg-muted/10 px-3 py-1 rounded-full">
                      <Calendar size={14} />
                      InÃ­cio: {profile?.created_at ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(profile.created_at)) : '...'}
                    </div>
                    {partnerProfile ? (
                      <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full font-medium">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Conta Conectada
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-3 py-1 rounded-full font-medium">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        Aguardando parceiro(a)
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="rounded-full gap-2 px-6 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all apple-interactive dark:border-white/10 active:scale-95" onClick={() => setShowInviteDialog(true)}>
                    <UserPlus size={18} />
                    Convidar Parceiro(a)
                  </Button>
                  {inviteCode && (
                    <div className="text-center md:text-left">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">CÃ³digo: <span className="text-primary font-mono">{inviteCode}</span></p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Invite Code Section */}
        <motion.div variants={itemVariants}>
          <Card className="apple-card overflow-hidden border-primary/20 bg-primary/5">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="text-lg font-bold flex items-center gap-2 justify-center md:justify-start">
                    <UserPlus size={20} className="text-primary" />
                    CÃ³digo de Convite do Casal
                  </h3>
                  <p className="text-sm text-muted-foreground italic">
                    Compartilhe este cÃ³digo para conectar seu parceiro(a) ao seu espaÃ§o.
                  </p>
                </div>
                
                <div className="flex items-center gap-3 bg-white dark:bg-black/40 p-2 pl-6 rounded-2xl border border-primary/20 shadow-inner group">
                  <span className="text-2xl font-black font-mono tracking-widest text-primary uppercase">
                    {inviteCode || "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-xl hover:bg-primary/10 transition-all active:scale-95"
                    onClick={handleCopyCode}
                  >
                    {copied ? (
                      <Check size={20} className="text-emerald-500" />
                    ) : (
                      <ClipboardCopy size={20} className="text-primary" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 2: Regras de DivisÃ£o */}
        <motion.div variants={itemVariants}>
          <Card className="apple-card overflow-hidden">
            <CardHeader className="border-b border-border/40 pb-6">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <Scale size={20} />
                </div>
                <CardTitle>Regras de DivisÃ£o de Despesas</CardTitle>
              </div>
              <CardDescription>Defina como as despesas marcadas como "Conjuntas" serÃ£o divididas.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <RadioGroup 
                value={divisionModel} 
                onValueChange={setDivisionModel}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div>
                  <RadioGroupItem value="fixed" id="fixed" className="peer sr-only" />
                  <Label
                    htmlFor="fixed"
                    className={cn(
                      "flex flex-col items-center justify-between rounded-2xl border-2 border-border p-6 hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all cursor-pointer h-full dark:bg-card dark:border-white/5",
                      divisionModel === "fixed" && "border-primary bg-primary/5 dark:bg-primary/10 dark:border-primary/50"
                    )}
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 peer-data-[state=checked]:bg-primary/20">
                      <Scale size={24} className={cn(divisionModel === "fixed" ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="font-bold">DivisÃ£o 50/50</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">Cada um paga metade exata das contas, independente da renda.</p>
                    </div>
                  </Label>
                </div>

                <div>
                  <RadioGroupItem value="proportional" id="proportional" className="peer sr-only" />
                  <Label
                    htmlFor="proportional"
                    className={cn(
                      "flex flex-col items-center justify-between rounded-2xl border-2 border-border p-6 hover:bg-muted/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-all cursor-pointer h-full dark:bg-card dark:border-white/5",
                      divisionModel === "proportional" && "border-primary bg-primary/5 dark:bg-primary/10 dark:border-primary/50"
                    )}
                  >
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <PiggyBank size={24} className={cn(divisionModel === "proportional" ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="font-bold">DivisÃ£o Proporcional</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">A divisÃ£o Ã© calculada com base na renda mensal de cada um.</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {divisionModel === "proportional" && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 pt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="incomeA" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Renda Mensal de {profile?.display_name?.split(' ')[0] || "VocÃª"}</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</span>
                        <Input 
                          id="incomeA" 
                          type="number" 
                           value={incomeJorge} 
                           onChange={(e) => setIncomes(Number(e.target.value), incomeLilian)}
                          className="pl-10 h-12 rounded-xl border-muted focus:border-primary/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="incomeB" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Renda Mensal de {partnerProfile?.display_name?.split(' ')[0] || "Parceiro(a)"}</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">R$</span>
                        <Input 
                          id="incomeB" 
                          type="number" 
                          value={incomeLilian} 
                          onChange={(e) => setIncomes(incomeJorge, Number(e.target.value))}
                          className="pl-10 h-12 rounded-xl border-muted focus:border-primary/50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 rounded-2xl p-6 md:p-8 space-y-6">
                    <div className="flex justify-between items-end mb-2">
                      <div className="space-y-1">
                        <p className="text-sm font-bold">Resultado do CÃ¡lculo</p>
                        <p className="text-xs text-muted-foreground italic">{profile?.display_name?.split(' ')[0] || "VocÃª"} paga {percentageA}% / {partnerProfile?.display_name?.split(' ')[0] || "Parceiro(a)"} paga {percentageB}%</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-primary" />
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">{profile?.display_name?.split(' ')[0] || "VocÃª"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-rose-400" />
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">{partnerProfile?.display_name?.split(' ')[0] || "Parceiro(a)"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="h-4 w-full bg-muted dark:bg-black rounded-full overflow-hidden flex shadow-inner border-none">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentageA}%` }}
                        className="h-full bg-primary" 
                      />
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentageB}%` }}
                        className="h-full bg-rose-400" 
                      />
                    </div>

                    <div className="flex items-start gap-3 bg-muted dark:bg-card p-4 rounded-xl border-border">
                      <Info size={16} className="text-primary mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Este percentual serÃ¡ aplicado automaticamente em todas as transaÃ§Ãµes marcadas como <span className="font-bold text-foreground">"DivisÃ£o Proporcional"</span> na tela de lanÃ§amentos.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 3: ConexÃµes e ExportaÃ§Ã£o */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="apple-card h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Bell size={20} />
                  </div>
                  <CardTitle>PreferÃªncias e Alertas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-2 hover:bg-primary/10 rounded-xl transition-colors group cursor-pointer">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold group-hover:text-primary transition-colors">NotificaÃ§Ãµes de Fatura</p>
                    <p className="text-xs text-muted-foreground italic dark:text-muted-foreground">Lembrar dias antes do vencimento.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-primary/10 rounded-xl transition-colors group cursor-pointer">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold group-hover:text-primary transition-colors">Alertas de OrÃ§amento</p>
                    <p className="text-xs text-muted-foreground italic dark:text-muted-foreground">Avisar quando passar de 80% do limite.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-primary/10 rounded-xl transition-colors group cursor-pointer">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold group-hover:text-primary transition-colors">RelatÃ³rio Semanal</p>
                    <p className="text-xs text-muted-foreground italic dark:text-muted-foreground">Resumo por e-mail toda segunda-feira.</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="apple-card h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Download size={20} />
                  </div>
                  <CardTitle>Dados e SeguranÃ§a</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-between h-14 px-6 rounded-2xl border-muted hover:bg-primary/5 hover:border-primary/30 transition-all group dark:border-white/5 apple-interactive dark:bg-card active:scale-[0.98]">
                  <div className="flex items-center gap-3">
                    <Download size={18} className="text-muted-foreground group-hover:text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-bold">Exportar Dados (CSV)</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">HistÃ³rico completo</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </Button>
                
                <Button variant="outline" className="w-full justify-between h-14 px-6 rounded-2xl border-muted hover:bg-primary/5 hover:border-primary/30 transition-all group dark:border-white/5 apple-interactive dark:bg-card active:scale-[0.98]">
                  <div className="flex items-center gap-3">
                    <Settings2 size={18} className="text-muted-foreground group-hover:text-primary" />
                    <div className="text-left">
                      <p className="text-sm font-bold">Privacidade da Conta</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">GestÃ£o de acessos</p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </Button>

                <div className="pt-4">
                  <Button variant="ghost" className="w-full text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-2xl font-bold text-xs uppercase tracking-widest">
                    Desconectar Conta do Casal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        {/* Invite Dialog */}
        <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
          <DialogContent className="apple-card">
            <DialogHeader>
              <DialogTitle>Convidar Parceiro(a)</DialogTitle>
              <DialogDescription>
                Compartilhe o cÃ³digo abaixo com seu parceiro para que ele(a) possa se conectar ao seu espaÃ§o.
              </DialogDescription>
            </DialogHeader>
            <div className="py-8 text-center">
              <div className="bg-muted p-6 rounded-2xl mb-4">
                <p className="text-4xl font-black tracking-widest font-mono text-primary animate-pulse uppercase">
                  {inviteCode || "Carregando..."}
                </p>
              </div>
              <Button 
                className="w-full h-12 rounded-xl font-bold gap-2" 
                onClick={handleCopyCode}
              >
                {copied ? <Check size={20} /> : <ClipboardCopy size={20} />}
                {copied ? "Copiado!" : "Copiar CÃ³digo"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
}
