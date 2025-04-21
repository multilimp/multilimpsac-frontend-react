
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ClientService } from '../services/client.service';
import { useQuery } from '@tanstack/react-query';
import { Client } from '../models/client.model';

const ClientPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const {
    data: clients = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['clients'],
    queryFn: ClientService.fetchClients
  });

  const handleAddClient = () => {
    navigate('/clients/new');
  };

  const handleEditClient = (clientId: string) => {
    navigate(`/clients/${clientId}`);
  };

  const handleViewDetails = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleReload = () => {
    refetch();
    toast({
      title: 'Clientes actualizados',
      description: 'La lista de clientes ha sido actualizada'
    });
  };

  if (isLoading) {
    return <div>Cargando clientes...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error al cargar los clientes: {(error as Error).message}</p>
        <Button onClick={handleReload}>Intentar de nuevo</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <Button onClick={handleAddClient}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client: Client) => (
          <div
            key={client.id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleViewDetails(client.id)}
          >
            <h2 className="text-lg font-semibold">{client.name}</h2>
            <p className="text-gray-600">RUC: {client.ruc}</p>
            <p className="text-gray-600 truncate">{client.address}</p>
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClient(client.id);
                }}
              >
                Editar
              </Button>
            </div>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No hay clientes registrados</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={handleAddClient}
          >
            Agregar Primer Cliente
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClientPage;
