import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center space-y-4 apple-card bg-muted/20 border-dashed border-2 border-muted",
        className
      )}
    >
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
        <Icon size={32} />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold tracking-tight">{title}</h3>
        <p className="text-sm text-muted-foreground max-w-[250px] mx-auto">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all font-bold"
        >
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
