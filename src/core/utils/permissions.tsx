// src/core/utils/permissions.tsx
import React from "react";
import { useAuthStore } from "@/store/authStore";

// Constante para habilitar/deshabilitar el modo demo
const DEMO_MODE = true;

interface RequirePermissionProps {
  permission: string;
  roles?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({
  permission,
  roles,
  children,
  fallback = <AccessDenied />
}) => {
  // En modo demo, siempre permitir acceso sin verificar nada
  if (DEMO_MODE) {
    return <>{children}</>;
  }
  
  // Modo permisivo: siempre permitir acceso si el usuario está autenticado
  // independientemente de los permisos o roles específicos
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  
  // Mostramos un loader mientras se está cargando
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-multilimp-green border-t-transparent"></div>
          <span className="text-multilimp-green">Verificando permisos...</span>
        </div>
      </div>
    );
  }

  // En modo permisivo, solo verificamos que el usuario esté autenticado
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Siempre permitir acceso si está autenticado (modo permisivo)
  return <>{children}</>;
};

const AccessDenied = () => (
  <div className="p-6 bg-red-50 border border-red-200 rounded-md shadow-sm">
    <div className="flex items-start gap-3">
      <div className="text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>
      <div>
        <h3 className="text-red-800 font-medium text-lg">Acceso denegado</h3>
        <p className="text-red-600 mt-1">Debe iniciar sesión para acceder a esta sección.</p>
        <button 
          onClick={() => window.location.href = "/login"} 
          className="mt-3 px-3 py-1.5 bg-white border border-red-300 text-red-700 rounded hover:bg-red-50 text-sm transition-colors"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  </div>
);