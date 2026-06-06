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
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const cardFormSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  totalLimit: z.string().refine((val) => !isNaN(Number(val.replace(/[^\d.-]/g, ""))), {
    message: "Informe um valor numérico válido",
  }),
  cardType: z.enum(["Meu Cartão", "Cartão do Parceiro(a)", "Cartão Conjunto"], {
    required_error: "Selecione o tipo de cartão",
  }),
  lastDigits: z.string().max(4, "Máximo de 4 dígitos").optional(),
  color: z.string().default("card-gradient-blue"),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

interface AddCardModalProps {
  children?: React.ReactNode;
}

export function AddCardModal({ children }: AddCardModalProps) {
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      name: "",
      totalLimit: "",
      cardType: "Meu Cartão",
      lastDigits: "",
      color: "card-gradient-blue",
    },
  });

  async function onSubmit(values: CardFormValues) {
    if (!user) return;

    setIsUploading(true);
    try {
      const numericLimit = Number(values.totalLimit.replace(/[^\d.-]/g, ""));
      
      const { error } = await supabase.from("credit_cards").insert({
        user_id: user.id,
        name: values.name,
        total_limit: numericLimit,
        card_type: values.cardType,
        last_digits: values.lastDigits || null,
        color: values.color,
      });

      if (error) throw error;

      toast.success("Cartão adicionado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["credit_cards"] });
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
    { name: "Azul", value: "card-gradient-blue" },
    { name: "Roxo", value: "card-gradient-purple" },
    { name: "Verde", value: "card-gradient-green" },
    { name: "Laranja", value: "card-gradient-orange" },
    { name: "Rosa", value: "card-gradient-pink" },
    { name: "Escuro", value: "card-gradient-dark" },
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
                        {...field} 
                        disabled={isUploading}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                        value={field.value ? `R$ ${(Number(field.value) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : ""}
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
                        className={`w-8 h-8 rounded-full ${color.value} border-2 ${
                          field.value === color.value ? "border-primary scale-110" : "border-transparent"
                        } transition-all`}
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
