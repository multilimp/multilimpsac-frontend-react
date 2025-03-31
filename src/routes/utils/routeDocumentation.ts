// src/routes/utils/routeDocumentation.ts
import { RouteDefinition, RouteDocumentation } from "../types";

/**
 * Genera documentación para una ruta específica
 * @param route Definición de la ruta
 * @returns Documentación de la ruta
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
 * Extrae los parámetros de ruta de una ruta
 * @param path Ruta a analizar
 * @returns Lista de parámetros de ruta
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
 * Genera documentación para todas las rutas
 * @param routes Lista de definiciones de rutas
 * @returns Documentación de todas las rutas
 */
export const generateRoutesDocumentation = (
  routes: RouteDefinition[]
): RouteDocumentation[] => {
  const docs: RouteDocumentation[] = [];

  const processRoute = (route: RouteDefinition) => {
    docs.push(generateRouteDoc(route));

    // Procesar rutas hijas recursivamente
    if (route.children && route.children.length > 0) {
      route.children.forEach(processRoute);
    }
  };

  routes.forEach(processRoute);
  return docs;
};

/**
 * Exporta la documentación de rutas a un archivo JSON
 * @param routes Lista de definiciones de rutas
 * @returns Cadena JSON con la documentación
 */
export const exportRoutesDocumentation = (
  routes: RouteDefinition[]
): string => {
  const docs = generateRoutesDocumentation(routes);
  return JSON.stringify(docs, null, 2);
};
