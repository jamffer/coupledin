import { createFileRoute } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/layout-dashboard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Coins,
  Building2,
  Gem,
  ArrowRight,
  Loader2,
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
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/investimentos")({
  head: () => ({
    meta: [
      { title: "Investimentos | CoupleFinance" },
      { name: "description", content: "Acompanhe seus ativos em tempo real." },
    ],
  }),
  component: InvestimentosPage,
});

// Base assets in portfolio
const initialAcoes = [
  { ticker: "VALE3", name: "Vale S.A.", qty: 100, avgPrice: 65.40, currentPrice: 65.40, icon: "https://logo.clearbit.com/vale.com" },
  { ticker: "PETR4", name: "Petrobras", qty: 150, avgPrice: 32.10, currentPrice: 32.10, icon: "https://logo.clearbit.com/petrobras.com.br" },
  { ticker: "ITUB4", name: "Itaú Unibanco", qty: 200, avgPrice: 28.50, currentPrice: 28.50, icon: "https://logo.clearbit.com/itau.com.br" },
];

const initialFIIs = [
  { ticker: "HGLG11", name: "CSHG Logística", qty: 50, avgPrice: 160.00, currentPrice: 160.00, icon: "https://logo.clearbit.com/cshg.com.br" },
  { ticker: "KNRI11", name: "Kinea Renda", qty: 80, avgPrice: 155.20, currentPrice: 155.20, icon: "https://logo.clearbit.com/kinea.com.br" },
  { ticker: "XPML11", name: "XP Malls", qty: 120, avgPrice: 108.50, currentPrice: 108.50, icon: "https://logo.clearbit.com/xp.com.br" },
];

