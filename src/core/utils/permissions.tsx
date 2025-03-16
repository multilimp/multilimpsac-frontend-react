
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
  const hasPermission = useAuthStore(state => state.hasPermission(permission));

  if (!hasPermission) {
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
