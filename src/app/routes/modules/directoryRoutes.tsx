
import { lazy } from "react";
import { Building2, Users, Truck, User } from "lucide-react";
import { RouteDefinition } from "../types";

// Domain-specific pages (lazy loaded)
const CompanyPage = lazy(() => import("@/pages/CompanyPage"));
const ClientPage = lazy(() => import("@/pages/ClientPage"));
const SupplierPage = lazy(() => import("@/pages/SupplierPage"));
const TransportPage = lazy(() => import("@/pages/TransportPage"));
const UserPage = lazy(() => import("@/pages/UserPage"));

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
    action: "list"
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
    action: "list"
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
    action: "list"
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
    action: "list"
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
    action: "list"
  }
];