const initialCripto = [
  { ticker: "BTC", id: "bitcoin", name: "Bitcoin", qty: 0.05, avgPrice: 285000, currentPrice: 285000, icon: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png" },
  { ticker: "ETH", id: "ethereum", name: "Ethereum", qty: 1.2, avgPrice: 12500, currentPrice: 12500, icon: "https://assets.coingecko.com/coins/images/279/small/ethereum.png" },
  { ticker: "SOL", id: "solana", name: "Solana", qty: 15, avgPrice: 450, currentPrice: 450, icon: "https://assets.coingecko.com/coins/images/4128/small/solana.png" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

function AssetTable({ data }: { data: any[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border/40 hover:bg-transparent">
            <TableHead className="font-bold text-xs uppercase text-muted-foreground">Ativo</TableHead>
            <TableHead className="font-bold text-xs uppercase text-muted-foreground text-center">Qtd</TableHead>
            <TableHead className="font-bold text-xs uppercase text-muted-foreground text-right">P. Médio</TableHead>
            <TableHead className="font-bold text-xs uppercase text-muted-foreground text-right">P. Atual</TableHead>
            <TableHead className="font-bold text-xs uppercase text-muted-foreground text-right">Variação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((asset) => {
            const variation = ((asset.currentPrice - asset.avgPrice) / asset.avgPrice) * 100;
            const isPositive = variation >= 0;
            const profit = (asset.currentPrice - asset.avgPrice) * asset.qty;

            return (
              <TableRow key={asset.ticker} className="border-border/40 group hover:bg-muted/10 transition-colors">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg apple-glass p-1 flex items-center justify-center overflow-hidden">
                      <img src={asset.icon} alt={asset.ticker} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{asset.ticker}</p>
                      <p className="text-[10px] text-muted-foreground">{asset.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-medium">{asset.qty}</TableCell>
                <TableCell className="text-right font-medium">R$ {asset.avgPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell className="text-right font-bold">R$ {asset.currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                <TableCell className="text-right">
                  <div className={cn(
                    "flex flex-col items-end",
                    isPositive ? "text-emerald-600" : "text-rose-500"
                  )}>
                    <div className="flex items-center gap-1 text-sm font-black">
                      {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {variation.toFixed(2)}%
                    </div>
                    <span className="text-[10px] font-bold">
                      {isPositive ? '+' : ''} R$ {profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [acoes, setAcoes] = useState(initialAcoes);
  const [fiis, setFiis] = useState(initialFIIs);
  const [cripto, setCripto] = useState(initialCripto);

  const fetchStockPrices = async () => {
    try {
      const tickers = [...acoes, ...fiis].map(a => a.ticker).join(',');
      const response = await fetch(`https://brapi.dev/api/quote/${tickers}`);
      const data = await response.json();
      
      if (data.results) {
        setAcoes(prev => prev.map(stock => {
          const result = data.results.find((r: any) => r.symbol === stock.ticker);
          return result ? { ...stock, currentPrice: result.regularMarketPrice } : stock;
        }));
        setFiis(prev => prev.map(fii => {
          const result = data.results.find((r: any) => r.symbol === fii.ticker);
          return result ? { ...fii, currentPrice: result.regularMarketPrice } : fii;
        }));
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
      toast.error("Erro ao atualizar cotações da B3");
    }
  };

  const fetchCryptoPrices = async () => {
    try {
      const ids = cripto.map(c => c.id).join(',');
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=brl`);
      const data = await response.json();
      
      if (data) {
        setCripto(prev => prev.map(coin => {
          const price = data[coin.id]?.brl;
          return price ? { ...coin, currentPrice: price } : coin;
        }));
      }
    } catch (error) {
      console.error("Error fetching crypto:", error);
      toast.error("Erro ao atualizar criptoativos");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchStockPrices(), fetchCryptoPrices()]);
    setIsRefreshing(false);
    toast.success("Preços atualizados!");
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const totalPatrimony = [...acoes, ...fiis, ...cripto].reduce((acc, curr) => acc + (curr.qty * curr.currentPrice), 0);
  const totalCost = [...acoes, ...fiis, ...cripto].reduce((acc, curr) => acc + (curr.qty * curr.avgPrice), 0);
  const totalProfit = totalPatrimony - totalCost;

  return (
    <DashboardLayout>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 pb-10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Meus Investimentos</h1>
            <p className="text-muted-foreground italic">Patrimônio atualizado em tempo real.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="rounded-full apple-interactive border-border/40 gap-2"
              disabled={isRefreshing}
            >
              <RefreshCw size={16} className={cn(isRefreshing && "animate-spin")} />
              {isRefreshing ? "Atualizando..." : "Atualizar Preços"}
            </Button>
            <Button size="sm" className="rounded-full gap-2 shadow-lg">
              <Plus size={16} />
              Novo Ativo
            </Button>
          </div>
        </div>

        {/* Resumo Patrimonial */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants}>
            <Card className="apple-card apple-card-hover group card-gradient-blue border-none h-full">
              <CardContent className="p-8 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg text-white">
                    <Wallet size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 bg-white/10 px-3 py-1 rounded-full">Geral</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Patrimônio Total</p>
                  <h3 className="text-4xl font-black tracking-tight text-white mt-1">
                    R$ {totalPatrimony.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="apple-card apple-card-hover group card-gradient-magenta border-none h-full">
              <CardContent className="p-8 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-white/20 rounded-lg text-white">
                    <TrendingUp size={24} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/70 bg-white/10 px-3 py-1 rounded-full">Total Acumulado</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white/80">Lucro/Prejuízo Total</p>
                  <h3 className="text-4xl font-black tracking-tight text-white mt-1">
                    {totalProfit >= 0 ? '+' : ''} R$ {totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="apple-card apple-card-hover group h-full border-2 border-primary/5">
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Distribuição</span>
                  <ArrowRight size={16} className="text-primary" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Ações / FIIs</span>
                    <span className="text-sm font-bold text-primary">65%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted dark:bg-black rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '65%' }} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Cripto / Diversos</span>
                    <span className="text-sm font-bold text-secondary-foreground">35%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted dark:bg-black rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-foreground rounded-full" style={{ width: '35%' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Ativos Categorizados */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="acoes" className="w-full">
            <TabsList className="bg-muted dark:bg-black/40 p-1 rounded-2xl h-14 border border-border/40 gap-1 w-full md:w-fit overflow-x-auto no-scrollbar">
              <TabsTrigger value="rendafixa" className="rounded-xl px-6 h-11 data-[state=active]:apple-card data-[state=active]:shadow-md gap-2 transition-all">
                <Building2 size={16} />
                Renda Fixa
              </TabsTrigger>
              <TabsTrigger value="acoes" className="rounded-xl px-6 h-11 data-[state=active]:apple-card data-[state=active]:shadow-md gap-2 transition-all">
                <TrendingUp size={16} />
                Ações
              </TabsTrigger>
              <TabsTrigger value="fiis" className="rounded-xl px-6 h-11 data-[state=active]:apple-card data-[state=active]:shadow-md gap-2 transition-all">
                <Building2 size={16} />
                FIIs
              </TabsTrigger>
              <TabsTrigger value="cripto" className="rounded-xl px-6 h-11 data-[state=active]:apple-card data-[state=active]:shadow-md gap-2 transition-all">
                <Coins size={16} />
                Criptomoedas
              </TabsTrigger>
            </TabsList>

            <div className="mt-8">
              <TabsContent value="rendafixa">
                <Card className="apple-card p-8">
                  <div className="text-center space-y-4 py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                      <Gem size={32} />
                    </div>
                    <h3 className="text-xl font-bold">CDBs, LCIs e Tesouro</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">Em breve, você poderá conectar suas contas bancárias para importar seus títulos de renda fixa automaticamente.</p>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="acoes">
                <Card className="apple-card overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold">Ações Brasil</CardTitle>
                    <CardDescription>Cotações em tempo real via Brapi API.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <AssetTable data={acoes} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fiis">
                <Card className="apple-card overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold">Fundos Imobiliários</CardTitle>
                    <CardDescription>Acompanhe o rendimento dos seus proventos.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <AssetTable data={fiis} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cripto">
                <Card className="apple-card overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold">Criptoativos</CardTitle>
                    <CardDescription>Dados globais via CoinGecko API.</CardDescription>
                  </CardHeader>
                  <CardContent className="px-0">
                    <AssetTable data={cripto} />
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
