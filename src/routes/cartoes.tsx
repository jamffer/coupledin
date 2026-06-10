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
  Plus,
  Loader2
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
import { cn, formatCurrency } from "@/lib/utils";
import { EmptyState } from "@/components/empty-state";
import { AddCardModal } from "@/components/add-card-modal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfMonth, subMonths, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

export const Route = createFileRoute("/cartoes")({
  head: () => ({
    meta: [
      { title: "Cartões | CoupleDin" },
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
  const currentMonth = format(startOfMonth(new Date()), "yyyy-MM-01");
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*, profiles(display_name, avatar_url)")
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: cards = [], isLoading: isCardsLoading } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Calcular faturas atuais filtrando pela data de billing selecionada (selectedMonth)
      const cardBalances = transactions.reduce((acc, tx) => {
        if (tx.card_id && tx.billing_date === selectedMonth) {
          acc[tx.card_id] = (acc[tx.card_id] || 0) + Math.abs(tx.amount);
        }
        return acc;
      }, {} as Record<string, number>);

      return data.map(card => {
        const currentBill = cardBalances[card.id] || 0;

        return {
          id: card.id,
          name: card.name,
          lastDigits: card.last_four || "0000",
          brand: "Mastercard", 
          color: card.color || "card-gradient-blue",
          currentBill: currentBill,
          limitUsed: currentBill,
          totalLimit: Number(card.limit_amount),
          type: card.card_type === "Meu Cartão" ? "individual" as const : "conjunto" as const,
          owner: card.card_type === "Meu Cartão" ? "Eu" : "Casal"
        };
      });
    },
    enabled: !!user && !!transactions,
  });

  // Derivar itens da fatura das transações reais usando o billing_date
  const currentBillItems = selectedCardId 
    ? transactions
        .filter(tx => tx.card_id === selectedCardId && tx.billing_date === selectedMonth)
        .map(tx => ({
          id: tx.id,
          date: new Date(tx.date).toLocaleDateString('pt-BR'),
          description: tx.description,
          amount: Math.abs(tx.amount),
          user: tx.profiles?.display_name || tx.responsible,
          avatarUrl: tx.profiles?.avatar_url,
          category: tx.category,
          icon: CreditCard, // Fallback
          installments: '1/1'
        }))
    : [];

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
  // const currentBillItems = selectedCardId ? (bills[selectedCardId] || []) : [];

  const usagePercentage = selectedCard ? (selectedCard.limitUsed / selectedCard.totalLimit) * 100 : 0;
  
  // Calcular quebra de responsabilidade
  const jorgePays = selectedCard ? (selectedCard.type === "conjunto" ? selectedCard.currentBill / 2 : selectedCard.owner === "Jorge" ? selectedCard.currentBill : 0) : 0;
  const lilianPays = selectedCard ? (selectedCard.type === "conjunto" ? selectedCard.currentBill / 2 : selectedCard.owner === "Lilian" ? selectedCard.currentBill : 0) : 0;

  const handlePayBill = () => {
    if (!selectedCard) return;
    toast.success("Fatura paga com sucesso!", {
      description: `O pagamento de ${formatCurrency(selectedCard.currentBill)} foi registrado.`,
    });
  };

  const getCardColorStyle = (colorStr?: string) => {
    if (!colorStr) return { backgroundColor: '#737373' };
    if (colorStr.startsWith('#')) return { backgroundColor: colorStr };
    // Fallback de contenção de erros para dados legados (ex: card-gradient-blue)
    return { backgroundColor: '#737373' };
  };

  const availableMonths = [
    currentMonth,
    format(subMonths(parseISO(currentMonth), 1), "yyyy-MM-01"),
    format(subMonths(parseISO(currentMonth), 2), "yyyy-MM-01"),
  ];

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
                  <Card 
                    className={cn(
                      "relative h-64 border-none text-white shadow-xl overflow-hidden transition-all duration-300 flex flex-col justify-between p-6",
                      selectedCardId === card.id ? "ring-2 ring-primary ring-offset-4 dark:ring-offset-[#161616]" : "opacity-95 hover:opacity-100 hover:shadow-2xl"
                    )}
                    style={getCardColorStyle(card.color)}
                  >
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
                        <h3 className="text-3xl font-bold tracking-tight">{formatCurrency(card.currentBill)}</h3>
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
                        <span className="text-xs font-mono tracking-widest opacity-60">⬢⬢⬢⬢ {card.lastDigits}</span>
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
                      <div 
                        className="p-2 rounded-lg text-white"
                        style={getCardColorStyle(selectedCard.color)}
                      >
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold">Detalhamento da Fatura</CardTitle>
                        <p className="text-xs text-muted-foreground">{selectedCard.name} ⬢ ⬢⬢⬢⬢ {selectedCard.lastDigits}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="rounded-full apple-interactive font-medium min-w-[180px] justify-between">
                            <div className="flex items-center gap-2">
                              <CalendarIcon size={16} className="text-muted-foreground" />
                              <span>
                                {format(parseISO(selectedMonth), "MMMM (yyyy)", { locale: ptBR })}
                              </span>
                            </div>
                            <ChevronRight size={14} className="rotate-90 opacity-50" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="apple-card w-[180px]">
                          {availableMonths.map((m) => (
                            <DropdownMenuItem key={m} onClick={() => setSelectedMonth(m)} className="cursor-pointer capitalize">
                              {format(parseISO(m), "MMMM (yyyy)", { locale: ptBR })}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Badge variant={selectedMonth === currentMonth ? "outline" : "secondary"} className={cn(
                        "px-3 py-1 rounded-full border-none h-9 flex items-center",
                        selectedMonth === currentMonth ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"
                      )}>
                        {selectedMonth === currentMonth ? "Fatura Aberta" : "Fatura Paga"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-b border-border/40">
                      <div className="p-6 flex flex-col justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Total da Fatura</p>
                          <h3 className="text-2xl font-bold tracking-tight">{formatCurrency(selectedCard.currentBill)}</h3>
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
                                  Deseja registrar o pagamento desta fatura no valor de <span className="font-bold text-foreground">{formatCurrency(selectedCard.currentBill)}</span>?
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
                        <h3 className="text-2xl font-bold tracking-tight text-blue-600">{formatCurrency(jorgePays)}</h3>
                      </div>
                      <div className="p-6">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Lilian paga</p>
                        <h3 className="text-2xl font-bold tracking-tight text-rose-600">{formatCurrency(lilianPays)}</h3>
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
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    {item.avatarUrl && (
                                      <img src={item.avatarUrl} alt={item.user} className="w-5 h-5 rounded-full border shadow-sm" />
                                    )}
                                    <span>{item.user}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                  <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical size={16} />
                                  </Button>
                                </TableCell>
                                <TableCell className="text-right font-bold pr-6">{formatCurrency(item.amount)}</TableCell>
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
