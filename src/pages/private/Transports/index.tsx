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

const Transports = () => {
  const { transports, loadingTransports, obtainTransports } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateProps<TransportProps>>(null);

  return (
    <PageContent component={<Button onClick={() => setModal({ mode: ModalStateEnum.BOX })}>Agregar</Button>}>
      <TransportsTable data={transports} loading={loadingTransports} onRecordAction={(mode, data) => setModal({ mode, data })} />

      {modal?.mode === ModalStateEnum.BOX ? (
        <TransportsModal data={modal.data} handleReload={obtainTransports} handleClose={() => setModal(null)} />
      ) : null}

      {modal?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/transports/${modal.data?.id}`} handleClose={() => setModal(null)} handleReload={obtainTransports} />
      ) : null}
    </PageContent>
  );
};

export default Transports;
