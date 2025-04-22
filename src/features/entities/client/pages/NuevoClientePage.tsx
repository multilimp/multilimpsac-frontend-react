
import React from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClienteForm } from "../components/ClienteForm";
import { useCreateCliente } from "../services/client.service";
import { useToast } from "@/hooks/use-toast";
import { Cliente } from "../models/client.model";

export const NuevoClientePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { mutateAsync: createCliente, isPending: isSubmitting } = useCreateCliente();
  
  const handleSubmit = async (data: Partial<Cliente>) => {
    try {
      // Ensure estado is set to true for new clients
      const clienteData = {
        ...data,
        estado: true // Setting estado explicitly as it's required
      };
      
      await createCliente(clienteData);
      
      toast({
        title: "Cliente creado",
        description: "El cliente ha sido creado exitosamente.",
      });
      navigate("/clientes");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al crear",
        description: error.message || "No se pudo crear el cliente. Intente nuevamente.",
      });
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <PageHeader 
        title="Nuevo Cliente" 
        description="Crea un nuevo cliente en el sistema."
        backButton={{
          label: "Volver a clientes",
          onClick: () => navigate("/clientes"),
        }}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Información del Cliente</CardTitle>
          <CardDescription>
            Completa los datos del nuevo cliente. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClienteForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isNewCliente={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};
