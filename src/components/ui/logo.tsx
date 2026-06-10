import * as React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Logo({ className, ...props }: LogoProps) {
  return (
    <div className={cn("relative flex items-center justify-center", className)} {...props}>
      <img
        src="/logo-coupledin-dark.png"
        alt="CoupleDin Logo"
        fetchPriority="high"
        loading="eager"
        className="w-full h-full object-contain dark:hidden"
      />
      <img
        src="/logo-coupledin-white.png"
        alt="CoupleDin Logo"
        fetchPriority="high"
        loading="eager"
        className="w-full h-full object-contain hidden dark:block"
      />
    </div>
  );
}
