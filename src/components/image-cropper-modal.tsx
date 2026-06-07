import React, { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { getCroppedImg } from "@/lib/crop-image";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

interface ImageCropperModalProps {
  image: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (url: string) => void;
  userId: string;
}

export function ImageCropperModal({
  image,
  isOpen,
  onClose,
  onSuccess,
  userId,
}: ImageCropperModalProps) {
  const queryClient = useQueryClient();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Cleanup effect to revoke object URLs if needed (though we mostly use data URLs in this flow)
  useEffect(() => {
    return () => {
      if (image && image.startsWith('blob:')) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!image || !croppedAreaPixels || !userId) return;

    setIsUploading(true);
    try {
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
      
      // Cleanup the original image URL if it's a blob
      if (image.startsWith('blob:')) {
        URL.revokeObjectURL(image);
      }

      // Usa um nome fixo para evitar lixo no storage (SSOT no banco)
      const fileName = `profile.webp`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, croppedImageBlob, {
          contentType: "image/webp",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Estratégia de Cache Busting (crucial para o React atualizar a tag img)
      const bustedUrl = `${publicUrl}?t=${new Date().getTime()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: bustedUrl })
        .eq("id", userId);

      if (updateError) throw updateError;

      // Single Source of Truth: Invalidate queries to sync throughout the app
      await queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      
      onSuccess(publicUrl);
      toast.success("Foto de perfil atualizada com sucesso!");
      onClose();
    } catch (error: any) {
      console.error("Error saving cropped image:", error);
      toast.error("Falha ao salvar a imagem. Verifique sua conexão e tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isUploading && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajustar Foto</DialogTitle>
        </DialogHeader>
        
        <div className={cn(
          "relative h-[300px] w-full bg-muted rounded-md overflow-hidden",
          isUploading && "pointer-events-none opacity-80"
        )}>
          {image && (
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          )}
        </div>

        <div className={cn("space-y-2 mt-4", isUploading && "pointer-events-none opacity-50")}>
          <label className="text-sm font-medium">Zoom</label>
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={([value]) => setZoom(value)}
            disabled={isUploading}
          />
        </div>

        <DialogFooter className="mt-6">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isUploading}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isUploading || !image}
            className="min-w-[140px]"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando imagem...
              </>
            ) : (
              "Salvar Foto"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
