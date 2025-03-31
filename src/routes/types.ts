// src/routes/types.ts
import { LucideIcon } from "lucide-react";

export interface RouteDefinition {
  path: string;
  component: React.LazyExoticComponent<any>;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  requireAuth?: boolean;
  permission?: string;
  redirectIfAuthenticated?: boolean;
  layout?: string;
  children?: RouteDefinition[];
  // Metadatos adicionales
  breadcrumb?: string;
  roles?: string[];
  isVisible?: boolean; // Para ocultar rutas del menú pero mantenerlas accesibles
  tags?: string[]; // Para categorización y búsqueda
  priority?: number; // Para ordenar en la navegación
}

export type RouteGroup = {
  title: string;
  routes: RouteDefinition[];
  icon?: React.ReactNode;
  expanded?: boolean; // Para controlar el estado de expansión en el menú
};

// Tipos para la documentación de rutas
export interface RouteDocumentation {
  path: string;
  title: string;
  description?: string;
  requiresAuth: boolean;
  permissions?: string[];
  roles?: string[];
  params?: RouteParam[];
  queries?: RouteQuery[];
}

export interface RouteParam {
  name: string;
  description: string;
  required: boolean;
  type: string;
}

export interface RouteQuery {
  name: string;
  description: string;
  required: boolean;
  type: string;
}