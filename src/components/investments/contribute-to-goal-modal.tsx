import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Goal, useContributeToGoal } from "@/hooks/use-goals";
import { formatCurrency } from "@/lib/utils";

const contributeSchema = z.object({
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
});

type ContributeFormValues = z.infer<typeof contributeSchema>;

interface ContributeToGoalModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContributeToGoalModal({ goal, isOpen, onClose }: ContributeToGoalModalProps) {
  const mutation = useContributeToGoal();

  const form = useForm<ContributeFormValues>({
    resolver: zodResolver(contributeSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const onSubmit = (values: ContributeFormValues) => {
    if (!goal) return;
    
    mutation.mutate(
      { 
        goalId: goal.id, 
        amount: values.amount, 
        currentSavedAmount: goal.saved_amount || 0 
      },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      }
    );
  };

  const isSubmitDisabled = mutation.isPending || !goal;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        form.reset();
        onClose();
      }
    }}>
      <DialogContent className="apple-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Aportar na Meta</DialogTitle>
          <DialogDescription>
            {goal ? `Adicione dinheiro para alcançar o sonho: ${goal.title}` : "Carregando meta..."}
          </DialogDescription>
        </DialogHeader>

        {goal && (
          <div className="flex justify-between items-center text-sm font-medium p-4 bg-muted/50 rounded-xl mb-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Já guardado</span>
              <span>{formatCurrency(goal.saved_amount || 0)}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-muted-foreground">Falta</span>
              <span>{formatCurrency(Math.max(0, goal.target_amount - (goal.saved_amount || 0)))}</span>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor do Aporte (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" className="apple-interactive rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl text-base font-bold shadow-lg mt-6"
              disabled={isSubmitDisabled}
            >
              {mutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
              {mutation.isPending ? "Processando..." : "Confirmar Aporte"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
