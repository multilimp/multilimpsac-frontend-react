
import { lazy } from "react";
import { FileSearch, ShoppingCart, Package, ClipboardList } from "lucide-react";
import { RouteDefinition } from "../types";

// Update imports to use the correct feature-based paths
const QuotationsPage = lazy(() => import("@/features/quotation/pages/QuotationsPage"));
const SalesPage = lazy(() => import("@/features/sales/pages/SalesPage"));
const PurchaseOrdersPage = lazy(() => import("@/features/purchaseOrder/pages/PurchaseOrdersPage"));
const SupplierOrdersPage = lazy(() => import("@/features/supplier-orders/pages/SupplierOrdersPage"));
const TrackingPage = lazy(() => import("@/pages/ModulePage"));

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
    component: TrackingPage,
    title: "Seguimiento de Órdenes",
    icon: <ClipboardList className="h-5 w-5" />,
    requireAuth: true,
    permission: "tracking:view",
  }
];
