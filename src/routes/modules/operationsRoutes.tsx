// src/routes/modules/operationsRoutes.tsx
import { lazy } from "react";
import { FileSearch, ShoppingCart, Package, ClipboardList } from "lucide-react";
import { RouteDefinition } from "../types";

// Componente modular para páginas en desarrollo
const ModulePage = lazy(() => import("@/pages/ModulePage"));

export const operationsRoutes: RouteDefinition[] = [
  {
    path: "/cotizaciones",
    component: () => ModulePage({
      title: "Cotizaciones",
      description: "Gestione las cotizaciones para sus clientes",
      icon: <FileSearch className="h-8 w-8 text-multilimp-green" />
    }),
    title: "Cotizaciones",
    icon: <FileSearch className="h-5 w-5" />,
    requireAuth: true,
    permission: "quotes:view",
  },
  {
    path: "/ventas",
    component: () => ModulePage({
      title: "Ventas",
      description: "Gestione las ventas a sus clientes",
      icon: <ShoppingCart className="h-8 w-8 text-multilimp-green" />
    }),
    title: "Ventas",
    icon: <ShoppingCart className="h-5 w-5" />,
    requireAuth: true,
    permission: "sales:view",
  },
  {
    path: "/ordenes",
    component: () => ModulePage({
      title: "Órdenes de Proveedores",
      description: "Gestione las órdenes a sus proveedores",
      icon: <Package className="h-8 w-8 text-multilimp-green" />
    }),
    title: "Órdenes de Proveedores",
    icon: <Package className="h-5 w-5" />,
    requireAuth: true,
    permission: "orders:view",
  },
  {
    path: "/seguimiento",
    component: () => ModulePage({
      title: "Seguimiento de Órdenes",
      description: "Realice el seguimiento de las órdenes",
      icon: <ClipboardList className="h-8 w-8 text-multilimp-green" />
    }),
    title: "Seguimiento",
    icon: <ClipboardList className="h-5 w-5" />,
    requireAuth: true,
    permission: "tracking:view",
  }
];
