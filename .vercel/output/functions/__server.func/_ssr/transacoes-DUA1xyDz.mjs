import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, e as useSearch, u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { m as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { u as useAuth } from "./router-r--sMQdH.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useProfile, a as useFinanceStore, D as DashboardLayout, S as Select, b as SelectTrigger, c as SelectValue, d as SelectContent, e as SelectItem, C as CATEGORY_ICONS, f as DIVISION_ICONS, A as Avatar, g as AvatarImage, h as AvatarFallback, T as TooltipProvider, i as Dialog, j as DialogContent, k as DialogHeader, l as DialogTitle, m as DialogDescription, n as DialogFooter } from "./layout-dashboard-irdFI0U9.mjs";
import { C as Card, a as CardContent, B as Button, f as formatCurrency, c as cn } from "./card-DDGnP21B.mjs";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell, A as AlertDialog, f as AlertDialogContent, g as AlertDialogHeader, h as AlertDialogTitle, i as AlertDialogDescription, j as AlertDialogFooter, k as AlertDialogCancel, l as AlertDialogAction } from "./alert-dialog-ryeMzYsQ.mjs";
import { B as Badge } from "./badge-DrsED2vf.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem } from "./dropdown-menu-D986qVQP.mjs";
import { L as Label, I as Input } from "./label--mk1_jyu.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-CDkZO5Tu.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-Bbxaukn3.mjs";
import { s as supabase } from "./client-CRCA7PsU.mjs";
import { E as EmptyState } from "./empty-state-Bu9yyJzT.mjs";
import "../_libs/seroval.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { S as Sparkles, L as LoaderCircle, C as CirclePlus, F as Funnel, a as CircleQuestionMark, U as Users, E as EllipsisVertical, b as SquarePen, T as Trash2, R as Receipt } from "../_libs/lucide-react.mjs";
import { p as parseISO, a as addMonths, s as setDate, f as format } from "../_libs/date-fns.mjs";
import { o as object, c as string } from "../_libs/zod.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";

