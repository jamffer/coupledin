import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { D as DashboardLayout, u as useProfile, i as Dialog, j as DialogContent, k as DialogHeader, l as DialogTitle, m as DialogDescription, S as Select, b as SelectTrigger, c as SelectValue, d as SelectContent, e as SelectItem } from "./layout-dashboard-DYPsAunJ.mjs";
import { B as Button, c as cn, C as Card, a as CardContent, f as formatCurrency, b as CardHeader, d as CardTitle } from "./card-DDGnP21B.mjs";
import { A as AlertDialog, f as AlertDialogContent, g as AlertDialogHeader, h as AlertDialogTitle, i as AlertDialogDescription, j as AlertDialogFooter, k as AlertDialogCancel, l as AlertDialogAction, T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./alert-dialog-ryeMzYsQ.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-0rhnvL4x.mjs";
import { u as useAuth } from "./router--zSI1aDr.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { E as EmptyState } from "./empty-state-Bu9yyJzT.mjs";
import { u as useQueryClient, b as useMutation, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CRCA7PsU.mjs";
import { u as useForm } from "../_libs/react-hook-form.mjs";
import { u } from "../_libs/hookform__resolvers.mjs";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormMessage } from "./form-D5bNUzYw.mjs";
import { I as Input } from "./label-BppqprV3.mjs";
import { R as RadioGroup, a as RadioGroupItem } from "./radio-group-JRkNOusG.mjs";
import { _ as _e } from "../_libs/cmdk.mjs";
import { R as Root2, T as Trigger, P as Portal, C as Content2 } from "../_libs/radix-ui__react-popover.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem } from "./dropdown-menu-D986qVQP.mjs";
import { m as RefreshCw, P as Plus, W as Wallet, e as TrendingUp, n as Activity, o as Coins, B as Building2, L as LoaderCircle, p as ArrowUp, q as ArrowDown, E as EllipsisVertical, r as Pencil, T as Trash2, s as ChevronsUpDown, t as CircleAlert, h as Check, u as Search } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { o as object, q as number, c as string, _ as _enum } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/react-easy-crop.mjs";
import "tslib";
import "../_libs/normalize-wheel.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/radix-ui__react-slider.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/radix-ui__react-separator.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/zustand.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const CACHE_TTL = 5 * 60 * 1e3;
function getCachedPrice(key) {
  const cached = localStorage.getItem(`finance_cache_${key}`);
  if (cached) {
    try {
      const entry = JSON.parse(cached);
      if (Date.now() - entry.timestamp < CACHE_TTL) {
        return entry.value;
      }
    } catch (e) {
    }
  }
  return null;
}
function setCachedPrice(key, value) {
  const entry = { value, timestamp: Date.now() };
  localStorage.setItem(`finance_cache_${key}`, JSON.stringify(entry));
}
async function fetchBrapiQuote(ticker) {
  const cleanTicker = ticker.toUpperCase().trim();
  const cacheKey = `brapi_${cleanTicker}`;
  const cached = getCachedPrice(cacheKey);
  if (cached !== null) return cached;
  const token = "mAKZZFb1bZdvqWvjgvGVCD";
  const url = `https://brapi.dev/api/quote/${cleanTicker}?token=${token}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Falha ao buscar cotação na Brapi");
    const data = await res.json();
    if (data.results && data.results[0] && data.results[0].regularMarketPrice) {
      const price = data.results[0].regularMarketPrice;
      setCachedPrice(cacheKey, price);
      return price;
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar Brapi para ${cleanTicker}:`, error);
    return null;
  }
}
const CRYPTO_DICTIONARY = {
  "BTC": "bitcoin",
  "ETH": "ethereum",
  "SOL": "solana",
  "ADA": "cardano",
  "DOT": "polkadot",
  "DOGE": "dogecoin",
  "USDT": "tether",
  "BNB": "binancecoin",
  "XRP": "ripple"
};
async function fetchCryptoQuote(tickerId) {
  const rawTicker = tickerId.toUpperCase().trim();
  const cleanTicker = CRYPTO_DICTIONARY[rawTicker] || tickerId.toLowerCase().trim();
  const cacheKey = `crypto_${cleanTicker}`;
  const cached = getCachedPrice(cacheKey);
  if (cached !== null) return cached;
  try {
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${cleanTicker}&vs_currencies=brl`);
    if (!res.ok) throw new Error("Falha ao buscar preço na CoinGecko");
    const data = await res.json();
    if (data[cleanTicker] && data[cleanTicker].brl) {
      const price = data[cleanTicker].brl;
      setCachedPrice(cacheKey, price);
      return price;
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar Crypto para ${cleanTicker}:`, error);
    return null;
  }
}
async function fetchTreasuryQuote(ticker) {
  const cleanTicker = ticker.trim();
  const cacheKey = `treasury_${cleanTicker}`;
  const cached = getCachedPrice(cacheKey);
  if (cached !== null) return cached;
  const token = "mAKZZFb1bZdvqWvjgvGVCD";
  const url = `https://brapi.dev/api/v2/treasury/indicators?symbols=${cleanTicker}&token=${token}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Falha ao buscar Tesouro na Brapi");
    const data = await res.json();
    if (data.error) throw new Error(data.message);
    if (data.results && data.results[0] && data.results[0].value) {
      const price = data.results[0].value;
      setCachedPrice(cacheKey, price);
      return price;
    }
    return null;
  } catch (error) {
    console.error(`Erro ao buscar Tesouro Direto para ${cleanTicker}:`, error);
    return null;
  }
}
function calculateFixedIncomeCurrentValue(averagePrice, quantity, purchaseDate, customRatePercentage) {
  const start = new Date(purchaseDate);
  const now = /* @__PURE__ */ new Date();
  const principal = averagePrice * quantity;
  if (isNaN(start.getTime())) return principal;
  const monthsDiff = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (monthsDiff <= 0) return principal;
  const rateDecimal = customRatePercentage / 100;
  return principal * Math.pow(1 + rateDecimal, monthsDiff);
}
function useInvestmentPortfolio() {
  const { profile } = useProfile();
  const query = useQuery({
    queryKey: ["investments", profile?.couple_id],
    enabled: !!profile?.couple_id,
    queryFn: async () => {
      const { data: investments, error } = await supabase.from("investments").select("*").eq("couple_id", profile.couple_id).order("created_at", { ascending: false });
      if (error) throw error;
      if (!investments) return [];
      const enrichedPromises = investments.map(async (inv) => {
        let current_price = Number(inv.average_price);
        if (inv.asset_type === "STOCK" || inv.asset_type === "FII") {
          const quote = await fetchBrapiQuote(inv.ticker);
          if (quote !== null) current_price = quote;
        } else if (inv.asset_type === "CRYPTO") {
          const quote = await fetchCryptoQuote(inv.ticker);
          if (quote !== null) current_price = quote;
        } else if (inv.asset_type === "FIXED_INCOME") {
          const customRate = Number(inv.custom_rate || 0);
          if (customRate > 0) {
            const totalVal = calculateFixedIncomeCurrentValue(
              Number(inv.average_price),
              Number(inv.quantity),
              inv.purchase_date,
              customRate
            );
            current_price = Number(inv.quantity) > 0 ? totalVal / Number(inv.quantity) : 0;
          } else {
            const quote = await fetchTreasuryQuote(inv.ticker);
            if (quote !== null) current_price = quote;
          }
        }
        const quantity = Number(inv.quantity);
        const average_price = Number(inv.average_price);
        const total_invested = quantity * average_price;
        const current_value = quantity * current_price;
        const profit_loss_percentage = total_invested > 0 ? (current_value / total_invested - 1) * 100 : 0;
        return {
          ...inv,
          current_price,
          total_invested,
          current_value,
          profit_loss_percentage
        };
      });
      const results = await Promise.allSettled(enrichedPromises);
      const enriched = results.map((res, index) => {
        if (res.status === "fulfilled") {
          return res.value;
        } else {
          console.error("Falha ao enriquecer ativo", investments[index].ticker, res.reason);
          const inv = investments[index];
          const quantity = Number(inv.quantity);
          const average_price = Number(inv.average_price);
          const total_invested = quantity * average_price;
          return {
            ...inv,
            current_price: average_price,
            total_invested,
            current_value: total_invested,
            profit_loss_percentage: 0
          };
        }
      });
      return enriched;
    },
    staleTime: 1e3 * 60 * 5,
    // 5 minutos de cache no React Query
    refetchInterval: 1e3 * 60 * 5
    // Atualização a cada 5 minutos
  });
  const enrichedInvestments = query.data || [];
  const totalPatrimony = enrichedInvestments.reduce((sum, inv) => sum + inv.current_value, 0);
  const totalInvested = enrichedInvestments.reduce((sum, inv) => sum + inv.total_invested, 0);
  const totalProfitPercentage = totalInvested > 0 ? (totalPatrimony / totalInvested - 1) * 100 : 0;
  return {
    ...query,
    investments: enrichedInvestments,
    totalPatrimony,
    totalInvested,
    totalProfitPercentage
  };
}
const Command = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e,
  {
    ref,
    className: cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    ),
    ...props
  }
));
Command.displayName = _e.displayName;
const CommandInput = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center border-b px-3", "cmdk-input-wrapper": "", children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }),
  /* @__PURE__ */ jsxRuntimeExports.jsx(
    _e.Input,
    {
      ref,
      className: cn(
        "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props
    }
  )
] }));
CommandInput.displayName = _e.Input.displayName;
const CommandList = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.List,
  {
    ref,
    className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
    ...props
  }
));
CommandList.displayName = _e.List.displayName;
const CommandEmpty = reactExports.forwardRef((props, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(_e.Empty, { ref, className: "py-6 text-center text-sm", ...props }));
CommandEmpty.displayName = _e.Empty.displayName;
const CommandGroup = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Group,
  {
    ref,
    className: cn(
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    ),
    ...props
  }
));
CommandGroup.displayName = _e.Group.displayName;
const CommandSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Separator,
  {
    ref,
    className: cn("-mx-1 h-px bg-border", className),
    ...props
  }
));
CommandSeparator.displayName = _e.Separator.displayName;
const CommandItem = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  _e.Item,
  {
    ref,
    className: cn(
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    ),
    ...props
  }
));
CommandItem.displayName = _e.Item.displayName;
const Popover = Root2;
const PopoverTrigger = Trigger;
const PopoverContent = reactExports.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    align,
    sideOffset,
    className: cn(
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
PopoverContent.displayName = Content2.displayName;
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = reactExports.useState(value);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}
const FIXED_INCOME_PUBLIC = [
  { value: "SELIC2026", label: "Tesouro Selic 2026", subtitle: "Pós-fixado · Selic" },
  { value: "SELIC2029", label: "Tesouro Selic 2029", subtitle: "Pós-fixado · Selic" },
  { value: "IPCA2029", label: "Tesouro IPCA+ 2029", subtitle: "Híbrido · IPCA + taxa" },
  { value: "IPCA2035", label: "Tesouro IPCA+ 2035", subtitle: "Híbrido · IPCA + taxa" },
  { value: "IPCA2045", label: "Tesouro IPCA+ c/ Juros 2045", subtitle: "Híbrido · Juros semestrais" },
  { value: "PREFIXADO2027", label: "Tesouro Prefixado 2027", subtitle: "Prefixado" },
  { value: "PREFIXADO2031", label: "Tesouro Prefixado 2031", subtitle: "Prefixado · Juros semestrais" },
  { value: "RENDA+2030", label: "Tesouro Renda+ 2030", subtitle: "Aposentadoria complementar" },
  { value: "EDUCA+2030", label: "Tesouro Educa+ 2030", subtitle: "Educação" }
];
const FIXED_INCOME_PRIVATE = [
  { value: "CDB_PRE", label: "CDB Prefixado", subtitle: "Banco · Taxa fixa" },
  { value: "CDB_CDI", label: "CDB Pós-fixado (CDI)", subtitle: "Banco · % do CDI" },
  { value: "CDB_IPCA", label: "CDB IPCA+", subtitle: "Banco · IPCA + spread" },
  { value: "LCI", label: "LCI", subtitle: "Letra de Crédito Imobiliário · Isenta de IR" },
  { value: "LCA", label: "LCA", subtitle: "Letra de Crédito do Agronegócio · Isenta de IR" },
  { value: "LC", label: "LC (Letra de Câmbio)", subtitle: "Financeira · Renda fixa" },
  { value: "DEBENTURE", label: "Debênture", subtitle: "Empresa · Crédito privado" },
  { value: "CRI", label: "CRI", subtitle: "Certificado de Recebíveis Imobiliários" },
  { value: "CRA", label: "CRA", subtitle: "Certificado de Recebíveis do Agronegócio" }
];
function searchFixedIncome(query, subType) {
  const list = subType === "PUBLIC" ? FIXED_INCOME_PUBLIC : FIXED_INCOME_PRIVATE;
  if (!query) return list;
  const q = query.toLowerCase();
  return list.filter(
    (item) => item.label.toLowerCase().includes(q) || item.value.toLowerCase().includes(q) || item.subtitle?.toLowerCase().includes(q)
  );
}
let brapiCache = null;
let brapiFetchPromise = null;
async function fetchBrapiList() {
  if (brapiCache) return brapiCache;
  if (brapiFetchPromise) return brapiFetchPromise;
  brapiFetchPromise = (async () => {
    try {
      const res = await fetch("https://brapi.dev/api/available");
      if (!res.ok) throw new Error(`Brapi ${res.status}`);
      const json = await res.json();
      const tickers = json.stocks || [];
      brapiCache = tickers.map((t) => ({
        value: t,
        label: t,
        subtitle: "B3"
      }));
      return brapiCache;
    } catch (err) {
      console.warn("[asset-search] Brapi fetch failed, falling back to empty list", err);
      brapiFetchPromise = null;
      return [];
    }
  })();
  return brapiFetchPromise;
}
async function searchBrapi(query) {
  const list = await fetchBrapiList();
  if (!query) return list.slice(0, 30);
  const q = query.toUpperCase();
  return list.filter((item) => item.value.includes(q)).slice(0, 30);
}
async function searchCoinGecko(query) {
  if (!query || query.length < 2) return [];
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    const json = await res.json();
    const coins = json.coins || [];
    return coins.slice(0, 20).map((c) => ({
      value: c.id,
      label: `${c.symbol.toUpperCase()}`,
      subtitle: c.name
    }));
  } catch (err) {
    console.warn("[asset-search] CoinGecko search failed", err);
    return [];
  }
}
function TickerCombobox({
  assetType,
  fixedIncomeType = "PRIVATE",
  value,
  onChange,
  placeholder
}) {
  const [open, setOpen] = reactExports.useState(false);
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [results, setResults] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [hasError, setHasError] = reactExports.useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const computedPlaceholder = placeholder ?? (assetType === "CRYPTO" ? "Ex: bitcoin" : assetType === "FIXED_INCOME" ? fixedIncomeType === "PUBLIC" ? "Ex: Tesouro Selic" : "Ex: CDB Prefixado" : "Ex: PETR4");
  const performSearch = reactExports.useCallback(
    async (query) => {
      setIsLoading(true);
      setHasError(false);
      try {
        let data = [];
        if (assetType === "FIXED_INCOME") {
          data = searchFixedIncome(query, fixedIncomeType);
        } else if (assetType === "STOCK" || assetType === "FII") {
          data = await searchBrapi(query);
        } else if (assetType === "CRYPTO") {
          data = await searchCoinGecko(query);
        }
        setResults(data);
      } catch {
        setHasError(true);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [assetType, fixedIncomeType]
  );
  reactExports.useEffect(() => {
    performSearch(debouncedSearch);
  }, [debouncedSearch, performSearch]);
  reactExports.useEffect(() => {
    if (open && results.length === 0 && !isLoading) {
      performSearch("");
    }
  }, [open]);
  reactExports.useEffect(() => {
    setResults([]);
    setSearchTerm("");
  }, [assetType, fixedIncomeType]);
  const selectedLabel = results.find((r) => r.value === value)?.label || value || void 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        role: "combobox",
        "aria-expanded": open,
        className: cn(
          "w-full justify-between apple-interactive rounded-xl font-normal h-9 px-3",
          !value && "text-muted-foreground"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: selectedLabel ?? computedPlaceholder }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronsUpDown, { className: "ml-2 h-4 w-4 shrink-0 opacity-50" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PopoverContent,
      {
        className: "w-[--radix-popover-trigger-width] p-0 apple-card rounded-xl shadow-xl border-border/40",
        align: "start",
        sideOffset: 6,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Command, { shouldFilter: false, className: "rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CommandInput,
            {
              placeholder: `Buscar ${assetType === "CRYPTO" ? "cripto" : assetType === "FIXED_INCOME" ? "título" : "ticker"}...`,
              value: searchTerm,
              onValueChange: setSearchTerm,
              className: "h-10"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CommandList, { className: "max-h-[220px]", children: [
            isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Buscando ativos..." })
            ] }),
            !isLoading && hasError && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2 py-6 text-sm text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-5 w-5 text-destructive/60" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Falha na busca. Tente novamente." })
            ] }),
            !isLoading && !hasError && results.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CommandEmpty, { children: "Nenhum ativo encontrado." }),
            !isLoading && results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(CommandGroup, { children: results.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              CommandItem,
              {
                value: item.value,
                onSelect: (currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                },
                className: "flex items-center gap-2 cursor-pointer rounded-lg px-2 py-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Check,
                    {
                      className: cn(
                        "h-4 w-4 shrink-0",
                        value === item.value ? "opacity-100 text-primary" : "opacity-0"
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold truncate", children: item.label }),
                    item.subtitle && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground truncate", children: item.subtitle })
                  ] })
                ]
              },
              item.value
            )) })
          ] })
        ] })
      }
    )
  ] });
}
const assetSchema = object({
  asset_type: _enum(["STOCK", "FII", "CRYPTO", "FIXED_INCOME"]),
  fixed_income_type: _enum(["PUBLIC", "PRIVATE"]).optional(),
  ticker: string().min(1, "Obrigatório").toUpperCase(),
  quantity: number().positive("Deve ser maior que zero"),
  average_price: number().positive("Deve ser maior que zero"),
  purchase_date: string().min(1, "Data obrigatória"),
  custom_rate: number().optional().default(0)
});
function NewAssetModal({ isOpen, onClose }) {
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: u(assetSchema),
    defaultValues: {
      asset_type: "STOCK",
      fixed_income_type: "PRIVATE",
      ticker: "",
      quantity: 1,
      average_price: 0,
      purchase_date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      custom_rate: 0
    }
  });
  const assetType = form.watch("asset_type");
  const fixedIncomeType = form.watch("fixed_income_type");
  reactExports.useEffect(() => {
    form.setValue("ticker", "");
  }, [assetType, fixedIncomeType]);
  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!profile?.couple_id) throw new Error("Couple ID não encontrado");
      const finalCustomRate = values.asset_type === "FIXED_INCOME" && values.fixed_income_type === "PUBLIC" ? 0 : values.custom_rate;
      const { data, error } = await supabase.from("investments").insert({
        couple_id: profile.couple_id,
        asset_type: values.asset_type,
        ticker: values.ticker,
        quantity: values.quantity,
        average_price: values.average_price,
        purchase_date: values.purchase_date,
        custom_rate: finalCustomRate
      }).select().single();
      if (error) throw error;
      return data;
    },
    onMutate: async (newAsset) => {
      await queryClient.cancelQueries({ queryKey: ["investments", profile?.couple_id] });
      const previousInvestments = queryClient.getQueryData(["investments", profile?.couple_id]);
      queryClient.setQueryData(["investments", profile?.couple_id], (old) => {
        const optimisticAsset = {
          ...newAsset,
          id: `temp-${Math.random().toString(36).substring(2, 15)}`,
          couple_id: profile?.couple_id,
          custom_rate: newAsset.asset_type === "FIXED_INCOME" && newAsset.fixed_income_type === "PUBLIC" ? 0 : newAsset.custom_rate,
          created_at: (/* @__PURE__ */ new Date()).toISOString(),
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        };
        return old ? [optimisticAsset, ...old] : [optimisticAsset];
      });
      return { previousInvestments };
    },
    onError: (err, newAsset, context) => {
      if (context?.previousInvestments) {
        queryClient.setQueryData(["investments", profile?.couple_id], context.previousInvestments);
      }
      toast.error("Erro ao salvar ativo", { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["investments", profile?.couple_id] });
    },
    onSuccess: () => {
      toast.success("Ativo adicionado com sucesso!");
      form.reset();
      onClose();
    }
  });
  const onSubmit = (values) => {
    mutation.mutate(values);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isOpen, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "apple-card sm:max-w-[425px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Novo Aporte" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Cadastre um novo ativo ou aporte na sua carteira." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name: "asset_type",
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Tipo de Ativo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "apple-interactive rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o tipo" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "apple-card rounded-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "STOCK", children: "Ações" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "FII", children: "Fundos Imobiliários (FIIs)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "CRYPTO", children: "Criptomoedas" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "FIXED_INCOME", children: "Renda Fixa" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] })
        }
      ),
      assetType === "FIXED_INCOME" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name: "fixed_income_type",
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "space-y-3 p-3 bg-muted/40 rounded-xl border border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Qual a natureza da Renda Fixa?" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              RadioGroup,
              {
                onValueChange: field.onChange,
                defaultValue: field.value,
                className: "flex flex-col space-y-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "flex items-center space-x-3 space-y-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: "PUBLIC" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "font-normal cursor-pointer", children: "Tesouro Direto (Ex: SELIC, IPCA)" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "flex items-center space-x-3 space-y-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { value: "PRIVATE" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "font-normal cursor-pointer", children: "Títulos Privados (CDB, LCI com taxa fixa)" })
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "ticker",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: assetType === "FIXED_INCOME" && fixedIncomeType === "PRIVATE" ? "Nome do Título" : assetType === "FIXED_INCOME" && fixedIncomeType === "PUBLIC" ? "Símbolo Tesouro" : "Ticker / Símbolo" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                TickerCombobox,
                {
                  assetType,
                  fixedIncomeType,
                  value: field.value,
                  onChange: field.onChange
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "quantity",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Quantidade" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.00000001", className: "apple-interactive rounded-xl", ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "average_price",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Preço Médio / Valor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", className: "apple-interactive rounded-xl", ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "purchase_date",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Data da Compra" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", className: "apple-interactive rounded-xl", ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        )
      ] }),
      assetType === "FIXED_INCOME" && fixedIncomeType === "PRIVATE" && /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name: "custom_rate",
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Taxa Mensal (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", placeholder: "1.0", className: "apple-interactive rounded-xl", ...field }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "submit",
          className: "w-full h-12 rounded-xl text-base font-bold shadow-lg mt-6",
          disabled: mutation.isPending,
          children: [
            mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin mr-2" }) : null,
            mutation.isPending ? "Salvando..." : "Salvar Aporte"
          ]
        }
      )
    ] }) })
  ] }) });
}
function useUpdateInvestment() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      if (!profile?.couple_id) throw new Error("Couple ID não encontrado");
      const { data, error } = await supabase.from("investments").update({
        quantity: payload.quantity,
        average_price: payload.average_price,
        custom_rate: payload.custom_rate,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }).eq("id", payload.id).eq("couple_id", profile.couple_id).select().single();
      if (error) throw error;
      return data;
    },
    onMutate: async (updatedAsset) => {
      const queryKey = ["investments", profile?.couple_id];
      await queryClient.cancelQueries({ queryKey });
      const previousInvestments = queryClient.getQueryData(queryKey);
      if (previousInvestments) {
        queryClient.setQueryData(queryKey, (old) => {
          return old.map((inv) => {
            if (inv.id === updatedAsset.id) {
              const quantity = Number(updatedAsset.quantity);
              const average_price = Number(updatedAsset.average_price);
              const custom_rate = Number(updatedAsset.custom_rate);
              const total_invested = quantity * average_price;
              let current_price = inv.current_price;
              if (inv.asset_type === "FIXED_INCOME" && custom_rate > 0) {
                const totalVal = calculateFixedIncomeCurrentValue(
                  average_price,
                  quantity,
                  inv.purchase_date,
                  custom_rate
                );
                current_price = quantity > 0 ? totalVal / quantity : 0;
              }
              const current_value = quantity * current_price;
              const profit_loss_percentage = total_invested > 0 ? (current_value / total_invested - 1) * 100 : 0;
              return {
                ...inv,
                quantity,
                average_price,
                custom_rate,
                total_invested,
                current_value,
                profit_loss_percentage,
                current_price
              };
            }
            return inv;
          });
        });
      }
      return { previousInvestments };
    },
    onError: (err, newAsset, context) => {
      if (context?.previousInvestments) {
        queryClient.setQueryData(["investments", profile?.couple_id], context.previousInvestments);
      }
      toast.error("Erro ao atualizar ativo", { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["investments", profile?.couple_id] });
    },
    onSuccess: () => {
      toast.success("Aporte atualizado com sucesso!");
    }
  });
}
function useDeleteInvestment() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      if (!profile?.couple_id) throw new Error("Couple ID não encontrado");
      const { error } = await supabase.from("investments").delete().eq("id", id).eq("couple_id", profile.couple_id);
      if (error) throw error;
      return id;
    },
    onMutate: async (deletedId) => {
      const queryKey = ["investments", profile?.couple_id];
      await queryClient.cancelQueries({ queryKey });
      const previousInvestments = queryClient.getQueryData(queryKey);
      if (previousInvestments) {
        queryClient.setQueryData(queryKey, (old) => {
          return old.filter((inv) => inv.id !== deletedId);
        });
      }
      return { previousInvestments };
    },
    onError: (err, deletedId, context) => {
      if (context?.previousInvestments) {
        queryClient.setQueryData(["investments", profile?.couple_id], context.previousInvestments);
      }
      toast.error("Erro ao excluir ativo", { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["investments", profile?.couple_id] });
    },
    onSuccess: () => {
      toast.success("Ativo removido da sua carteira!");
    }
  });
}
const editAssetSchema = object({
  quantity: number().positive("Deve ser maior que zero"),
  average_price: number().positive("Deve ser maior que zero"),
  custom_rate: number().min(0, "A taxa não pode ser negativa")
});
function EditAssetModal({ isOpen, onClose, asset }) {
  const mutation = useUpdateInvestment();
  if (!asset) return null;
  const form = useForm({
    resolver: u(editAssetSchema),
    defaultValues: {
      quantity: Number(asset?.quantity || 0),
      average_price: Number(asset?.average_price || 0),
      custom_rate: Number(asset?.custom_rate || 0)
    }
  });
  reactExports.useEffect(() => {
    if (asset) {
      form.reset({
        quantity: Number(asset.quantity),
        average_price: Number(asset.average_price),
        custom_rate: Number(asset.custom_rate || 0)
      });
    }
  }, [asset, form]);
  const onSubmit = (values) => {
    if (!asset) return;
    mutation.mutate(
      {
        id: asset.id,
        quantity: values.quantity,
        average_price: values.average_price,
        custom_rate: values.custom_rate
      },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };
  const isPrivateFixedIncome = asset.asset_type === "FIXED_INCOME" && Number(asset.custom_rate) > 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isOpen, onOpenChange: (open) => !open && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "apple-card sm:max-w-[425px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Editar Aporte" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { children: [
        "Ajuste a quantidade e preço médio do ativo ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "uppercase", children: asset.ticker }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Ativo (Ticker)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: asset.ticker, disabled: true, className: "apple-interactive rounded-xl bg-muted/50" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-1", children: "O símbolo do ativo não pode ser alterado." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "quantity",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Quantidade Atual" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.00000001", className: "apple-interactive rounded-xl", ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "average_price",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Preço Médio Ajustado" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", className: "apple-interactive rounded-xl", ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        )
      ] }),
      isPrivateFixedIncome && /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name: "custom_rate",
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Taxa Mensal (%)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", className: "apple-interactive rounded-xl", ...field }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "submit",
          className: "w-full h-12 rounded-xl text-base font-bold shadow-lg mt-6",
          disabled: mutation.isPending,
          children: [
            mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin mr-2" }) : null,
            mutation.isPending ? "Salvando Alterações..." : "Salvar Edição"
          ]
        }
      )
    ] }) })
  ] }) });
}
const containerVariants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};
const itemVariants = {
  hidden: {
    y: 20,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1
  }
};
function AssetTable({
  data,
  onEdit,
  onDelete
}) {
  if (data.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-muted-foreground font-medium", children: "Nenhum ativo cadastrado nesta aba." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/40 hover:bg-transparent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-bold text-xs uppercase text-muted-foreground", children: "Ativo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-bold text-xs uppercase text-muted-foreground text-center", children: "Qtd" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-bold text-xs uppercase text-muted-foreground text-right", children: "P. Médio" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-bold text-xs uppercase text-muted-foreground text-right", children: "Valor Atual" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-bold text-xs uppercase text-muted-foreground text-right", children: "P&L" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[50px]" })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: data.map((asset) => {
      const isPositive = asset.profit_loss_percentage > 0;
      const isNegative = asset.profit_loss_percentage < 0;
      const profitValue = asset.current_value - asset.total_invested;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border/40 group hover:bg-muted/10 transition-colors", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-muted flex items-center justify-center overflow-hidden", children: asset.asset_type === "CRYPTO" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 16, className: "text-secondary-foreground" }) : asset.asset_type === "FIXED_INCOME" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 16, className: "text-amber-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 16, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold uppercase", children: asset.ticker }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-center font-medium", children: Number(asset.quantity) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-medium", children: formatCurrency(Number(asset.average_price)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-bold", children: formatCurrency(asset.current_value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex flex-col items-end", isPositive ? "text-emerald-600" : isNegative ? "text-rose-500" : "text-muted-foreground"), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-sm font-black", children: [
            isPositive && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 14 }),
            isNegative && /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 14 }),
            !isPositive && !isNegative && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mr-1", children: "-" }),
            Math.abs(asset.profit_loss_percentage).toFixed(2),
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold", children: [
            isPositive ? "+" : "",
            " ",
            formatCurrency(profitValue)
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { size: 16, className: "text-muted-foreground" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "apple-card rounded-xl w-40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer gap-2", onClick: () => onEdit(asset), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 14 }),
              "Editar Aporte"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer gap-2 text-rose-500 focus:text-rose-600 focus:bg-rose-500/10", onClick: () => onDelete(asset), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }),
              "Excluir Ativo"
            ] })
          ] })
        ] }) })
      ] }, asset.id);
    }) })
  ] }) });
}
function InvestimentosPage() {
  const {
    user,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const [assetToEdit, setAssetToEdit] = reactExports.useState(null);
  const [assetToDelete, setAssetToDelete] = reactExports.useState(null);
  const deleteMutation = useDeleteInvestment();
  reactExports.useEffect(() => {
    if (!authLoading && !user) {
      navigate({
        to: "/auth"
      });
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
  const acoes = investments?.filter((i) => i.asset_type === "STOCK") || [];
  const fiis = investments?.filter((i) => i.asset_type === "FII") || [];
  const cripto = investments?.filter((i) => i.asset_type === "CRYPTO") || [];
  const rendafixa = investments?.filter((i) => i.asset_type === "FIXED_INCOME") || [];
  const rvTotal = [...acoes, ...fiis].reduce((acc, curr) => acc + curr.current_value, 0);
  const cryptoTotal = cripto.reduce((acc, curr) => acc + curr.current_value, 0);
  const rvPerc = totalPatrimony > 0 ? rvTotal / totalPatrimony * 100 : 0;
  const cryptoPerc = totalPatrimony > 0 ? cryptoTotal / totalPatrimony * 100 : 0;
  if (isLoading && !hasInvestments) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center py-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "animate-spin text-primary w-8 h-8" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DashboardLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(NewAssetModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EditAssetModal, { isOpen: !!assetToEdit, onClose: () => setAssetToEdit(null), asset: assetToEdit }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!assetToDelete, onOpenChange: (open) => !open && setAssetToDelete(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "apple-card rounded-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Excluir Ativo?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
          "Tem certeza que deseja remover ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "uppercase", children: assetToDelete?.ticker }),
          " da sua carteira? Esta ação não pode ser desfeita e afetará o histórico do seu patrimônio."
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { disabled: deleteMutation.isPending, className: "rounded-xl", children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogAction, { onClick: (e) => {
          e.preventDefault();
          handleConfirmDelete();
        }, disabled: deleteMutation.isPending, className: "bg-rose-500 hover:bg-rose-600 text-white rounded-xl gap-2", children: [
          deleteMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 14, className: "animate-spin" }),
          "Sim, Excluir"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "space-y-8 pb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Meus Investimentos" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground italic", children: "Patrimônio atualizado em tempo real pelas APIs." })
        ] }),
        hasInvestments && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: handleRefresh, className: "rounded-full apple-interactive border-border/40 gap-2", disabled: isRefetching, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 16, className: cn(isRefetching && "animate-spin") }),
            isRefetching ? "Buscando cotações..." : "Atualizar Cotações"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "rounded-full gap-2 shadow-lg", onClick: () => setIsModalOpen(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
            "Novo Aporte"
          ] })
        ] })
      ] }),
      isError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-rose-500/10 text-rose-500 p-4 rounded-xl border border-rose-500/20 font-medium", children: "Houve um erro de rede ao buscar a cotação externa dos investimentos." }),
      hasInvestments ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card group card-gradient-blue border-none h-full shadow-xl relative overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent backdrop-blur-sm pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8 flex flex-col justify-between h-full relative z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-white/20 rounded-lg text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 24 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest text-white/90 bg-black/20 px-3 py-1 rounded-full backdrop-blur-md", children: "Geral" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-white/80", children: "Patrimônio Total Atualizado" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-4xl font-black tracking-tight text-white mt-1", children: formatCurrency(totalPatrimony) })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card group card-gradient-magenta border-none h-full shadow-xl relative overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent backdrop-blur-sm pointer-events-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8 flex flex-col justify-between h-full relative z-10", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-white/20 rounded-lg text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 24 }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest text-white/90 bg-black/20 px-3 py-1 rounded-full backdrop-blur-md", children: "P&L Geral" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-white/80", children: [
                  "Lucro/Prejuízo Total (",
                  totalProfitPercentage >= 0 ? "+" : "",
                  totalProfitPercentage.toFixed(2),
                  "%)"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "text-4xl font-black tracking-tight text-white mt-1", children: [
                  totalProfit > 0 ? "+" : "",
                  " ",
                  formatCurrency(totalProfit)
                ] })
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "apple-card h-full border-border/40 bg-card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider text-muted-foreground", children: "Distribuição da Carteira" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Ações / FIIs" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-primary", children: [
                  rvPerc.toFixed(1),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-muted dark:bg-black rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-primary rounded-full", style: {
                width: `${rvPerc}%`
              } }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "Cripto" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-secondary-foreground", children: [
                  cryptoPerc.toFixed(1),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-muted dark:bg-black rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-secondary-foreground rounded-full", style: {
                width: `${cryptoPerc}%`
              } }) })
            ] })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "visaogeral", className: "w-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "bg-muted/50 p-1 rounded-2xl h-14 border border-border/40 gap-1 w-full md:w-fit overflow-x-auto no-scrollbar", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "visaogeral", className: "rounded-xl px-6 h-11 data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2 transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { size: 16 }),
              "Visão Geral"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "acoes_fiis", className: "rounded-xl px-6 h-11 data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2 transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { size: 16 }),
              "Renda Variável"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "cripto", className: "rounded-xl px-6 h-11 data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2 transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Coins, { size: 16 }),
              "Criptomoedas"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "rendafixa", className: "rounded-xl px-6 h-11 data-[state=active]:bg-card data-[state=active]:shadow-sm gap-2 transition-all", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { size: 16 }),
              "Renda Fixa"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "visaogeral", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card overflow-hidden bg-card border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg font-bold", children: "Todos os Ativos" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AssetTable, { data: investments, onEdit: setAssetToEdit, onDelete: setAssetToDelete }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "acoes_fiis", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card overflow-hidden bg-card border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg font-bold", children: "Ações e FIIs" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AssetTable, { data: [...acoes, ...fiis], onEdit: setAssetToEdit, onDelete: setAssetToDelete }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "cripto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card overflow-hidden bg-card border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg font-bold", children: "Criptoativos" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AssetTable, { data: cripto, onEdit: setAssetToEdit, onDelete: setAssetToDelete }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "rendafixa", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card overflow-hidden bg-card border-border/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg font-bold", children: "Títulos e Aplicações" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "px-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AssetTable, { data: rendafixa, onEdit: setAssetToEdit, onDelete: setAssetToDelete }) })
            ] }) })
          ] })
        ] }) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: TrendingUp, title: "Sua carteira está vazia", description: "Comece a adicionar seus ativos para que possamos monitorar as cotações em tempo real.", actionLabel: "Cadastrar Novo Aporte", onAction: () => setIsModalOpen(true) })
    ] })
  ] });
}
export {
  InvestimentosPage as component
};
