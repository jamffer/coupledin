import { createFileRoute, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { 
  LayoutDashboard, 
  ReceiptText, 
  CreditCard, 
  TrendingUp, 
  Target,
  Settings,
  PlusCircle,
  Menu,
  Moon,
  Sun,
  Plus,
  Camera,
  User as UserIcon,
  Check
} from "lucide-react";
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
      <SidebarHeader className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <TrendingUp size={20} />
          </div>
          <span className="group-data-[collapsible=icon]:hidden">CoupleFinance</span>
        </div>
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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isNewRecordOpen, setIsNewRecordOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { userNames, userAvatars, updateUserProfile } = useFinanceStore();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<"Jorge" | "Lilian">("Jorge");
  const [tempName, setTempName] = useState("");
  const [tempAvatar, setTempAvatar] = useState("");
  
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
    if (isProfileOpen) {
      setTempName(userNames[currentUser]);
      setTempAvatar(userAvatars[currentUser]);
    }
  }, [isProfileOpen, currentUser, userNames, userAvatars]);

  const handleSaveProfile = () => {
    updateUserProfile(currentUser, tempName, tempAvatar);
    toast.success("Perfil atualizado com sucesso!");
    setIsProfileOpen(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
        setProfile(data);
      });
    }
  }, [user]);

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

  return (
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full relative bg-background overflow-x-hidden isolate">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-300">
            <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-40 transition-colors">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <div>
                  <h2 className="text-xs font-medium text-muted-foreground italic">Bom dia,</h2>
                  <h1 className="text-lg font-bold text-foreground">
                    {profile?.display_name || user?.email?.split('@')[0] || "Usuário"}
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
                          <DialogTrigger asChild onClick={() => setCurrentUser("Jorge")}>
                            <Avatar className="border-2 border-white/50 dark:border-black/50 w-8 h-8 md:w-10 md:h-10 shadow-sm cursor-pointer hover:scale-110 transition-transform z-10">
                              <AvatarImage src={userAvatars.Jorge} />
                              <AvatarFallback>JO</AvatarFallback>
                            </Avatar>
                          </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent><p>Perfil de {userNames.Jorge}</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <DialogTrigger asChild onClick={() => setCurrentUser("Lilian")}>
                            <Avatar className="border-2 border-white/50 dark:border-black/50 w-8 h-8 md:w-10 md:h-10 shadow-sm cursor-pointer hover:scale-110 transition-transform">
                              <AvatarImage src={userAvatars.Lilian} />
                              <AvatarFallback>LI</AvatarFallback>
                            </Avatar>
                          </DialogTrigger>
                        </TooltipTrigger>
                        <TooltipContent><p>Perfil de {userNames.Lilian}</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  
                  <DialogContent className="apple-card dark:bg-[#1A1A1A] border-border/40 sm:max-w-md overflow-hidden">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-black tracking-tight text-center pt-4">Editar Perfil</DialogTitle>
                      <DialogDescription className="text-center">
                        Personalize como você aparece no CoupleFinance.
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex flex-col items-center gap-8 py-8">
                      {/* Avatar Upload Section */}
                      <div className="relative group">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-black shadow-2xl ring-2 ring-primary/20 relative">
                          {tempAvatar ? (
                            <img src={tempAvatar} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                              <UserIcon size={40} />
                            </div>
                          )}
                        </div>
                        <label 
                          htmlFor="avatar-upload" 
                          className="absolute bottom-0 right-0 p-2.5 bg-primary text-primary-foreground rounded-full shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all ring-4 ring-background"
                        >
                          <Camera size={18} />
                          <input 
                            id="avatar-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleAvatarChange}
                          />
                        </label>
                      </div>

                      {/* Name Input Section */}
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

                    <DialogFooter className="px-4 pb-4">
                      <Button 
                        className="w-full h-12 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 apple-interactive border-none active:scale-95 transition-all gap-2"
                        onClick={handleSaveProfile}
                      >
                        <Check size={18} />
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
      </SidebarProvider>
    </TooltipProvider>
  );
}
