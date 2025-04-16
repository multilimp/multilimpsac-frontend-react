
import { ReactNode } from 'react';

/**
 * Core route definition interface with domain-focused properties
 */
export interface RouteDefinition {
  path: string;
  component?: React.ComponentType<any>;
  title: string;
  description?: string;
  icon?: ReactNode;
  requireAuth?: boolean;
  permission?: string;
  roles?: string[];
  redirectIfAuthenticated?: boolean;
  children?: RouteDefinition[];
  breadcrumb?: string;
  hideInMenu?: boolean;
  
  // Domain-specific metadata
  domain?: 'company' | 'client' | 'supplier' | 'transport' | 'admin' | 'operation' | 'finance' | 'report';
  entityType?: string;
  action?: 'list' | 'detail' | 'create' | 'edit' | 'delete';
}

/**
 * Grouped routes by domain area
 */
export interface RouteGroup {
  title: string;
  routes: RouteDefinition[];
  domain?: string;
  description?: string;
}

/**
 * Domain-specific route configuration
 */
export interface DomainRouteConfig {
  basePath: string;
  entityName: string;
  permission: string;
  icon: ReactNode;
  routes: {
    list: RouteDefinition;
    detail?: RouteDefinition;
    create?: RouteDefinition;
    edit?: RouteDefinition;
  };
}

/**
 * Route documentation interface
 */
export interface RouteDocumentation {
  path: string;
  title: string;
  description: string;
  requiresAuth: boolean;
  permissions: string[];
  roles: string[];
  params: {
    name: string;
    description: string;
    required: boolean;
    type: string;
  }[];
  queries: {
    name: string;
    description: string;
    required: boolean;
    type: string;
  }[];
}
