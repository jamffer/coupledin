import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateInvestment } from "@/hooks/use-investment-mutations";
import { Database } from "@/integrations/supabase/types";
import {
  getDefaultInvestmentBehaviorByAssetType,
  INVESTMENT_BEHAVIOR_OPTIONS,
} from "@/lib/investment-behavior";

const investmentBehaviorSchema = z.enum([
  "DISTRIBUTES_INCOME",
  "ACCUMULATES_VALUE",
  "REINVESTS_AUTOMATICALLY",
  "FIXED_INCOME_MATURITY",
  "CRYPTOASSET",
  "OTHER",
]);

const editAssetSchema = z.object({
  quantity: z.number().positive("Deve ser maior que zero"),
  average_price: z.number().positive("Deve ser maior que zero"),
  custom_rate: z.number().min(0, "A taxa nao pode ser negativa"),
  investment_behavior: investmentBehaviorSchema,
});

type EditAssetFormValues = z.infer<typeof editAssetSchema>;
type Investment = Database["public"]["Tables"]["investments"]["Row"];

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Investment | null;
}

export function EditAssetModal({ isOpen, onClose, asset }: EditAssetModalProps) {
  const mutation = useUpdateInvestment();

  const form = useForm<EditAssetFormValues>({
    resolver: zodResolver(editAssetSchema),
    defaultValues: {
      quantity: Number(asset?.quantity || 0),
      average_price: Number(asset?.average_price || 0),
      custom_rate: Number(asset?.custom_rate || 0),
      investment_behavior:
        asset?.investment_behavior ||
        getDefaultInvestmentBehaviorByAssetType(asset?.asset_type || "STOCK"),
    },
  });

  useEffect(() => {
    if (asset) {
      form.reset({
        quantity: Number(asset.quantity),
        average_price: Number(asset.average_price),
        custom_rate: Number(asset.custom_rate || 0),
        investment_behavior:
          asset.investment_behavior || getDefaultInvestmentBehaviorByAssetType(asset.asset_type),
      });
    }
  }, [asset, form]);

  if (!asset) return null;

  const onSubmit = (values: EditAssetFormValues) => {
    mutation.mutate(
      {
        id: asset.id,
        quantity: values.quantity,
        average_price: values.average_price,
        custom_rate: values.custom_rate,
        investment_behavior: values.investment_behavior,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const isPrivateFixedIncome = asset.asset_type === "FIXED_INCOME" && Number(asset.custom_rate) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="apple-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Aporte</DialogTitle>
          <DialogDescription>
            Ajuste a quantidade e preco medio do ativo{" "}
            <strong className="uppercase">{asset.ticker}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-investment-ticker">Ativo (Ticker)</Label>
              <Input
                id="edit-investment-ticker"
                value={asset.ticker}
                disabled
                className="apple-interactive rounded-xl bg-muted/50"
              />
              <p className="mt-1 text-[10px] text-muted-foreground">
                O simbolo do ativo nao pode ser alterado.
              </p>
            </div>

            <FormField
              control={form.control}
              name="investment_behavior"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funcionamento do investimento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="apple-interactive rounded-xl">
                        <SelectValue placeholder="Como esse investimento rende?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="apple-card rounded-xl">
                      {INVESTMENT_BEHAVIOR_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {
                      INVESTMENT_BEHAVIOR_OPTIONS.find((option) => option.value === field.value)
                        ?.description
                    }
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade Atual</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.00000001"
                        className="apple-interactive rounded-xl"
                        {...field}
                        onChange={(event) => field.onChange(event.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="average_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preco Medio Ajustado</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="apple-interactive rounded-xl"
                        {...field}
                        onChange={(event) => field.onChange(event.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isPrivateFixedIncome && (
              <FormField
                control={form.control}
                name="custom_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taxa Mensal (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="apple-interactive rounded-xl"
                        {...field}
                        onChange={(event) => field.onChange(event.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button
              type="submit"
              className="mt-6 h-12 w-full rounded-xl text-base font-bold shadow-lg"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? <Loader2 className="mr-2 animate-spin" /> : null}
              {mutation.isPending ? "Salvando Alteracoes..." : "Salvar Edicao"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
