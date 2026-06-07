import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useProfile } from "@/hooks/use-profile";
import { Loader2 } from "lucide-react";

const assetSchema = z.object({
  asset_type: z.enum(['STOCK', 'FII', 'CRYPTO', 'FIXED_INCOME']),
  fixed_income_type: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  ticker: z.string().min(1, "Obrigatório").toUpperCase(),
  quantity: z.coerce.number().positive("Deve ser maior que zero"),
  average_price: z.coerce.number().positive("Deve ser maior que zero"),
  purchase_date: z.string().min(1, "Data obrigatória"),
  custom_rate: z.coerce.number().optional().default(0),
});

type AssetFormValues = z.infer<typeof assetSchema>;

interface NewAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewAssetModal({ isOpen, onClose }: NewAssetModalProps) {
  const { profile } = useProfile();
  const queryClient = useQueryClient();

  const form = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      asset_type: 'STOCK',
      fixed_income_type: 'PRIVATE',
      ticker: '',
      quantity: 1,
      average_price: 0,
      purchase_date: new Date().toISOString().split('T')[0],
      custom_rate: 0,
    },
  });

  const assetType = form.watch("asset_type");
  const fixedIncomeType = form.watch("fixed_income_type");

  const mutation = useMutation({
    mutationFn: async (values: AssetFormValues) => {
      if (!profile?.couple_id) throw new Error("Couple ID não encontrado");

      const finalCustomRate = (values.asset_type === 'FIXED_INCOME' && values.fixed_income_type === 'PUBLIC') 
        ? 0 
        : values.custom_rate;

      const { data, error } = await supabase
        .from('investments')
        .insert({
          couple_id: profile.couple_id,
          asset_type: values.asset_type,
          ticker: values.ticker,
          quantity: values.quantity,
          average_price: values.average_price,
          purchase_date: values.purchase_date,
          custom_rate: finalCustomRate,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newAsset) => {
      await queryClient.cancelQueries({ queryKey: ["investments", profile?.couple_id] });
      const previousInvestments = queryClient.getQueryData(["investments", profile?.couple_id]);

      queryClient.setQueryData(["investments", profile?.couple_id], (old: any) => {
        const optimisticAsset = {
          ...newAsset,
          id: `temp-${Math.random().toString(36).substring(2, 15)}`,
          couple_id: profile?.couple_id,
          custom_rate: (newAsset.asset_type === 'FIXED_INCOME' && newAsset.fixed_income_type === 'PUBLIC') ? 0 : newAsset.custom_rate,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
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
    },
  });

  const onSubmit = (values: AssetFormValues) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="apple-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Aporte</DialogTitle>
          <DialogDescription>
            Cadastre um novo ativo ou aporte na sua carteira.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="asset_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Ativo</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="apple-interactive rounded-xl">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="apple-card rounded-xl">
                      <SelectItem value="STOCK">Ações</SelectItem>
                      <SelectItem value="FII">Fundos Imobiliários (FIIs)</SelectItem>
                      <SelectItem value="CRYPTO">Criptomoedas</SelectItem>
                      <SelectItem value="FIXED_INCOME">Renda Fixa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {assetType === 'FIXED_INCOME' && (
              <FormField
                control={form.control}
                name="fixed_income_type"
                render={({ field }) => (
                  <FormItem className="space-y-3 p-3 bg-muted/40 rounded-xl border border-border/40">
                    <FormLabel>Qual a natureza da Renda Fixa?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="PUBLIC" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Tesouro Direto (Ex: SELIC, IPCA)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="PRIVATE" />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Títulos Privados (CDB, LCI com taxa fixa)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ticker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {assetType === 'FIXED_INCOME' && fixedIncomeType === 'PRIVATE' ? 'Nome do Título' : 
                       assetType === 'FIXED_INCOME' && fixedIncomeType === 'PUBLIC' ? 'Símbolo Tesouro' : 
                       'Ticker / Símbolo'}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={assetType === 'CRYPTO' ? 'bitcoin' : assetType === 'FIXED_INCOME' ? (fixedIncomeType === 'PUBLIC' ? 'SELIC2029' : 'CDB Banco X') : 'PETR4'} className="apple-interactive rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.00000001" className="apple-interactive rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="average_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Médio / Valor</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" className="apple-interactive rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="purchase_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data da Compra</FormLabel>
                    <FormControl>
                      <Input type="date" className="apple-interactive rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {assetType === 'FIXED_INCOME' && fixedIncomeType === 'PRIVATE' && (
              <FormField
                control={form.control}
                name="custom_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa Mensal (%)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="1.0" className="apple-interactive rounded-xl" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-base font-bold shadow-lg mt-6"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
              {mutation.isPending ? "Salvando..." : "Salvar Aporte"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
