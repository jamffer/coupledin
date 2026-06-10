import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency, parseCurrencyInput } from "@/lib/utils";

const editCardSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  totalLimit: z.string().min(1, "O limite é obrigatório"),
  closingDay: z.string().min(1, "Obrigatório").refine(v => parseInt(v) >= 1 && parseInt(v) <= 31, "Dia inválido (1-31)"),
});

type EditCardFormValues = z.infer<typeof editCardSchema>;

interface EditCardModalProps {
  card: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCardModal({ card, open, onOpenChange }: EditCardModalProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<EditCardFormValues>({
    resolver: zodResolver(editCardSchema),
    defaultValues: {
      name: "",
      totalLimit: "",
      closingDay: "",
    },
  });

  useEffect(() => {
    if (card && open) {
      form.reset({
        name: card.name,
        totalLimit: card.totalLimit.toString(),
        closingDay: card.closing_day?.toString() || "5",
      });
    }
  }, [card, open, form]);

  async function onSubmit(values: EditCardFormValues) {
    if (!card) return;

    setIsUpdating(true);
    try {
      const numericLimit = parseCurrencyInput(values.totalLimit);
      
      const { error } = await supabase
        .from("cards")
        .update({
          name: values.name,
          limit_amount: numericLimit,
          closing_day: parseInt(values.closingDay),
        })
        .eq("id", card.id);

      if (error) throw error;

      toast.success("Cartão atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating card:", error);
      toast.error("Falha ao salvar o cartão. Verifique sua conexão e tente novamente.");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] apple-card">
        <DialogHeader>
          <DialogTitle>Editar Cartão</DialogTitle>
          <DialogDescription>
            Altere as informações do cartão selecionado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Cartão</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Nubank, Itaú..." {...field} disabled={isUpdating} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Limite Total</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="R$ 0,00" 
                        disabled={isUpdating}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                        value={field.value ? formatCurrency(parseCurrencyInput(field.value)) : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="closingDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia de Fechamento</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: 5" 
                        type="number" 
                        min={1} 
                        max={31} 
                        disabled={isUpdating}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full rounded-xl shadow-lg font-bold" 
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
