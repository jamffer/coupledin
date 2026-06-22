import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { goalSchema, GoalFormValues, useUpdateGoal, useDeleteGoal, Goal } from "@/hooks/use-goals";
import { useProfile } from "@/hooks/use-profile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Loader2, ImagePlus, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GoalInvestmentSelector } from "@/components/investments/goal-investment-selector";

interface EditGoalModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditGoalModal({ goal, isOpen, onClose }: EditGoalModalProps) {
  const mutation = useUpdateGoal();
  const deleteMutation = useDeleteGoal();
  const { profile, isLoading: isProfileLoading } = useProfile();

  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: "",
      target_amount: 0,
      saved_amount: 0,
      image_url: null,
      investment_ids: [],
    },
  });

  useEffect(() => {
    if (goal && isOpen) {
      form.reset({
        title: goal.title,
        target_amount: goal.target_amount,
        saved_amount: goal.saved_amount || 0,
        image_url: goal.image_url,
        deadline:
          goal.deadline && !isNaN(new Date(goal.deadline).getTime())
            ? new Date(goal.deadline)
            : null,
        investment_ids: goal.linked_investments?.map((investment) => investment.id) || [],
      });
      setPreviewUrl(goal.image_url);
    }
  }, [goal, isOpen, form]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione uma imagem válida.");
      return;
    }

    try {
      setIsUploading(true);

      // Criar URL local para preview imediato
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${profile?.couple_id}/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from("goal_covers")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("goal_covers").getPublicUrl(filePath);

      form.setValue("image_url", publicUrl);
    } catch (error) {
      console.error("Erro no upload:", error);
      toast.error("Erro ao fazer upload da imagem.");
      setPreviewUrl(null); // Reverter preview em caso de erro
      if (fileInputRef.current) fileInputRef.current.value = "";
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    form.setValue("image_url", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (values: GoalFormValues) => {
    if (!goal) return;
    mutation.mutate(
      { id: goal.id, ...values },
      {
        onSuccess: () => {
          form.reset();
          onClose();
        },
      },
    );
  };

  const handleDelete = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!goal) return;
    deleteMutation.mutate(goal.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const isSubmitDisabled =
    mutation.isPending ||
    deleteMutation.isPending ||
    isProfileLoading ||
    !profile?.couple_id ||
    isUploading;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
          setPreviewUrl(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          onClose();
        }
      }}
    >
      <DialogContent className="apple-card sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Meta</DialogTitle>
          <DialogDescription>Atualize as informações da sua meta ou sonho.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Upload de Capa */}
            <div className="flex flex-col gap-2">
              <Label>Capa da Meta (Opcional)</Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />

                {previewUrl ? (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="rounded-full h-8 w-8"
                        onClick={removeImage}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-32 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-muted/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <>
                        <ImagePlus className="h-8 w-8 mb-1" />
                        <span>Adicionar uma capa</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Meta</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Viagem para Europa, Reserva de Emergência..."
                      className="apple-interactive rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="target_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Alvo (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="apple-interactive rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="saved_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Já Guardado (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        className="apple-interactive rounded-xl"
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
              name="investment_ids"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <GoalInvestmentSelector
                      value={field.value || []}
                      onChange={field.onChange}
                      disabled={isSubmitDisabled}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!isProfileLoading && !profile?.couple_id && (
              <div className="p-3 text-xs text-red-500 bg-red-500/10 rounded-xl font-medium text-center border border-red-500/20">
                Você precisa estar associado a um casal para criar metas.
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border/40 mt-6">
              {goal && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="destructive"
                      className="w-full sm:w-auto rounded-xl font-bold gap-2"
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : null}
                      Eliminar Meta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="apple-card">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. A meta e todo o histórico associado serão
                        removidos permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e) => handleDelete(e as unknown as React.MouseEvent)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                      >
                        Sim, eliminar meta
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <Button
                type="submit"
                className="w-full sm:w-auto rounded-xl font-bold shadow-lg"
                disabled={isSubmitDisabled}
              >
                {mutation.isPending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                {mutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
