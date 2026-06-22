import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { addMonths, format, parseISO } from "date-fns";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { calculateBillingMonth } from "@/lib/billing-engine";
import { CATEGORY_ICONS, DIVISION_ICONS, type Transaction } from "@/hooks/use-finance-store";

const EXPENSE_CATEGORIES = ["Alimentação", "Lazer", "Transporte", "Moradia", "Saúde", "Outros"];
const INCOME_CATEGORIES = [
  "Salário",
  "Renda extra",
  "Freelance",
  "Vendas",
  "Reembolso",
  "Presente recebido",
  "Rendimentos",
  "Aluguel recebido",
  "Bônus",
  "Outros ganhos",
];

type CardOption = {
  id: string;
  name: string;
  last_four?: string | null;
  closing_day?: number | null;
};

const transactionSchema = z
  .object({
    description: z.string().min(1, "A descrição é obrigatória"),
    amount: z.number().min(0.01, "O valor deve ser maior que zero"),
    notes: z.string().max(500).optional(),
    type: z.enum(["Entrada", "Débito", "Crédito"]),
    date: z.string().min(1, "A data é obrigatória"),
    category: z.string().min(1, "A categoria é obrigatória"),
    responsible: z.string().min(1, "O responsável é obrigatório"),
    division: z.string().min(1, "A divisão é obrigatória"),
    card_id: z.string().optional(),
    isInstallment: z.boolean().default(false).optional(),
    installmentsCount: z.number().int().min(1).max(24).optional(),
    isRecurring: z.boolean().default(false).optional(),
    recurrenceDay: z.number().int().min(1).max(31).optional(),
  })
  .refine(
    (data) => {
      if (data.type === "Crédito" && !data.card_id) {
        return false;
      }
      return true;
    },
    {
      message: "Selecione um cartão para compras no crédito",
      path: ["card_id"],
    },
  );

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingTx: Transaction | null;
}

