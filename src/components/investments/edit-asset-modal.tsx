import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useUpdateInvestment } from "@/hooks/use-investment-mutations";
import { EnrichedInvestment } from "@/hooks/use-investment-portfolio";

const editAssetSchema = z.object({
  quantity: z.coerce.number().positive("Deve ser maior que zero"),
  average_price: z.coerce.number().positive("Deve ser maior que zero"),
  custom_rate: z.coerce.number().min(0, "A taxa não pode ser negativa"),
});

type EditAssetFormValues = z.infer<typeof editAssetSchema>;

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: EnrichedInvestment | null;
}

export function EditAssetModal({ isOpen, onClose, asset }: EditAssetModalProps) {
  const mutation = useUpdateInvestment();

  const form = useForm<EditAssetFormValues>({
    resolver: zodResolver(editAssetSchema),
    defaultValues: {
      quantity: 0,
      average_price: 0,
      custom_rate: 0,
    },
  });

  useEffect(() => {
    if (asset) {
      form.reset({
        quantity: Number(asset.quantity),
        average_price: Number(asset.average_price),
        custom_rate: Number(asset.custom_rate || 0),
      });
    }
  }, [asset, form]);

  const onSubmit = (values: EditAssetFormValues) => {
    if (!asset) return;
    
    mutation.mutate(
      {
        id: asset.id,
        quantity: values.quantity,
        average_price: values.average_price,
        custom_rate: values.custom_rate,
      },
      {
        onSuccess: () => {
          onClose();
        }
      }
    );
  };

  if (!asset) return null;

  const isPrivateFixedIncome = asset.asset_type === 'FIXED_INCOME' && Number(asset.custom_rate) > 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="apple-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Aporte</DialogTitle>
          <DialogDescription>
            Ajuste a quantidade e preço médio do ativo <strong className="uppercase">{asset.ticker}</strong>.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            <FormItem>
              <FormLabel>Ativo (Ticker)</FormLabel>
              <FormControl>
                <Input value={asset.ticker} disabled className="apple-interactive rounded-xl bg-muted/50" />
              </FormControl>
              <p className="text-[10px] text-muted-foreground mt-1">O símbolo do ativo não pode ser alterado.</p>
            </FormItem>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade Atual</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.00000001" className="apple-interactive rounded-xl" {...field} />
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
                    <FormLabel>Preço Médio Ajustado</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" className="apple-interactive rounded-xl" {...field} />
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
                      <Input type="number" step="0.01" className="apple-interactive rounded-xl" {...field} />
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
              {mutation.isPending ? "Salvando Alterações..." : "Salvar Edição"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
