import React from "react";
import { useAuthStore } from "@/store/authStore";

interface RequirePermissionProps {
  permission: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const RequirePermission: React.FC<RequirePermissionProps> = ({
  permission,
  children,
  fallback = <AccessDenied />
}) => {
  // Primero obtenemos la función y el estado de carga
  const hasPermissionFn = useAuthStore(state => state.hasPermission);
  const isLoading = useAuthStore(state => state.isLoading);
  
  // Mostramos un loader mientras se está cargando
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse text-multilimp-green">Cargando...</div>
      </div>
    );
  }

  // Ahora llamamos a la función de forma segura
  if (!hasPermissionFn(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

const AccessDenied = () => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-md">
    <h3 className="text-red-800 font-medium">Acceso denegado</h3>
    <p className="text-red-600 text-sm">No tiene permisos para acceder a esta sección.</p>
  </div>
);