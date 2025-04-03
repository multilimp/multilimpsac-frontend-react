
import { ReactNode } from 'react';

export interface RouteDefinition {
  path: string;
  component?: React.ComponentType<any>;
  title: string;
  icon?: ReactNode;
  requireAuth?: boolean;
  permission?: string;
  roles?: string[];
  redirectIfAuthenticated?: boolean;
  children?: RouteDefinition[];
}

export interface RouteGroup {
  title: string;
  routes: RouteDefinition[];
}
