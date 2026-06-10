import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { D as DashboardLayout, T as TooltipProvider, u as useProfile, i as Dialog, s as DialogTrigger, j as DialogContent, k as DialogHeader, l as DialogTitle, m as DialogDescription, S as Select, b as SelectTrigger, c as SelectValue, d as SelectContent, e as SelectItem } from "./layout-dashboard-BPAzyFdL.mjs";
import { C as Card, f as formatCurrency, c as cn, b as CardHeader, d as CardTitle, B as Button, a as CardContent, p as parseCurrencyInput } from "./card-DDGnP21B.mjs";
import { D as DropdownMenu, a as DropdownMenuTrigger, b as DropdownMenuContent, c as DropdownMenuItem } from "./dropdown-menu-D986qVQP.mjs";
import { A as AlertDialog, m as AlertDialogTrigger, f as AlertDialogContent, g as AlertDialogHeader, h as AlertDialogTitle, i as AlertDialogDescription, j as AlertDialogFooter, k as AlertDialogCancel, l as AlertDialogAction, T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./alert-dialog-ryeMzYsQ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { B as Badge } from "./badge-DrsED2vf.mjs";
import { u as useAuth } from "./router-Dl0zekrI.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { E as EmptyState } from "./empty-state-Bu9yyJzT.mjs";
import { u } from "../_libs/hookform__resolvers.mjs";
import { u as useForm } from "../_libs/react-hook-form.mjs";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormMessage } from "./form-JGwHWJio.mjs";
import { I as Input } from "./label-BKMEXiM6.mjs";
import { s as supabase } from "./client-CRCA7PsU.mjs";
import { a as useQuery, u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { f as format, d as startOfMonth, b as subMonths, p as parseISO, c as ptBR } from "../_libs/date-fns.mjs";
import { K as CreditCard, c as CircleCheck, u as Calendar, z as ChevronRight, E as EllipsisVertical, L as LoaderCircle, P as Plus } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { o as object, c as string, _ as _enum } from "../_libs/zod.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
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
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const cardFormSchema = object({
  name: string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  totalLimit: string().min(1, "O limite é obrigatório"),
  cardType: _enum(["Meu Cartão", "Cartão do Parceiro(a)", "Cartão Conjunto"]),
  lastDigits: string().max(4, "Máximo de 4 dígitos").optional(),
  dueDay: string().min(1, "Obrigatório").refine((v) => parseInt(v) >= 1 && parseInt(v) <= 31, "Dia inválido (1-31)"),
  closingDay: string().min(1, "Obrigatório").refine((v) => parseInt(v) >= 1 && parseInt(v) <= 31, "Dia inválido (1-31)"),
  color: string()
});
function AddCardModal({ children }) {
  const [open, setOpen] = reactExports.useState(false);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: u(cardFormSchema),
    defaultValues: {
      name: "",
      totalLimit: "",
      cardType: "Meu Cartão",
      lastDigits: "",
      dueDay: "",
      closingDay: "",
      color: "#203F9A"
    }
  });
  async function onSubmit(values) {
    if (!user || !profile?.couple_id) {
      toast.error("Você precisa estar em um casal para adicionar um cartão.");
      return;
    }
    setIsUploading(true);
    try {
      const numericLimit = parseCurrencyInput(values.totalLimit);
      const { error } = await supabase.from("cards").insert({
        owner_id: user.id,
        couple_id: profile.couple_id,
        name: values.name,
        limit_amount: numericLimit,
        card_type: values.cardType,
        last_four: values.lastDigits || null,
        due_day: parseInt(values.dueDay),
        closing_day: parseInt(values.closingDay),
        color: values.color
      });
      if (error) throw error;
      toast.success("Cartão adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Falha ao salvar o cartão. Verifique sua conexão e tente novamente.");
    } finally {
      setIsUploading(false);
    }
  }
  const colors = [
    { name: "Azul Royal", value: "#203F9A" },
    { name: "Rosa Magenta", value: "#E84797" },
    { name: "Escuro", value: "#161616" },
    { name: "Azul Claro", value: "#94C2DA" },
    { name: "Rosa Claro", value: "#E7A0CC" },
    { name: "Azul Aço", value: "#4E7CB2" },
    { name: "Cinza", value: "#737373" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: children || /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "rounded-full gap-2 shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
      "Novo Cartão"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[425px] apple-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Adicionar Novo Cartão" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Preencha os dados abaixo para cadastrar um novo cartão de crédito." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4 pt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "name",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Nome do Cartão" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Ex: Nubank, Itaú...", ...field, disabled: isUploading }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "totalLimit",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Limite Total" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "R$ 0,00",
                    disabled: isUploading,
                    onChange: (e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      field.onChange(value);
                    },
                    value: field.value ? formatCurrency(parseCurrencyInput(field.value)) : ""
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
              name: "lastDigits",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Últimos 4 dígitos" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "1234", maxLength: 4, ...field, disabled: isUploading }) }),
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
              name: "closingDay",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Dia de Fechamento" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Ex: 5",
                    type: "number",
                    min: 1,
                    max: 31,
                    disabled: isUploading,
                    ...field
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
              name: "dueDay",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Dia de Vencimento" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Ex: 10",
                    type: "number",
                    min: 1,
                    max: 31,
                    disabled: isUploading,
                    ...field
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "cardType",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Tipo de Cartão" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, disabled: isUploading, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o tipo" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Meu Cartão", children: "Meu Cartão" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cartão do Parceiro(a)", children: "Cartão do Parceiro(a)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cartão Conjunto", children: "Cartão Conjunto" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "color",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Cor de Destaque" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: colors.map((color) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  className: `w-8 h-8 rounded-full border-2 ${field.value === color.value ? "border-primary ring-2 ring-primary ring-offset-2 scale-110" : "border-transparent"} transition-all`,
                  style: { backgroundColor: color.value },
                  onClick: () => field.onChange(color.value),
                  disabled: isUploading,
                  title: color.name
                },
                color.value
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "submit",
            className: "w-full rounded-xl shadow-lg font-bold",
            disabled: isUploading,
            children: isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Salvando..."
            ] }) : "Salvar Cartão"
          }
        )
      ] }) })
    ] })
  ] });
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
function CartoesPage() {
  const currentMonth = format(startOfMonth(/* @__PURE__ */ new Date()), "yyyy-MM-01");
  const [selectedCardId, setSelectedCardId] = reactExports.useState(null);
  const [selectedMonth, setSelectedMonth] = reactExports.useState(currentMonth);
  const {
    user,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const {
    data: transactions = []
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("transactions").select("*, profiles(display_name, avatar_url)").order("date", {
        ascending: false
      });
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
  const {
    data: cards = [],
    isLoading: isCardsLoading
  } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("cards").select("*").order("created_at", {
        ascending: false
      });
      if (error) throw error;
      const cardBalances = transactions.reduce((acc, tx) => {
        if (tx.card_id && tx.billing_date === selectedMonth) {
          acc[tx.card_id] = (acc[tx.card_id] || 0) + Math.abs(tx.amount);
        }
        return acc;
      }, {});
      return data.map((card) => {
        const currentBill = cardBalances[card.id] || 0;
        return {
          id: card.id,
          name: card.name,
          lastDigits: card.last_four || "0000",
          brand: "Mastercard",
          color: card.color || "card-gradient-blue",
          currentBill,
          limitUsed: currentBill,
          totalLimit: Number(card.limit_amount),
          type: card.card_type === "Meu Cartão" ? "individual" : "conjunto",
          owner: card.card_type === "Meu Cartão" ? "Eu" : "Casal"
        };
      });
    },
    enabled: !!user && !!transactions
  });
  const currentBillItems = selectedCardId ? transactions.filter((tx) => tx.card_id === selectedCardId && tx.billing_date === selectedMonth).map((tx) => ({
    id: tx.id,
    date: new Date(tx.date).toLocaleDateString("pt-BR"),
    description: tx.description,
    amount: Math.abs(tx.amount),
    user: tx.profiles?.display_name || tx.responsible,
    avatarUrl: tx.profiles?.avatar_url,
    category: tx.category,
    icon: CreditCard,
    // Fallback
    installments: "1/1"
  })) : [];
  reactExports.useEffect(() => {
    if (!authLoading && !user) {
      navigate({
        to: "/auth"
      });
    }
  }, [user, authLoading]);
  reactExports.useEffect(() => {
    if (cards.length > 0 && !selectedCardId) {
      setSelectedCardId(cards[0].id);
    }
  }, [cards, selectedCardId]);
  const selectedCard = cards.find((c) => c.id === selectedCardId);
  selectedCard ? selectedCard.limitUsed / selectedCard.totalLimit * 100 : 0;
  const jorgePays = selectedCard ? selectedCard.type === "conjunto" ? selectedCard.currentBill / 2 : selectedCard.owner === "Jorge" ? selectedCard.currentBill : 0 : 0;
  const lilianPays = selectedCard ? selectedCard.type === "conjunto" ? selectedCard.currentBill / 2 : selectedCard.owner === "Lilian" ? selectedCard.currentBill : 0 : 0;
  const handlePayBill = () => {
    if (!selectedCard) return;
    toast.success("Fatura paga com sucesso!", {
      description: `O pagamento de ${formatCurrency(selectedCard.currentBill)} foi registrado.`
    });
  };
  const getCardColorStyle = (colorStr) => {
    if (!colorStr) return {
      backgroundColor: "#737373"
    };
    if (colorStr.startsWith("#")) return {
      backgroundColor: colorStr
    };
    return {
      backgroundColor: "#737373"
    };
  };
  const availableMonths = [currentMonth, format(subMonths(parseISO(currentMonth), 1), "yyyy-MM-01"), format(subMonths(parseISO(currentMonth), 2), "yyyy-MM-01")];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-end", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-foreground", children: "Meus Cartões" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground italic", children: "Gerencie seus limites e faturas." })
      ] }),
      cards.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(AddCardModal, {})
    ] }),
    cards.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: cards.map((card) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, whileHover: {
        y: -4
      }, onClick: () => setSelectedCardId(card.id), className: "cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: cn("relative h-64 border-none text-white shadow-xl overflow-hidden transition-all duration-300 flex flex-col justify-between p-6", selectedCardId === card.id ? "ring-2 ring-primary ring-offset-4 dark:ring-offset-[#161616]" : "opacity-95 hover:opacity-100 hover:shadow-2xl"), style: getCardColorStyle(card.color), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 right-0 p-4 opacity-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 140 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex flex-row items-center justify-between pb-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest opacity-60", children: card.type === "conjunto" ? "Conjunto" : `Individual - ${card.owner}` }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold leading-tight", children: card.name })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold backdrop-blur-sm", children: card.brand })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-bold opacity-60", children: "Fatura Atual" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-3xl font-bold tracking-tight", children: formatCurrency(card.currentBill) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center text-[9px] font-bold uppercase", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-60", children: "Uso do Limite" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                Math.round(card.limitUsed / card.totalLimit * 100),
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-full bg-white/20 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("h-full transition-all duration-500 rounded-full", card.limitUsed / card.totalLimit * 100 > 80 ? "bg-rose-400" : "bg-white"), style: {
              width: `${card.limitUsed / card.totalLimit * 100}%`
            } }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono tracking-widest opacity-60", children: [
              "⬢⬢⬢⬢ ",
              card.lastDigits
            ] }),
            selectedCardId === card.id && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { layoutId: "active-indicator", className: "bg-white text-black p-1 rounded-full shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 14 }) })
          ] })
        ] })
      ] }) }, card.id)) }),
      selectedCard && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "border-b border-border/40 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg text-white", style: getCardColorStyle(selectedCard.color), children: /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { size: 20 }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg font-bold", children: "Detalhamento da Fatura" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                selectedCard.name,
                " ⬢ ⬢⬢⬢⬢ ",
                selectedCard.lastDigits
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "rounded-full apple-interactive font-medium min-w-[180px] justify-between", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 16, className: "text-muted-foreground" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: format(parseISO(selectedMonth), "MMMM (yyyy)", {
                    locale: ptBR
                  }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 14, className: "rotate-90 opacity-50" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuContent, { className: "apple-card w-[180px]", children: availableMonths.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => setSelectedMonth(m), className: "cursor-pointer capitalize", children: format(parseISO(m), "MMMM (yyyy)", {
                locale: ptBR
              }) }, m)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: selectedMonth === currentMonth ? "outline" : "secondary", className: cn("px-3 py-1 rounded-full border-none h-9 flex items-center", selectedMonth === currentMonth ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400"), children: selectedMonth === currentMonth ? "Fatura Aberta" : "Fatura Paga" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x border-b border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex flex-col justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground mb-1", children: "Total da Fatura" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold tracking-tight", children: formatCurrency(selectedCard.currentBill) })
              ] }),
              selectedMonth === "june" && /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialog, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4 w-full rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all font-bold", children: "Pagar Fatura" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { className: "apple-card rounded-3xl", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Confirmar Pagamento" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogDescription, { children: [
                      "Deseja registrar o pagamento desta fatura no valor de ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-foreground", children: formatCurrency(selectedCard.currentBill) }),
                      "?"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { className: "rounded-full", children: "Cancelar" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: handlePayBill, className: "rounded-full shadow-lg shadow-primary/20", children: "Confirmar Pagamento" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground mb-1", children: "Jorge paga" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold tracking-tight text-blue-600", children: formatCurrency(jorgePays) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-muted-foreground mb-1", children: "Lilian paga" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold tracking-tight text-rose-600", children: formatCurrency(lilianPays) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "bg-muted/30 hover:bg-muted/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-[100px] pl-6", children: "Data" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Descrição" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Categoria" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Parcela" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Responsável" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right pr-6 min-w-[120px]", children: "Ações" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right pr-6", children: "Valor" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: currentBillItems.length > 0 ? currentBillItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "group transition-colors", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-medium text-muted-foreground pl-6", children: item.date }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-bold", children: item.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: item.category }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: item.installments || "1/1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                item.avatarUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: item.avatarUrl, alt: item.user, className: "w-5 h-5 rounded-full border shadow-sm" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.user })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right pr-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "rounded-full opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { size: 16 }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right font-bold pr-6", children: formatCurrency(item.amount) })
            ] }, item.id)) : /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 7, className: "h-32 text-center text-muted-foreground", children: "Nenhuma compra registrada nesta fatura." }) }) })
          ] }) })
        ] })
      ] }) })
    ] }) : isCardsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center items-center h-64", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: CreditCard, title: "Você ainda não cadastrou nenhum cartão", description: "Organize seus limites e faturas em um só lugar.", actionLabel: "Adicionar Cartão", onAction: () => {
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AddCardModal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-4 apple-interactive rounded-xl px-8 shadow-lg shadow-primary/20 font-bold", children: "Adicionar Cartão" }) }) })
  ] }) }) });
}
export {
  CartoesPage as component
};
