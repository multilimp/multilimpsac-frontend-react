
import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { getClients } from '@/services/clients/client.requests';
import { ClientProps } from '@/services/clients/clients';

const useClients = () => {
  const [loadingClients, setLoadingClients] = useState(false);
  const [clients, setClients] = useState<Array<ClientProps>>([]);

  useEffect(() => {
    obtainClients();
  }, []);

  const obtainClients = async () => {
    try {
      setLoadingClients(true);
      const res = await getClients();
      // Map API response to match the ClientProps type expected in the component
      const mappedClients = res.map(client => ({
        codigoUnidadEjecutora: client.codigoUnidadEjecutora || '',
        createdAt: client.createdAt,
        direccion: client.direccion,
        departamento: client.departamento,
        provincia: client.provincia,
        distrito: client.distrito,
        email: client.email,
        estado: client.estado,
        id: client.id,
        razonSocial: client.razonSocial,
        ruc: client.ruc,
        telefono: client.telefono,
        updatedAt: client.updatedAt,
      })) as ClientProps[];
      
      setClients(mappedClients);
    } catch (error) {
      notification.error({
        message: 'Error al obtener clientes',
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoadingClients(false);
    }
  };

  return { loadingClients, clients, obtainClients };
};

export default useClients;