export function TransactionModal({ isOpen, onClose, editingTx }: TransactionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { profile, partnerProfile } = useProfile();
  const queryClient = useQueryClient();

  const { data: cards = [] } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const { data, error } = await supabase.from("cards").select("*");
      if (error) throw error;
      return data as CardOption[];
    },
    enabled: isOpen,
  });

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      notes: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      category: "Outros",
      responsible: profile?.id || "",
      division: "Conjunta 50/50",
      type: "Débito",
      card_id: undefined,
      isInstallment: false,
      installmentsCount: 1,
      isRecurring: false,
      recurrenceDay: new Date().getDate(),
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingTx) {
        form.reset({
          description: editingTx.description,
          notes: editingTx.notes || "",
          amount: Math.abs(editingTx.amount),
          date: new Date(editingTx.date).toISOString().split("T")[0],
          category: editingTx.category,
          responsible: editingTx.responsible_id || profile?.id || "",
          division: editingTx.division,
          type: editingTx.type === "Entrada" ? "Entrada" : editingTx.card_id ? "Crédito" : "Débito",
          card_id: editingTx.card_id || undefined,
          isRecurring: editingTx.is_recurring || false,
          recurrenceDay: editingTx.recurrence_day || new Date(editingTx.date).getDate(),
        });
      } else {
        form.reset({
          description: "",
          notes: "",
          amount: 0,
          date: new Date().toISOString().split("T")[0],
          category: "Outros",
          responsible: profile?.id || "",
          division: "Conjunta 50/50",
          type: "Débito",
          card_id: undefined,
          isInstallment: false,
          installmentsCount: 1,
          isRecurring: false,
          recurrenceDay: new Date().getDate(),
        });
      }
    }
  }, [isOpen, editingTx, form, profile?.id]);

  const watchType = form.watch("type");
  const categoryOptions = watchType === "Entrada" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  useEffect(() => {
    const currentCategory = form.getValues("category");
    if (!categoryOptions.includes(currentCategory)) {
      form.setValue("category", watchType === "Entrada" ? "Outros ganhos" : "Outros");
    }
  }, [categoryOptions, form, watchType]);

  async function onSubmit(values: TransactionFormValues) {
    if (!user || !profile?.couple_id) return;

    setIsSubmitting(true);
    try {
      let billing_date = values.date.substring(0, 8) + "01";

      if (values.type === "Crédito" && values.card_id) {
        const card = cards.find((c) => c.id === values.card_id);
        if (card && card.closing_day) {
          billing_date = calculateBillingMonth(values.date, card.closing_day);
        }
      }

      const sign = values.type === "Entrada" ? 1 : -1;
      const responsibleProfile =
        values.responsible === profile.id ? profile : partnerProfile;
      const responsibleName =
        responsibleProfile?.display_name ||
        (values.responsible === profile.id ? "Você" : "Parceiro(a)");

      if (
        !editingTx &&
        values.type === "Crédito" &&
        values.isInstallment &&
        values.installmentsCount &&
        values.installmentsCount > 1
      ) {
        const count = values.installmentsCount;
        const totalAmount = Math.abs(values.amount);
        const installmentAmount = Math.floor((totalAmount / count) * 100) / 100;
        const remainder = Math.round((totalAmount - installmentAmount * count) * 100) / 100;

        const txsToInsert = [];

        for (let i = 0; i < count; i++) {
          const currentAmount = installmentAmount + (i === 0 ? remainder : 0);
          const dateObj = parseISO(billing_date);
          const nextBillingDate = format(addMonths(dateObj, i), "yyyy-MM-dd");

          txsToInsert.push({
            description: `${values.description} (${i + 1}/${count})`,
            notes: values.notes || null,
            amount: sign * currentAmount,
            date: values.date,
            category: values.category,
            responsible: responsibleName,
            responsible_id: values.responsible,
            division: values.division,
            type: values.type,
            user_id: user.id,
            couple_id: profile.couple_id,
            card_id: values.card_id,
            billing_date: nextBillingDate,
          });
        }

        const { error } = await supabase.from("transactions").insert(txsToInsert);
        if (error) throw error;
        toast.success(`${count} parcelas adicionadas!`);
      } else {
        const txData = {
          description: values.description,
          notes: values.notes || null,
          amount: sign * Math.abs(values.amount),
          date: values.date,
          category: values.category,
          responsible: responsibleName,
          responsible_id: values.responsible,
          division: values.division,
          type: values.type,
          user_id: user.id,
          couple_id: profile.couple_id,
          card_id: values.type === "Crédito" ? values.card_id : null,
          billing_date: billing_date,
          is_recurring: !editingTx && !!values.isRecurring,
          recurrence_rule: !editingTx && values.isRecurring ? "monthly" : null,
          recurrence_day: !editingTx && values.isRecurring ? values.recurrenceDay || 1 : null,
          recurrence_status: "active",
        };

        if (editingTx) {
          const { error } = await supabase
            .from("transactions")
            .update(txData)
            .eq("id", editingTx.id);
          if (error) throw error;
          toast.success("Transação atualizada!");
        } else {
          const { error } = await supabase.from("transactions").insert(txData);
          if (error) throw error;
          toast.success("Transação adicionada!");
        }
      }

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      queryClient.invalidateQueries({ queryKey: ["card-invoice"] });
      onClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Tente novamente em instantes.";
      toast.error("Erro ao salvar transação", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="apple-card sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editingTx ? "Editar Lançamento" : "Novo Lançamento"}
          </DialogTitle>
          <DialogDescription>
            {editingTx
              ? "Altere as informações da transação."
              : "Insira os detalhes do gasto ou entrada manualmente."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-60">
                    Descrição
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-xl"
                      placeholder="Ex: Aluguel, Supermercado..."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-60">
                    Observações
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-20 rounded-xl"
                      placeholder="Detalhes opcionais sobre este gasto ou ganho."
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-60">
                      Valor
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">
                          R$
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          className="pl-9 rounded-xl font-bold"
                          placeholder="0,00"
                          value={field.value}
                          onChange={(event) => field.onChange(Number(event.target.value))}
                          disabled={isSubmitting}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-60">
                      Tipo
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="apple-card">
                        <SelectItem value="Entrada">Entrada</SelectItem>
                        <SelectItem value="Débito">Débito</SelectItem>
                        <SelectItem value="Crédito">Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-60">
                      Data
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className="rounded-xl"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-60">
                      Categoria
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="apple-card h-64">
                        {categoryOptions.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {watchType === "Crédito" && (
              <div className="animate-in fade-in slide-in-from-top-1 duration-300 space-y-4">
                <FormField
                  control={form.control}
                  name="card_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-60">
                        Cartão de Crédito
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Selecione o cartão" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="apple-card">
                          {cards.map((card) => (
                            <SelectItem key={card.id} value={card.id}>
                              {card.name} (final {card.last_four || "0000"})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!editingTx && (
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
                    <FormField
                      control={form.control}
                      name="isInstallment"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-y-0">
                          <div>
                            <FormLabel className="font-bold text-sm">Compra Parcelada</FormLabel>
                            <DialogDescription className="text-xs">
                              Dividir o valor em várias faturas.
                            </DialogDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {form.watch("isInstallment") && (
                      <FormField
                        control={form.control}
                        name="installmentsCount"
                        render={({ field }) => (
                          <FormItem className="animate-in fade-in zoom-in-95 duration-200">
                            <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-60">
                              Número de Parcelas
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="2"
                                max="24"
                                className="rounded-xl"
                                value={field.value}
                                onChange={(event) => field.onChange(Number(event.target.value))}
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="responsible"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-60">
                      Responsável
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="apple-card">
                        {profile && (
                          <SelectItem value={profile.id}>
                            {profile.display_name || "Você"}
                          </SelectItem>
                        )}
                        {partnerProfile && (
                          <SelectItem value={partnerProfile.id}>
                            {partnerProfile.display_name || "Parceiro(a)"}
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="division"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-xs uppercase tracking-widest opacity-60">
                      Divisão
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="apple-card">
                        {Object.keys(DIVISION_ICONS).map((div) => (
                          <SelectItem key={div} value={div}>
                            {div}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!editingTx && (
              <div className="rounded-2xl border border-primary/10 bg-primary/5 p-4">
                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-y-0">
                      <div>
                        <FormLabel className="font-bold">Repetir todo mês</FormLabel>
                        <DialogDescription className="text-xs">
                          Ideal para aluguel, internet, streaming e outros gastos fixos.
                        </DialogDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {form.watch("isRecurring") && (
                  <FormField
                    control={form.control}
                    name="recurrenceDay"
                    render={({ field }) => (
                      <FormItem className="mt-4">
                        <FormLabel>Dia do lançamento mensal</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={31}
                            value={field.value}
                            onChange={(event) => field.onChange(Number(event.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl shadow-lg font-bold py-6 mt-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Salvando...
                </>
              ) : editingTx ? (
                "Atualizar Lançamento"
              ) : (
                "Adicionar Lançamento"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
