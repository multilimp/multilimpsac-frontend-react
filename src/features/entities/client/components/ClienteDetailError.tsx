
import React from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ClienteDetailErrorProps {
  error: Error | null;
}

const ClienteDetailError: React.FC<ClienteDetailErrorProps> = ({ error }) => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Error al cargar cliente" 
        description="Ocurrió un error al cargar los datos del cliente"
        backButton={{
          label: "Volver a clientes",
          onClick: () => navigate("/clientes"),
        }}
      />
      <Alert variant="destructive" className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error?.message || "No se pudo cargar la información del cliente."}
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ClienteDetailError;
