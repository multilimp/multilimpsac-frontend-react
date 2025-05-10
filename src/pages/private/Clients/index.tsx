
import { useState } from 'react';
import PageContent from '@/components/PageContent';
import ClientsTable from './components/ClientsTable';
import { Button } from '@mui/material';
import ClientsModal from './components/ClientsModal';
import { ModalStateEnum } from '@/types/global.enum';
import { ClientProps } from '@/services/clients/clients';
import { ModalStateProps } from '@/types/global';
import ConfirmDelete from '@/components/ConfirmDelete';
import useClients from '@/hooks/useClients';

const ClientsPage = () => {
  const [modalState, setModalState] = useState<ModalStateProps<ClientProps>>(null);
  const { clients, loadingClients, obtainClients } = useClients();

  const handleOpenModal = () => {
    setModalState({
      mode: ModalStateEnum.BOX,
      data: undefined,
    });
  };

  const handleCloseModal = () => {
    setModalState(null);
  };

  return (
    <PageContent
      component={
        <Button variant="contained" onClick={handleOpenModal}>
          Agregar Cliente
        </Button>
      }
    >
      <ClientsTable data={clients} loading={loadingClients} onRecordAction={(mode, data) => setModalState({ mode, data })} />

      {modalState?.mode === ModalStateEnum.BOX && <ClientsModal data={modalState.data} handleClose={handleCloseModal} handleReload={obtainClients} />}

      {modalState?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/clients/${modalState.data?.id}`} handleClose={handleCloseModal} handleReload={obtainClients} />
      ) : null}
    </PageContent>
  );
};

export default ClientsPage;
