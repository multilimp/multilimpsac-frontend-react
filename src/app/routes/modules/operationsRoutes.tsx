
import { lazy } from "react";
import { FileSearch, ShoppingCart, Package, ClipboardList } from "lucide-react";
import { RouteDefinition } from "../types";

// Lazy load components
const QuotationsPage = lazy(() => import("@/pages/QuotationsPage"));
const SalesPage = lazy(() => import("@/pages/SalesPage"));

export const operationsRoutes: RouteDefinition[] = [
  {
    path: "/cotizaciones",
    component: QuotationsPage,
    title: "Cotizaciones",
    icon: <FileSearch className="h-5 w-5" />,
    requireAuth: true,
    permission: "quotes:view",
  },
  {
    path: "/ventas",
    component: SalesPage,
    title: "Ventas",
    icon: <ShoppingCart className="h-5 w-5" />,
    requireAuth: true,
    permission: "sales:view",
  },
  {
    path: "/ordenes",
    component: lazy(() => import("@/pages/ModulePage")),
    title: "Órdenes de Proveedores",
    icon: <Package className="h-5 w-5" />,
    requireAuth: true,
    permission: "orders:view",
  },
  {
    path: "/seguimiento",
    component: lazy(() => import("@/pages/ModulePage")),
    title: "Seguimiento de Órdenes",
    icon: <ClipboardList className="h-5 w-5" />,
    requireAuth: true,
    permission: "tracking:view",
  }
];
