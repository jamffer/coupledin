import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency, parseCurrencyInput } from "@/lib/utils";

const cardFormSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  totalLimit: z.string().min(1, "O limite é obrigatório"),
  cardType: z.enum(["Meu Cartão", "Cartão do Parceiro(a)", "Cartão Conjunto"]),
  lastDigits: z.string().max(4, "Máximo de 4 dígitos").optional(),
  dueDay: z.string().min(1, "Obrigatório").refine(v => parseInt(v) >= 1 && parseInt(v) <= 31, "Dia inválido (1-31)"),
  closingDay: z.string().min(1, "Obrigatório").refine(v => parseInt(v) >= 1 && parseInt(v) <= 31, "Dia inválido (1-31)"),
  color: z.string(),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

interface AddCardModalProps {
  children?: React.ReactNode;
}

export function AddCardModal({ children }: AddCardModalProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      name: "",
      totalLimit: "",
      cardType: "Meu Cartão",
      lastDigits: "",
      dueDay: "",
      closingDay: "",
      color: "#203F9A",
    },
  });

  async function onSubmit(values: CardFormValues) {
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
        color: values.color,
      });

      if (error) throw error;

      toast.success("Cartão adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      setOpen(false);
      form.reset();
    } catch (error: any) {
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
    { name: "Cinza", value: "#737373" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="rounded-full gap-2 shadow-sm">
            <Plus size={16} />
            Novo Cartão
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] apple-card">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Cartão</DialogTitle>
          <DialogDescription>
            Preencha os dados abaixo para cadastrar um novo cartão de crédito.
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
                    <Input placeholder="Ex: Nubank, Itaú..." {...field} disabled={isUploading} />
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
                        disabled={isUploading}
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
                name="lastDigits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Últimos 4 dígitos</FormLabel>
                    <FormControl>
                      <Input placeholder="1234" maxLength={4} {...field} disabled={isUploading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                        disabled={isUploading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dia de Vencimento</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: 10" 
                        type="number" 
                        min={1} 
                        max={31} 
                        disabled={isUploading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cardType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Cartão</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isUploading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Meu Cartão">Meu Cartão</SelectItem>
                      <SelectItem value="Cartão do Parceiro(a)">Cartão do Parceiro(a)</SelectItem>
                      <SelectItem value="Cartão Conjunto">Cartão Conjunto</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor de Destaque</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 ${
                          field.value === color.value ? "border-primary ring-2 ring-primary ring-offset-2 scale-110" : "border-transparent"
                        } transition-all`}
                        style={{ backgroundColor: color.value }}
                        onClick={() => field.onChange(color.value)}
                        disabled={isUploading}
                        title={color.name}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full rounded-xl shadow-lg font-bold" 
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar Cartão"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
