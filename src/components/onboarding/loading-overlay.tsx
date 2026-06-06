import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LoadingOverlayProps {
  isVisible: boolean;
  message: string;
  progressValue: number;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible, message, progressValue }) => {
  const overlayRef = React.useRef<HTMLDivElement>(null);

  // Focus Trap and Body Lock
  React.useEffect(() => {
    if (isVisible) {
      // Lock pointer events on body
      document.body.style.pointerEvents = 'none';
      document.body.style.overflow = 'hidden';
      
      // Handle focus trap
      const originalFocusedElement = document.activeElement as HTMLElement;
      overlayRef.current?.focus();

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          e.preventDefault(); // Completely block tabbing out of the overlay
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.pointerEvents = '';
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
        originalFocusedElement?.focus();
      };
    }
  }, [isVisible]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          ref={overlayRef}
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md outline-none"
          style={{ pointerEvents: 'auto' }} // Re-enable for the overlay itself
        >
          <div className="w-full max-w-md p-6 space-y-4 text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary mb-4"
            >
              <RefreshCcw size={40} className="animate-spin" />
            </motion.div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">{message}</h2>
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <span>Progresso</span>
                <span>{progressValue}%</span>
              </div>
              <Progress value={progressValue} className="h-1.5" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
