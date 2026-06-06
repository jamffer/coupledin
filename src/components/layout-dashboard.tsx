import { createFileRoute, Link, useRouterState } from "@tanstack/react-router";
import { 
  LayoutDashboard, 
  ReceiptText, 
  CreditCard, 
  TrendingUp, 
  Target,
  Settings,
  PlusCircle,
  Menu
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
import { ReactNode } from "react";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Lançamentos", url: "/transacoes", icon: ReceiptText },
  { title: "Cartões", url: "/cartoes", icon: CreditCard },
  { title: "Investimentos", url: "/investimentos", icon: TrendingUp },
  { title: "Metas", url: "/investimentos", icon: Target },
  { title: "Relatórios", url: "/relatorios", icon: ReceiptText },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const currentPath = useRouterState({
    select: (router) => router.location.pathname,
  });

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="h-16 flex items-center px-6">
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
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white relative">
        {/* Apple-style background gradient that follows scroll */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-white to-rose-500/5 opacity-50" />
          <div className="absolute top-0 left-0 right-0 h-screen bg-linear-to-b from-white via-transparent to-transparent" />
        </div>

        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          <header className="h-16 flex items-center justify-between px-4 md:px-8 border-b border-border/10 bg-white/40 backdrop-blur-xl sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="md:hidden" />
              <div>
                <h2 className="text-xs font-medium text-muted-foreground italic">Bom dia,</h2>
                <h1 className="text-lg font-bold text-foreground">O casal preferido!</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-3 md:gap-6">
              <Button size="sm" className="hidden md:flex gap-2 rounded-full shadow-sm hover:shadow-md transition-all bg-primary/80 backdrop-blur-sm border border-white/20">
                <PlusCircle size={18} />
                Novo Registro
              </Button>
              <Button size="icon" variant="ghost" className="md:hidden rounded-full">
                <PlusCircle size={22} />
              </Button>
              
              <div className="flex -space-x-2">
                <Avatar className="border-2 border-white/50 w-8 h-8 md:w-10 md:h-10 shadow-sm">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                  <AvatarFallback>JO</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-white/50 w-8 h-8 md:w-10 md:h-10 shadow-sm">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bella" />
                  <AvatarFallback>LI</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
