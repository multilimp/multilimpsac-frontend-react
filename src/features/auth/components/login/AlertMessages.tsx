
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, AlertTriangleIcon } from "lucide-react";

interface DemoModeAlertProps {
  visible: boolean;
}

export const DemoModeAlert: React.FC<DemoModeAlertProps> = ({ visible }) => {
  if (!visible) return null;
  
  return (
    <Alert className="mb-4 bg-blue-50 text-blue-800 border-blue-200">
      <InfoIcon className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-800">Modo demostración</AlertTitle>
      <AlertDescription className="text-blue-700">
        Puede iniciar sesión con cualquier correo y contraseña para explorar la aplicación.
      </AlertDescription>
    </Alert>
  );
};

interface ConnectionStatusAlertProps {
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

export const ConnectionStatusAlert: React.FC<ConnectionStatusAlertProps> = ({ connectionStatus }) => {
  if (connectionStatus === 'connected') return null;
  
  return (
    <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-200">
      <AlertTriangleIcon className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Problema de conexión</AlertTitle>
      <AlertDescription className="text-amber-700">
        {connectionStatus === 'connecting' 
          ? 'Conectando con el servidor...'
          : 'No se pudo conectar con el servidor. La aplicación funcionará en modo offline.'}
      </AlertDescription>
    </Alert>
  );
};
