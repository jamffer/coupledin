import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { B as Button, c as cn } from "./card-DDGnP21B.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      className: cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center space-y-4 apple-card bg-muted/20 border-dashed border-2 border-muted",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 32 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold tracking-tight", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground max-w-[250px] mx-auto", children: description })
        ] }),
        children ? children : actionLabel && onAction && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: onAction,
            className: "rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all font-bold",
            children: actionLabel
          }
        )
      ]
    }
  );
}
export {
  EmptyState as E
};
