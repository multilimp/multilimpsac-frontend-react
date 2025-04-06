
// src/routes/utils/routeDocumentation.ts
import { RouteDefinition } from "@/app/routes/types";
import { RouteDocumentation } from "@/app/routes/types";

/**
 * Generates documentation for a specific route
 * @param route Route definition
 * @returns Route documentation
 */
export const generateRouteDoc = (route: RouteDefinition): RouteDocumentation => {
  return {
    path: route.path,
    title: route.title || route.path,
    description: route.description || "",
    requiresAuth: !!route.requireAuth,
    permissions: route.permission ? [route.permission] : [],
    roles: route.roles || [],
    params: extractPathParams(route.path),
    queries: [],
  };
};

/**
 * Extracts path parameters from a route
 * @param path Route to analyze
 * @returns List of path parameters
 */
const extractPathParams = (path: string) => {
  const params: RouteDocumentation["params"] = [];
  const paramRegex = /:([a-zA-Z0-9_]+)/g;
  let match;

  while ((match = paramRegex.exec(path)) !== null) {
    params.push({
      name: match[1],
      description: `Parámetro ${match[1]} de la ruta`,
      required: true,
      type: "string",
    });
  }

  return params;
};

/**
 * Generates documentation for all routes
 * @param routes List of route definitions
 * @returns Documentation for all routes
 */
export const generateRoutesDocumentation = (
  routes: RouteDefinition[]
): RouteDocumentation[] => {
  const docs: RouteDocumentation[] = [];

  const processRoute = (route: RouteDefinition) => {
    docs.push(generateRouteDoc(route));

    // Process child routes recursively
    if (route.children && route.children.length > 0) {
      route.children.forEach(processRoute);
    }
  };

  routes.forEach(processRoute);
  return docs;
};

/**
 * Exports route documentation to a JSON file
 * @param routes List of route definitions
 * @returns JSON string with documentation
 */
export const exportRoutesDocumentation = (
  routes: RouteDefinition[]
): string => {
  const docs = generateRoutesDocumentation(routes);
  return JSON.stringify(docs, null, 2);
};
