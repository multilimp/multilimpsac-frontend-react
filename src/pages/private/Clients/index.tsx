import { useState } from 'react';
import PageContent from '@/components/PageContent';
import ClientsTable from './components/ClientsTable';
import { Button } from '@mui/material';
import ClientsModal from './components/ClientsModal';
import { ModalStateEnum } from '@/types/global.enum';
import { ClientProps } from '@/services/clients/clients';
import { ModalStateProps } from '@/types/global';
import ConfirmDelete from '@/components/ConfirmDelete';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';
import ContactsDrawer from '@/components/ContactsDrawer';

const ClientsPage = () => {
  const [modalState, setModal] = useState<ModalStateProps<ClientProps>>(null);
  const { clients, loadingClients, obtainClients } = useGlobalInformation();

  const handleCloseModal = () => {
    setModal(null);
  };

  return (
    <PageContent component={<Button onClick={() => setModal({ mode: ModalStateEnum.BOX })}>Agregar</Button>}>
      <ClientsTable data={clients} loading={loadingClients} onRecordAction={(mode, data) => setModal({ mode, data })} />

      {modalState?.mode === ModalStateEnum.BOX && <ClientsModal data={modalState.data} handleClose={handleCloseModal} handleReload={obtainClients} />}

      {modalState?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/clients/${modalState.data?.id}`} handleClose={handleCloseModal} handleReload={obtainClients} />
      ) : null}

      {modalState?.mode === ModalStateEnum.DRAWER ? (
        <ContactsDrawer referenceId={modalState.data?.id!} handleClose={handleCloseModal} tipo={ContactTypeEnum.CLIENTE} />
      ) : null}
    </PageContent>
  );
};

export default ClientsPage;
