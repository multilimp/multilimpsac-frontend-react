
// src/routes/modules/directoryRoutesNested.tsx
import { lazy } from "react";
import { RouteDefinition } from "../types";
import { Users, Building2, Truck, UserCog } from "lucide-react";

// Lazy load pages
const ClientPage = lazy(() => import("@/pages/ClientPage"));
const ClientDetailPage = lazy(() => import("@/pages/ClientDetailPage"));
const ClientContactsPage = lazy(() => import("@/pages/ClientContactsPage"));
const ClientOrdersPage = lazy(() => import("@/pages/ClientOrdersPage"));
const ClientInvoicesPage = lazy(() => import("@/pages/ClientInvoicesPage"));

// Rutas de clientes con subrutas anidadas
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

// Ejemplo de estructura para otras rutas de directorio
export const directoryNestedRoutes: RouteDefinition[] = [
  clientNestedRoutes,
  {
    path: "/empresas",
    component: lazy(() => import("@/pages/CompanyPage")),
    title: "Empresas",
    description: "Gestión de empresas del grupo",
    icon: <Building2 className="h-5 w-5" />,
    requireAuth: true,
    permission: "view:companies",
    breadcrumb: "Empresas",
  },
  {
    path: "/transportes",
    component: lazy(() => import("@/pages/TransportPage")),
    title: "Transportes",
    description: "Gestión de empresas de transporte",
    icon: <Truck className="h-5 w-5" />,
    requireAuth: true,
    permission: "view:transport",
    breadcrumb: "Transportes",
  },
  {
    path: "/usuarios",
    component: lazy(() => import("@/pages/UserPage")),
    title: "Usuarios",
    description: "Gestión de usuarios del sistema",
    icon: <UserCog className="h-5 w-5" />,
    requireAuth: true,
    permission: "view:users",
    breadcrumb: "Usuarios",
    roles: ["admin"],
  },
];
