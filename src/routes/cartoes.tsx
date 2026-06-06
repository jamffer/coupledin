import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  ChevronRight, 
  Calendar as CalendarIcon,
  ShoppingBag,
  Coffee,
  Car,
  Utensils,
  Smartphone,
  CheckCircle2,
  Clock,
  MoreVertical,
  Edit,
  FastForward,
  Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { AddCardModal } from "@/components/add-card-modal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/cartoes")({
  head: () => ({
    meta: [
      { title: "Cartões | CoupleFinance" },
      { name: "description", content: "Gerencie seus cartões de crédito e faturas." },
    ],
  }),
  component: CartoesPage,
});

type CardInfo = {
  id: string;
  name: string;
  lastDigits: string;
  brand: string;
  color: string;
  currentBill: number;
  limitUsed: number;
  totalLimit: number;
  type: "conjunto" | "individual";
  owner?: string;
};

type BillItem = {
  id: string;
  date: string;
  description: string;
  amount: number;
  totalAmount?: number;
  installments?: string;
  user: string;
  category: string;
  icon: any;
};

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

function CartoesPage() {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState("june");
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { data: cards = [], isLoading: isCardsLoading } = useQuery({
    queryKey: ["credit_cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credit_cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      return data.map(card => ({
        id: card.id,
        name: card.name,
        lastDigits: card.last_digits || "0000",
        brand: "Mastercard", // Fallback for now
        color: card.color || "card-gradient-blue",
        currentBill: 0, // Should be calculated from transactions
        limitUsed: 0,   // Should be calculated from transactions
        totalLimit: Number(card.total_limit),
        type: card.card_type === "Meu Cartão" ? "individual" as const : "conjunto" as const,
        owner: card.card_type === "Meu Cartão" ? "Eu" : "Casal"
      }));
    },
    enabled: !!user,
  });

  const [bills, setBills] = useState<Record<string, BillItem[]>>({});

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0].id);
    }
  }, [cards, selectedCardId]);

  const selectedCard = cards.find(c => c.id === selectedCardId);
  const currentBillItems = selectedCardId ? (bills[selectedCardId] || []) : [];

  const usagePercentage = selectedCard ? (selectedCard.limitUsed / selectedCard.totalLimit) * 100 : 0;
  
  // Calcular quebra de responsabilidade
  const jorgePays = selectedCard ? (selectedCard.type === "conjunto" ? selectedCard.currentBill / 2 : selectedCard.owner === "Jorge" ? selectedCard.currentBill : 0) : 0;
  const lilianPays = selectedCard ? (selectedCard.type === "conjunto" ? selectedCard.currentBill / 2 : selectedCard.owner === "Lilian" ? selectedCard.currentBill : 0) : 0;

  const handlePayBill = () => {
    if (!selectedCard) return;
    toast.success("Fatura paga com sucesso!", {
      description: `O pagamento de R$ ${selectedCard.currentBill.toLocaleString('pt-BR')} foi registrado.`,
    });
  };

  return (
    <DashboardLayout>
      <TooltipProvider>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Meus Cartões</h1>
            <p className="text-muted-foreground italic">Gerencie seus limites e faturas.</p>
          </div>
          {cards.length > 0 && (
             <AddCardModal />
          )}
        </div>

        {cards.length > 0 ? (
          <>
            {/* Visão Geral dos Cartões */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card) => (
                <motion.div 
                  key={card.id} 
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  onClick={() => setSelectedCardId(card.id)}
                  className="cursor-pointer"
                >
                  <Card className={cn(
                    "relative h-64 border-none text-white shadow-xl overflow-hidden transition-all duration-300 flex flex-col justify-between p-6",
                    card.color || "card-gradient-blue",
                    selectedCardId === card.id ? "ring-2 ring-primary ring-offset-4 dark:ring-offset-[#161616]" : "opacity-95 hover:opacity-100 hover:shadow-2xl"
                  )}>
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <CreditCard size={140} />
                    </div>
                    
                    <div className="relative z-10 flex flex-row items-center justify-between pb-0">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                          {card.type === "conjunto" ? "Conjunto" : `Individual - ${card.owner}`}
                        </span>
                        <h2 className="text-base font-bold leading-tight">{card.name}</h2>
                      </div>
                      <div className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-sm">
                        {card.brand}
                      </div>
                    </div>

                    <div className="relative z-10 space-y-4">
                      <div className="flex flex-col gap-0">
                        <span className="text-[10px] uppercase font-bold opacity-60">Fatura Atual</span>
                        <h3 className="text-3xl font-bold tracking-tight">R$ {card.currentBill.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                          <span className="opacity-60">Uso do Limite</span>
                          <span>{Math.round(card.limitUsed / card.totalLimit * 100)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full transition-all duration-500 rounded-full", (card.limitUsed / card.totalLimit * 100) > 80 ? "bg-rose-400" : "bg-white")} 
                            style={{ width: `${(card.limitUsed / card.totalLimit * 100)}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2">
                        <span className="text-xs font-mono tracking-widest opacity-60">•••• {card.lastDigits}</span>
                        {selectedCardId === card.id && (
                          <motion.div layoutId="active-indicator" className="bg-white text-black p-1 rounded-full shadow-sm">
                            <CheckCircle2 size={14} />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Detalhes da Fatura Selecionada */}
            {selectedCard && (
              <motion.div variants={itemVariants}>
                <Card className="apple-card overflow-hidden">
                  <CardHeader className="border-b border-border/40 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg text-white", selectedCard.color || "card-gradient-blue")}>
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">Detalhamento da Fatura</CardTitle>
                        <p className="text-xs text-muted-foreground">{selectedCard.name} • •••• {selectedCard.lastDigits}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="rounded-full apple-interactive font-medium min-w-[180px] justify-between">
                            <div className="flex items-center gap-2">
                              <CalendarIcon size={16} className="text-muted-foreground" />
                              <span>
                                {selectedMonth === "june" ? "Junho (Aberta)" : 
                                 selectedMonth === "may" ? "Maio (Fechada)" : 
                                 "Abril (Paga)"}
                              </span>
                            </div>
                            <ChevronRight size={14} className="rotate-90 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="apple-card w-[180px]">
                          <DropdownMenuItem onClick={() => setSelectedMonth("june")} className="cursor-pointer">
                            Junho (Aberta)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedMonth("may")} className="cursor-pointer">
                            Maio (Fechada)
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedMonth("april")} className="cursor-pointer">
                            Abril (Paga)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Badge variant={selectedMonth === "june" ? "outline" : "secondary"} className={cn(
                        "px-3 py-1 rounded-full border-none h-9 flex items-center",
                        selectedMonth === "june" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                      )}>
                        {selectedMonth === "june" ? "Fatura Aberta" : "Fatura Paga"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-b border-border/40">
                      <div className="p-6 flex flex-col justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Total da Fatura</p>
                          <h3 className="text-2xl font-bold tracking-tight">R$ {selectedCard.currentBill.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                        </div>
                        {selectedMonth === "june" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button className="mt-4 w-full rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all font-bold">
                                Pagar Fatura
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="apple-card rounded-3xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Pagamento</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Deseja registrar o pagamento desta fatura no valor de <span className="font-bold text-foreground">R$ {selectedCard.currentBill.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handlePayBill} className="rounded-full shadow-lg shadow-primary/20">
                                  Confirmar Pagamento
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                      <div className="p-6">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Jorge paga</p>
                        <h3 className="text-2xl font-bold tracking-tight text-blue-600">R$ {jorgePays.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                      </div>
                      <div className="p-6">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Lilian paga</p>
                        <h3 className="text-2xl font-bold tracking-tight text-rose-600">R$ {lilianPays.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/30 hover:bg-muted/30">
                            <TableHead className="w-[100px] pl-6">Data</TableHead>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Parcela</TableHead>
                            <TableHead>Responsável</TableHead>
                            <TableHead className="text-right pr-6 min-w-[120px]">Ações</TableHead>
                            <TableHead className="text-right pr-6">Valor</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentBillItems.length > 0 ? (
                            currentBillItems.map((item) => (
                              <TableRow key={item.id} className="group transition-colors">
                                <TableCell className="font-medium text-muted-foreground pl-6">{item.date}</TableCell>
                                <TableCell className="font-bold">{item.description}</TableCell>
                                <TableCell>{item.category}</TableCell>
                                <TableCell>{item.installments || '1/1'}</TableCell>
                                <TableCell>{item.user}</TableCell>
                                <TableCell className="text-right pr-6">
                                  <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical size={16} />
                                  </Button>
                                </TableCell>
                                <TableCell className="text-right font-bold pr-6">R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                Nenhuma compra registrada nesta fatura.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </>
        ) : isCardsLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <EmptyState 
            icon={CreditCard}
            title="Você ainda não cadastrou nenhum cartão"
            description="Organize seus limites e faturas em um só lugar."
            actionLabel="Adicionar Cartão"
            onAction={() => {}}
          >
            <AddCardModal>
              <Button className="mt-4 apple-interactive rounded-xl px-8 shadow-lg shadow-primary/20 font-bold">
                Adicionar Cartão
              </Button>
            </AddCardModal>
          </EmptyState>
        )}
        </motion.div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
