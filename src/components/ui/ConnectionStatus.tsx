import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Wifi, WifiOff, AlertCircle, Laptop } from 'lucide-react';
import { cn } from '@/lib/utils';

// Constante para verificar si estamos en modo demo (debe coincidir con la del AuthContext)
const DEMO_MODE = true;

interface ConnectionStatusProps {
  className?: string;
  showText?: boolean;
}

/**
 * Componente que muestra el estado de la conexión a Supabase
 * Útil para mostrar en la barra de navegación o en otras partes de la aplicación
 */
export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  className,
  showText = true
}) => {
  const { connectionStatus } = useAuth();
  
  // Si estamos en modo demo, mostramos un indicador especial
  if (DEMO_MODE) {
    return (
      <div className={cn(
        "flex items-center gap-2 text-blue-600",
        className
      )}>
        <Laptop size={18} />
        {showText && <span className="text-sm font-medium">Modo Demo</span>}
      </div>
    );
  }
  
  return (
    <div className={cn(
      "flex items-center gap-2",
      connectionStatus === 'connected' ? "text-green-600" : 
      connectionStatus === 'disconnected' ? "text-red-600" : 
      "text-yellow-600",
      className
    )}>
      {connectionStatus === 'connected' && (
        <>
          <Wifi size={18} />
          {showText && <span className="text-sm font-medium">Conectado</span>}
        </>
      )}
      
      {connectionStatus === 'disconnected' && (
        <>
          <WifiOff size={18} />
          {showText && <span className="text-sm font-medium">Desconectado</span>}
        </>
      )}
      
      {connectionStatus === 'checking' && (
        <>
          <AlertCircle size={18} className="animate-pulse" />
          {showText && <span className="text-sm font-medium">Verificando...</span>}
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;
