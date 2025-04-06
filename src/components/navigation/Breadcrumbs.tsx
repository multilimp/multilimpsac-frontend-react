
// src/components/navigation/Breadcrumbs.tsx
import React, { useMemo } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { allRoutes } from "@/app/routes/config";
import { RouteDefinition } from "@/app/routes/types";

interface BreadcrumbItem {
  path: string;
  label: string;
  isActive: boolean;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const params = useParams();

  // Función para encontrar la definición de ruta que coincide con la ruta actual
  const findMatchingRoute = (
    routes: RouteDefinition[],
    pathname: string,
    parentPath = ""
  ): RouteDefinition | null => {
    for (const route of routes) {
      // Construir la ruta completa (incluyendo la ruta padre)
      const fullPath = parentPath ? `${parentPath}${route.path}` : route.path;
      
      // Reemplazar parámetros de ruta con sus valores reales
      const pathWithParams = replacePathParams(fullPath, params);
      
      // Verificar si la ruta coincide con la ruta actual
      if (pathname === pathWithParams || pathname.startsWith(`${pathWithParams}/`)) {
        // Si la ruta tiene hijos, buscar en ellos
        if (route.children && route.children.length > 0) {
          const childMatch = findMatchingRoute(route.children, pathname, pathWithParams);
          if (childMatch) return childMatch;
        }
        return route;
      }
    }
    return null;
  };

  // Función para reemplazar los parámetros de ruta con sus valores reales
  const replacePathParams = (path: string, params: Record<string, string>) => {
    let result = path;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`:${key}`, value);
    });
    return result;
  };

  // Función para generar los elementos de breadcrumb
  const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { path: "/", label: "Inicio", isActive: pathname === "/" },
    ];

    if (pathname === "/") return breadcrumbs;

    // Dividir la ruta en segmentos
    const segments = pathname.split("/").filter(Boolean);
    let currentPath = "";

    // Generar breadcrumbs para cada segmento de la ruta
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Buscar la definición de ruta para este segmento
      const matchingRoute = findMatchingRoute(allRoutes, currentPath);
      
      if (matchingRoute) {
        breadcrumbs.push({
          path: currentPath,
          label: matchingRoute.breadcrumb || matchingRoute.title || segment,
          isActive: currentPath === pathname,
        });
      } else {
        // Si no hay una definición de ruta, usar el segmento como etiqueta
        breadcrumbs.push({
          path: currentPath,
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          isActive: currentPath === pathname,
        });
      }
    });

    return breadcrumbs;
  };

  // Generar breadcrumbs basados en la ruta actual
  const breadcrumbs = useMemo(() => generateBreadcrumbs(location.pathname), [
    location.pathname,
    params,
  ]);

  // No mostrar breadcrumbs en la página de inicio
  if (location.pathname === "/") return null;

  return (
    <nav className="flex items-center text-sm text-gray-500 mb-4 px-4 py-2 bg-white rounded-md shadow-sm">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          {index > 0 && (
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          )}
          <div className="flex items-center">
            {index === 0 && (
              <Home className="h-3.5 w-3.5 mr-1 text-multilimp-green" />
            )}
            {breadcrumb.isActive ? (
              <span className="font-medium text-multilimp-green">
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                className="hover:text-multilimp-green transition-colors"
              >
                {breadcrumb.label}
              </Link>
            )}
          </div>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
