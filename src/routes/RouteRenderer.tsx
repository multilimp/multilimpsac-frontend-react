
// src/routes/RouteRenderer.tsx
import { Suspense, Fragment } from "react";
import { Route } from "react-router-dom";
import { RouteDefinition } from "./types";
import { RequireAuth, RedirectIfAuthenticated } from "@/core/utils/guards";
import { RequirePermission } from "@/core/utils/permissions";
import { ErrorBoundary } from "react-error-boundary";

// Componente de carga mejorado con estados
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full min-h-[200px]">
    <div className="flex flex-col items-center gap-2">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-multilimp-green border-t-transparent"></div>
      <div className="text-multilimp-green text-lg">Cargando módulo...</div>
    </div>
  </div>
);

// Componente para manejar errores de carga
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full min-h-[200px] p-4">
    <div className="text-red-600 text-lg font-semibold mb-2">¡Ups! Algo salió mal</div>
    <p className="text-gray-600 mb-4 text-center">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-multilimp-green text-white rounded-md hover:bg-multilimp-green/90 transition-colors"
    >
      Intentar nuevamente
    </button>
  </div>
);

// Función recursiva para renderizar rutas anidadas
const renderRoutes = (routes: RouteDefinition[]) => {
  return routes.map(route => {
    // Si no hay componente definido, saltar esta ruta
    if (!route.component) {
      console.warn(`Route ${route.path} has no component defined. Skipping.`);
      return null;
    }
    
    // Componente con Suspense y ErrorBoundary
    const RouteComponent = (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<LoadingFallback />}>
          <route.component />
        </Suspense>
      </ErrorBoundary>
    );

    // Aplicar protecciones según configuración
    let wrappedComponent = RouteComponent;

    if (route.permission) {
      // Si requiere un permiso específico
      wrappedComponent = (
        <RequireAuth>
          <RequirePermission permission={route.permission} roles={route.roles}>
            {RouteComponent}
          </RequirePermission>
        </RequireAuth>
      );
    } else if (route.requireAuth) {
      // Si solo requiere autenticación
      wrappedComponent = <RequireAuth>{RouteComponent}</RequireAuth>;
    } else if (route.redirectIfAuthenticated) {
      // Si debe redirigir cuando está autenticado (ej: login)
      wrappedComponent = <RedirectIfAuthenticated>{RouteComponent}</RedirectIfAuthenticated>;
    }

    // Si tiene rutas hijas, renderizarlas anidadas
    if (route.children && route.children.length > 0) {
      return (
        <Route key={route.path} path={route.path} element={wrappedComponent}>
          {renderRoutes(route.children)}
        </Route>
      );
    }

    // Ruta sin hijos
    return (
      <Route 
        key={route.path} 
        path={route.path} 
        element={wrappedComponent} 
      />
    );
  }).filter(Boolean); // Filter out null routes (ones without components)
};

// Renderizador de rutas principal
export const RouteRenderer = ({ routes }: { routes: RouteDefinition[] }) => {
  return <Fragment>{renderRoutes(routes)}</Fragment>;
};
