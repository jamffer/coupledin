import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, 
  Filter, 
  ShoppingBag,
  Coffee,
  Car,
  Home,
  Heart,
  PlusCircle,
  TrendingUp,
  HelpCircle,
  User,
  Users,
  Split,
  Loader2,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { parseTransactionFromText, type ParsedTransaction } from "@/lib/transactions.functions";

export const Route = createFileRoute("/transacoes")({
  head: () => ({
    meta: [
      { title: "Lançamentos | CoupleFinance" },
      { name: "description", content: "Gerencie as transações do casal." },
    ],
  }),
  component: TransactionsPage,
});

type Transaction = {
  id: number;
  date: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  amount: number;
  type: string;
  responsible: string;
  avatar: string;
  division: string;
  divisionIcon: React.ComponentType<{ size?: number; className?: string }>;
};

const CATEGORY_ICONS: Record<string, Transaction["icon"]> = {
  "Alimentação": ShoppingBag,
  "Lazer": Coffee,
  "Transporte": Car,
  "Moradia": Home,
  "Saúde": Heart,
  "Renda": TrendingUp,
  "Outros": HelpCircle,
};

const DIVISION_ICONS: Record<string, Transaction["divisionIcon"]> = {
  "Conjunta 50/50": Users,
  "Proporcional": Split,
  "Individual": User,
};

const AVATARS: Record<string, string> = {
  Felipe: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  Beatriz: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella",
};

