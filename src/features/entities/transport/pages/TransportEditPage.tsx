
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransportForm } from "../components/TransportForm";
import { useToast } from "@/hooks/use-toast";
import { useTransport, useUpdateTransport } from "../services/transport.service";

export const TransportEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: transport, isLoading } = useTransport(id as string);
  const { mutateAsync: updateTransport, isPending: isSubmitting } = useUpdateTransport();
  
  const handleSubmit = async (data: Partial<Transport>) => {
    if (!id) return;
    
    try {
      await updateTransport({
        id,
        data: {
          ...data,
        }
      });
      
      toast({
        title: "Transporte actualizado",
        description: "El transporte ha sido actualizado exitosamente.",
      });
      
      navigate(`/transportes/${id}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: error.message || "No se pudo actualizar el transporte.",
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Cargando transporte" 
          description="Espere mientras cargamos la información..."
          backButton={{
            label: "Volver",
            onClick: () => navigate(-1),
          }}
        />
        <div className="animate-pulse p-6">Cargando...</div>
      </div>
    );
  }
  
  if (!transport) {
    return (
      <div className="container mx-auto py-6">
        <PageHeader 
          title="Transporte no encontrado" 
          description="El transporte solicitado no existe o ha sido eliminado."
          backButton={{
            label: "Volver a transportes",
            onClick: () => navigate("/transportes"),
          }}
        />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <PageHeader 
        title="Editar Transporte" 
        description="Actualiza la información del transporte"
        backButton={{
          label: "Volver a detalles",
          onClick: () => navigate(`/transportes/${id}`),
        }}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Información del Transporte</CardTitle>
          <CardDescription>
            Completa los datos del transporte. Los campos marcados con * son obligatorios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TransportForm 
            transport={transport}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportEditPage;
