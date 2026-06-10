import { createFileRoute, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { 
  LayoutDashboard, 
  ReceiptText, 
  CreditCard, 
  TrendingUp, 
  Target,
  Settings,
  PlusCircle,
  Moon,
  Sun,
  Plus,
  Camera,
  User as UserIcon,
  Check,
  AlertCircle,
  Loader2,
  Copy,
  LogOut
} from "lucide-react";
import { ProfileAvatar } from "./profile-avatar";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFinanceStore } from "@/hooks/use-finance-store";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { supabase } from "@/integrations/supabase/client";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Lançamentos", url: "/transacoes", icon: ReceiptText },
  { title: "Cartões", url: "/cartoes", icon: CreditCard },
  { title: "Investimentos", url: "/investimentos", icon: TrendingUp },
  { title: "Metas", url: "/metas", icon: Target },
  { title: "Relatórios", url: "/relatorios", icon: ReceiptText },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar z-[100] shadow-xl transition-all duration-300 pointer-events-auto">
      <SidebarHeader className="h-16 flex items-center justify-start px-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-200">
          <img src="/logo-coupledin.png" alt="Logo CoupleDin" className="h-8 w-auto object-contain" />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">Menu</SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={currentPath === item.url}
                    className="rounded-xl transition-all duration-200"
                  >
                    <Link to={item.url} className="flex items-center gap-3 py-6">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const { userNames, userAvatars } = useFinanceStore();
  const { user, signOut } = useAuth();
  const { profile, partnerProfile, isLoading: isProfileLoading } = useProfile();
  const [tempName, setTempName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showInviteDialogInLayout, setShowInviteDialogInLayout] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const navigate = useNavigate();
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    if (isProfileOpen && profile) {
      setTempName(profile.display_name || "");
    }
  }, [isProfileOpen, profile]);

  const handleSaveProfile = async () => {
    if (!tempName.trim()) {
      toast.error("Por favor, insira um nome.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          display_name: tempName.trim()
        })
        .eq("id", user?.id as string);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Perfil atualizado com sucesso!");
      setIsProfileOpen(false);
    } catch (error: any) {
      toast.error("Erro ao atualizar perfil: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (user && profile) {
      if (!profile.display_name) {
        setIsNameModalOpen(true);
      }
      
      supabase.rpc("get_my_invite_code").then(({ data: code }) => {
        setInviteCode(code as string);
      });
    }
  }, [user, profile]);

  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      toast.success("Código copiado!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveName = async () => {
    if (!tempName.trim()) {
      toast.error("Por favor, insira um nome.");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: tempName.trim() })
        .eq("id", user?.id as string);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      setIsNameModalOpen(false);
      toast.success("Nome salvo com sucesso!");
    } catch (error: any) {
      toast.error("Erro ao salvar nome: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalScroll > 0) {
        setScrollProgress(currentScroll / totalScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    let baseGreeting = "Bom dia";
    if (hour >= 12 && hour < 18) baseGreeting = "Boa tarde";
    if (hour >= 18 || hour < 5) baseGreeting = "Boa noite";

    if (!profile?.display_name) return baseGreeting;

    const firstName = profile.display_name.split(' ')[0];
    
    if (partnerProfile?.display_name) {
      const partnerFirstName = partnerProfile.display_name.split(' ')[0];
      return `${baseGreeting}, ${firstName} e ${partnerFirstName}!`;
    }

    return `${baseGreeting}, ${firstName}!`;
  };

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full relative bg-background overflow-x-hidden isolate">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-300">
            <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-40 transition-colors">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <Link to="/" className="md:hidden flex items-center hover:opacity-70 transition-opacity duration-200 shrink-0">
                  <img src="/logo-coupledin.png" alt="Logo CoupleDin" className="h-7 w-auto object-contain" />
                </Link>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-foreground truncate">
                    {getGreeting()}
                  </h1>
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:gap-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={toggleDarkMode}
                      className="rounded-full apple-interactive border-white/40 active:scale-95 transition-all"
                    >
                      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Alternar para Modo {isDarkMode ? 'Claro' : 'Escuro'}</p>
                  </TooltipContent>
                </Tooltip>

                <Dialog open={isNewRecordOpen} onOpenChange={setIsNewRecordOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button size="sm" className="hidden md:flex gap-2 rounded-full shadow-md apple-interactive border-white/40 active:scale-95 transition-all">
                          <Plus size={18} />
                          Novo Registro
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Adicionar nova transação</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <DialogContent className="apple-card dark:bg-[#1A1A1A] border-border/40">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold">Novo Registro</DialogTitle>
                      <DialogDescription>
                        Adicione uma nova transação rapidamente ou vá para a página detalhada.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="desc" className="text-right font-medium">Descrição</Label>
                        <Input id="desc" placeholder="Ex: Mercado" className="col-span-3 rounded-xl apple-interactive dark:bg-black/20" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="valor" className="text-right font-medium">Valor</Label>
                        <Input id="valor" type="number" placeholder="0,00" className="col-span-3 rounded-xl apple-interactive dark:bg-black/20" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tipo" className="text-right font-medium">Tipo</Label>
                        <Select defaultValue="saida">
                          <SelectTrigger id="tipo" className="col-span-3 rounded-xl apple-interactive dark:bg-black/20">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent className="apple-card">
                            <SelectItem value="entrada">Entrada</SelectItem>
                            <SelectItem value="saida">Saída</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button variant="ghost" className="rounded-xl active:scale-95 transition-all" onClick={() => navigate({ to: '/transacoes' })}>
                        Ir para Lançamentos
                      </Button>
                      <Button className="rounded-xl apple-interactive border-none px-8 active:scale-95 transition-all" onClick={() => {
                        toast.success("Registro adicionado!");
                        setIsNewRecordOpen(false);
                      }}>
                        Salvar
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                  <div className="flex items-center gap-3">
                    <DialogTrigger asChild className="md:hidden">
                      <Button size="icon" variant="ghost" className="rounded-full apple-interactive border-white/40 active:scale-95 transition-all">
                        <PlusCircle size={22} />
                      </Button>
                    </DialogTrigger>
                    
                    <div className="flex -space-x-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DialogTrigger asChild onClick={() => {
                            setTempName(profile?.display_name || "");
                          }}>
                            <Avatar className="border-2 border-white/50 dark:border-black/50 w-8 h-8 md:w-10 md:h-10 shadow-sm cursor-pointer hover:scale-110 transition-transform z-10">
                              <AvatarImage src={profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.display_name || "user"}`} />
                              <AvatarFallback>{profile?.display_name?.substring(0, 2).toUpperCase() || "ME"}</AvatarFallback>
                            </Avatar>
                          </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent><p>Seu Perfil ({profile?.display_name || "Configurar"})</p></TooltipContent>
                      </Tooltip>
                      
                      {partnerProfile ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Avatar className="border-2 border-white/50 dark:border-black/50 w-8 h-8 md:w-10 md:h-10 shadow-sm transition-transform">
                              <AvatarImage src={partnerProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partnerProfile.display_name || "partner"}`} />
                              <AvatarFallback>{partnerProfile.display_name?.substring(0, 2).toUpperCase() || "PA"}</AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent><p>Perfil de {partnerProfile.display_name}</p></TooltipContent>
                        </Tooltip>
                      ) : (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              onClick={() => navigate({ to: '/invite' })}
                              className="border-2 border-dashed border-primary/40 bg-primary/5 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-all active:scale-95"
                            >
                              <Plus size={16} className="text-primary" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-center space-y-1">
                              <p className="font-bold">Aguardando convite</p>
                              <p className="text-[10px] text-muted-foreground italic">Clique para gerenciar o convite</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                  
                  <DialogContent className="apple-card dark:bg-[#1A1A1A] border-border/40 sm:max-w-md overflow-hidden">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black tracking-tight text-center pt-4">Editar Perfil</DialogTitle>
                      <DialogDescription className="text-center">
                        Personalize como você aparece no CoupleDin.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex flex-col items-center gap-8 py-8">
                      <ProfileAvatar 
                        url={profile?.avatar_url || null} 
                        name={profile?.display_name || "ME"} 
                        userId={user?.id || undefined}
                        onUpdate={() => {}}
                        className="w-32 h-32 scale-110"
                      />
                      
                      <div className="w-full space-y-2 px-4">
                        <Label htmlFor="profile-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                          Seu Nome
                        </Label>
                        <Input 
                          id="profile-name" 
                          value={tempName} 
                          onChange={(e) => setTempName(e.target.value)}
                          placeholder="Como quer ser chamado?" 
                          className="h-12 text-lg font-medium rounded-2xl border-border/40 bg-muted/30 focus-visible:ring-primary/20 apple-interactive"
                        />
                      </div>
                    </div>

                    <DialogFooter className="flex-col sm:flex-row gap-3 px-4 pb-4">
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          signOut();
                          setIsProfileOpen(false);
                        }}
                        className="rounded-2xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 gap-2 order-2 sm:order-1 h-12"
                      >
                        <LogOut size={18} />
                        Sair da Conta
                      </Button>
                      <Button 
                        className="flex-1 h-12 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 apple-interactive border-none active:scale-95 transition-all gap-2 order-1 sm:order-2"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check size={18} />}
                        Salvar Alterações
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </header>
            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
              {children}
            </main>
          </div>
        </div>

        {/* Modal obrigatório para definir o nome */}
        <Dialog open={isNameModalOpen} onOpenChange={(open) => {
          if (!open && !profile?.display_name) {
            toast.error("Você precisa definir um nome para continuar.");
            return;
          }
          setIsNameModalOpen(open);
        }}>
          <DialogContent className="apple-card dark:bg-[#1A1A1A] border-border/40 sm:max-w-md pointer-events-auto z-[1000]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight text-center pt-4">Bem-vindo(a)!</DialogTitle>
              <DialogDescription className="text-center">
                Como você gostaria de ser chamado(a)? Precisamos disso para personalizar sua experiência.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-6 py-6 px-4">
              <div className="space-y-2">
                <Label htmlFor="mandatory-name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                  Seu Nome
                </Label>
                <Input 
                  id="mandatory-name" 
                  value={tempName} 
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Digite seu nome ou apelido" 
                  className="h-14 text-xl font-medium rounded-2xl border-border/40 bg-muted/30 focus-visible:ring-primary/20 apple-interactive"
                  autoFocus
                />
              </div>
              <Button 
                className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 apple-interactive border-none active:scale-95 transition-all gap-2"
                onClick={handleSaveName}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    Começar a usar
                    <Check size={20} />
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Modal de Convite (quando clica no parceiro vazio) */}
        <Dialog open={showInviteDialogInLayout} onOpenChange={setShowInviteDialogInLayout}>
          <DialogContent className="apple-card dark:bg-[#1A1A1A] border-border/40 sm:max-w-md pointer-events-auto z-[1000]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight text-center pt-4">Convidar Parceiro(a)</DialogTitle>
              <DialogDescription className="text-center">
                Compartilhe o código abaixo para que seu parceiro(a) possa se conectar a este espaço.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-6 py-8 px-4">
              <div className="w-full flex items-center gap-3 bg-white dark:bg-black/40 p-2 pl-6 rounded-2xl border border-primary/20 shadow-inner group">
                <span className="flex-1 text-2xl font-black font-mono tracking-widest text-primary uppercase text-center">
                  {inviteCode || "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl hover:bg-primary/10 transition-all active:scale-95 shrink-0"
                  onClick={handleCopyCode}
                >
                  {copied ? (
                    <Check size={20} className="text-emerald-500" />
                  ) : (
                    <Copy size={20} className="text-primary" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center italic">
                O seu parceiro(a) deve escolher "Ingressar em um espaço" e inserir este código no Onboarding.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarProvider>
    </TooltipProvider>
  );
}