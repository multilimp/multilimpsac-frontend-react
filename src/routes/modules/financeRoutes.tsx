
import { lazy } from "react";
import { CreditCard, FileText, ReceiptText } from "lucide-react";
import { RouteDefinition } from "../types";

// Lazy load pages
const ModulePage = lazy(() => import("@/pages/ModulePage"));

export const financeRoutes: RouteDefinition[] = [
  {
    path: "/tesoreria",
    component: lazy(() => import("@/pages/ModulePage")),
    title: "Tesorería",
    icon: <CreditCard className="h-5 w-5" />,
    requireAuth: true,
    permission: "treasury:view",
  },
  {
    path: "/facturacion",
    component: lazy(() => import("@/pages/ModulePage")),
    title: "Facturación",
    icon: <FileText className="h-5 w-5" />,
    requireAuth: true,
    permission: "billing:view",
  },
  {
    path: "/cobranzas",
    component: lazy(() => import("@/pages/ModulePage")),
    title: "Cobranzas",
    icon: <ReceiptText className="h-5 w-5" />,
    requireAuth: true,
    permission: "collections:view",
  }
];
