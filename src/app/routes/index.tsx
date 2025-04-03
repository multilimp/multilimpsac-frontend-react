
// src/app/routes/index.tsx
import { Route, Routes } from "react-router-dom";
import { allRoutes } from "./config";
import { RouteDefinition } from "./types";
import { RequireAuth, RedirectIfAuthenticated } from "@/core/utils/guards";
import { RequirePermission } from "@/core/utils/permissions";
import { Suspense, lazy } from "react";
import { LoadingFallback } from "@/components/common/LoadingFallback";
import { ErrorBoundary } from "react-error-boundary";

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

// Recursive function to render routes with protection wrappers
const renderRoutes = (routes: RouteDefinition[]) => {
  return routes.map((route) => {
    // Skip routes without components
    if (!route.component) {
      console.warn(`Route ${route.path} has no component defined. Skipping.`);
      return null;
    }

    // Component with ErrorBoundary and Suspense
    const RouteElement = (
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
        <Suspense fallback={<LoadingFallback />}>
          <route.component />
        </Suspense>
      </ErrorBoundary>
    );

    // Apply protections based on route configuration
    let ProtectedElement = RouteElement;

    if (route.permission) {
      ProtectedElement = (
        <RequireAuth>
          <RequirePermission permission={route.permission} roles={route.roles}>
            {RouteElement}
          </RequirePermission>
        </RequireAuth>
      );
    } else if (route.requireAuth) {
      ProtectedElement = <RequireAuth>{RouteElement}</RequireAuth>;
    } else if (route.redirectIfAuthenticated) {
      ProtectedElement = <RedirectIfAuthenticated>{RouteElement}</RedirectIfAuthenticated>;
    }

    // Render route with children if they exist
    if (route.children && route.children.length > 0) {
      return (
        <Route key={route.path} path={route.path} element={ProtectedElement}>
          {renderRoutes(route.children)}
        </Route>
      );
    }

    // Render route without children
    return <Route key={route.path} path={route.path} element={ProtectedElement} />;
  });
};

export const AppRoutes = () => {
  return <Routes>{renderRoutes(allRoutes)}</Routes>;
};

// Export other route-related utilities
export * from "./config";
export * from "./types";
