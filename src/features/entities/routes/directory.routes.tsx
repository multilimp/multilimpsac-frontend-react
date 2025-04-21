
import { lazy } from "react";
import { Building2, Users, Truck, User } from "lucide-react";
import { RouteDefinition } from "../../../app/routes/types";

// Domain-driven route definitions
export const directoryRoutes: RouteDefinition[] = [
  {
    path: "/empresas",
    component: lazy(() => import("@/features/entities/company/pages/CompanyPage")),
    title: "Empresas",
    icon: <Building2 className="h-5 w-5" />,
    requireAuth: true,
    permission: "companies:view",
    domain: "company",
    entityType: "empresa",
    action: "list",
    breadcrumb: "Empresas"
  },
  {
    path: "/empresas/new",
    component: lazy(() => import("@/features/entities/company/pages/CompanyDetailsPage")),
    title: "Nueva Empresa",
    icon: <Building2 className="h-5 w-5" />,
    requireAuth: true,
    permission: "companies:create",
    domain: "company",
    entityType: "empresa",
    action: "create",
    breadcrumb: "Nueva Empresa",
    hideInMenu: true
  },
  {
    path: "/empresas/:id",
    component: lazy(() => import("@/features/entities/company/pages/CompanyDetailsPage")),
    title: "Detalles de Empresa",
    icon: <Building2 className="h-5 w-5" />,
    requireAuth: true,
    permission: "companies:view",
    domain: "company",
    entityType: "empresa",
    action: "detail",
    breadcrumb: "Detalles",
    hideInMenu: true
  },
  {
    path: "/empresas/:companyId/catalogos",
    component: lazy(() => import("@/features/entities/company/pages/CompanyCatalogsPage")),
    title: "Catálogos de Empresa",
    icon: <Building2 className="h-5 w-5" />,
    requireAuth: true,
    permission: "companies:view",
    domain: "company",
    entityType: "catalogo",
    action: "list",
    breadcrumb: "Catálogos",
    hideInMenu: true
  },
  {
    path: "/clientes",
    component: lazy(() => import("@/features/entities/client/pages/ClientPage")),
    title: "Clientes",
    icon: <Users className="h-5 w-5" />,
    requireAuth: true,
    permission: "clients:view",
    domain: "client",
    entityType: "cliente",
    action: "list",
    breadcrumb: "Clientes"
  },
  {
    path: "/proveedores",
    component: lazy(() => import("@/features/supplier/pages/SupplierPage")),
    title: "Proveedores",
    icon: <Building2 className="h-5 w-5" />,
    requireAuth: true,
    permission: "suppliers:view",
    domain: "supplier",
    entityType: "proveedor",
    action: "list",
    breadcrumb: "Proveedores"
  },
  {
    path: "/transportes",
    component: lazy(() => import("@/features/transport/pages/TransportPage")),
    title: "Transportes",
    icon: <Truck className="h-5 w-5" />,
    requireAuth: true,
    permission: "transports:view",
    domain: "transport",
    entityType: "transporte",
    action: "list",
    breadcrumb: "Transportes"
  },
  {
    path: "/transportes/:id",
    component: lazy(() => import("@/features/transport/pages/TransportDetailsPage")),
    title: "Detalle de Transporte",
    icon: <Truck className="h-5 w-5" />,
    requireAuth: true,
    permission: "transports:view",
    domain: "transport",
    entityType: "transporte",
    action: "detail",
    breadcrumb: "Detalle",
    hideInMenu: true
  },
  {
    path: "/transportes/new",
    component: lazy(() => import("@/features/transport/pages/TransportEditPage")),
    title: "Nuevo Transporte",
    icon: <Truck className="h-5 w-5" />,
    requireAuth: true,
    permission: "transports:create",
    domain: "transport",
    entityType: "transporte",
    action: "create",
    breadcrumb: "Nuevo",
    hideInMenu: true
  },
  {
    path: "/transportes/:id/edit",
    component: lazy(() => import("@/features/transport/pages/TransportEditPage")),
    title: "Editar Transporte",
    icon: <Truck className="h-5 w-5" />,
    requireAuth: true,
    permission: "transports:edit",
    domain: "transport",
    entityType: "transporte",
    action: "edit",
    breadcrumb: "Editar",
    hideInMenu: true
  },
  {
    path: "/usuarios",
    component: lazy(() => import("@/features/user/pages/UserPage")),
    title: "Usuarios",
    icon: <User className="h-5 w-5" />,
    requireAuth: true,
    permission: "users:view",
    domain: "admin",
    entityType: "usuario",
    action: "list",
    breadcrumb: "Usuarios"
  }
];
