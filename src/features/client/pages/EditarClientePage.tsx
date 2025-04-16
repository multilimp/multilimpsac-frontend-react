
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ClienteForm } from "../components/ClienteForm";
import { useCliente, useUpdateCliente } from "../services/cliente.service";
import { useToast } from "@/hooks/use-toast";
import { Cliente } from "../models/client.model";

export const EditarClientePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: cliente, isLoading, error } = useCliente(id as string);
  const { mutateAsync: updateCliente, isPending: isSubmitting } = useUpdateCliente();
  
  const handleSubmit = async (data: Partial<Cliente>) => {
    if (!id) return;
    
    try {
      await updateCliente(
        { id, data }
      );
      
      toast({
        title: "Cliente actualizado",
        description: "Los datos del cliente han sido actualizados exitosamente.",
      });
      navigate(`/clientes/${id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: error.message || "No se pudo actualizar el cliente. Intente nuevamente.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-6">
        <PageHeader
          title="Editar Cliente"
          description="Cargando datos del cliente..."
          backButton={{
            label: "Volver a clientes",
            onClick: () => navigate("/clientes"),
          }}
        />
        <div className="animate-pulse h-64"></div>
      </div>
    );
  }

  if (error || !cliente) {
    return (
      <div className="flex flex-col space-y-6">
        <PageHeader
          title="Editar Cliente"
          description="Ocurrió un error al cargar los datos del cliente"
          backButton={{
            label: "Volver a clientes",
            onClick: () => navigate("/clientes"),
          }}
        />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error?.message || "No se pudo cargar la información del cliente. Intente nuevamente."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <PageHeader
        title={`Editar Cliente: ${cliente.razonSocial}`}
        description="Actualiza la información del cliente."
        backButton={{
          label: "Volver al cliente",
          onClick: () => navigate(`/clientes/${id}`),
        }}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
          <CardDescription>
            Modifica los datos del cliente. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClienteForm
            initialData={cliente}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};
