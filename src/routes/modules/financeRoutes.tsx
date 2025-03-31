import { lazy } from "react";
import { CreditCard, FileText, ReceiptText } from "lucide-react";
import { RouteDefinition } from "../types";

// Componente modular para páginas en desarrollo
const ModulePage = lazy(() => import("@/pages/ModulePage"));

export const financeRoutes: RouteDefinition[] = [
  {
    path: "/tesoreria",
    component: () => ModulePage({
      title: "Tesorería",
      description: "Gestione los movimientos de tesorería",
      icon: <CreditCard className="h-8 w-8 text-multilimp-green" />
    }),
    title: "Tesorería",
    icon: <CreditCard className="h-5 w-5" />,
    requireAuth: true,
    permission: "treasury:view",
  },
  {
    path: "/facturacion",
    component: () => ModulePage({
      title: "Facturación",
      description: "Gestione las facturas de ventas",
      icon: <FileText className="h-8 w-8 text-multilimp-green" />
    }),
    title: "Facturación",
    icon: <FileText className="h-5 w-5" />,
    requireAuth: true,
    permission: "billing:view",
  },
  {
    path: "/cobranzas",
    component: () => ModulePage({
      title: "Cobranzas",
      description: "Gestione las cobranzas a clientes",
      icon: <ReceiptText className="h-8 w-8 text-multilimp-green" />
    }),
    title: "Cobranzas",
    icon: <ReceiptText className="h-5 w-5" />,
    requireAuth: true,
    permission: "collections:view",
  }
];
