
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import PageHeader from '@/components/common/PageHeader';
import TransportForm from '../components/TransportForm';
import { useGetTransport, useUpdateTransport } from '../services/transport.service';
import { Transport } from '../models/transport.model';

const TransportEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: transport, isLoading } = useGetTransport(id || '');
  const { mutateAsync: updateTransport, isPending: isSubmitting } = useUpdateTransport();
  
  const [formData, setFormData] = useState<Transport | null>(null);
  
  useEffect(() => {
    if (transport) {
      setFormData(transport);
    }
  }, [transport]);
  
  const handleSubmit = async (data: Partial<Transport>) => {
    if (!id) return;
    
    try {
      // Make sure all required fields are provided
      // Temporary fix: if address is required, we'll ensure it's passed
      const updatedTransport = {
        ...data,
        // Add any required fields here if they're missing
      };
      
      await updateTransport({ id, ...updatedTransport });
      
      toast({
        title: 'Transporte actualizado',
        description: 'Los datos del transporte han sido actualizados exitosamente.',
      });
      
      navigate('/transportes');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error al actualizar',
        description: error instanceof Error 
          ? error.message 
          : 'Ocurrió un error al actualizar el transporte.',
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!formData) {
    return (
      <div className="text-center">
        <p>No se encontró el transporte solicitado.</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Editar Transporte"
        description="Actualiza los datos del transporte"
        backButton={{
          label: "Volver a transportes",
          onClick: () => navigate("/transportes"),
        }}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Información del Transporte</CardTitle>
        </CardHeader>
        <CardContent>
          <TransportForm
            transport={formData}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportEditPage;
