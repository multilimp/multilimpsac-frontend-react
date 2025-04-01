// src/routes/config.tsx
import { lazy } from "react";
import { RouteDefinition, RouteGroup } from "./types";
import { directoryRoutes } from "./modules/directoryRoutes";
import { operationsRoutes } from "./modules/operationsRoutes";
import { financeRoutes } from "./modules/financeRoutes";
import { reportRoutes } from "./modules/reportRoutes";
import { adminRoutes } from "./modules/adminRoutes";

// Rutas públicas
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export const publicRoutes: RouteDefinition[] = [
  {
    path: "/login",
    component: LoginPage,
    title: "Iniciar Sesión",
    redirectIfAuthenticated: true,
  },
  {
    path: "*",
    component: NotFound,
    title: "Página no encontrada",
  },
];

// Rutas protegidas
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));

export const protectedRoutes: RouteDefinition[] = [
  {
    path: "/",
    component: Dashboard,
    title: "Dashboard",
    requireAuth: true,
  },
  {
    path: "/perfil",
    component: ProfilePage,
    title: "Perfil",
    requireAuth: true,
  },
  {
    path: "/configuracion",
    component: SettingsPage,
    title: "Configuración",
    requireAuth: true,
  },
  // ... otras rutas protegidas principales
];

// Agrupar todas las rutas para navegación
export const routeGroups: RouteGroup[] = [
  {
    title: "Principal",
    routes: [{ path: "/", title: "Dashboard" }],
  },
  {
    title: "Directorio",
    routes: directoryRoutes,
  },
  {
    title: "Operaciones",
    routes: operationsRoutes,
  },
  {
    title: "Finanzas",
    routes: financeRoutes,
  },
  {
    title: "Reportes",
    routes: reportRoutes,
  },
  {
    title: "Administración",
    routes: adminRoutes,
  },
];

// Unir todas las rutas para React Router
export const allRoutes: RouteDefinition[] = [
  ...publicRoutes,
  ...protectedRoutes,
  ...directoryRoutes,
  ...operationsRoutes,
  ...financeRoutes,
  ...reportRoutes,
  ...adminRoutes,
];
