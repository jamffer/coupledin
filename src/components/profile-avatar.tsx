import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { ImageCropperModal } from "./image-cropper-modal";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  url: string | null;
  name: string;
  userId: string;
  onUpdate: (url: string) => void;
  className?: string;
  editable?: boolean;
}

export function ProfileAvatar({
  url,
  name,
  userId,
  onUpdate,
  className,
  editable = true,
}: ProfileAvatarProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    if (editable) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn("relative group", className)}>
      <Avatar 
        className={cn(
          "w-24 h-24 border-4 border-white dark:border-[#1A1A1A] shadow-xl ring-1 ring-muted/20",
          editable && "cursor-pointer"
        )}
        onClick={handleAvatarClick}
      >
        <AvatarImage src={url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || "default"}`} />
        <AvatarFallback>{name?.substring(0, 2).toUpperCase() || "ME"}</AvatarFallback>
      </Avatar>

      {editable && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-none"
          onClick={handleAvatarClick}
        >
          <Camera className="text-white w-6 h-6" />
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <ImageCropperModal
        image={selectedImage}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedImage(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }}
        onSuccess={onUpdate}
        userId={userId}
      />
    </div>
  );
}
