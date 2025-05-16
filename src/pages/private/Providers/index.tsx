import { useState } from 'react';
import PageContent from '@/components/PageContent';
import { Button } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';
import ConfirmDelete from '@/components/ConfirmDelete';
import { ProviderProps } from '@/services/providers/providers';
import ProvidersTable from './components/ProvidersTable';
import ProvidersModal from './components/ProvidersModal';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';

const Providers = () => {
  const { providers, obtainProviders, loadingProviders } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateProps<ProviderProps>>(null);

  return (
    <PageContent component={<Button onClick={() => setModal({ mode: ModalStateEnum.BOX })}>Agregar</Button>}>
      <ProvidersTable data={providers} loading={loadingProviders} onRecordAction={(mode, data) => setModal({ mode, data })} />

      {modal?.mode === ModalStateEnum.BOX ? (
        <ProvidersModal data={modal.data} handleReload={obtainProviders} handleClose={() => setModal(null)} />
      ) : null}

      {modal?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/providers/${modal.data?.id}`} handleClose={() => setModal(null)} handleReload={obtainProviders} />
      ) : null}
    </PageContent>
  );
};

export default Providers;
