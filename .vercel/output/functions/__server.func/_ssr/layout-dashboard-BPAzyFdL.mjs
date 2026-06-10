import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link, f as useRouterState } from "../_libs/tanstack__react-router.mjs";
import { a as Logo, L as Label, I as Input } from "./label-BKMEXiM6.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { R as Root$1, I as Image$1, F as Fallback } from "../_libs/radix-ui__react-avatar.mjs";
import { B as Button, c as cn } from "./card-DDGnP21B.mjs";
import { C as Cropper } from "../_libs/react-easy-crop.mjs";
import { R as Root, T as Trigger$1, P as Portal, C as Content, b as Close, a as Title, D as Description, O as Overlay } from "../_libs/radix-ui__react-dialog.mjs";
import { S as Slider$1, a as SliderTrack, b as SliderRange, c as SliderThumb } from "../_libs/radix-ui__react-slider.mjs";
import { s as supabase } from "./client-CRCA7PsU.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { c as cva } from "../_libs/class-variance-authority.mjs";
import { R as Root$2 } from "../_libs/radix-ui__react-separator.mjs";
import { P as Provider, R as Root3, T as Trigger, a as Portal$1, C as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
import { S as Select$1, a as SelectValue$1, b as SelectTrigger$1, c as SelectIcon, d as SelectPortal, e as SelectContent$1, f as SelectViewport, g as SelectItem$1, h as SelectItemIndicator, i as SelectItemText, j as SelectScrollUpButton$1, k as SelectScrollDownButton$1, l as SelectLabel$1, m as SelectSeparator$1 } from "../_libs/radix-ui__react-select.mjs";
import { c as create, p as persist } from "../_libs/zustand.mjs";
import { u as useAuth } from "./router-Dl0zekrI.mjs";
import { a as CircleQuestionMark, d as TrendingUp, H as Heart, a0 as House, a1 as Car, Z as Coffee, a2 as ShoppingBag, Q as User, a3 as Split, U as Users, a4 as Sun, a5 as Moon, P as Plus, C as CirclePlus, a6 as LogOut, L as LoaderCircle, g as Check, h as Copy, _ as ChevronDown, a7 as X, a8 as Camera, k as LayoutDashboard, a9 as ReceiptText, K as CreditCard, f as Target, aa as Settings, ab as PanelLeft, ac as ChevronUp } from "../_libs/lucide-react.mjs";
function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });
  const { data: partnerProfile, isLoading: isPartnerLoading } = useQuery({
    queryKey: ["partnerProfile", profile?.couple_id, user?.id],
    queryFn: async () => {
      if (!profile?.couple_id || !user) return null;
      const { data, error } = await supabase.from("profiles").select("*").eq("couple_id", profile.couple_id).neq("id", user.id).maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!profile?.couple_id && !!user
  });
  reactExports.useEffect(() => {
    if (!user) return;
    const userChannel = supabase.channel(`user-profile-${user.id}-${Math.random()}`).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "profiles",
        filter: `id=eq.${user.id}`
      },
      (payload) => {
        queryClient.invalidateQueries({ queryKey: ["profile", user.id] });
      }
    ).subscribe();
    let partnerChannel = null;
    if (profile?.couple_id) {
      partnerChannel = supabase.channel(`partner-profile-${profile.couple_id}-${Math.random()}`).on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `couple_id=eq.${profile.couple_id}`
        },
        (payload) => {
          const updatedProfile = payload.new;
          if (updatedProfile.id !== user.id) {
            queryClient.invalidateQueries({ queryKey: ["partnerProfile", profile.couple_id, user.id] });
          }
        }
      ).subscribe();
    }
    return () => {
      supabase.removeChannel(userChannel);
      if (partnerChannel) {
        supabase.removeChannel(partnerChannel);
      }
    };
  }, [user, profile?.couple_id, queryClient]);
  return {
    profile,
    partnerProfile,
    isLoading: isProfileLoading || isPartnerLoading
  };
}
const Avatar = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root$1,
  {
    ref,
    className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
    ...props
  }
));
Avatar.displayName = Root$1.displayName;
const AvatarImage = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Image$1,
  {
    ref,
    className: cn("aspect-square h-full w-full", className),
    ...props
  }
));
AvatarImage.displayName = Image$1.displayName;
const AvatarFallback = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Fallback,
  {
    ref,
    className: cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    ),
    ...props
  }
));
AvatarFallback.displayName = Fallback.displayName;
const Dialog = Root;
const DialogTrigger = Trigger$1;
const DialogPortal = Portal;
const DialogOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = Overlay.displayName;
const DialogContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogFooter = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "div",
  {
    className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
    ...props
  }
);
DialogFooter.displayName = "DialogFooter";
const DialogTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = Title.displayName;
const DialogDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = Description.displayName;
const Slider = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Slider$1,
  {
    ref,
    className: cn("relative flex w-full touch-none select-none items-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SliderTrack, { className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SliderRange, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = Slider$1.displayName;
const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }
  const MAX_SIZE = 512;
  let targetWidth = pixelCrop.width;
  let targetHeight = pixelCrop.height;
  if (targetWidth > MAX_SIZE || targetHeight > MAX_SIZE) {
    if (targetWidth > targetHeight) {
      targetHeight = MAX_SIZE / targetWidth * targetHeight;
      targetWidth = MAX_SIZE;
    } else {
      targetWidth = MAX_SIZE / targetHeight * targetWidth;
      targetHeight = MAX_SIZE;
    }
  }
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      resolve(blob);
    }, "image/webp", 0.8);
  });
};
const createImage = (url) => new Promise((resolve, reject) => {
  const image = new Image();
  image.addEventListener("load", () => resolve(image));
  image.addEventListener("error", (error) => reject(error));
  image.setAttribute("crossOrigin", "anonymous");
  image.src = url;
});
function ImageCropperModal({
  image,
  isOpen,
  onClose,
  onSuccess,
  userId
}) {
  const queryClient = useQueryClient();
  const [crop, setCrop] = reactExports.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = reactExports.useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = reactExports.useState(null);
  const [isUploading, setIsUploading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    return () => {
      if (image && image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);
  const onCropComplete = reactExports.useCallback((_croppedArea, croppedAreaPixels2) => {
    setCroppedAreaPixels(croppedAreaPixels2);
  }, []);
  const handleSave = async () => {
    if (!image || !croppedAreaPixels || !userId) return;
    setIsUploading(true);
    try {
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels);
      if (image.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
      const fileName = `profile.webp`;
      const filePath = `${userId}/${fileName}`;
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, croppedImageBlob, {
        contentType: "image/webp",
        upsert: true
      });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const bustedUrl = `${publicUrl}?t=${(/* @__PURE__ */ new Date()).getTime()}`;
      const { error: updateError } = await supabase.from("profiles").update({ avatar_url: bustedUrl }).eq("id", userId);
      if (updateError) throw updateError;
      await queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
      await queryClient.invalidateQueries({ queryKey: ["cards"] });
      onSuccess(publicUrl);
      toast.success("Foto de perfil atualizada com sucesso!");
      onClose();
    } catch (error) {
      console.error("Error saving cropped image:", error);
      toast.error(`Falha ao salvar a imagem: ${error.message || "Erro desconhecido"}`);
    } finally {
      setIsUploading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isOpen, onOpenChange: (open) => !open && !isUploading && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Ajustar Foto" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
      "relative h-[300px] w-full bg-muted rounded-md overflow-hidden",
      isUploading && "pointer-events-none opacity-80"
    ), children: image && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Cropper,
      {
        image,
        crop,
        zoom,
        aspect: 1,
        onCropChange: setCrop,
        onCropComplete,
        onZoomChange: setZoom
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("space-y-2 mt-4", isUploading && "pointer-events-none opacity-50"), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Zoom" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Slider,
        {
          value: [zoom],
          min: 1,
          max: 3,
          step: 0.1,
          onValueChange: ([value]) => setZoom(value),
          disabled: isUploading
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          onClick: onClose,
          disabled: isUploading,
          children: "Cancelar"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleSave,
          disabled: isUploading || !image,
          className: "min-w-[140px]",
          children: isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
            "Salvando imagem..."
          ] }) : "Salvar Foto"
        }
      )
    ] })
  ] }) });
}
function ProfileAvatar({
  url,
  name,
  userId,
  onUpdate,
  className,
  editable = true
}) {
  const [selectedImage, setSelectedImage] = reactExports.useState(null);
  const [isModalOpen, setIsModalOpen] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Arquivo não suportado. Envie uma imagem JPG/PNG ou WebP.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error("Arquivo muito grande. O limite é de 5MB.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const objectUrl = URL.createObjectURL(file);
      setSelectedImage(objectUrl);
      setIsModalOpen(true);
    }
  };
  const handleAvatarClick = () => {
    if (editable && userId) {
      fileInputRef.current?.click();
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("relative group", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Avatar,
      {
        className: cn(
          "w-24 h-24 border-4 border-white dark:border-[#1A1A1A] shadow-xl ring-1 ring-muted/20",
          editable && "cursor-pointer"
        ),
        onClick: handleAvatarClick,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || "default"}` }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: name?.substring(0, 2).toUpperCase() || "ME" })
        ]
      }
    ),
    editable && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer pointer-events-none",
        onClick: handleAvatarClick,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "text-white w-6 h-6" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "file",
        ref: fileInputRef,
        onChange: handleFileChange,
        accept: "image/*",
        className: "hidden"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ImageCropperModal,
      {
        image: selectedImage,
        isOpen: isModalOpen,
        onClose: () => {
          setIsModalOpen(false);
          if (selectedImage) {
            URL.revokeObjectURL(selectedImage);
          }
          setSelectedImage(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        },
        onSuccess: onUpdate,
        userId: userId || ""
      }
    )
  ] });
}
const MOBILE_BREAKPOINT = 768;
function useIsMobile() {
  const [isMobile, setIsMobile] = reactExports.useState(void 0);
  reactExports.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return !!isMobile;
}
const Separator = reactExports.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root$2,
  {
    ref,
    decorative,
    orientation,
    className: cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    ),
    ...props
  }
));
Separator.displayName = Root$2.displayName;
const Sheet = Root;
const SheetPortal = Portal;
const SheetOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = reactExports.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
    ] }),
    children
  ] })
] }));
SheetContent.displayName = Content.displayName;
const SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
SheetHeader.displayName = "SheetHeader";
const SheetTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = Title.displayName;
const SheetDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = Description.displayName;
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("animate-pulse rounded-md bg-primary/10", className), ...props });
}
const TooltipProvider = Provider;
const Tooltip = Root3;
const TooltipTrigger = Trigger;
const TooltipContent = reactExports.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    sideOffset,
    className: cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)",
      className
    ),
    ...props
  }
) }));
TooltipContent.displayName = Content2.displayName;
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_MOBILE = "18rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SidebarContext = reactExports.createContext(null);
function useSidebar() {
  const context = reactExports.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return context;
}
const SidebarProvider = reactExports.forwardRef(
  ({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ...props
  }, ref) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = reactExports.useState(false);
    const [_open, _setOpen] = reactExports.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = reactExports.useCallback(
      (value) => {
        const openState = typeof value === "function" ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open]
    );
    const toggleSidebar = reactExports.useCallback(() => {
      return isMobile ? setOpenMobile((open2) => !open2) : setOpen((open2) => !open2);
    }, [isMobile, setOpen, setOpenMobile]);
    reactExports.useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);
    const state = open ? "expanded" : "collapsed";
    const contextValue = reactExports.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContext.Provider, { value: contextValue, children: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { delayDuration: 0, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          "--sidebar-width": SIDEBAR_WIDTH,
          "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
          ...style
        },
        className: cn(
          "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
          className
        ),
        ref,
        ...props,
        children
      }
    ) }) });
  }
);
SidebarProvider.displayName = "SidebarProvider";
const Sidebar = reactExports.forwardRef(
  ({
    side = "left",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    ...props
  }, ref) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    if (collapsible === "none") {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: cn(
            "flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
            className
          ),
          ref,
          ...props,
          children
        }
      );
    }
    if (isMobile) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: openMobile, onOpenChange: setOpenMobile, ...props, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        SheetContent,
        {
          "data-sidebar": "sidebar",
          "data-mobile": "true",
          className: "w-(--sidebar-width) bg-transparent p-0 text-sidebar-foreground [&>button]:hidden",
          style: {
            "--sidebar-width": SIDEBAR_WIDTH_MOBILE
          },
          side,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { className: "sr-only", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { children: "Sidebar" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SheetDescription, { children: "Displays the mobile sidebar." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full w-full flex-col", children })
          ]
        }
      ) });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref,
        className: "group peer hidden text-sidebar-foreground md:block",
        "data-state": state,
        "data-collapsible": state === "collapsed" ? collapsible : "",
        "data-variant": variant,
        "data-side": side,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
                "group-data-[collapsible=offcanvas]:w-0",
                "group-data-[side=right]:rotate-180",
                variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
              )
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "fixed inset-y-0 z-50 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
                side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
                // Adjust the padding for floating and inset variants.
                variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l",
                className
              ),
              ...props,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-sidebar": "sidebar",
                  className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
                  children
                }
              )
            }
          )
        ]
      }
    );
  }
);
Sidebar.displayName = "Sidebar";
const SidebarTrigger = reactExports.forwardRef(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Button,
    {
      ref,
      "data-sidebar": "trigger",
      variant: "ghost",
      size: "icon",
      className: cn("h-7 w-7", className),
      onClick: (event) => {
        onClick?.(event);
        toggleSidebar();
      },
      ...props,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeft, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Toggle Sidebar" })
      ]
    }
  );
});
SidebarTrigger.displayName = "SidebarTrigger";
const SidebarRail = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar();
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        ref,
        "data-sidebar": "rail",
        "aria-label": "Toggle Sidebar",
        tabIndex: -1,
        onClick: toggleSidebar,
        title: "Toggle Sidebar",
        className: cn(
          "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
          "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
          "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
          "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
          "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
          "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
          className
        ),
        ...props
      }
    );
  }
);
SidebarRail.displayName = "SidebarRail";
const SidebarInset = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "main",
      {
        ref,
        className: cn(
          "relative flex w-full flex-1 flex-col bg-background",
          "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
          className
        ),
        ...props
      }
    );
  }
);
SidebarInset.displayName = "SidebarInset";
const SidebarInput = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Input,
    {
      ref,
      "data-sidebar": "input",
      className: cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      ),
      ...props
    }
  );
});
SidebarInput.displayName = "SidebarInput";
const SidebarHeader = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref,
        "data-sidebar": "header",
        className: cn("flex flex-col gap-2 p-2", className),
        ...props
      }
    );
  }
);
SidebarHeader.displayName = "SidebarHeader";
const SidebarFooter = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref,
        "data-sidebar": "footer",
        className: cn("flex flex-col gap-2 p-2", className),
        ...props
      }
    );
  }
);
SidebarFooter.displayName = "SidebarFooter";
const SidebarSeparator = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Separator,
    {
      ref,
      "data-sidebar": "separator",
      className: cn("mx-2 w-auto bg-sidebar-border", className),
      ...props
    }
  );
});
SidebarSeparator.displayName = "SidebarSeparator";
const SidebarContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref,
        "data-sidebar": "content",
        className: cn(
          "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
          className
        ),
        ...props
      }
    );
  }
);
SidebarContent.displayName = "SidebarContent";
const SidebarGroup = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        ref,
        "data-sidebar": "group",
        className: cn("relative flex w-full min-w-0 flex-col p-2", className),
        ...props
      }
    );
  }
);
SidebarGroup.displayName = "SidebarGroup";
const SidebarGroupLabel = reactExports.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-label",
      className: cn(
        "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
const SidebarGroupAction = reactExports.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      ref,
      "data-sidebar": "group-action",
      className: cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";
const SidebarGroupContent = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      "data-sidebar": "group-content",
      className: cn("w-full text-sm", className),
      ...props
    }
  )
);
SidebarGroupContent.displayName = "SidebarGroupContent";
const SidebarMenu = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "ul",
    {
      ref,
      "data-sidebar": "menu",
      className: cn("flex w-full min-w-0 flex-col gap-1", className),
      ...props
    }
  )
);
SidebarMenu.displayName = "SidebarMenu";
const SidebarMenuItem = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "li",
    {
      ref,
      "data-sidebar": "menu-item",
      className: cn("group/menu-item relative", className),
      ...props
    }
  )
);
SidebarMenuItem.displayName = "SidebarMenuItem";
const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring cursor-pointer transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline: "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]"
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const SidebarMenuButton = reactExports.forwardRef(
  ({
    asChild = false,
    isActive = false,
    variant = "default",
    size = "default",
    tooltip,
    className,
    ...props
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    const { isMobile, state } = useSidebar();
    const button = /* @__PURE__ */ jsxRuntimeExports.jsx(
      Comp,
      {
        ref,
        "data-sidebar": "menu-button",
        "data-size": size,
        "data-active": isActive,
        className: cn(sidebarMenuButtonVariants({ variant, size }), className),
        ...props
      }
    );
    if (!tooltip) {
      return button;
    }
    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip
      };
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: button }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        TooltipContent,
        {
          side: "right",
          align: "center",
          hidden: state !== "collapsed" || isMobile,
          ...tooltip
        }
      )
    ] });
  }
);
SidebarMenuButton.displayName = "SidebarMenuButton";
const SidebarMenuAction = reactExports.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-action",
      className: cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      ),
      ...props
    }
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";
const SidebarMenuBadge = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref,
      "data-sidebar": "menu-badge",
      className: cn(
        "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground",
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  )
);
SidebarMenuBadge.displayName = "SidebarMenuBadge";
const SidebarMenuSkeleton = reactExports.forwardRef(({ className, showIcon = false, ...props }, ref) => {
  const width = reactExports.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref,
      "data-sidebar": "menu-skeleton",
      className: cn("flex h-8 items-center gap-2 rounded-md px-2", className),
      ...props,
      children: [
        showIcon && /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "size-4 rounded-md", "data-sidebar": "menu-skeleton-icon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "h-4 max-w-(--skeleton-width) flex-1",
            "data-sidebar": "menu-skeleton-text",
            style: {
              "--skeleton-width": width
            }
          }
        )
      ]
    }
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
const SidebarMenuSub = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "ul",
    {
      ref,
      "data-sidebar": "menu-sub",
      className: cn(
        "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  )
);
SidebarMenuSub.displayName = "SidebarMenuSub";
const SidebarMenuSubItem = reactExports.forwardRef(
  ({ ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { ref, ...props })
);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
const SidebarMenuSubButton = reactExports.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Comp,
    {
      ref,
      "data-sidebar": "menu-sub-button",
      "data-size": size,
      "data-active": isActive,
      className: cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      ),
      ...props
    }
  );
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
const Select = Select$1;
const SelectValue = SelectValue$1;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectTrigger$1,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectIcon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = SelectTrigger$1.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollUpButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectScrollDownButton$1,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectContent$1,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        SelectViewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = SelectContent$1.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectLabel$1,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = SelectLabel$1.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  SelectItem$1,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItemText, { children })
    ]
  }
));
SelectItem.displayName = SelectItem$1.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  SelectSeparator$1,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = SelectSeparator$1.displayName;
const useFinanceStore = create()(
  persist(
    (set) => ({
      transactions: [],
      incomeJorge: 0,
      incomeLilian: 0,
      addTransaction: (tx) => set((state) => ({ transactions: [tx, ...state.transactions] })),
      updateTransaction: (id, updatedTx) => set((state) => ({
        transactions: state.transactions.map((tx) => tx.id === id ? { ...tx, ...updatedTx } : tx)
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter((tx) => tx.id !== id)
      })),
      setTransactions: (transactions) => set((state) => ({
        transactions: typeof transactions === "function" ? transactions(state.transactions) : transactions
      })),
      setIncomes: (jorge, lilian) => set({ incomeJorge: jorge, incomeLilian: lilian }),
      userNames: { Jorge: "Jorge", Lilian: "Lilian" },
      userAvatars: {
        Jorge: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        Lilian: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bella"
      },
      updateUserProfile: (user, name, avatar) => set((state) => ({
        userNames: { ...state.userNames, [user]: name },
        userAvatars: { ...state.userAvatars, [user]: avatar }
      }))
    }),
    {
      name: "finance-storage",
      partialize: (state) => ({
        incomeJorge: state.incomeJorge,
        incomeLilian: state.incomeLilian,
        userNames: state.userNames
      })
    }
  )
);
const CATEGORY_ICONS = {
  "Alimentação": ShoppingBag,
  "Lazer": Coffee,
  "Transporte": Car,
  "Moradia": House,
  "Saúde": Heart,
  "Renda": TrendingUp,
  "Outros": CircleQuestionMark
};
const DIVISION_ICONS = {
  "Conjunta 50/50": Users,
  "Proporcional": Split,
  "Individual": User
};
const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Lançamentos", url: "/transacoes", icon: ReceiptText },
  { title: "Cartões", url: "/cartoes", icon: CreditCard },
  { title: "Investimentos", url: "/investimentos", icon: TrendingUp },
  { title: "Metas", url: "/metas", icon: Target },
  { title: "Relatórios", url: "/relatorios", icon: ReceiptText },
  { title: "Configurações", url: "/configuracoes", icon: Settings }
];
function AppSidebar() {
  const currentPath = useRouterState({
    select: (router) => router.location.pathname
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Sidebar, { collapsible: "icon", className: "border-r border-sidebar-border bg-sidebar z-[100] shadow-xl transition-all duration-300 pointer-events-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarHeader, { className: "h-16 flex items-center justify-start px-6 border-b border-white/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center gap-2 hover:opacity-70 transition-opacity duration-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { className: "h-8 w-auto" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarGroup, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarGroupLabel, { className: "px-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70", children: "Menu" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarGroupContent, { className: "px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenu, { children: menuItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarMenuItem, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        SidebarMenuButton,
        {
          asChild: true,
          isActive: currentPath === item.url,
          className: "rounded-xl transition-all duration-200",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: item.url, className: "flex items-center gap-3 py-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: item.title })
          ] })
        }
      ) }, item.title)) }) })
    ] }) })
  ] });
}
function DashboardLayout({ children }) {
  const queryClient = useQueryClient();
  const [scrollProgress, setScrollProgress] = reactExports.useState(0);
  const [isNewRecordOpen, setIsNewRecordOpen] = reactExports.useState(false);
  const [isProfileOpen, setIsProfileOpen] = reactExports.useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = reactExports.useState(false);
  const { userNames, userAvatars } = useFinanceStore();
  const { user, signOut } = useAuth();
  const { profile, partnerProfile } = useProfile();
  const [tempName, setTempName] = reactExports.useState("");
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [showInviteDialogInLayout, setShowInviteDialogInLayout] = reactExports.useState(false);
  const [inviteCode, setInviteCode] = reactExports.useState(null);
  const [copied, setCopied] = reactExports.useState(false);
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = reactExports.useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme === "dark";
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  reactExports.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };
  reactExports.useEffect(() => {
    if (isProfileOpen && profile) {
      setTempName(profile.display_name || "");
    }
  }, [isProfileOpen, profile]);
  const handleSaveProfile = async () => {
    if (!tempName.trim()) {
      toast.error("Por favor, insira um nome.");
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({
        display_name: tempName.trim()
      }).eq("id", user?.id);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      toast.success("Perfil atualizado com sucesso!");
      setIsProfileOpen(false);
    } catch (error) {
      toast.error("Erro ao atualizar perfil: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };
  reactExports.useEffect(() => {
    if (user && profile) {
      if (!profile.display_name) {
        setIsNameModalOpen(true);
      }
      supabase.rpc("get_my_invite_code").then(({ data: code }) => {
        setInviteCode(code);
      });
    }
  }, [user, profile]);
  const handleCopyCode = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      toast.success("Código copiado!");
      setTimeout(() => setCopied(false), 2e3);
    }
  };
  const handleSaveName = async () => {
    if (!tempName.trim()) {
      toast.error("Por favor, insira um nome.");
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.from("profiles").update({ display_name: tempName.trim() }).eq("id", user?.id);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      setIsNameModalOpen(false);
      toast.success("Nome salvo com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar nome: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };
  reactExports.useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalScroll > 0) {
        setScrollProgress(currentScroll / totalScroll);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const getGreeting = () => {
    const hour = (/* @__PURE__ */ new Date()).getHours();
    let baseGreeting = "Bom dia";
    if (hour >= 12 && hour < 18) baseGreeting = "Boa tarde";
    if (hour >= 18 || hour < 5) baseGreeting = "Boa noite";
    if (!profile?.display_name) return baseGreeting;
    const firstName = profile.display_name.split(" ")[0];
    if (partnerProfile?.display_name) {
      const partnerFirstName = partnerProfile.display_name.split(" ")[0];
      return `${baseGreeting}, ${firstName} e ${partnerFirstName}!`;
    }
    return `${baseGreeting}, ${firstName}!`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(SidebarProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen flex w-full relative bg-background overflow-x-hidden isolate", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0 relative z-10 transition-all duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "h-16 flex items-center justify-between px-4 md:px-8 border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-0 z-40 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarTrigger, { className: "md:hidden" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "md:hidden flex items-center hover:opacity-70 transition-opacity duration-200 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { className: "h-7 w-auto" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:block", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-foreground truncate", children: getGreeting() }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 md:gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  onClick: toggleDarkMode,
                  className: "rounded-full apple-interactive border-white/40 active:scale-95 transition-all",
                  children: isDarkMode ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { size: 20 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { size: 20 })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                "Alternar para Modo ",
                isDarkMode ? "Claro" : "Escuro"
              ] }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isNewRecordOpen, onOpenChange: setIsNewRecordOpen, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", className: "hidden md:flex gap-2 rounded-full shadow-md apple-interactive border-white/40 active:scale-95 transition-all", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 18 }),
                  "Novo Registro"
                ] }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Adicionar nova transação" }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "apple-card dark:bg-[#1A1A1A] border-border/40", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold", children: "Novo Registro" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: "Adicione uma nova transação rapidamente ou vá para a página detalhada." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 py-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "desc", className: "text-right font-medium", children: "Descrição" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "desc", placeholder: "Ex: Mercado", className: "col-span-3 rounded-xl apple-interactive dark:bg-black/20" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "valor", className: "text-right font-medium", children: "Valor" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "valor", type: "number", placeholder: "0,00", className: "col-span-3 rounded-xl apple-interactive dark:bg-black/20" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "tipo", className: "text-right font-medium", children: "Tipo" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { defaultValue: "saida", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "tipo", className: "col-span-3 rounded-xl apple-interactive dark:bg-black/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Selecione o tipo" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "apple-card", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "entrada", children: "Entrada" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "saida", children: "Saída" })
                      ] })
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 sm:gap-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "rounded-xl active:scale-95 transition-all", onClick: () => navigate({ to: "/transacoes" }), children: "Ir para Lançamentos" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "rounded-xl apple-interactive border-none px-8 active:scale-95 transition-all", onClick: () => {
                    toast.success("Registro adicionado!");
                    setIsNewRecordOpen(false);
                  }, children: "Salvar" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: isProfileOpen, onOpenChange: setIsProfileOpen, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, className: "md:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "rounded-full apple-interactive border-white/40 active:scale-95 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 22 }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex -space-x-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, onClick: () => {
                      setTempName(profile?.display_name || "");
                    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "border-2 border-white/50 dark:border-black/50 w-8 h-8 md:w-10 md:h-10 shadow-sm cursor-pointer hover:scale-110 transition-transform z-10", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: profile?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.display_name || "user"}` }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: profile?.display_name?.substring(0, 2).toUpperCase() || "ME" })
                    ] }) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                      "Seu Perfil (",
                      profile?.display_name || "Configurar",
                      ")"
                    ] }) })
                  ] }),
                  partnerProfile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "border-2 border-white/50 dark:border-black/50 w-8 h-8 md:w-10 md:h-10 shadow-sm transition-transform", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: partnerProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${partnerProfile.display_name || "partner"}` }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: partnerProfile.display_name?.substring(0, 2).toUpperCase() || "PA" })
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                      "Perfil de ",
                      partnerProfile.display_name
                    ] }) })
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        onClick: () => navigate({ to: "/invite" }),
                        className: "border-2 border-dashed border-primary/40 bg-primary/5 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/10 transition-all active:scale-95",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "text-primary" })
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: "Aguardando convite" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground italic", children: "Clique para gerenciar o convite" })
                    ] }) })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "apple-card dark:bg-[#1A1A1A] border-border/40 sm:max-w-md overflow-hidden", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl font-black tracking-tight text-center pt-4", children: "Editar Perfil" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-center", children: "Personalize como você aparece no CoupleDin." })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-8 py-8", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ProfileAvatar,
                    {
                      url: profile?.avatar_url || null,
                      name: profile?.display_name || "ME",
                      userId: user?.id || void 0,
                      onUpdate: () => {
                      },
                      className: "w-32 h-32 scale-110"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full space-y-2 px-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "profile-name", className: "text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1", children: "Seu Nome" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "profile-name",
                        value: tempName,
                        onChange: (e) => setTempName(e.target.value),
                        placeholder: "Como quer ser chamado?",
                        className: "h-12 text-lg font-medium rounded-2xl border-border/40 bg-muted/30 focus-visible:ring-primary/20 apple-interactive"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex-col sm:flex-row gap-3 px-4 pb-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "ghost",
                      onClick: () => {
                        signOut();
                        setIsProfileOpen(false);
                      },
                      className: "rounded-2xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 gap-2 order-2 sm:order-1 h-12",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { size: 18 }),
                        "Sair da Conta"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      className: "flex-1 h-12 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 apple-interactive border-none active:scale-95 transition-all gap-2 order-1 sm:order-2",
                      onClick: handleSaveProfile,
                      disabled: isSaving,
                      children: [
                        isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 18 }),
                        "Salvar Alterações"
                      ]
                    }
                  )
                ] })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full", children })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isNameModalOpen, onOpenChange: (open) => {
      if (!open && !profile?.display_name) {
        toast.error("Você precisa definir um nome para continuar.");
        return;
      }
      setIsNameModalOpen(open);
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "apple-card dark:bg-[#1A1A1A] border-border/40 sm:max-w-md pointer-events-auto z-[1000]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl font-black tracking-tight text-center pt-4", children: "Bem-vindo(a)!" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-center", children: "Como você gostaria de ser chamado(a)? Precisamos disso para personalizar sua experiência." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 py-6 px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "mandatory-name", className: "text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1", children: "Seu Nome" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "mandatory-name",
              value: tempName,
              onChange: (e) => setTempName(e.target.value),
              placeholder: "Digite seu nome ou apelido",
              className: "h-14 text-xl font-medium rounded-2xl border-border/40 bg-muted/30 focus-visible:ring-primary/20 apple-interactive",
              autoFocus: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            className: "w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 apple-interactive border-none active:scale-95 transition-all gap-2",
            onClick: handleSaveName,
            disabled: isSaving,
            children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }),
              "Salvando..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              "Começar a usar",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 20 })
            ] })
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showInviteDialogInLayout, onOpenChange: setShowInviteDialogInLayout, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "apple-card dark:bg-[#1A1A1A] border-border/40 sm:max-w-md pointer-events-auto z-[1000]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-2xl font-black tracking-tight text-center pt-4", children: "Convidar Parceiro(a)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-center", children: "Compartilhe o código abaixo para que seu parceiro(a) possa se conectar a este espaço." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-6 py-8 px-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full flex items-center gap-3 bg-white dark:bg-black/40 p-2 pl-6 rounded-2xl border border-primary/20 shadow-inner group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-2xl font-black font-mono tracking-widest text-primary uppercase text-center", children: inviteCode || "â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "rounded-xl hover:bg-primary/10 transition-all active:scale-95 shrink-0",
              onClick: handleCopyCode,
              children: copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 20, className: "text-emerald-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { size: 20, className: "text-primary" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center italic", children: 'O seu parceiro(a) deve escolher "Ingressar em um espaço" e inserir este código no Onboarding.' })
      ] })
    ] }) })
  ] }) });
}
export {
  Avatar as A,
  CATEGORY_ICONS as C,
  DashboardLayout as D,
  ProfileAvatar as P,
  Select as S,
  TooltipProvider as T,
  useFinanceStore as a,
  SelectTrigger as b,
  SelectValue as c,
  SelectContent as d,
  SelectItem as e,
  DIVISION_ICONS as f,
  AvatarImage as g,
  AvatarFallback as h,
  Dialog as i,
  DialogContent as j,
  DialogHeader as k,
  DialogTitle as l,
  DialogDescription as m,
  DialogFooter as n,
  Tooltip as o,
  TooltipTrigger as p,
  TooltipContent as q,
  Skeleton as r,
  DialogTrigger as s,
  Sheet as t,
  useProfile as u,
  SheetContent as v,
  SheetHeader as w,
  SheetTitle as x,
  SheetDescription as y
};
