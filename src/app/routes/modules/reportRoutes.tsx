
import { lazy } from "react";
import { BarChart3, ReceiptText, Package, TrendingUp } from "lucide-react";
import { RouteDefinition } from "../types";

// Lazy load pages
const SalesReportPage = lazy(() => import("@/features/reports/SalesReportPage"));
const ModulePage = lazy(() => import("@/pages/ModulePage"));

export const reportRoutes: RouteDefinition[] = [
  {
    path: "/reportes/ventas",
    component: SalesReportPage,
    title: "Reporte de Ventas",
    icon: <BarChart3 className="h-5 w-5" />,
    requireAuth: true,
    permission: "reports:sales:view",
  },
  {
    path: "/reportes/cobranzas",
    component: lazy(() => import("@/pages/ModulePage")),
    title: "Reporte de Cobranzas",
    icon: <ReceiptText className="h-5 w-5" />,
    requireAuth: true,
    permission: "reports:collections:view",
  },
  {
    path: "/reportes/entregas",
    component: lazy(() => import("@/pages/ModulePage")),
    title: "Reporte de Entregas OC",
    icon: <Package className="h-5 w-5" />,
    requireAuth: true,
    permission: "reports:deliveries:view",
  },
  {
    path: "/reportes/ranking",
    component: lazy(() => import("@/pages/ModulePage")),
    title: "Ranking",
    icon: <TrendingUp className="h-5 w-5" />,
    requireAuth: true,
    permission: "reports:ranking:view",
  }
];
