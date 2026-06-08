import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  TrendingUp, 
  Wallet,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Coins,
  Building2,
  Gem,
  ArrowRight,
  Activity,
  MoreVertical,
  Pencil,
  Trash2
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { useInvestmentPortfolio, EnrichedInvestment } from "@/hooks/use-investment-portfolio";
import { NewAssetModal } from "@/components/investments/new-asset-modal";
import { EditAssetModal } from "@/components/investments/edit-asset-modal";
import { useDeleteInvestment } from "@/hooks/use-investment-mutations";
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

export const Route = createFileRoute("/investimentos")({
  head: () => ({
    meta: [
      { title: "Investimentos | CoupledIn" },
      { name: "description", content: "Acompanhe seus ativos em tempo real." },
    ],
  }),
  component: InvestimentosPage,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

function AssetTable({ 
  data, 
  onEdit, 
  onDelete 
}: { 
  data: EnrichedInvestment[],
  onEdit: (asset: EnrichedInvestment) => void,
  onDelete: (asset: EnrichedInvestment) => void 
}) {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground font-medium">
        Nenhum ativo cadastrado nesta aba.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/40 hover:bg-transparent">
            <TableHead className="font-bold text-xs uppercase text-muted-foreground">Ativo</TableHead>
            <TableHead className="font-bold text-xs uppercase text-muted-foreground text-center">Qtd</TableHead>
            <TableHead className="font-bold text-xs uppercase text-muted-foreground text-right">P. Médio</TableHead>
            <TableHead className="font-bold text-xs uppercase text-muted-foreground text-right">Valor Atual</TableHead>
            <TableHead className="font-bold text-xs uppercase text-muted-foreground text-right">P&L</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((asset) => {
            const isPositive = asset.profit_loss_percentage > 0;
            const isNegative = asset.profit_loss_percentage < 0;
            const profitValue = asset.current_value - asset.total_invested;

            return (
              <TableRow key={asset.id} className="border-border/40 group hover:bg-muted/10 transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                       {asset.asset_type === 'CRYPTO' ? <Coins size={16} className="text-secondary-foreground" /> :
                        asset.asset_type === 'FIXED_INCOME' ? <Building2 size={16} className="text-amber-500" /> :
                        <Activity size={16} className="text-primary" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase">{asset.ticker}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">{Number(asset.quantity)}</TableCell>
                <TableCell className="text-right font-medium">{formatCurrency(Number(asset.average_price))}</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(asset.current_value)}</TableCell>
                <TableCell className="text-right">
                  <div className={cn(
                    "flex flex-col items-end",
                    isPositive ? "text-emerald-600" : isNegative ? "text-rose-500" : "text-muted-foreground"
                  )}>
                    <div className="flex items-center gap-1 text-sm font-black">
                      {isPositive && <ArrowUp size={14} />}
                      {isNegative && <ArrowDown size={14} />}
                      {!isPositive && !isNegative && <span className="mr-1">-</span>}
                      {Math.abs(asset.profit_loss_percentage).toFixed(2)}%
                    </div>
                    <span className="text-[10px] font-bold">
                      {isPositive ? '+' : ''} {formatCurrency(profitValue)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreVertical size={16} className="text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="apple-card rounded-xl w-40">
                      <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => onEdit(asset)}>
                        <Pencil size={14} />
                        Editar Aporte
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer gap-2 text-rose-500 focus:text-rose-600 focus:bg-rose-500/10" onClick={() => onDelete(asset)}>
                        <Trash2 size={14} />
                        Excluir Ativo
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function InvestimentosPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<EnrichedInvestment | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<EnrichedInvestment | null>(null);

  const deleteMutation = useDeleteInvestment();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, authLoading]);

  const {
    investments,
    totalPatrimony,
    totalInvested,
    totalProfitPercentage,
    isLoading,
    isRefetching,
    refetch,
    isError
  } = useInvestmentPortfolio();

  const handleRefresh = async () => {
    await refetch();
    toast.success("Preços atualizados via API!");
  };

  const handleConfirmDelete = () => {
    if (assetToDelete) {
      deleteMutation.mutate(assetToDelete.id, {
        onSuccess: () => {
          setAssetToDelete(null);
        }
      });
    }
  };

  const totalProfit = totalPatrimony - totalInvested;
  const hasInvestments = investments && investments.length > 0;

  const acoes = investments?.filter(i => i.asset_type === "STOCK") || [];
  const fiis = investments?.filter(i => i.asset_type === "FII") || [];
  const cripto = investments?.filter(i => i.asset_type === "CRYPTO") || [];
  const rendafixa = investments?.filter(i => i.asset_type === "FIXED_INCOME") || [];

  const rvTotal = [...acoes, ...fiis].reduce((acc, curr) => acc + curr.current_value, 0);
  const cryptoTotal = cripto.reduce((acc, curr) => acc + curr.current_value, 0);
  
  const rvPerc = totalPatrimony > 0 ? (rvTotal / totalPatrimony) * 100 : 0;
  const cryptoPerc = totalPatrimony > 0 ? (cryptoTotal / totalPatrimony) * 100 : 0;

  if (isLoading && !hasInvestments) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center py-40">
          <RefreshCw className="animate-spin text-primary w-8 h-8" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <NewAssetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EditAssetModal isOpen={!!assetToEdit} onClose={() => setAssetToEdit(null)} asset={assetToEdit} />

      <AlertDialog open={!!assetToDelete} onOpenChange={(open) => !open && setAssetToDelete(null)}>
        <AlertDialogContent className="apple-card rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Ativo?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover <strong className="uppercase">{assetToDelete?.ticker}</strong> da sua carteira? Esta ação não pode ser desfeita e afetará o histórico do seu patrimônio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending} className="rounded-xl">Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleConfirmDelete();
              }}
              disabled={deleteMutation.isPending} 
              className="bg-rose-500 hover:bg-rose-600 text-white rounded-xl gap-2"
            >
              {deleteMutation.isPending && <RefreshCw size={14} className="animate-spin" />}
              Sim, Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 pb-10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Meus Investimentos</h1>
            <p className="text-muted-foreground italic">Patrimônio atualizado em tempo real pelas APIs.</p>
          </div>
          {hasInvestments && (
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                className="rounded-full apple-interactive border-border/40 gap-2"
                disabled={isRefetching}
              >
                <RefreshCw size={16} className={cn(isRefetching && "animate-spin")} />
                {isRefetching ? "Buscando cotações..." : "Atualizar Cotações"}
              </Button>
              <Button size="sm" className="rounded-full gap-2 shadow-lg" onClick={() => setIsModalOpen(true)}>
                <Plus size={16} />
                Novo Aporte
              </Button>
            </div>
          )}
        </div>

        {isError && (
          <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl border border-rose-500/20 font-medium">
            Houve um erro de rede ao buscar a cotação externa dos investimentos.
          </div>
        )}

        {hasInvestments ? (
          <>
            {/* Resumo Patrimonial - Somente esses cards possuem glassmorphism nas cores vibrantes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants}>
                <Card className="apple-card group card-gradient-blue border-none h-full shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent backdrop-blur-sm pointer-events-none" />
                  <CardContent className="p-8 flex flex-col justify-between h-full relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/20 rounded-lg text-white">
                        <Wallet size={24} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 bg-black/20 px-3 py-1 rounded-full backdrop-blur-md">Geral</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/80">Patrimônio Total Atualizado</p>
                      <h3 className="text-4xl font-black tracking-tight text-white mt-1">
                        {formatCurrency(totalPatrimony)}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="apple-card group card-gradient-magenta border-none h-full shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent backdrop-blur-sm pointer-events-none" />
                  <CardContent className="p-8 flex flex-col justify-between h-full relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/20 rounded-lg text-white">
                        <TrendingUp size={24} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 bg-black/20 px-3 py-1 rounded-full backdrop-blur-md">P&L Geral</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/80">Lucro/Prejuízo Total ({totalProfitPercentage >= 0 ? '+' : ''}{totalProfitPercentage.toFixed(2)}%)</p>
                      <h3 className="text-4xl font-black tracking-tight text-white mt-1">
                        {totalProfit > 0 ? '+' : ''} {formatCurrency(totalProfit)}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="apple-card h-full border-border/40 bg-card">
                  <CardContent className="p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Distribuição da Carteira</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Ações / FIIs</span>
                        <span className="text-sm font-bold text-primary">{rvPerc.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted dark:bg-black rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${rvPerc}%` }} />
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Cripto</span>
                        <span className="text-sm font-bold text-secondary-foreground">{cryptoPerc.toFixed(1)}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted dark:bg-black rounded-full overflow-hidden">
                        <div className="h-full bg-secondary-foreground rounded-full" style={{ width: `${cryptoPerc}%` }} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Ativos Categorizados - Tabelas Limpas */}
            <motion.div variants={itemVariants}>
              <Tabs defaultValue="visaogeral" className="w-full">
                <TabsList className="bg-muted/50 p-1 rounded-2xl h-14 border border-border/40 gap-1 w-full md:w-fit overflow-x-auto no-scrollbar">
                  <TabsTrigger value="visaogeral" className="rounded-xl px-6 h-11 data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2 transition-all">
                    <Activity size={16} />
                    Visão Geral
                  </TabsTrigger>
                  <TabsTrigger value="acoes_fiis" className="rounded-xl px-6 h-11 data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2 transition-all">
                    <TrendingUp size={16} />
                    Renda Variável
                  </TabsTrigger>
                  <TabsTrigger value="cripto" className="rounded-xl px-6 h-11 data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2 transition-all">
                    <Coins size={16} />
                    Criptomoedas
                  </TabsTrigger>
                  <TabsTrigger value="rendafixa" className="rounded-xl px-6 h-11 data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2 transition-all">
                    <Building2 size={16} />
                    Renda Fixa
                  </TabsTrigger>
                </TabsList>

                <div className="mt-8">
                  <TabsContent value="visaogeral">
                    <Card className="apple-card overflow-hidden bg-card border-border/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold">Todos os Ativos</CardTitle>
                      </CardHeader>
                      <CardContent className="px-0">
                        <AssetTable data={investments} onEdit={setAssetToEdit} onDelete={setAssetToDelete} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="acoes_fiis">
                    <Card className="apple-card overflow-hidden bg-card border-border/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold">Ações e FIIs</CardTitle>
                      </CardHeader>
                      <CardContent className="px-0">
                        <AssetTable data={[...acoes, ...fiis]} onEdit={setAssetToEdit} onDelete={setAssetToDelete} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="cripto">
                    <Card className="apple-card overflow-hidden bg-card border-border/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold">Criptoativos</CardTitle>
                      </CardHeader>
                      <CardContent className="px-0">
                        <AssetTable data={cripto} onEdit={setAssetToEdit} onDelete={setAssetToDelete} />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="rendafixa">
                    <Card className="apple-card overflow-hidden bg-card border-border/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold">Títulos e Aplicações</CardTitle>
                      </CardHeader>
                      <CardContent className="px-0">
                        <AssetTable data={rendafixa} onEdit={setAssetToEdit} onDelete={setAssetToDelete} />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
            </motion.div>
          </>
        ) : (
          <EmptyState 
            icon={TrendingUp}
            title="Sua carteira está vazia"
            description="Comece a adicionar seus ativos para que possamos monitorar as cotações em tempo real."
            actionLabel="Cadastrar Novo Aporte"
            onAction={() => setIsModalOpen(true)}
          />
        )}
      </motion.div>
    </DashboardLayout>
  );
}
