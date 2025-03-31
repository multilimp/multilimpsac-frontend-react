import { lazy } from "react";
import { Shield } from "lucide-react";
import { RouteDefinition } from "../types";

// Lazy load pages
const UsersManagementPage = lazy(() => import("@/features/auth/pages/UsersManagementPage"));

export const adminRoutes: RouteDefinition[] = [
  {
    path: "/admin/usuarios",
    component: UsersManagementPage,
    title: "Gestión de Usuarios",
    icon: <Shield className="h-5 w-5" />,
    requireAuth: true,
    permission: "admin:users:manage",
  }
];
