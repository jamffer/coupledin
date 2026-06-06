import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Clock
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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

const mockCards: CardInfo[] = [
  {
    id: "1",
    name: "Cartão Conjunto",
    lastDigits: "4589",
    brand: "Visa",
    color: "bg-slate-900",
    currentBill: 2150.40,
    limitUsed: 8500,
    totalLimit: 10000,
    type: "conjunto",
  },
  {
    id: "2",
    name: "Cartão do Jorge",
    lastDigits: "1234",
    brand: "Mastercard",
    color: "bg-blue-600",
    currentBill: 1200.00,
    limitUsed: 1200,
    totalLimit: 5000,
    type: "individual",
    owner: "Jorge",
  },
  {
    id: "3",
    name: "Cartão da Parceira",
    lastDigits: "8872",
    brand: "Visa",
    color: "bg-rose-500",
    currentBill: 800.00,
    limitUsed: 4200,
    totalLimit: 5000,
    type: "individual",
    owner: "Beatriz",
  },
];

type BillItem = {
  id: string;
  date: string;
  description: string;
  amount: number;
  installments?: string;
  user: "Jorge" | "Beatriz";
  category: string;
  icon: any;
};

const mockBills: Record<string, BillItem[]> = {
  "1": [
    { id: "b1", date: "05 Jun", description: "Supermercado Extra", amount: 450.00, installments: "1/1", user: "Jorge", category: "Alimentação", icon: Utensils },
    { id: "b2", date: "04 Jun", description: "Netflix", amount: 55.90, installments: "1/1", user: "Beatriz", category: "Lazer", icon: Coffee },
    { id: "b3", date: "02 Jun", description: "Posto Shell", amount: 220.00, installments: "1/1", user: "Jorge", category: "Transporte", icon: Car },
    { id: "b4", date: "01 Jun", description: "Amazon.com", amount: 1424.50, installments: "2/10", user: "Beatriz", category: "Shopping", icon: ShoppingBag },
  ],
  "2": [
    { id: "j1", date: "06 Jun", description: "Steam Store", amount: 150.00, installments: "1/1", user: "Jorge", category: "Lazer", icon: Coffee },
    { id: "j2", date: "04 Jun", description: "Restaurante", amount: 85.00, installments: "1/1", user: "Jorge", category: "Alimentação", icon: Utensils },
    { id: "j3", date: "01 Jun", description: "Vivo Móvel", amount: 965.00, installments: "1/1", user: "Jorge", category: "Serviços", icon: Smartphone },
  ],
  "3": [
    { id: "p1", date: "05 Jun", description: "Zara", amount: 350.00, installments: "1/3", user: "Beatriz", category: "Shopping", icon: ShoppingBag },
    { id: "p2", date: "03 Jun", description: "iFood", amount: 65.00, installments: "1/1", user: "Beatriz", category: "Alimentação", icon: Utensils },
    { id: "p3", date: "01 Jun", description: "Academia", amount: 385.00, installments: "1/1", user: "Beatriz", category: "Saúde", icon: Clock },
  ],
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
  const [selectedCardId, setSelectedCardId] = useState(mockCards[0].id);
  const [selectedMonth, setSelectedMonth] = useState("june");

  const selectedCard = mockCards.find(c => c.id === selectedCardId)!;
  const currentBillItems = mockBills[selectedCardId] || [];

  const usagePercentage = (selectedCard.limitUsed / selectedCard.totalLimit) * 100;
  const progressColor = usagePercentage > 80 ? "bg-rose-500" : usagePercentage > 60 ? "bg-orange-400" : "bg-primary";

  // Calcular quebra de responsabilidade para o cartão conjunto
  const jorgePays = selectedCard.type === "conjunto" ? 1200 : selectedCard.owner === "Jorge" ? selectedCard.currentBill : 0;
  const beatrizPays = selectedCard.type === "conjunto" ? 800 : selectedCard.owner === "Beatriz" ? selectedCard.currentBill : 0;

  return (
    <DashboardLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Meus Cartões</h1>
          <p className="text-muted-foreground italic">Gerencie seus limites e faturas.</p>
        </div>

        {/* Visão Geral dos Cartões */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCards.map((card) => (
            <motion.div 
              key={card.id} 
              variants={itemVariants}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedCardId(card.id)}
              className="cursor-pointer"
            >
              <Card className={cn(
                "relative h-64 border-none text-white shadow-xl overflow-hidden transition-all duration-300 flex flex-col justify-between p-6",
                card.color,
                selectedCardId === card.id ? "ring-2 ring-primary ring-offset-4 ring-offset-[#fcfbf8]" : "opacity-95 hover:opacity-100"
              )}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <CreditCard size={140} />
                </div>
                
                <CardHeader className="relative z-10 flex flex-row items-center justify-between p-6 pb-0">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">
                      {card.type === "conjunto" ? "Conjunto" : `Individual - ${card.owner}`}
                    </span>
                    <CardTitle className="text-base font-bold leading-tight">{card.name}</CardTitle>
                  </div>
                  <div className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-sm">
                    {card.brand}
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 p-6 space-y-4">
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
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Detalhes da Fatura Selecionada */}
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-border/40 bg-muted/20 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg text-white", selectedCard.color)}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">Detalhamento da Fatura</CardTitle>
                  <p className="text-xs text-muted-foreground">{selectedCard.name} • •••• {selectedCard.lastDigits}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[180px] rounded-full bg-white border-none shadow-sm font-medium">
                    <div className="flex items-center gap-2">
                      <CalendarIcon size={16} className="text-muted-foreground" />
                      <SelectValue placeholder="Selecione o mês" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="june">Junho (Aberta)</SelectItem>
                    <SelectItem value="may">Maio (Paga)</SelectItem>
                    <SelectItem value="april">Abril (Paga)</SelectItem>
                  </SelectContent>
                </Select>
                <Badge variant={selectedMonth === "june" ? "outline" : "secondary"} className={cn(
                  "px-3 py-1 rounded-full border-none",
                  selectedMonth === "june" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                )}>
                  {selectedMonth === "june" ? "Fatura Aberta" : "Fatura Paga"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Resumo da Fatura */}
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b border-border/40">
                <div className="p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total da Fatura</p>
                  <h3 className="text-2xl font-bold tracking-tight">R$ {selectedCard.currentBill.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-1">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" />
                      <AvatarFallback>FE</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-muted-foreground">Jorge paga</p>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-blue-600">R$ {jorgePays.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-1">
                    <Avatar className="w-5 h-5">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Bella" />
                      <AvatarFallback>BE</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-muted-foreground">Parceira paga</p>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-rose-600">R$ {beatrizPays.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                </div>
              </div>

              {/* Lista de Compras */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="w-[100px] pl-6">Data</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Parcela</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead className="text-right pr-6">Valor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence mode="wait">
                      {currentBillItems.map((item) => (
                        <TableRow key={item.id} className="group transition-colors">
                          <TableCell className="font-medium text-muted-foreground pl-6">{item.date}</TableCell>
                          <TableCell className="font-bold">{item.description}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 bg-muted rounded-md text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                <item.icon size={14} />
                              </div>
                              <span className="text-xs">{item.category}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-mono text-[10px] px-2 py-0 border-muted">
                              {item.installments}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Avatar className="w-6 h-6 ring-2 ring-background ring-offset-1 group-hover:scale-110 transition-transform">
                              <AvatarImage src={item.user === "Jorge" ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" : "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella"} />
                              <AvatarFallback>{item.user.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                          </TableCell>
                          <TableCell className="text-right font-bold pr-6">
                            R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
              
              <div className="p-4 border-t border-border/40 text-center">
                <button className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group">
                  Ver todas as transações da fatura
                  <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
