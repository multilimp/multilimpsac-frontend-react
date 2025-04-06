
// src/routes/modules/directoryRoutesNested.tsx
import { lazy } from "react";
import { Users, Building2, Truck, UserCog } from "lucide-react";
import { RouteDefinition } from "@/app/routes/types";

// Lazy load pages - These are placeholders and will need to be updated with actual paths
const ClientPage = lazy(() => import("@/pages/ClientDetailPage"));
const ClientDetailPage = lazy(() => import("@/pages/ClientDetailPage"));
const ClientContactsPage = lazy(() => import("@/pages/ClientContactsPage"));
const ClientOrdersPage = lazy(() => import("@/pages/ClientOrdersPage"));
const ClientInvoicesPage = lazy(() => import("@/pages/ClientInvoicesPage"));

// Client routes with nested subroutes
export const clientNestedRoutes: RouteDefinition = {
  path: "/clientes",
  component: ClientPage,
  title: "Clientes",
  description: "Gestión de clientes y sus datos relacionados",
  icon: <Users className="h-5 w-5" />,
  requireAuth: true,
  permission: "view:clients",
  breadcrumb: "Clientes",
  children: [
    {
      path: ":id",
      component: ClientDetailPage,
      title: "Detalle de Cliente",
      requireAuth: true,
      permission: "view:clients",
      breadcrumb: "Detalle",
      children: [
        {
          path: "contactos",
          component: ClientContactsPage,
          title: "Contactos del Cliente",
          requireAuth: true,
          permission: "view:client_contacts",
          breadcrumb: "Contactos",
        },
        {
          path: "ordenes",
          component: ClientOrdersPage,
          title: "Órdenes del Cliente",
          requireAuth: true,
          permission: "view:client_orders",
          breadcrumb: "Órdenes",
        },
        {
          path: "facturas",
          component: ClientInvoicesPage,
          title: "Facturas del Cliente",
          requireAuth: true,
          permission: "view:client_invoices",
          breadcrumb: "Facturas",
        }
      ]
    }
  ]
};

// Example structure for other directory routes
export const directoryNestedRoutes: RouteDefinition[] = [
  clientNestedRoutes,
  {
    path: "/empresas",
    component: lazy(() => import("@/features/company/pages/CompanyPage")),
    title: "Empresas",
    description: "Gestión de empresas del grupo",
    icon: <Building2 className="h-5 w-5" />,
    requireAuth: true,
    permission: "view:companies",
    breadcrumb: "Empresas",
  },
  {
    path: "/transportes",
    component: lazy(() => import("@/features/transport/pages/TransportPage")),
    title: "Transportes",
    description: "Gestión de empresas de transporte",
    icon: <Truck className="h-5 w-5" />,
    requireAuth: true,
    permission: "view:transport",
    breadcrumb: "Transportes",
  },
  {
    path: "/usuarios",
    component: lazy(() => import("@/features/user/pages/UserPage")),
    title: "Usuarios",
    description: "Gestión de usuarios del sistema",
    icon: <UserCog className="h-5 w-5" />,
    requireAuth: true,
    permission: "view:users",
    breadcrumb: "Usuarios",
    roles: ["admin"],
  },
];
