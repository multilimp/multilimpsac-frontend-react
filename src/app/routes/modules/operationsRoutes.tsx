import { lazy } from "react";
import { FileSearch, ShoppingCart, Package, ClipboardList } from "lucide-react";
import { RouteDefinition } from "../types";

const QuotationsPage = lazy(() => import("@/pages/QuotationsPage"));
const SalesPage = lazy(() => import("@/pages/SalesPage"));
const PurchaseOrdersPage = lazy(() => import("@/pages/PurchaseOrdersPage"));
const SupplierOrdersPage = lazy(() => import("@/pages/SupplierOrdersPage"));

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
    component: PurchaseOrdersPage,
    title: "Órdenes",
    icon: <Package className="h-5 w-5" />,
    requireAuth: true,
    permission: "orders:view",
  },
  {
    path: "/ordenes/proveedor",
    component: SupplierOrdersPage,
    title: "Órdenes de Proveedor",
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
