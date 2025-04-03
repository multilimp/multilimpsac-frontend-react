
import { lazy } from "react";
import { Building2, Users, Truck, User } from "lucide-react";
import { RouteDefinition } from "../types";

// Lazy load pages
const CompanyPage = lazy(() => import("@/pages/CompanyPage"));
const ClientPage = lazy(() => import("@/pages/ClientPage"));
const SupplierPage = lazy(() => import("@/pages/SupplierPage"));
const TransportPage = lazy(() => import("@/pages/TransportPage"));
const UserPage = lazy(() => import("@/pages/UserPage"));

export const directoryRoutes: RouteDefinition[] = [
  {
    path: "/empresas",
    component: CompanyPage,
    title: "Empresas",
    icon: <Building2 className="h-5 w-5" />,
    requireAuth: true,
    permission: "companies:view",
  },
  {
    path: "/clientes",
    component: ClientPage,
    title: "Clientes",
    icon: <Users className="h-5 w-5" />,
    requireAuth: true,
    permission: "clients:view",
  },
  {
    path: "/proveedores",
    component: SupplierPage,
    title: "Proveedores",
    icon: <Building2 className="h-5 w-5" />,
    requireAuth: true,
    permission: "suppliers:view",
  },
  {
    path: "/transportes",
    component: TransportPage,
    title: "Transportes",
    icon: <Truck className="h-5 w-5" />,
    requireAuth: true,
    permission: "transports:view",
  },
  {
    path: "/usuarios",
    component: UserPage,
    title: "Usuarios",
    icon: <User className="h-5 w-5" />,
    requireAuth: true,
    permission: "users:view",
  }
];