function formatDate(iso: string): string {
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${String(d).padStart(2, "0")} ${months[m - 1]}, ${y}`;
}

const initialTransactions: Transaction[] = [
  {
    id: 1,
    date: "05 Jun, 2024",
    description: "Supermercado Pão de Açúcar",
    category: "Alimentação",
    icon: ShoppingBag,
    amount: -350.20,
    type: "Débito",
    responsible: "Felipe",
    avatar: AVATARS.Felipe,
    division: "Conjunta 50/50",
    divisionIcon: Users,
  },
  {
    id: 2,
    date: "05 Jun, 2024",
    description: "Assinatura Netflix",
    category: "Lazer",
    icon: Coffee,
    amount: -55.90,
    type: "Crédito",
    responsible: "Beatriz",
    avatar: AVATARS.Beatriz,
    division: "Proporcional",
    divisionIcon: Split,
  },
  {
    id: 3,
    date: "04 Jun, 2024",
    description: "Salário Empresa X",
    category: "Renda",
    icon: TrendingUp,
    amount: 5200.00,
    type: "Entrada",
    responsible: "Beatriz",
    avatar: AVATARS.Beatriz,
    division: "Individual",
    divisionIcon: User,
  },
  {
    id: 4,
    date: "03 Jun, 2024",
    description: "Manutenção Carro",
    category: "Transporte",
    icon: Car,
    amount: -450.00,
    type: "Crédito",
    responsible: "Felipe",
    avatar: AVATARS.Felipe,
    division: "Conjunta 50/50",
    divisionIcon: Users,
  },
  {
    id: 5,
    date: "02 Jun, 2024",
    description: "Aluguel Apartamento",
    category: "Moradia",
    icon: Home,
    amount: -2500.00,
    type: "Débito",
    responsible: "Beatriz",
    avatar: AVATARS.Beatriz,
    division: "Proporcional",
    divisionIcon: Split,
  },
];

function buildTransaction(parsed: ParsedTransaction, id: number): Transaction {
  const sign = parsed.type === "Entrada" ? 1 : -1;
  return {
    id,
    date: formatDate(parsed.date),
    description: parsed.description,
    category: parsed.category,
    icon: CATEGORY_ICONS[parsed.category] ?? HelpCircle,
    amount: sign * Math.abs(parsed.amount),
    type: parsed.type,
    responsible: parsed.responsible,
    avatar: AVATARS[parsed.responsible] ?? AVATARS.Felipe,
    division: parsed.division,
    divisionIcon: DIVISION_ICONS[parsed.division] ?? Users,
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
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedTransaction | null>(null);

  const parseFn = useServerFn(parseTransactionFromText);
  const mutation = useMutation({
    mutationFn: (text: string) => parseFn({ data: { text } }),
    onSuccess: (parsed) => {
      setParsedData(parsed);
      setIsConfirmModalOpen(true);
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
    if (!parsedData) return;
    const tx = buildTransaction(parsedData, Date.now());
    setTransactions((prev) => [tx, ...prev]);
    setSmartInput("");
    setIsConfirmModalOpen(false);
    setParsedData(null);
    toast.success("Lançamento adicionado com sucesso!");
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
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles size={20} className="animate-pulse" />
                  <h3 className="text-lg font-bold">Lançamento Inteligente</h3>
                </div>
                
                <div className="relative group">
                  <Textarea 
                    placeholder="Descreva o gasto... Ex: Paguei 120 reais de gasolina hoje no cartão de crédito."
                    className="min-h-[120px] resize-none text-base p-4 border-muted focus:border-primary/50 transition-all rounded-2xl bg-muted/30 focus:bg-white"
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
                      className="rounded-full px-6 shadow-md hover:shadow-lg transition-all gap-2"
                      disabled={!smartInput.trim() || isLoading}
                      onClick={handleProcess}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Processar
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium gap-2">
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
              <Select defaultValue="june">
                <SelectTrigger className="w-[130px] rounded-full border-none bg-white shadow-sm">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="june">Junho</SelectItem>
                  <SelectItem value="may">Maio</SelectItem>
                  <SelectItem value="april">Abril</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-cats">
                <SelectTrigger className="w-[140px] rounded-full border-none bg-white shadow-sm">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-cats">Todas Categorias</SelectItem>
                  <SelectItem value="food">Alimentação</SelectItem>
                  <SelectItem value="leisure">Lazer</SelectItem>
                  <SelectItem value="transport">Transporte</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all-types">
                <SelectTrigger className="w-[120px] rounded-full border-none bg-white shadow-sm">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-types">Todos Tipos</SelectItem>
                  <SelectItem value="credit">Crédito</SelectItem>
                  <SelectItem value="debit">Débito</SelectItem>
                  <SelectItem value="income">Entrada</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="both">
                <SelectTrigger className="w-[130px] rounded-full border-none bg-white shadow-sm">
                  <SelectValue placeholder="Responsável" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">O Casal</SelectItem>
                  <SelectItem value="felipe">Felipe</SelectItem>
                  <SelectItem value="beatriz">Beatriz</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="icon" className="rounded-full bg-white border-none shadow-sm">
                <Filter size={18} className="text-muted-foreground" />
              </Button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-3xl shadow-sm border-none overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 pl-8">Data</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-5">Descrição</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 text-center">Categoria</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 text-right">Valor</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 text-center">Responsável</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 pr-8 text-center">Divisão</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
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
                            <tx.icon size={14} />
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
                            <AvatarImage src={tx.avatar} />
                            <AvatarFallback>{tx.responsible[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                      </TableCell>
                      <TableCell className="py-4 pr-8">
                        <div className="flex justify-center">
                          <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tighter rounded-lg border-muted/50 bg-white shadow-xs gap-1 py-1">
                            <tx.divisionIcon size={12} className="text-primary" />
                            {tx.division}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {transactions.map((tx) => (
                <Card key={tx.id} className="border-none shadow-sm bg-white overflow-hidden group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-muted rounded-xl text-muted-foreground">
                          <tx.icon size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{tx.description}</p>
                          <p className="text-[10px] text-muted-foreground">{tx.date} • {tx.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-black ${tx.amount > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {tx.amount > 0 ? '+' : ''} R$ {Math.abs(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <Badge variant="outline" className="text-[9px] py-0 h-4 mt-1">
                          {tx.category}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-muted/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6 border shadow-sm">
                          <AvatarImage src={tx.avatar} />
                          <AvatarFallback>{tx.responsible[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-muted-foreground">{tx.responsible}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-lg">
                        <tx.divisionIcon size={12} className="text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-tight text-muted-foreground">{tx.division}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Section 3: Confirmation Modal */}
        <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles size={20} className="text-primary" />
                Confirmar Lançamento
              </DialogTitle>
              <DialogDescription>
                A IA extraiu os seguintes dados do seu texto. Deseja confirmar?
              </DialogDescription>
            </DialogHeader>
            
            {parsedData && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="desc" className="text-right text-xs font-bold uppercase text-muted-foreground">
                    Descrição
                  </Label>
                  <Input
                    id="desc"
                    value={parsedData.description}
                    onChange={(e) => setParsedData({ ...parsedData, description: e.target.value })}
                    className="col-span-3 rounded-xl h-11"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right text-xs font-bold uppercase text-muted-foreground">
                    Valor
                  </Label>
                  <div className="col-span-3 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">R$</span>
                    <Input
                      id="amount"
                      type="number"
                      value={parsedData.amount}
                      onChange={(e) => setParsedData({ ...parsedData, amount: Number(e.target.value) })}
                      className="pl-10 rounded-xl h-11"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right text-xs font-bold uppercase text-muted-foreground">
                    Categoria
                  </Label>
                  <Select 
                    value={parsedData.category} 
                    onValueChange={(val) => setParsedData({ ...parsedData, category: val as any })}
                  >
                    <SelectTrigger className="col-span-3 rounded-xl h-11">
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
                  <Label htmlFor="responsible" className="text-right text-xs font-bold uppercase text-muted-foreground">
                    Quem
                  </Label>
                  <Select 
                    value={parsedData.responsible} 
                    onValueChange={(val) => setParsedData({ ...parsedData, responsible: val as any })}
                  >
                    <SelectTrigger className="col-span-3 rounded-xl h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Felipe">Felipe</SelectItem>
                      <SelectItem value="Beatriz">Beatriz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            
            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)} className="rounded-full">
                Ajustar
              </Button>
              <Button onClick={handleConfirm} className="rounded-full px-8 font-bold shadow-lg">
                Confirmar e Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
    </DashboardLayout>
  );
}
