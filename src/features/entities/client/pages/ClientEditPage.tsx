import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingFallback } from '@/components/common/LoadingFallback';
import BreadcrumbNav from '@/components/layout/BreadcrumbNav';
import { useCliente, useCreateCliente, useUpdateCliente } from '../services/cliente.service';
import ClientForm from '../components/ClientForm';
import { Client } from '../models/client.model';

const ClientEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNewClient = id === 'new';
  
  const { data: client, isLoading, error } = useCliente(id || '');
  const updateMutation = useUpdateCliente();
  const createMutation = useCreateCliente();
  
  const breadcrumbItems = [
    {
      label: "Clientes",
      path: "/clientes",
    },
    {
      label: isNewClient ? "Nuevo Cliente" : (client?.razonSocial || "Editar"),
      path: isNewClient ? "/clientes/new" : `/clientes/${id}/edit`,
      isCurrentPage: true
    }
  ];
  
  const handleBackClick = () => {
    if (isNewClient) {
      navigate('/clientes');
    } else {
      navigate(`/clientes/${id}`);
    }
  };
  
  const handleFormSubmit = async (data: Partial<Client>) => {
    if (isNewClient) {
      try {
        const newClient = await createMutation.mutateAsync(data);
        navigate(`/clientes/${newClient.id}`);
      } catch (error) {
        console.error("Error creating client:", error);
      }
    } else if (id) {
      try {
        await updateMutation.mutateAsync({ id, data });
        navigate(`/clientes/${id}`);
      } catch (error) {
        console.error("Error updating client:", error);
      }
    }
  };
  
  if (!isNewClient && isLoading) {
    return <LoadingFallback />;
  }
  
  if (!isNewClient && (error || !client)) {
    return (
      <div className="p-4">
        <BreadcrumbNav items={breadcrumbItems} />
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {(error as Error)?.message || "No se pudo cargar el cliente"}</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => navigate('/clientes')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Clientes
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="flex items-center space-x-2 mb-6">
        <Button variant="outline" size="sm" onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {isNewClient ? 'Clientes' : 'Detalles'}
        </Button>
        <h1 className="text-2xl font-bold">
          {isNewClient ? "Nuevo Cliente" : `Editar ${client?.razonSocial}`}
        </h1>
      </div>
      
      <ClientForm
        client={isNewClient ? undefined : client}
        onSubmit={handleFormSubmit}
        onCancel={handleBackClick}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
};

export default ClientEditPage;