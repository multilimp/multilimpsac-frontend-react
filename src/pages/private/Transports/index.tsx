import PageContent from '@/components/PageContent';
import { useState } from 'react';
import { Button } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';
import ConfirmDelete from '@/components/ConfirmDelete';
import TransportsTable from './components/TransportsTable';
import TransportsModal from './components/TransportsModal';
import { TransportProps } from '@/services/transports/transports';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import ContactsDrawer from '@/components/ContactsDrawer';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';

const Transports = () => {
  const { transports, loadingTransports, obtainTransports } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateProps<TransportProps>>(null);

  const handleClose = () => setModal(null);

  return (
    <PageContent component={<Button onClick={() => setModal({ mode: ModalStateEnum.BOX })}>Agregar</Button>}>
      <TransportsTable
        data={transports}
        loading={loadingTransports}
        onRecordAction={(mode, data) => setModal({ mode, data })}
        onReload={obtainTransports}
      />

      {modal?.mode === ModalStateEnum.BOX ? <TransportsModal data={modal.data} handleReload={obtainTransports} handleClose={handleClose} /> : null}

      {modal?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/transports/${modal.data?.id}`} handleClose={handleClose} handleReload={obtainTransports} />
      ) : null}

      {modal?.mode === ModalStateEnum.DRAWER ? (
        <ContactsDrawer referenceId={modal.data?.id!} handleClose={handleClose} tipo={ContactTypeEnum.TRANSPORTE} />
      ) : null}
    </PageContent>
  );
};

export default Transports;
