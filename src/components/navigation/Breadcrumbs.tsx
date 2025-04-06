
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

  // Find matching route function
  const findMatchingRoute = (
    routes: RouteDefinition[],
    pathname: string,
    parentPath = ""
  ): RouteDefinition | null => {
    for (const route of routes) {
      // Construct the full path
      const fullPath = parentPath ? `${parentPath}${route.path}` : route.path;
      
      // Replace path params with real values
      const pathWithParams = replacePathParams(fullPath, params);
      
      // Check if route matches current path
      if (pathname === pathWithParams || pathname.startsWith(`${pathWithParams}/`)) {
        // If route has children, search in them
        if (route.children && route.children.length > 0) {
          const childMatch = findMatchingRoute(route.children, pathname, pathWithParams);
          if (childMatch) return childMatch;
        }
        return route;
      }
    }
    return null;
  };

  // Replace path params with real values
  const replacePathParams = (path: string, params: Record<string, string>) => {
    let result = path;
    Object.entries(params).forEach(([key, value]) => {
      result = result.replace(`:${key}`, value);
    });
    return result;
  };

  // Generate breadcrumb elements
  const generateBreadcrumbs = (pathname: string): BreadcrumbItem[] => {
    const breadcrumbs: BreadcrumbItem[] = [
      { path: "/", label: "Inicio", isActive: pathname === "/" },
    ];

    if (pathname === "/") return breadcrumbs;

    // Split path into segments
    const segments = pathname.split("/").filter(Boolean);
    let currentPath = "";

    // Generate breadcrumbs for each path segment
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      // Find route definition for this segment
      const matchingRoute = findMatchingRoute(allRoutes, currentPath);
      
      if (matchingRoute) {
        breadcrumbs.push({
          path: currentPath,
          label: matchingRoute.breadcrumb || matchingRoute.title || segment,
          isActive: currentPath === pathname,
        });
      } else {
        // If no route definition exists, use segment as label
        breadcrumbs.push({
          path: currentPath,
          label: segment.charAt(0).toUpperCase() + segment.slice(1),
          isActive: currentPath === pathname,
        });
      }
    });

    return breadcrumbs;
  };

  // Generate breadcrumbs based on current path
  const breadcrumbs = useMemo(() => generateBreadcrumbs(location.pathname), [
    location.pathname,
    params,
  ]);

  // Don't show breadcrumbs on home page
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
