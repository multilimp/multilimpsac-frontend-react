
import { lazy } from "react";
import { Building2, Users, Truck, User } from "lucide-react";
import { RouteDefinition } from "../types";

// Domain-specific pages (lazy loaded)
const CompanyPage = lazy(() => import("@/features/company/pages/CompanyPage"));
const ClientPage = lazy(() => import("@/features/client/pages/ClientPage"));
const SupplierPage = lazy(() => import("@/features/supplier/pages/SupplierPage"));
const TransportPage = lazy(() => import("@/features/transport/pages/TransportPage"));
const UserPage = lazy(() => import("@/features/user/pages/UserPage"));

// Domain-driven route definitions
export const directoryRoutes: RouteDefinition[] = [
  {
    path: "/empresas",
    component: CompanyPage,
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
    path: "/clientes",
    component: ClientPage,
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
    component: SupplierPage,
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
    component: TransportPage,
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
    path: "/usuarios",
    component: UserPage,
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
