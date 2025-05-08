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
      setClients([...res]);
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
