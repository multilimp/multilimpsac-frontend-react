
import PageContent from '@/components/PageContent';
import ClientsTable from './components/ClientsTable';
import { useEffect, useState } from 'react';
import { ClientProps } from '@/services/clients/clients';
import { notification } from 'antd';
import { getClients } from '@/services/clients/clients.request'; 
import { Button } from '@mui/material';
import ClientsModal from './components/ClientsModal';
import { ModalStateEnum } from '@/types/global.enum';

type ModalStateType = {
  mode: ModalStateEnum;
  data: ClientProps | undefined;
} | null;

const ClientsPage = () => {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [modalState, setModalState] = useState<ModalStateType>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await getClients();
      setClients(response);
    } catch (error) {
      notification.error({
        message: 'Error al obtener clientes',
        description: error instanceof Error ? error.message : 'Error desconocido',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenModal = () => {
    setModalState({
      mode: ModalStateEnum.BOX,
      data: undefined
    });
  };

  const handleCloseModal = () => {
    setModalState(null);
  };

  return (
    <PageContent
      title="Clientes"
      helper="DIRECTORIO / CLIENTES"
      component={
        <Button 
          variant="contained" 
          onClick={handleOpenModal}
        >
          Agregar Cliente
        </Button>
      }
    >
      <ClientsTable 
        data={clients} 
        loading={loading} 
      />
      
      {modalState?.mode === ModalStateEnum.BOX && (
        <ClientsModal 
          data={modalState.data} 
          handleClose={handleCloseModal}
          handleReload={fetchClients}
        />
      )}
    </PageContent>
  );
};

export default ClientsPage;
