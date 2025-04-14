
// src/app/routes/config.tsx
import { lazy } from "react";
import { RouteDefinition, RouteGroup } from "./types";
import { directoryRoutes } from "./modules/directoryRoutes";
import { operationsRoutes } from "./modules/operationsRoutes";
import { financeRoutes } from "./modules/financeRoutes";
import { reportRoutes } from "./modules/reportRoutes";
import { adminRoutes } from "./modules/adminRoutes";
import { MainLayout } from "@/layouts";

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
const Dashboard = lazy(() => import("@/features/dashboard/pages/Dashboard"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));

// Ruta principal con layout
const mainRoute: RouteDefinition = {
  path: "/",
  component: MainLayout,
  title: "Principal", // Added missing title property
  requireAuth: true,
  children: [
    {
      path: "",
      component: Dashboard,
      title: "Dashboard",
    },
    {
      path: "perfil",
      component: ProfilePage,
      title: "Perfil",
    },
    {
      path: "configuracion",
      component: SettingsPage,
      title: "Configuración",
    },
    ...directoryRoutes,
    ...operationsRoutes,
    ...financeRoutes,
    ...reportRoutes,
    ...adminRoutes,
  ],
};

export const protectedRoutes: RouteDefinition[] = [mainRoute];

// Agrupar todas las rutas para navegación
export const routeGroups: RouteGroup[] = [
  {
    title: "Principal",
    routes: [
      { 
        path: "/", 
        title: "Dashboard",
        component: Dashboard
      }
    ],
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
];
