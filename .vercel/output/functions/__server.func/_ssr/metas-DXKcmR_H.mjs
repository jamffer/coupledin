import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router--zSI1aDr.mjs";
import { D as DashboardLayout, r as Skeleton, u as useProfile, i as Dialog, j as DialogContent, k as DialogHeader, l as DialogTitle, m as DialogDescription } from "./layout-dashboard-DYPsAunJ.mjs";
import { B as Button, C as Card, b as CardHeader, d as CardTitle, e as CardDescription, f as formatCurrency, a as CardContent } from "./card-DDGnP21B.mjs";
import { P as Progress } from "./progress-DPF4PGs9.mjs";
import { E as EmptyState } from "./empty-state-Bu9yyJzT.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as supabase } from "./client-CRCA7PsU.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useForm } from "../_libs/react-hook-form.mjs";
import { u } from "../_libs/hookform__resolvers.mjs";
import { F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormMessage } from "./form-D5bNUzYw.mjs";
import { I as Input } from "./label-BppqprV3.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import { P as Plus, g as Target, L as LoaderCircle } from "../_libs/lucide-react.mjs";
import { o as object, v as date, q as number, c as string } from "../_libs/zod.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
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
import "../_libs/radix-ui__react-progress.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
const goalSchema = object({
  title: string().min(1, "O título é obrigatório"),
  target_amount: number().positive("O valor alvo deve ser maior que zero"),
  saved_amount: number().min(0, "O valor salvo não pode ser negativo").optional(),
  deadline: date().optional().nullable()
});
function useGoals() {
  const { profile } = useProfile();
  return useQuery({
    queryKey: ["goals", profile?.couple_id],
    queryFn: async () => {
      if (!profile?.couple_id) return [];
      const { data, error } = await supabase.from("goals").select("*").eq("couple_id", profile.couple_id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.couple_id
  });
}
function useCreateGoal() {
  const { profile } = useProfile();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (values) => {
      if (!profile?.couple_id) throw new Error("Couple ID não encontrado");
      const { data, error } = await supabase.from("goals").insert({
        couple_id: profile.couple_id,
        title: values.title,
        target_amount: values.target_amount,
        saved_amount: values.saved_amount || 0,
        deadline: values.deadline ? values.deadline.toISOString().split("T")[0] : null
      }).select().single();
      if (error) throw error;
      return data;
    },
    onMutate: async (newGoal) => {
      const queryKey = ["goals", profile?.couple_id];
      await queryClient.cancelQueries({ queryKey });
      const previousGoals = queryClient.getQueryData(queryKey);
      if (previousGoals) {
        queryClient.setQueryData(queryKey, (old) => {
          const optimisticGoal = {
            id: `temp-${Date.now()}`,
            couple_id: profile?.couple_id || "",
            title: newGoal.title,
            target_amount: newGoal.target_amount,
            saved_amount: newGoal.saved_amount || 0,
            deadline: newGoal.deadline ? newGoal.deadline.toISOString() : null,
            created_at: (/* @__PURE__ */ new Date()).toISOString()
          };
          return [optimisticGoal, ...old];
        });
      }
      return { previousGoals };
    },
    onError: (err, newGoal, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(["goals", profile?.couple_id], context.previousGoals);
      }
      toast.error("Erro ao criar meta", { description: err.message });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", profile?.couple_id] });
    },
    onSuccess: () => {
      toast.success("Meta criada com sucesso!");
    }
  });
}
function NewGoalModal({ isOpen, onClose }) {
  const mutation = useCreateGoal();
  const form = useForm({
    resolver: u(goalSchema),
    defaultValues: {
      title: "",
      target_amount: 0,
      saved_amount: 0
    }
  });
  const onSubmit = (values) => {
    mutation.mutate(values, {
      onSuccess: () => {
        form.reset();
        onClose();
      }
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isOpen, onOpenChange: (open) => {
    if (!open) {
      form.reset();
      onClose();
    }
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "apple-card sm:max-w-[425px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Nova Meta" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Crie uma nova meta ou sonho para alcançar com seu parceiro." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name: "title",
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Título da Meta" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Ex: Viagem para Europa, Reserva de Emergência...", className: "apple-interactive rounded-xl", ...field }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "target_amount",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Valor Alvo (R$)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", className: "apple-interactive rounded-xl", ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "saved_amount",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { children: "Já Guardado (R$)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", className: "apple-interactive rounded-xl", ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "submit",
          className: "w-full h-12 rounded-xl text-base font-bold shadow-lg mt-6",
          disabled: mutation.isPending,
          children: [
            mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin mr-2" }) : null,
            mutation.isPending ? "Criando Meta..." : "Criar Meta"
          ]
        }
      )
    ] }) })
  ] }) });
}
function MetasPage() {
  const {
    user,
    loading: authLoading
  } = useAuth();
  const navigate = useNavigate();
  const {
    data: goals,
    isLoading
  } = useGoals();
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!authLoading && !user) {
      navigate({
        to: "/auth"
      });
    }
  }, [user, authLoading]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { variants: containerVariants, initial: "hidden", animate: "visible", className: "space-y-10 pb-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Metas e Sonhos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground italic", children: "Planejando o futuro passo a passo." })
      ] }),
      goals && goals.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "rounded-full shadow-sm gap-2 apple-interactive border-white/20", onClick: () => setIsModalOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
        "Nova Meta"
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[250px] rounded-2xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-[250px] rounded-2xl" })
    ] }) : goals && goals.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: goals.map((goal) => /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { variants: itemVariants, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "apple-card apple-card-hover group overflow-hidden border-2 border-primary/5 dark:border-white/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-start", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-2xl bg-blue-500/10 text-blue-500", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 24 }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "rounded-full opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "mt-4 text-lg font-bold", children: goal.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { className: "flex justify-between items-end mt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-bold text-lg dark:text-white", children: formatCurrency(goal.saved_amount || 0) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs dark:text-white/60", children: [
            "alvo: ",
            formatCurrency(goal.target_amount)
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: (goal.saved_amount || 0) / goal.target_amount * 100, className: "h-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-right font-bold uppercase tracking-wider text-muted-foreground", children: [
            Math.round((goal.saved_amount || 0) / goal.target_amount * 100),
            "% concluído"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-end pt-2 border-t border-border/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "outline", className: "h-8 rounded-full text-xs font-bold px-4 border-primary/20 hover:bg-primary/5 hover:text-primary transition-all", children: "Aportar" }) })
      ] })
    ] }) }, goal.id)) }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { icon: Target, title: "Nenhum cofre ou meta ainda", description: "Crie metas para suas viagens, sonhos ou reserva de emergência.", actionLabel: "Criar minha primeira meta", onAction: () => setIsModalOpen(true) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NewGoalModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false) })
  ] }) });
}
export {
  MetasPage as component
};
