import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { s as supabase } from "./client-CRCA7PsU.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";

const __rest = (s, e) => {
  const t = {};
  for (const p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (let i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++)
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
  return t;
};

import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-BHC1k4sa.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const AuthContext = reactExports.createContext(void 0);
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [user, setUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: session2 } }) => {
      setSession(session2);
      setUser(session2?.user ?? null);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session2) => {
      setSession(session2);
      setUser(session2?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  const signOut = async () => {
    await supabase.auth.signOut();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value: { session, user, loading, signOut }, children });
}
const useAuth = () => {
  const context = reactExports.useContext(AuthContext);
  if (context === void 0) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$9 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "JL-Couple" },
      { name: "description", content: "Kind Companion is a responsive web app for couples to manage shared finances." },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "JL-Couple" },
      { property: "og:description", content: "Kind Companion is a responsive web app for couples to manage shared finances." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "JL-Couple" },
      { name: "twitter:description", content: "Kind Companion is a responsive web app for couples to manage shared finances." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/01b0888b-1ce7-4b29-b08c-6f2e69caabd3/id-preview-e6b8ca8b--51739a71-96c3-4b17-8299-c490a181d143.lovable.app-1780629009601.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/01b0888b-1ce7-4b29-b08c-6f2e69caabd3/id-preview-e6b8ca8b--51739a71-96c3-4b17-8299-c490a181d143.lovable.app-1780629009601.png" }
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$9.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AuthProvider, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {})
  ] }) });
}
const $$splitComponentImporter$8 = () => import("./transacoes-DUA1xyDz.mjs");
const Route$8 = createFileRoute("/transacoes")({
  head: () => ({
    meta: [{
      title: "Lançamentos | CoupleFinance"
    }, {
      name: "description",
      content: "Gerencie as transações do casal."
    }]
  }),
  validateSearch: (search) => {
    return {
      month: search.month || "june",
      category: search.category || "all-cats",
      type: search.type || "all-types",
      responsible: search.responsible || "both"
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./relatorios-C8vm7i3A.mjs");
const Route$7 = createFileRoute("/relatorios")({
  head: () => ({
    meta: [{
      title: "Relatórios | CoupleFinance"
    }, {
      name: "description",
      content: "Análise de gastos e fechamento do mês do casal."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./metas-Bh-rGtXJ.mjs");
const Route$6 = createFileRoute("/metas")({
  head: () => ({
    meta: [{
      title: "Metas | CoupleFinance"
    }, {
      name: "description",
      content: "Acompanhe as metas do casal."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./invite-CCIG7sC_.mjs");
const Route$5 = createFileRoute("/invite")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./investimentos-BJGN63oM.mjs");
const Route$4 = createFileRoute("/investimentos")({
  head: () => ({
    meta: [{
      title: "Investimentos | CoupleFinance"
    }, {
      name: "description",
      content: "Acompanhe seus ativos em tempo real."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./configuracoes-DyiBhncc.mjs");
const Route$3 = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [{
      title: "Configurações | CoupleFinance"
    }, {
      name: "description",
      content: "Gerencie as regras financeiras e o perfil do casal."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./cartoes-C644d7N9.mjs");
const Route$2 = createFileRoute("/cartoes")({
  head: () => ({
    meta: [{
      title: "Cartões | CoupleFinance"
    }, {
      name: "description",
      content: "Gerencie seus cartões de crédito e faturas."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./auth-DZsnCEkM.mjs");
const Route$1 = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Entrar | CoupleFinance"
    }, {
      name: "description",
      content: "Faça login para gerenciar suas finanças a dois."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-DZlHcQGv.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Dashboard | CoupleFinance"
    }, {
      name: "description",
      content: "Finanças do casal em um só lugar."
    }]
  }),
  validateSearch: (search) => {
    return {
      month: search.month || void 0,
      sheet: search.sheet || void 0
    };
  },
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const TransacoesRoute = Route$8.update({
  id: "/transacoes",
  path: "/transacoes",
  getParentRoute: () => Route$9
});
const RelatoriosRoute = Route$7.update({
  id: "/relatorios",
  path: "/relatorios",
  getParentRoute: () => Route$9
});
const MetasRoute = Route$6.update({
  id: "/metas",
  path: "/metas",
  getParentRoute: () => Route$9
});
const InviteRoute = Route$5.update({
  id: "/invite",
  path: "/invite",
  getParentRoute: () => Route$9
});
const InvestimentosRoute = Route$4.update({
  id: "/investimentos",
  path: "/investimentos",
  getParentRoute: () => Route$9
});
const ConfiguracoesRoute = Route$3.update({
  id: "/configuracoes",
  path: "/configuracoes",
  getParentRoute: () => Route$9
});
const CartoesRoute = Route$2.update({
  id: "/cartoes",
  path: "/cartoes",
  getParentRoute: () => Route$9
});
const AuthRoute = Route$1.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$9
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$9
});
const rootRouteChildren = {
  IndexRoute,
  AuthRoute,
  CartoesRoute,
  ConfiguracoesRoute,
  InvestimentosRoute,
  InviteRoute,
  MetasRoute,
  RelatoriosRoute,
  TransacoesRoute
};
const routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  router as r,
  useAuth as u
};
