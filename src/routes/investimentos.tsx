import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
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
  Activity,
  ChevronDown,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { cn, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { useInvestmentPortfolio, ConsolidatedAsset } from "@/hooks/use-investment-portfolio";
import { NewAssetModal } from "@/components/investments/new-asset-modal";
import { EditAssetModal } from "@/components/investments/edit-asset-modal";
import { AssetDetails } from "@/components/investments/asset-details";
import { PortfolioAllocationChart } from "@/components/investments/portfolio-allocation-chart";
import { useDeleteInvestment } from "@/hooks/use-investment-mutations";
import { Database } from "@/integrations/supabase/types";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/investimentos")({
  head: () => ({
    meta: [
      { title: "Investimentos | CoupleDin" },
      { name: "description", content: "Acompanhe seus ativos consolidados em tempo real." },
    ],
  }),
  component: InvestimentosPage,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

type RawInvestment = Database["public"]["Tables"]["investments"]["Row"];

function ConsolidatedAssetCards({
  data,
  portfolioTotal,
  onEdit,
  onDelete,
}: {
  data: ConsolidatedAsset[];
  portfolioTotal: number;
  onEdit: (asset: RawInvestment) => void;
  onDelete: (asset: RawInvestment, ticker: string) => void;
}) {
  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground font-medium">
        Nenhum ativo cadastrado nesta aba.
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="space-y-4 w-full">
      {data.map((asset) => {
        const isPositive = asset.profit_loss_percentage > 0;
        const isNegative = asset.profit_loss_percentage < 0;

        return (
          <AccordionItem value={asset.id} key={asset.id} className="border-none">
            <Card className="apple-card group border-border/40 hover:border-primary/20 transition-all overflow-hidden">
              <AccordionTrigger className="hover:no-underline py-0 [&[data-state=open]>div>div:last-child>svg]:rotate-180 cursor-pointer">
                <CardContent className="p-4 sm:p-6 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Side: Icon & Ticker */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-muted/50 border border-border/40 flex items-center justify-center shrink-0">
                      {asset.asset_type === "CRYPTO" ? (
                        <Coins size={20} className="text-secondary-foreground" />
                      ) : asset.asset_type === "FIXED_INCOME" ? (
                        <Building2 size={20} className="text-amber-500" />
                      ) : (
                        <Activity size={20} className="text-primary" />
                      )}
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-black uppercase tracking-tight">
                        {asset.ticker}
                      </h3>
                      <p className="text-xs font-medium text-muted-foreground">
                        {asset.total_quantity} cotas | P.M {formatCurrency(asset.average_price)}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Balances & Accordion Icon */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8 w-full sm:w-auto mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-border/20">
                    <div className="text-left sm:text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        Saldo Atual
                      </p>
                      <p className="text-base sm:text-lg font-black">
                        {formatCurrency(asset.current_value)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                        P&L
                      </p>
                      <div
                        className={cn(
                          "flex items-center gap-1 font-bold text-sm",
                          isPositive
                            ? "text-emerald-500"
                            : isNegative
                              ? "text-rose-500"
                              : "text-muted-foreground",
                        )}
                      >
                        {isPositive && <ArrowUp size={14} />}
                        {isNegative && <ArrowDown size={14} />}
                        {!isPositive && !isNegative && <span className="mr-1">-</span>}
                        {Math.abs(asset.profit_loss_percentage).toFixed(2)}%
                      </div>
                      <p
                        className={cn(
                          "text-[10px] font-bold",
                          isPositive
                            ? "text-emerald-500/80"
                            : isNegative
                              ? "text-rose-500/80"
                              : "text-muted-foreground",
                        )}
                      >
                        {isPositive ? "+" : ""}
                        {formatCurrency(asset.profit_loss_value)}
                      </p>
                    </div>

                    {/* Accordion Chevron Wrapper */}
                    <div className="hidden sm:flex text-muted-foreground/50 transition-transform duration-200">
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
              </AccordionTrigger>

              <AccordionContent className="bg-muted/10 border-t border-border/20 px-4 sm:px-6 py-4">
                <AssetDetails
                  asset={asset}
                  portfolioTotal={portfolioTotal}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </AccordionContent>
            </Card>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export function InvestimentosPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<RawInvestment | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<{ raw: RawInvestment; ticker: string } | null>(
    null,
  );

  const deleteMutation = useDeleteInvestment();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/auth" });
    }
  }, [user, authLoading, navigate]);

  const {
    investments,
    totalPatrimony,
    totalInvested,
    totalProfitPercentage,
    topAsset,
    isLoading,
    isRefetching,
    refetch,
    isError,
  } = useInvestmentPortfolio();

  const handleRefresh = async () => {
    await refetch();
    toast.success("Preços atualizados via API!");
  };

  const handleConfirmDelete = () => {
    if (assetToDelete) {
      deleteMutation.mutate(
        { id: assetToDelete.raw.id, ticker: assetToDelete.ticker },
        {
          onSuccess: () => {
            setAssetToDelete(null);
          },
        },
      );
    }
  };

  const totalProfit = totalPatrimony - totalInvested;
  const isGlobalPositive = totalProfitPercentage > 0;
  const isGlobalNegative = totalProfitPercentage < 0;

  const hasInvestments = investments && investments.length > 0;

  const acoes = investments?.filter((i) => i.asset_type === "STOCK") || [];
  const fiis = investments?.filter((i) => i.asset_type === "FII") || [];
  const cripto = investments?.filter((i) => i.asset_type === "CRYPTO") || [];
  const rendafixa = investments?.filter((i) => i.asset_type === "FIXED_INCOME") || [];

  return (
    <DashboardLayout>
      <NewAssetModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EditAssetModal
        isOpen={!!assetToEdit}
        onClose={() => setAssetToEdit(null)}
        asset={assetToEdit}
      />

      <AlertDialog open={!!assetToDelete} onOpenChange={(open) => !open && setAssetToDelete(null)}>
        <AlertDialogContent className="apple-card rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Aporte?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este aporte em{" "}
              <strong className="uppercase">{assetToDelete?.ticker}</strong>? A rentabilidade e o
              preço médio do ativo serão recalculados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending} className="rounded-xl">
              Cancelar
            </AlertDialogCancel>
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
            <h1 className="text-2xl font-bold tracking-tight">Carteira Consolidada</h1>
            <p className="text-muted-foreground italic">
              Seus ativos agrupados e atualizados em tempo real.
            </p>
          </div>
          {hasInvestments && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="rounded-full apple-interactive border-border/40 gap-2"
                disabled={isRefetching || isLoading}
              >
                <RefreshCw
                  size={16}
                  className={cn((isRefetching || isLoading) && "animate-spin")}
                />
                {isRefetching || isLoading ? "Buscando..." : "Atualizar"}
              </Button>
              <Button
                size="sm"
                className="rounded-full gap-2 shadow-lg"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={16} />
                Novo Aporte
              </Button>
            </div>
          )}
        </div>

        {isError && hasInvestments && (
          <div className="bg-rose-500/10 text-rose-500 p-4 rounded-xl border border-rose-500/20 font-medium flex items-center gap-3">
            <Activity size={20} />
            Houve um erro de rede em algumas integrações. Exibindo últimos preços cacheados ou o
            preço médio.
          </div>
        )}

        {isError && !hasInvestments ? (
          <div className="bg-rose-500/10 text-rose-500 p-12 rounded-3xl border border-rose-500/20 flex flex-col items-center justify-center text-center gap-4 shadow-sm">
            <div className="p-4 bg-rose-500/20 rounded-full">
              <Activity size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Falha ao Carregar</h3>
              <p className="text-sm opacity-80 max-w-md mx-auto">
                Não foi possível carregar seus investimentos no momento. Verifique sua conexão ou
                tente novamente.
              </p>
            </div>
            <Button
              onClick={() => refetch()}
              variant="outline"
              className="mt-4 border-rose-500/30 text-rose-500 hover:bg-rose-500/20"
            >
              <RefreshCw size={16} className="mr-2" /> Tentar Novamente
            </Button>
          </div>
        ) : isLoading ? (
          // Skeletons Premium para carregamento
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-2xl w-full apple-card" />
              ))}
            </div>
            <Skeleton className="h-14 w-full max-w-md rounded-2xl apple-card" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-2xl apple-card" />
              ))}
            </div>
          </div>
        ) : hasInvestments ? (
          <>
            {/* Top Cards: Métricas Globais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div variants={itemVariants}>
                <Card className="apple-card group card-gradient-blue border-none h-full shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent backdrop-blur-sm pointer-events-none" />
                  <CardContent className="p-6 md:p-8 flex flex-col justify-between h-full relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/20 rounded-lg text-white">
                        <Wallet size={24} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 bg-black/20 px-3 py-1 rounded-full backdrop-blur-md">
                        Consolidado
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/80">Patrimônio Total</p>
                      <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-1">
                        {formatCurrency(totalPatrimony)}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="apple-card group card-gradient-magenta border-none h-full shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent backdrop-blur-sm pointer-events-none" />
                  <CardContent className="p-6 md:p-8 flex flex-col justify-between h-full relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/20 rounded-lg text-white">
                        <TrendingUp size={24} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/90 bg-black/20 px-3 py-1 rounded-full backdrop-blur-md">
                        P&L Geral
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/80 flex items-center gap-1">
                        Rentabilidade da Carteira
                        <span
                          className={cn(
                            "ml-1 font-bold",
                            isGlobalPositive
                              ? "text-emerald-300"
                              : isGlobalNegative
                                ? "text-rose-300"
                                : "text-white",
                          )}
                        >
                          ({isGlobalPositive ? "+" : ""}
                          {totalProfitPercentage.toFixed(2)}%)
                        </span>
                      </p>
                      <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white mt-1 flex items-center gap-2">
                        {isGlobalPositive && <ArrowUp size={24} className="text-emerald-300" />}
                        {isGlobalNegative && <ArrowDown size={24} className="text-rose-300" />}
                        {formatCurrency(totalProfit)}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="apple-card h-full border-border/40 bg-card overflow-hidden relative group">
                  <CardContent className="p-6 md:p-8 flex flex-col justify-between h-full relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-primary/10 text-primary rounded-lg">
                        <Building2 size={24} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full">
                        Maior Posição
                      </span>
                    </div>

                    {topAsset ? (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {topAsset.ticker}
                        </p>
                        <div className="flex items-end justify-between mt-1">
                          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-primary">
                            {((topAsset.current_value / totalPatrimony) * 100).toFixed(1)}%
                          </h3>
                          <span className="text-sm font-bold text-muted-foreground pb-1">
                            {formatCurrency(topAsset.current_value)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Nenhum ativo</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            <motion.div variants={itemVariants}>
              <PortfolioAllocationChart assets={investments} totalPatrimony={totalPatrimony} />
            </motion.div>

            {/* Ativos Categorizados - Cartões Expansíveis */}
            <motion.div variants={itemVariants}>
              <Tabs defaultValue="visaogeral" className="w-full">
                <TabsList className="bg-muted/50 p-1 rounded-2xl h-auto border border-border/40 gap-1 w-full md:w-fit flex-wrap md:flex-nowrap justify-start">
                  <TabsTrigger
                    value="visaogeral"
                    className="rounded-xl px-6 h-11 data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2 transition-all"
                  >
                    <Activity size={16} />
                    Visão Geral
                  </TabsTrigger>
                  <TabsTrigger
                    value="acoes_fiis"
                    className="rounded-xl px-6 h-11 data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2 transition-all"
                  >
                    <TrendingUp size={16} />
                    Renda Variável
                  </TabsTrigger>
                  <TabsTrigger
                    value="cripto"
                    className="rounded-xl px-6 h-11 data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2 transition-all"
                  >
                    <Coins size={16} />
                    Criptomoedas
                  </TabsTrigger>
                  <TabsTrigger
                    value="rendafixa"
                    className="rounded-xl px-6 h-11 data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2 transition-all"
                  >
                    <Building2 size={16} />
                    Renda Fixa
                  </TabsTrigger>
                </TabsList>

                <div className="mt-8">
                  <TabsContent value="visaogeral" className="mt-0">
                    <ConsolidatedAssetCards
                      data={investments}
                      portfolioTotal={totalPatrimony}
                      onEdit={setAssetToEdit}
                      onDelete={(raw, ticker) => setAssetToDelete({ raw, ticker })}
                    />
                  </TabsContent>

                  <TabsContent value="acoes_fiis" className="mt-0">
                    <ConsolidatedAssetCards
                      data={[...acoes, ...fiis]}
                      portfolioTotal={totalPatrimony}
                      onEdit={setAssetToEdit}
                      onDelete={(raw, ticker) => setAssetToDelete({ raw, ticker })}
                    />
                  </TabsContent>

                  <TabsContent value="cripto" className="mt-0">
                    <ConsolidatedAssetCards
                      data={cripto}
                      portfolioTotal={totalPatrimony}
                      onEdit={setAssetToEdit}
                      onDelete={(raw, ticker) => setAssetToDelete({ raw, ticker })}
                    />
                  </TabsContent>

                  <TabsContent value="rendafixa" className="mt-0">
                    <ConsolidatedAssetCards
                      data={rendafixa}
                      portfolioTotal={totalPatrimony}
                      onEdit={setAssetToEdit}
                      onDelete={(raw, ticker) => setAssetToDelete({ raw, ticker })}
                    />
                  </TabsContent>
                </div>
              </Tabs>
            </motion.div>
          </>
        ) : (
          <EmptyState
            icon={TrendingUp}
            title="Sua carteira está vazia"
            description="Comece a adicionar seus ativos para criar sua carteira consolidada e acompanhar a rentabilidade."
            actionLabel="Cadastrar Novo Aporte"
            onAction={() => setIsModalOpen(true)}
          />
        )}
      </motion.div>
    </DashboardLayout>
  );
}
