import React, { useEffect, useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "@/hooks/use-profile";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, 
  Filter, 
  PlusCircle,
  TrendingUp,
  HelpCircle,
  Users,
  Loader2,
  MoreVertical,
  Edit,
  Trash2,
  Receipt
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { TooltipProvider } from "@/components/ui/tooltip";

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
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { parseTransactionFromText, type ParsedTransaction } from "@/lib/transactions.functions";
import { useFinanceStore, CATEGORY_ICONS, DIVISION_ICONS, type Transaction } from "@/hooks/use-finance-store";
import { supabase } from "@/integrations/supabase/client";
import { EmptyState } from "@/components/empty-state";
import { formatCurrency } from "@/lib/utils";

export const Route = createFileRoute("/transacoes")({
  head: () => ({
    meta: [
      { title: "Lançamentos | CoupleFinance" },
      { name: "description", content: "Gerencie as transações do casal." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => {
    return {
      month: (search.month as string) || "june",
      category: (search.category as string) || "all-cats",
      type: (search.type as string) || "all-types",
      responsible: (search.responsible as string) || "both",
    }
  },
  component: TransactionsPage,
});

function formatDate(iso: string): string {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const dateObj = new Date(iso);
  const d = dateObj.getUTCDate();
  const m = dateObj.getUTCMonth();
  const y = dateObj.getUTCFullYear();
  return `${String(d).padStart(2, "0")} ${months[m]}, ${y}`;
}

function buildTransaction(parsed: ParsedTransaction, id: string, userId: string, coupleId: string): Transaction {
  return {
    id,
    date: formatDate(parsed.date),
    description: parsed.description,
    category: parsed.category,
    amount: (parsed.type === "Entrada" ? 1 : -1) * Math.abs(parsed.amount),
    type: parsed.type,
    responsible: parsed.responsible as string,
    division: parsed.division as string,
    user_id: userId,
    couple_id: coupleId,
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function TransactionsPage() {
  const [smartInput, setSmartInput] = useState("");
  const navigate = useNavigate();
  const search = useSearch({ from: "/transacoes" });
  const { user, loading: authLoading } = useAuth();
  const { profile, isLoading: isProfileLoading } = useProfile();
  const queryClient = useQueryClient();
  const { transactions, addTransaction, updateTransaction, deleteTransaction, userAvatars, setTransactions } = useFinanceStore();

  const { data: cards = [] } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.couple_id,
  });


  // Fetch transactions with React Query
  const { data: dbTransactions = [], isLoading: isTxsLoading } = useQuery({
    queryKey: ["transactions", profile?.couple_id],
    queryFn: async () => {
      if (!profile?.couple_id) return [];
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("couple_id", profile.couple_id)
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.couple_id,
  });

  // Keep store in sync with React Query data for other components that might still use the store
  useEffect(() => {
    if (dbTransactions.length > 0) {
      setTransactions(dbTransactions as any);
    }
  }, [dbTransactions, setTransactions]);

  // Real-time subscription to invalidate React Query cache
  useEffect(() => {
    if (profile?.couple_id) {
      const channel = supabase
        .channel("transactions-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "transactions",
            filter: `couple_id=eq.${profile.couple_id}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["cards"] });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile?.couple_id, queryClient]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, authLoading]);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [txToDelete, setTxToDelete] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedTransaction | null>(null);

  const [formData, setFormData] = useState<Partial<Transaction & { card_id?: string }>>({
    description: "",
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: "Outros",
    responsible: "Jorge",
    division: "Conjunta 50/50",
    type: "Saída",
    card_id: undefined
  });

  const filters = {
    month: search.month,
    category: search.category,
    type: search.type,
    responsible: search.responsible
  };

  const setFilters = (newFilters: any) => {
    navigate({
      search: { ...search, ...newFilters },
    });
  };

  const parseFn = useServerFn(parseTransactionFromText);
  const mutation = useMutation({
    mutationFn: (text: string) => parseFn({ data: { text } }),
    onSuccess: (parsed) => {
      setTimeout(() => {
        setParsedData(parsed);
        setIsConfirmModalOpen(true);
      }, 1500);
    },
    onError: (err: Error) => {
      toast.error("Não foi possível processar", { description: err.message });
    },
  });

  const isLoading = mutation.isPending;

  const handleProcess = () => {
    const text = smartInput.trim();
    if (!text || isLoading) return;
    mutation.mutate(text);
  };

  const handleConfirm = async () => {
    if (!parsedData || !user || !profile?.couple_id) return;
    
    const coupleId = profile.couple_id;
    
    const txData = {
      description: parsedData.description,
      amount: (parsedData.type === "Entrada" ? 1 : -1) * Math.abs(parsedData.amount),
      date: parsedData.date,
      category: parsedData.category,
      responsible: parsedData.responsible as string,
      division: parsedData.division as string,
      type: parsedData.type,
      user_id: user.id,
      couple_id: coupleId,
      card_id: (formData as any).card_id,
    };

    const { error } = await supabase.from("transactions").insert(txData);
    
    if (error) {
      toast.error("Erro ao salvar transação", { description: error.message });
      return;
    }

    setSmartInput("");
    setIsConfirmModalOpen(false);
    setParsedData(null);
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["cards"] });
    toast.success("Transação adicionada!");
  };

  const handleSaveManual = async () => {
    if (!formData.description || !formData.amount || !profile?.couple_id) {
      toast.error("Preencha a descrição, o valor e certifique-se de estar conectado.");
      return;
    }

    const coupleId = profile.couple_id;

    const txData = {
      description: formData.description || "",
      amount: (formData.type === "Entrada" ? 1 : -1) * Math.abs(formData.amount || 0),
      date: formData.date!,
      category: formData.category || "Outros",
      responsible: (formData.responsible as string) || "Jorge",
      division: (formData.division as string) || "Conjunta 50/50",
      type: formData.type || "Saída",
      user_id: user!.id,
      couple_id: coupleId,
      card_id: formData.card_id
    };

    if (editingTx) {
      const { error } = await supabase
        .from("transactions")
        .update(txData)
        .eq("id", editingTx.id);

      if (error) {
        toast.error("Erro ao atualizar transação", { description: error.message });
        return;
      }
      toast.success("Transação atualizada!");
    } else {
      const { error } = await supabase
        .from("transactions")
        .insert(txData);

      if (error) {
        toast.error("Erro ao adicionar transação", { description: error.message });
        return;
      }
      toast.success("Transação adicionada!");
    }
    
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    queryClient.invalidateQueries({ queryKey: ["cards"] });
    
    setIsManualModalOpen(false);
    setEditingTx(null);
  };

  const handleEditClick = (tx: Transaction) => {
    setEditingTx(tx);
    setFormData({
      description: tx.description,
      amount: Math.abs(tx.amount),
      date: new Date().toISOString().split('T')[0],
      category: tx.category,
      responsible: tx.responsible,
      division: tx.division,
      type: tx.type === "Entrada" ? "Entrada" : (tx.amount < 0 ? "Saída" : "Entrada"),
      card_id: (tx as any).card_id
    });
    setIsManualModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (txToDelete !== null) {
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", txToDelete);

      if (error) {
        toast.error("Erro ao excluir transação", { description: error.message });
        return;
      }
      
      toast.error("Transação excluída");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      setIsDeleteModalOpen(false);
      setTxToDelete(null);
    }
  };

  const handleAddManualClick = () => {
    setEditingTx(null);
    setFormData({
      description: "",
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      category: "Outros",
      responsible: "Jorge",
      division: "Conjunta 50/50",
      type: "Saída",
      card_id: undefined
    });
    setIsManualModalOpen(true);
  };

  return (
    <DashboardLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 pb-10"
      >
        {/* Section 1: Smart Input */}
        <motion.div variants={itemVariants}>
          <Card className="apple-card overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles size={20} className="animate-pulse" />
                  <h3 className="text-lg font-bold">Lançamento Inteligente</h3>
                </div>
                
                <div className="relative group">
                  <Textarea 
                    placeholder="Descreva o gasto... Ex: Paguei 120 reais de gasolina hoje no cartão de crédito."
                    className="min-h-[120px] resize-none text-base p-4 border-muted focus:border-primary/50 transition-all rounded-2xl apple-interactive"
                    value={smartInput}
                    onChange={(e) => setSmartInput(e.target.value)}
                    disabled={isLoading}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleProcess();
                      }
                    }}
                  />
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    <Button 
                      className="rounded-full px-6 shadow-md hover:shadow-lg transition-all gap-2 active:scale-95"
                      disabled={!smartInput.trim() || isLoading}
                      onClick={handleProcess}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          <span className="animate-pulse">Analisando...</span>
                        </div>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Magia IA
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <Button 
                    variant="ghost" 
                    className="text-muted-foreground hover:text-primary transition-all text-sm font-medium gap-2 active:scale-95"
                    onClick={handleAddManualClick}
                  >
                    <PlusCircle size={16} />
                    Adicionar Manualmente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Section 2: Filters and Table */}
        <div className="space-y-4">
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold tracking-tight">Histórico</h2>
            
            <div className="flex flex-wrap items-center gap-2">
              <Select 
                value={filters.month} 
                onValueChange={(val) => setFilters({ ...filters, month: val })}
              >
                <SelectTrigger className="w-[130px] rounded-full apple-interactive">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="june">Junho</SelectItem>
                  <SelectItem value="may">Maio</SelectItem>
                  <SelectItem value="april">Abril</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={filters.category} 
                onValueChange={(val) => setFilters({ ...filters, category: val })}
              >
                <SelectTrigger className="w-[140px] rounded-full apple-interactive">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-cats">Todas Categorias</SelectItem>
                  {Object.keys(CATEGORY_ICONS).map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={filters.type} 
                onValueChange={(val) => setFilters({ ...filters, type: val })}
              >
                <SelectTrigger className="w-[120px] rounded-full apple-interactive">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">Todos Tipos</SelectItem>
                  <SelectItem value="Entrada">Entrada</SelectItem>
                  <SelectItem value="Débito">Débito</SelectItem>
                  <SelectItem value="Crédito">Crédito</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={filters.responsible} 
                onValueChange={(val) => setFilters({ ...filters, responsible: val })}
              >
                <SelectTrigger className="w-[130px] rounded-full apple-interactive">
                  <SelectValue placeholder="Responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">O Casal</SelectItem>
                  <SelectItem value="Jorge">Jorge</SelectItem>
                  <SelectItem value="Lilian">Lilian</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" className="rounded-full apple-interactive">
                <Filter size={18} className="text-muted-foreground" />
              </Button>
            </div>
          </motion.div>

          {transactions.length > 0 ? (
            <motion.div variants={itemVariants}>
              {/* Desktop Table */}
              <div className="hidden md:block apple-card overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow className="border-none hover:bg-transparent">
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 pl-8">Data</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-5">Descrição</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 text-center">Categoria</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 text-right">Valor</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 text-center">Responsável</TableHead>
                      <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 text-center">Divisão</TableHead>
                      <TableHead className="w-[50px] pr-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((tx) => {
                      const CategoryIcon = CATEGORY_ICONS[tx.category] || HelpCircle;
                      const DivisionIcon = DIVISION_ICONS[tx.division] || Users;
                      const avatarUrl = userAvatars[tx.responsible as keyof typeof userAvatars];

                      return (
                        <TableRow key={tx.id} className="group border-b border-muted/20 hover:bg-accent/30 transition-colors">
                          <TableCell className="py-5 pl-8 text-sm font-medium text-muted-foreground">{tx.date}</TableCell>
                          <TableCell className="py-5">
                            <p className="font-bold text-foreground">{tx.description}</p>
                          </TableCell>
                          <TableCell className="py-5 text-center">
                            <Badge variant="secondary" className="gap-1.5 px-3 py-1 rounded-full bg-muted/50 border-none font-bold text-[10px] uppercase">
                              <CategoryIcon size={12} className="text-primary" />
                              {tx.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-5 text-right">
                            <p className={`font-black text-sm ${tx.amount > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                              {tx.amount > 0 ? '+' : ''} {formatCurrency(Math.abs(tx.amount))}
                            </p>
                          </TableCell>
                          <TableCell className="py-5">
                            <div className="flex items-center justify-center gap-2">
                              <Avatar className="w-6 h-6 border shadow-sm">
                                <AvatarImage src={avatarUrl} />
                                <AvatarFallback>{tx.responsible[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium">{tx.responsible}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-5">
                            <div className="flex items-center justify-center">
                              <TooltipProvider>
                                <Badge variant="outline" className="gap-1 rounded-full text-[10px] font-bold border-muted/50">
                                  <DivisionIcon size={10} />
                                  {tx.division}
                                </Badge>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                          <TableCell className="py-5 pr-8 text-right">
                            {tx.user_id === user?.id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                                    <MoreVertical size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="apple-card">
                                  <DropdownMenuItem className="gap-2" onClick={() => handleEditClick(tx)}>
                                    <Edit size={14} />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="gap-2 text-destructive" 
                                    onClick={() => {
                                      setTxToDelete(tx.id);
                                      setIsDeleteModalOpen(true);
                                    }}
                                  >
                                    <Trash2 size={14} />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {transactions.map((tx) => {
                  const CategoryIcon = CATEGORY_ICONS[tx.category] || HelpCircle;
                  const DivisionIcon = DIVISION_ICONS[tx.division] || Users;
                  const avatarUrl = userAvatars[tx.responsible as keyof typeof userAvatars];
                  
                  return (
                    <Card key={tx.id} className="apple-card apple-card-hover overflow-hidden group">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-xl text-muted-foreground">
                              <CategoryIcon size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold">{tx.description}</p>
                              <p className="text-[10px] text-muted-foreground">{tx.date} • {tx.type}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            {tx.user_id === user?.id && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2 rounded-full">
                                    <MoreVertical size={14} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="apple-card">
                                  <DropdownMenuItem className="gap-2" onClick={() => handleEditClick(tx)}>
                                    <Edit size={14} />
                                    Editar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="gap-2 text-destructive" 
                                    onClick={() => {
                                      setTxToDelete(tx.id);
                                      setIsDeleteModalOpen(true);
                                    }}
                                  >
                                    <Trash2 size={14} />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                            <p className={`text-sm font-black mt-1 ${tx.amount > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                              {tx.amount > 0 ? '+' : ''} R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-muted/50 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6 border shadow-sm">
                              <AvatarImage src={avatarUrl} />
                              <AvatarFallback>{tx.responsible[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-muted-foreground">{tx.responsible}</span>
                          </div>
                          
                          <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-lg">
                            <DivisionIcon size={10} className="text-muted-foreground" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{tx.division}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <EmptyState 
              icon={Receipt}
              title="Nenhuma transação ainda"
              description="Comece a registrar seus gastos para ter controle total."
              actionLabel="Adicionar meu primeiro lançamento"
              onAction={handleAddManualClick}
            />
          )}
        </div>
      </motion.div>

      {/* Manual Entry Modal */}
      <Dialog open={isManualModalOpen} onOpenChange={setIsManualModalOpen}>
        <DialogContent className="apple-card sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{editingTx ? "Editar Lançamento" : "Novo Lançamento"}</DialogTitle>
            <DialogDescription>
              {editingTx ? "Altere as informações da transação." : "Insira os detalhes do gasto ou entrada manualmente."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description" className="font-bold text-xs uppercase tracking-widest opacity-60">Descrição</Label>
              <Input 
                id="description" 
                className="rounded-xl" 
                placeholder="Ex: Aluguel, Supermercado..." 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount" className="font-bold text-xs uppercase tracking-widest opacity-60">Valor</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">R$</span>
                  <Input 
                    id="amount" 
                    type="number" 
                    className="pl-9 rounded-xl font-bold" 
                    placeholder="0,00"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type" className="font-bold text-xs uppercase tracking-widest opacity-60">Tipo</Label>
                <Select value={formData.type} onValueChange={(val: any) => setFormData({...formData, type: val})}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="apple-card">
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Saída">Saída / Débito</SelectItem>
                    <SelectItem value="Crédito">Crédito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="date" className="font-bold text-xs uppercase tracking-widest opacity-60">Data</Label>
                <Input 
                  id="date" 
                  type="date" 
                  className="rounded-xl" 
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category" className="font-bold text-xs uppercase tracking-widest opacity-60">Categoria</Label>
                <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="apple-card">
                    {Object.keys(CATEGORY_ICONS).map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.type === "Crédito" && (
              <div className="grid gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                <Label htmlFor="card" className="font-bold text-xs uppercase tracking-widest opacity-60">Cartão de Crédito</Label>
                <Select value={formData.card_id} onValueChange={(val) => setFormData({...formData, card_id: val})}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Selecione o cartão" />
                  </SelectTrigger>
                  <SelectContent className="apple-card">
                    {cards.length > 0 ? (
                      cards.map((card: any) => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.name} (•••• {card.last_four})
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-cards" disabled>Nenhum cartão cadastrado</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label className="font-bold text-xs uppercase tracking-widest opacity-60">Responsável</Label>
                <Select value={formData.responsible} onValueChange={(val) => setFormData({...formData, responsible: val})}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="apple-card">
                    <SelectItem value="Jorge">Jorge</SelectItem>
                    <SelectItem value="Lilian">Lilian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label className="font-bold text-xs uppercase tracking-widest opacity-60">Divisão</Label>
                <Select value={formData.division} onValueChange={(val) => setFormData({...formData, division: val})}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="apple-card">
                    {Object.keys(DIVISION_ICONS).map(div => (
                      <SelectItem key={div} value={div}>{div}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" className="rounded-full" onClick={() => setIsManualModalOpen(false)}>Cancelar</Button>
            <Button className="rounded-full px-8 shadow-lg shadow-primary/20" onClick={handleSaveManual}>Salvar Lançamento</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Modal for Smart Input */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="apple-card sm:max-w-[400px]">
          <DialogHeader>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <Sparkles size={24} />
            </div>
            <DialogTitle className="text-xl font-bold">Lançamento Detectado!</DialogTitle>
            <DialogDescription>
              Confirme os detalhes extraídos pela nossa inteligência artificial.
            </DialogDescription>
          </DialogHeader>
          
          {parsedData && (
            <div className="space-y-4 py-4 bg-muted/30 p-6 rounded-3xl border border-muted-foreground/10">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-muted-foreground">O que é?</p>
                <p className="font-bold">{parsedData.description}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-muted-foreground">Quanto?</p>
                <p className={`font-black ${parsedData.type === 'Entrada' ? 'text-emerald-600' : 'text-foreground'}`}>
                  R$ {Math.abs(parsedData.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-muted-foreground">Quando?</p>
                <p className="font-medium">{parsedData.date}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-muted-foreground">Categoria</p>
                <Badge variant="outline" className="font-bold">{parsedData.category}</Badge>
              </div>
              {parsedData.type === "Crédito" && (
                <div className="space-y-2 mt-2">
                   <p className="text-sm font-medium text-muted-foreground">Vincular ao Cartão</p>
                   <Select 
                     value={(formData as any).card_id} 
                     onValueChange={(val) => setFormData({...formData, card_id: val})}
                   >
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Selecione o cartão" />
                    </SelectTrigger>
                    <SelectContent className="apple-card">
                      {cards.map((card: any) => (
                        <SelectItem key={card.id} value={card.id}>
                          {card.name} (•••• {card.last_four})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" className="rounded-full flex-1" onClick={() => setIsConfirmModalOpen(false)}>Corrigir</Button>
            <Button className="rounded-full flex-1 shadow-lg shadow-primary/20" onClick={handleConfirm}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent className="apple-card rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Transação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O valor será removido permanentemente dos registros do casal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeleteConfirm}
            >
              Excluir Registro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
