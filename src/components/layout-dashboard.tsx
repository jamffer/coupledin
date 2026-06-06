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
  Plus
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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar z-50 shadow-xl transition-colors duration-300">
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
        <div className="min-h-screen flex w-full relative bg-background overflow-x-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-300">
            <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-40 transition-colors">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div>
                <h2 className="text-xs font-medium text-muted-foreground italic">Bom dia,</h2>
                <h1 className="text-lg font-bold text-foreground">O casal preferido!</h1>
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

              <DialogTrigger asChild className="md:hidden">
                <Button size="icon" variant="ghost" className="rounded-full apple-interactive border-white/40 active:scale-95 transition-all">
                  <PlusCircle size={22} />
                </Button>
              </DialogTrigger>
              
              <div className="flex -space-x-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="border-2 border-white/50 dark:border-black/50 w-8 h-8 md:w-10 md:h-10 shadow-sm cursor-pointer hover:scale-110 transition-transform z-10">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                      <AvatarFallback>JO</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent><p>Perfil do Jorge</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="border-2 border-white/50 dark:border-black/50 w-8 h-8 md:w-10 md:h-10 shadow-sm cursor-pointer hover:scale-110 transition-transform">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bella" />
                      <AvatarFallback>LI</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent><p>Perfil da Lilian</p></TooltipContent>
                </Tooltip>
              </div>
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
