import { lazy } from "react";
import { BarChart, ReceiptText, Package, BookOpen } from "lucide-react";
import { RouteDefinition } from "../types";

// Lazy load pages
const SalesReportPage = lazy(() => import("@/pages/reports/SalesReportPage"));
const ModulePage = lazy(() => import("@/pages/ModulePage"));

export const reportRoutes: RouteDefinition[] = [
  {
    path: "/reportes/ventas",
    component: SalesReportPage,
    title: "Reporte de Ventas",
    icon: <BarChart className="h-5 w-5" />,
    requireAuth: true,
    permission: "reports:sales:view",
  },
  {
    path: "/reportes/cobranzas",
    component: () => ModulePage({
      title: "Reporte de Cobranzas",
      description: "Visualice los reportes de cobranzas",
      icon: <ReceiptText className="h-8 w-8 text-multilimp-green" />
    }),
    title: "Reporte de Cobranzas",
    icon: <ReceiptText className="h-5 w-5" />,
    requireAuth: true,
    permission: "reports:collections:view",
  },
  {
    path: "/reportes/entregas",
    component: () => ModulePage({
      title: "Reporte de Entregas OC",
      description: "Visualice los reportes de entregas de órdenes de compra",
      icon: <Package className="h-8 w-8 text-multilimp-green" />
    }),
    title: "Reporte de Entregas",
    icon: <Package className="h-5 w-5" />,
    requireAuth: true,
    permission: "reports:deliveries:view",
  },
  {
    path: "/reportes/ranking",
    component: () => ModulePage({
      title: "Ranking",
      description: "Visualice el ranking de ventas y clientes",
      icon: <BookOpen className="h-8 w-8 text-multilimp-green" />
    }),
    title: "Ranking",
    icon: <BookOpen className="h-5 w-5" />,
    requireAuth: true,
    permission: "reports:ranking:view",
  }
];
