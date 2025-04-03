
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { ConnectionStatus } from "@/features/auth";

interface DemoModeAlertProps {
  isActive: boolean;
}

export const DemoModeAlert = ({ isActive }: DemoModeAlertProps) => {
  if (!isActive) return null;
  
  return (
    <Alert className="mb-4 bg-blue-50 border-blue-200 text-blue-800">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-sm">
        Modo demo activado. Use las credenciales pre-llenadas para ingresar.
      </AlertDescription>
    </Alert>
  );
};

interface ConnectionStatusAlertProps {
  status: ConnectionStatus;
}

export const ConnectionStatusAlert = ({ status }: ConnectionStatusAlertProps) => {
  if (status !== 'disconnected') return null;
  
  return (
    <Alert className="mb-4 bg-amber-50 border-amber-200 text-amber-800">
      <Info className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-sm">
        No hay conexión con el servidor. Se usará el modo demo para iniciar sesión.
      </AlertDescription>
    </Alert>
  );
};