const __rest = (s, e) => {
  const t = {};
  for (const p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (let i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
  return t;
};

import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/react-easy-crop.mjs";
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
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
function calculateBillingMonth(purchaseDate, closingDay) {
  const date = typeof purchaseDate === "string" ? parseISO(purchaseDate) : purchaseDate;
  const purchaseDay = date.getDate();
  let billingMonthDate = date;
  if (purchaseDay >= closingDay) {
    billingMonthDate = addMonths(billingMonthDate, 1);
  }
  const resultDate = setDate(billingMonthDate, 1);
  return format(resultDate, "yyyy-MM-01");
}
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const InputSchema = object({
  text: string().min(3).max(500)
});
const parseTransactionFromText = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).inputValidator((input) => InputSchema.parse(input)).handler(createSsrRpc("ff0ad7c6eed40bcfc0fa108fa7a794fdd29fbdeedb9161f153630792ad349914"));
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
function TransactionsPage() {
  const [smartInput, setSmartInput] = reactExports.useState("");
  const navigate = useNavigate();
  const search = useSearch({
    from: "/transacoes"
  });
  const {
    user,
    loading: authLoading
  } = useAuth();
  const {
    profile
  } = useProfile();
  const queryClient = useQueryClient();
  const {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    userAvatars,
    setTransactions
  } = useFinanceStore();
  const {
    data: cards = []
  } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("cards").select("*").order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.couple_id
  });
  const {
    data: dbTransactions = [],
    isLoading: isTxsLoading
  } = useQuery({
    queryKey: ["transactions", profile?.couple_id],
    queryFn: async () => {
      if (!profile?.couple_id) return [];
      const {
        data,
        error
      } = await supabase.from("transactions").select("*, profiles(display_name, avatar_url)").eq("couple_id", profile.couple_id).order("date", {
        ascending: false
      });
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.couple_id
  });
  reactExports.useEffect(() => {
    if (dbTransactions.length > 0) {
      setTransactions(dbTransactions);
    }
  }, [dbTransactions, setTransactions]);
  reactExports.useEffect(() => {
    if (profile?.couple_id) {
      const channel = supabase.channel("transactions-realtime").on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "transactions",
        filter: `couple_id=eq.${profile.couple_id}`
      }, () => {
        queryClient.invalidateQueries({
          queryKey: ["transactions"]
        });
        queryClient.invalidateQueries({
          queryKey: ["cards"]
        });
      }).subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [profile?.couple_id, queryClient]);
  reactExports.useEffect(() => {
    if (!authLoading && !user) {
      navigate({
        to: "/auth"
      });
    }
  }, [user, authLoading]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = reactExports.useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = reactExports.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = reactExports.useState(false);
  const [editingTx, setEditingTx] = reactExports.useState(null);
  const [txToDelete, setTxToDelete] = reactExports.useState(null);
  const [parsedData, setParsedData] = reactExports.useState(null);
  const [formData, setFormData] = reactExports.useState({
    description: "",
    amount: 0,
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    category: "Outros",
    responsible: "Jorge",
    division: "Conjunta 50/50",
    type: "Saída",
    card_id: void 0
  });
  const filters = {
    month: search.month,
    category: search.category,
    type: search.type,
    responsible: search.responsible
  };
  const setFilters = (newFilters) => {
    navigate({
      search: {
        ...search,
        ...newFilters
      }
    });
  };
  const parseFn = useServerFn(parseTransactionFromText);
  const mutation = useMutation({
    mutationFn: (text) => parseFn({
      data: {
        text
      }
    }),
    onSuccess: (parsed) => {
      setTimeout(() => {
        setParsedData(parsed);
        setIsConfirmModalOpen(true);
      }, 1500);
    },
    onError: (err) => {
      toast.error("Não foi possível processar", {
        description: err.message
      });
    }
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
    let billing_date = parsedData.date ? parsedData.date.substring(0, 8) + "01" : (/* @__PURE__ */ new Date()).toISOString().substring(0, 8) + "01";
    const cardId = formData.card_id;
    if (cardId) {
      const card = cards.find((c) => c.id === cardId);
      if (card && card.closing_day) {
        billing_date = calculateBillingMonth(parsedData.date, card.closing_day);
      }
    }
    const txData = {
      description: parsedData.description,
      amount: (parsedData.type === "Entrada" ? 1 : -1) * Math.abs(parsedData.amount),
      date: parsedData.date,
      category: parsedData.category,
      responsible: parsedData.responsible,
      division: parsedData.division,
      type: parsedData.type,
      user_id: user.id,
      couple_id: coupleId,
      card_id: cardId,
      billing_date
    };
    const {
      error
    } = await supabase.from("transactions").insert(txData);
    if (error) {
      toast.error("Erro ao salvar transação", {
        description: error.message
      });
      return;
    }
    setSmartInput("");
    setIsConfirmModalOpen(false);
    setParsedData(null);
    queryClient.invalidateQueries({
      queryKey: ["transactions"]
    });
    queryClient.invalidateQueries({
      queryKey: ["cards"]
    });
    toast.success("Transação adicionada!");
  };
  const handleSaveManual = async () => {
    if (!formData.description || !formData.amount || !profile?.couple_id) {
      toast.error("Preencha a descrição, o valor e certifique-se de estar conectado.");
      return;
    }
    const coupleId = profile.couple_id;
    let billing_date = formData.date ? formData.date.substring(0, 8) + "01" : (/* @__PURE__ */ new Date()).toISOString().substring(0, 8) + "01";
    if (formData.card_id) {
      const card = cards.find((c) => c.id === formData.card_id);
      if (card && card.closing_day) {
        billing_date = calculateBillingMonth(formData.date, card.closing_day);
      }
    }
    const txData = {
      description: formData.description || "",
      amount: (formData.type === "Entrada" ? 1 : -1) * Math.abs(formData.amount || 0),
      date: formData.date,
      category: formData.category || "Outros",
      responsible: formData.responsible || "Jorge",
      division: formData.division || "Conjunta 50/50",
      type: formData.type || "Saída",
      user_id: user.id,
      couple_id: coupleId,
      card_id: formData.card_id,
      billing_date
    };
    if (editingTx) {
      const {
        error
      } = await supabase.from("transactions").update(txData).eq("id", editingTx.id);
      if (error) {
        toast.error("Erro ao atualizar transação", {
          description: error.message
        });
        return;
      }
      toast.success("Transação atualizada!");
    } else {
      const {
        error
      } = await supabase.from("transactions").insert(txData);
      if (error) {
        toast.error("Erro ao adicionar transação", {
          description: error.message
        });
        return;
      }
      toast.success("Transação adicionada!");
    }
    queryClient.invalidateQueries({
      queryKey: ["transactions"]
    });
    queryClient.invalidateQueries({
      queryKey: ["cards"]
    });
    setIsManualModalOpen(false);
    setEditingTx(null);
  };
  const handleEditClick = (tx) => {
    setEditingTx(tx);
    setFormData({
      description: tx.description,
      amount: Math.abs(tx.amount),
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      category: tx.category,
      responsible: tx.responsible,
      division: tx.division,
      type: tx.type === "Entrada" ? "Entrada" : tx.amount < 0 ? "Saída" : "Entrada",
      card_id: tx.card_id
    });
    setIsManualModalOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (txToDelete !== null) {
      const {
        error
      } = await supabase.from("transactions").delete().eq("id", txToDelete);
      if (error) {
        toast.error("Erro ao excluir transação", {
          description: error.message
        });
        return;
      }
      toast.error("Transação excluída");
      queryClient.invalidateQueries({
        queryKey: ["transactions"]
      });
      queryClient.invalidateQueries({
        queryKey: ["cards"]
      });
      setIsDeleteModalOpen(false);
      setTxToDelete(null);
    }
  };
  const handleAddManualClick = () => {
    setEditingTx(null);
    setFormData({
      description: "",
      amount: 0,
      date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      category: "Outros",
      responsible: "Jorge",
      division: "Conjunta 50/50",
      type: "Saída",
      card_id: void 0
    });
    setIsManualModalOpen(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(DashboardLayout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "space-y-8 pb-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "apple-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 md:p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-primary", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 20, className: "animate-pulse" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold", children: "Lançamento Inteligente" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Descreva o gasto... Ex: Paguei 120 reais de gasolina hoje no cartão de crédito.", className: "min-h-[120px] resize-none text-base p-4 border-muted focus:border-primary/50 transition-all rounded-2xl apple-interactive", value: smartInput, onChange: (e) => setSmartInput(e.target.value), disabled: isLoading, onKeyDown: (e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleProcess();
            }
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-4 right-4 flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "rounded-full px-6 shadow-md hover:shadow-lg transition-all gap-2 active:scale-95", disabled: !smartInput.trim() || isLoading, onClick: handleProcess, children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "animate-spin" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-pulse", children: "Analisando..." })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 16 }),
            "Magia IA"
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", className: "text-muted-foreground hover:text-primary transition-all text-sm font-medium gap-2 active:scale-95", onClick: handleAddManualClick, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 16 }),
          "Adicionar Manualmente"
        ] }) })
      ] }) }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: itemVariants, className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Histórico" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filters.month, onValueChange: (val) => setFilters({
              ...filters,
              month: val
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[130px] rounded-full apple-interactive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Mês" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "june", children: "Junho" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "may", children: "Maio" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "april", children: "Abril" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filters.category, onValueChange: (val) => setFilters({
              ...filters,
              category: val
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[140px] rounded-full apple-interactive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Categoria" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all-cats", children: "Todas Categorias" }),
                Object.keys(CATEGORY_ICONS).map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cat, children: cat }, cat))
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filters.type, onValueChange: (val) => setFilters({
              ...filters,
              type: val
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[120px] rounded-full apple-interactive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Tipo" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all-types", children: "Todos Tipos" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Entrada", children: "Entrada" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Débito", children: "Débito" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Crédito", children: "Crédito" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filters.responsible, onValueChange: (val) => setFilters({
              ...filters,
              responsible: val
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-[130px] rounded-full apple-interactive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Responsável" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "both", children: "O Casal" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Jorge", children: "Jorge" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Lilian", children: "Lilian" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", className: "rounded-full apple-interactive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { size: 18, className: "text-muted-foreground" }) })
          ] })
        ] }),
        transactions.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: itemVariants, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block apple-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { className: "bg-muted/30", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-none hover:bg-transparent", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 pl-8", children: "Data" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-bold text-xs uppercase tracking-wider text-muted-foreground py-5", children: "Descrição" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 text-center", children: "Categoria" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 text-right", children: "Valor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 text-center", children: "Responsável" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 text-center", children: "Divisão" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[50px] pr-8" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: transactions.map((tx) => {
              const CategoryIcon = CATEGORY_ICONS[tx.category] || CircleQuestionMark;
              const DivisionIcon = DIVISION_ICONS[tx.division] || Users;
              const avatarUrl = tx.profiles?.avatar_url || userAvatars[tx.responsible];
              const responsibleName = tx.profiles?.display_name || tx.responsible;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "group border-b border-muted/20 hover:bg-accent/30 transition-colors", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-5 pl-8 text-sm font-medium text-muted-foreground", children: tx.date }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-foreground", children: tx.description }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-5 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "gap-1.5 px-3 py-1 rounded-full bg-muted/50 border-none font-bold text-[10px] uppercase", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryIcon, { size: 12, className: "text-primary" }),
                  tx.category
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-5 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `font-black text-sm ${tx.amount > 0 ? "text-emerald-600" : "text-rose-500"}`, children: [
                  tx.amount > 0 ? "+" : "",
                  " ",
                  formatCurrency(Math.abs(tx.amount))
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-6 h-6 border shadow-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarUrl }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: responsibleName[0] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium", children: responsibleName })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "gap-1 rounded-full text-[10px] font-bold border-muted/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DivisionIcon, { size: 10 }),
                  tx.division
                ] }) }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "py-5 pr-8 text-right", children: tx.user_id === user?.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { size: 16 }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "apple-card", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "gap-2", onClick: () => handleEditClick(tx), children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 14 }),
                      "Editar"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "gap-2 text-destructive", onClick: () => {
                      setTxToDelete(tx.id);
                      setIsDeleteModalOpen(true);
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }),
                      "Excluir"
                    ] })
                  ] })
                ] }) })
              ] }, tx.id);
            }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "md:hidden space-y-4", children: transactions.map((tx) => {
            const CategoryIcon = CATEGORY_ICONS[tx.category] || CircleQuestionMark;
            const DivisionIcon = DIVISION_ICONS[tx.division] || Users;
            const avatarUrl = tx.profiles?.avatar_url || userAvatars[tx.responsible];
            const responsibleName = tx.profiles?.display_name || tx.responsible;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "apple-card apple-card-hover overflow-hidden group", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 bg-muted rounded-xl text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryIcon, { size: 18 }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold", children: tx.description }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                      tx.date,
                      " • ",
                      tx.type
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-end", children: [
                  tx.user_id === user?.id && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8 -mt-2 -mr-2 rounded-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { size: 14 }) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "apple-card", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "gap-2", onClick: () => handleEditClick(tx), children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 14 }),
                        "Editar"
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "gap-2 text-destructive", onClick: () => {
                        setTxToDelete(tx.id);
                        setIsDeleteModalOpen(true);
                      }, children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }),
                        "Excluir"
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: `text-sm font-black mt-1 ${tx.amount > 0 ? "text-emerald-600" : "text-rose-500"}`, children: [
                    tx.amount > 0 ? "+" : "",
                    " ",
                    formatCurrency(Math.abs(tx.amount))
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-muted/50 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "w-6 h-6 border shadow-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatarUrl }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: responsibleName[0] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground", children: responsibleName })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 bg-muted/30 px-2 py-1 rounded-lg", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DivisionIcon, { size: 10, className: "text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-muted-foreground uppercase", children: tx.division })
                ] })
              ] })
            ] }) }, tx.id);
          }) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: Receipt, title: "Nenhuma transação ainda", description: "Comece a registrar seus gastos para ter controle total.", actionLabel: "Adicionar meu primeiro lançamento", onAction: handleAddManualClick })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isManualModalOpen, onOpenChange: setIsManualModalOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "apple-card sm:max-w-[425px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold", children: editingTx ? "Editar Lançamento" : "Novo Lançamento" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: editingTx ? "Altere as informações da transação." : "Insira os detalhes do gasto ou entrada manualmente." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "description", className: "font-bold text-xs uppercase tracking-widest opacity-60", children: "Descrição" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "description", className: "rounded-xl", placeholder: "Ex: Aluguel, Supermercado...", value: formData.description, onChange: (e) => setFormData({
            ...formData,
            description: e.target.value
          }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "amount", className: "font-bold text-xs uppercase tracking-widest opacity-60", children: "Valor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold", children: "R$" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "amount", type: "number", className: "pl-9 rounded-xl font-bold", placeholder: "0,00", value: formData.amount, onChange: (e) => setFormData({
                ...formData,
                amount: parseFloat(e.target.value) || 0
              }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "type", className: "font-bold text-xs uppercase tracking-widest opacity-60", children: "Tipo" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.type, onValueChange: (val) => setFormData({
              ...formData,
              type: val
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "apple-card", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Entrada", children: "Entrada" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Saída", children: "Saída / Débito" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Crédito", children: "Crédito" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "date", className: "font-bold text-xs uppercase tracking-widest opacity-60", children: "Data" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "date", type: "date", className: "rounded-xl", value: formData.date, onChange: (e) => setFormData({
              ...formData,
              date: e.target.value
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "category", className: "font-bold text-xs uppercase tracking-widest opacity-60", children: "Categoria" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.category, onValueChange: (val) => setFormData({
              ...formData,
              category: val
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "apple-card", children: Object.keys(CATEGORY_ICONS).map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: cat, children: cat }, cat)) })
            ] })
          ] })
        ] }),
        formData.type === "Crédito" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 animate-in fade-in slide-in-from-top-1 duration-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "card", className: "font-bold text-xs uppercase tracking-widest opacity-60", children: "Cartão de Crédito" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.card_id, onValueChange: (val) => setFormData({
            ...formData,
            card_id: val
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o cartão" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "apple-card", children: cards.length > 0 ? cards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: card.id, children: [
              card.name,
              " (•••• ",
              card.last_four,
              ")"
            ] }, card.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "no-cards", disabled: true, children: "Nenhum cartão cadastrado" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-bold text-xs uppercase tracking-widest opacity-60", children: "Responsável" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.responsible, onValueChange: (val) => setFormData({
              ...formData,
              responsible: val
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "apple-card", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Jorge", children: "Jorge" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Lilian", children: "Lilian" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "font-bold text-xs uppercase tracking-widest opacity-60", children: "Divisão" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.division, onValueChange: (val) => setFormData({
              ...formData,
              division: val
            }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "apple-card", children: Object.keys(DIVISION_ICONS).map((div) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: div, children: div }, div)) })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "rounded-full", onClick: () => setIsManualModalOpen(false), children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "rounded-full px-8 shadow-lg shadow-primary/20", onClick: handleSaveManual, children: "Salvar Lançamento" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isConfirmModalOpen, onOpenChange: setIsConfirmModalOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "apple-card sm:max-w-[400px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { size: 24 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold", children: "Lançamento Detectado!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Confirme os detalhes extraídos pela nossa inteligência artificial." })
      ] }),
      parsedData && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-4 bg-muted/30 p-6 rounded-3xl border border-muted-foreground/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "O que é?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: parsedData.description })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Quanto?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `font-black ${parsedData.type === "Entrada" ? "text-emerald-600" : "text-foreground"}`, children: formatCurrency(Math.abs(parsedData.amount)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Quando?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: parsedData.date })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Categoria" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "font-bold", children: parsedData.category })
        ] }),
        parsedData.type === "Crédito" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: "Vincular ao Cartão" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: formData.card_id, onValueChange: (val) => setFormData({
            ...formData,
            card_id: val
          }), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o cartão" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "apple-card", children: cards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: card.id, children: [
              card.name,
              " (•••• ",
              card.last_four,
              ")"
            ] }, card.id)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "rounded-full flex-1", onClick: () => setIsConfirmModalOpen(false), children: "Corrigir" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "rounded-full flex-1 shadow-lg shadow-primary/20", onClick: handleConfirm, children: "Confirmar" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: isDeleteModalOpen, onOpenChange: setIsDeleteModalOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "apple-card rounded-3xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Excluir Transação?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Esta ação não pode ser desfeita. O valor será removido permanentemente dos registros do casal." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "rounded-full", children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { className: "rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90", onClick: handleDeleteConfirm, children: "Excluir Registro" })
      ] })
    ] }) })
  ] });
}
export {
  TransactionsPage as component
};
