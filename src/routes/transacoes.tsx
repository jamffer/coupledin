import React, { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
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
import { useState } from "react";
import { toast } from "sonner";
import { parseTransactionFromText, type ParsedTransaction } from "@/lib/transactions.functions";
import { useFinanceStore, CATEGORY_ICONS, DIVISION_ICONS, type Transaction } from "@/hooks/use-finance-store";
import { supabase } from "@/integrations/supabase/client";

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
import { EmptyState } from "@/components/empty-state";
import { Receipt } from "lucide-react";


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
  const [profile, setProfile] = useState<any>(null);
  const { transactions, addTransaction, updateTransaction, deleteTransaction, userAvatars, setTransactions } = useFinanceStore();

  useEffect(() => {
    if (user) {
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle().then(({ data }) => {
        setProfile(data);
      });
    }
  }, [user]);

  // Sync transactions from Supabase
  useEffect(() => {
    if (profile?.couple_id) {
      const fetchTransactions = async () => {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("couple_id", profile.couple_id)
          .order("date", { ascending: false });

        if (!error && data) {
          // Map snake_case from DB to camelCase in store if necessary, or ensure store uses same keys
          // For now, let's assume they match or we adjust
          setTransactions(data as any);
        }
      };

      fetchTransactions();

      // Subscription for real-time updates
      const subscription = supabase
        .channel("transactions-updates")
        .on("postgres_changes", {
          event: "*",
          schema: "public",
          table: "transactions",
          filter: `couple_id=eq.${profile.couple_id}`
        }, (payload) => {
          if (payload.eventType === 'INSERT') {
            const newTx = payload.new as any;
            setTransactions([newTx, ...transactions]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedTx = payload.new as any;
            setTransactions(transactions.map(tx => tx.id === updatedTx.id ? updatedTx : tx));
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setTransactions(transactions.filter(tx => tx.id !== deletedId));
          }
        })
        .subscribe();

      return () => {
        supabase.removeChannel(subscription);
      };
    }
  }, [profile?.couple_id, setTransactions]);

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

  // States for manual form
  const [formData, setFormData] = useState<Partial<Transaction>>({
    description: "",
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    category: "Outros",
    responsible: "Jorge",
    division: "Conjunta 50/50",
    type: "Saída"
  });

  // States for filters synced with URL
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

  const handleConfirm = () => {
    if (!parsedData || !user || !profile?.couple_id) return;
    const tx = buildTransaction(parsedData, crypto.randomUUID(), user.id, profile.couple_id);
    addTransaction(tx);
    setSmartInput("");
    setIsConfirmModalOpen(false);
    setParsedData(null);
    toast.success("Transação adicionada!");
  };

  const handleSaveManual = () => {
    if (!formData.description || !formData.amount) {
      toast.error("Preencha a descrição e o valor.");
      return;
    }

    if (editingTx) {
      updateTransaction(editingTx.id, {
        ...formData,
        amount: (formData.type === "Entrada" ? 1 : -1) * Math.abs(formData.amount || 0)
      } as Partial<Transaction>);
      toast.success("Transação atualizada!");
    } else {
      const newTx: Transaction = {
        id: crypto.randomUUID(),
        description: formData.description || "",
        amount: (formData.type === "Entrada" ? 1 : -1) * Math.abs(formData.amount || 0),
        date: formatDate(formData.date!),
        category: formData.category || "Outros",
        responsible: (formData.responsible as string) || "Jorge",
        division: (formData.division as string) || "Conjunta 50/50",
        type: formData.type || "Saída",
        user_id: user!.id,
        couple_id: profile.couple_id
      };
      addTransaction(newTx);
      toast.success("Transação adicionada!");
    }
    
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
      type: tx.type === "Entrada" ? "Entrada" : (tx.amount < 0 ? "Saída" : "Entrada")
    });
    setIsManualModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (txToDelete !== null) {
      deleteTransaction(txToDelete);
      toast.error("Transação excluída");
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
      type: "Saída"
    });
    setIsManualModalOpen(true);
  };

  return (
    <DashboardLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
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
                  {transactions.length > 0 ? (
                    transactions.map((tx) => {

                    const CategoryIcon = CATEGORY_ICONS[tx.category] || HelpCircle;
                    const DivisionIcon = DIVISION_ICONS[tx.division] || Users;
                    const avatarUrl = userAvatars[tx.responsible as keyof typeof userAvatars];
                    
                    return (
                      <TableRow key={tx.id} className="group border-b border-muted/50 hover:bg-muted/10 transition-colors">
                        <TableCell className="py-4 pl-8">
                          <span className="text-sm text-muted-foreground font-medium">{tx.date}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <span className="text-sm font-bold text-foreground">{tx.description}</span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex justify-center">
                            <Badge variant="secondary" className="bg-muted text-muted-foreground font-semibold px-3 py-1 rounded-full border-none gap-2">
                              <CategoryIcon size={14} />
                              {tx.category}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <span className={`text-sm font-black ${tx.amount > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                            {tx.amount > 0 ? '+' : ''} R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex justify-center">
                            <Avatar className="w-8 h-8 border-2 border-white shadow-sm ring-1 ring-muted/50">
                              <AvatarImage src={avatarUrl} />
                              <AvatarFallback>{tx.responsible[0]}</AvatarFallback>
                            </Avatar>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex justify-center">
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tighter rounded-lg border-muted/50 apple-glass gap-1 py-1">
                              <DivisionIcon size={12} className="text-primary" />
                              {tx.division}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="py-4 pr-8 text-right">
                          {tx.user_id === user?.id && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical size={16} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="apple-card">
                                <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => handleEditClick(tx)}>
                                  <Edit size={14} />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="gap-2 text-destructive cursor-pointer" 
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
                          <DivisionIcon size={12} className="text-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">{tx.division}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Section 3: IA Confirmation Modal */}
        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-3xl apple-card">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles size={20} className="text-primary" />
                Confirmar Lançamento
              </DialogTitle>
              <DialogDescription>
                A IA extraiu os seguintes dados. Deseja confirmar?
              </DialogDescription>
            </DialogHeader>
            
            {parsedData && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-xs font-bold uppercase text-muted-foreground">Descrição</Label>
                  <Input
                    value={parsedData.description}
                    onChange={(e) => setParsedData({ ...parsedData, description: e.target.value })}
                    className="col-span-3 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-xs font-bold uppercase text-muted-foreground">Valor</Label>
                  <Input
                    type="number"
                    value={parsedData.amount}
                    onChange={(e) => setParsedData({ ...parsedData, amount: Number(e.target.value) })}
                    className="col-span-3 rounded-xl"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right text-xs font-bold uppercase text-muted-foreground">Quem</Label>
                  <Select 
                    value={parsedData.responsible} 
                    onValueChange={(val) => setParsedData({ ...parsedData, responsible: val as any })}
                  >
                    <SelectTrigger className="col-span-3 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Jorge">Jorge</SelectItem>
                      <SelectItem value="Lilian">Lilian</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)} className="rounded-full">Ajustar</Button>
              <Button onClick={handleConfirm} className="rounded-full px-8 font-bold shadow-lg">Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Section 4: Manual Add/Edit Modal */}
        <Dialog open={isManualModalOpen} onOpenChange={setIsManualModalOpen}>
          <DialogContent className="sm:max-w-[500px] rounded-3xl apple-card">
            <DialogHeader>
              <DialogTitle>{editingTx ? "Editar Lançamento" : "Adicionar Manualmente"}</DialogTitle>
              <DialogDescription>Preencha os campos abaixo para registrar sua transação.</DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-5 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-xs font-bold uppercase text-muted-foreground">Valor</Label>
                <Input 
                  type="number" 
                  value={formData.amount} 
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="col-span-3 h-12 rounded-xl text-lg font-bold"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-xs font-bold uppercase text-muted-foreground">Descrição</Label>
                <Input 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Jantar fora"
                  className="col-span-3 h-11 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-xs font-bold uppercase text-muted-foreground">Data</Label>
                <Input 
                  type="date" 
                  value={formData.date} 
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="col-span-3 h-11 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-xs font-bold uppercase text-muted-foreground">Categoria</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(val) => setFormData({ ...formData, category: val })}
                >
                  <SelectTrigger className="col-span-3 h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(CATEGORY_ICONS).map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-xs font-bold uppercase text-muted-foreground">Quem</Label>
                <Select 
                  value={formData.responsible} 
                  onValueChange={(val) => setFormData({ ...formData, responsible: val as any })}
                >
                  <SelectTrigger className="col-span-3 h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Jorge">Jorge</SelectItem>
                    <SelectItem value="Lilian">Lilian</SelectItem>
                    <SelectItem value="Conjunto">Conjunto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right text-xs font-bold uppercase text-muted-foreground">Tipo</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(val) => setFormData({ ...formData, type: val })}
                >
                  <SelectTrigger className="col-span-3 h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entrada">Entrada</SelectItem>
                    <SelectItem value="Débito">Saída (Débito)</SelectItem>
                    <SelectItem value="Crédito">Saída (Crédito)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setIsManualModalOpen(false)} className="rounded-full">Cancelar</Button>
              <Button onClick={handleSaveManual} className="rounded-full px-8 font-bold shadow-lg">Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Section 5: Delete Confirmation */}
        <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <AlertDialogContent className="apple-card rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Tem certeza que deseja excluir este lançamento?</AlertDialogTitle>
              <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm} className="rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Excluir
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </DashboardLayout>
  );
}
