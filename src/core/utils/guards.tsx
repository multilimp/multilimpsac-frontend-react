import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading, connectionStatus } = useAuth();
  const location = useLocation();

  // Si está cargando, mostrar un indicador de carga más atractivo
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-multilimp-green mb-4" />
        <p className="text-multilimp-navy text-lg font-medium">Verificando autenticación...</p>
      </div>
    );
  }

  // Si hay problemas de conexión, mostrar un mensaje informativo
  if (connectionStatus === 'disconnected') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full shadow-sm">
          <h2 className="text-red-800 text-xl font-semibold mb-3">Problema de conexión</h2>
          <p className="text-red-700 mb-4">
            No se pudo conectar al servidor de autenticación. Verifica tu conexión a internet e intenta nuevamente.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Modo permisivo: solo verificar si está autenticado
  if (!isAuthenticated) {
    // Guardar la ubicación actual para redirigir después del inicio de sesión
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const RedirectIfAuthenticated = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading, connectionStatus } = useAuth();
  
  // Si está cargando, mostrar un indicador de carga más atractivo
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-multilimp-green mb-4" />
        <p className="text-multilimp-navy text-lg font-medium">Verificando sesión...</p>
      </div>
    );
  }

  // Si hay problemas de conexión, permitir continuar al componente hijo
  // ya que este es un guardia para páginas públicas como login
  if (connectionStatus === 'disconnected') {
    return children;
  }

  // Si está autenticado, redirigir al dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};
