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
import ContactsDrawer from '@/components/ContactsDrawer';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';

const Providers = () => {
  const { providers, obtainProviders, loadingProviders } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateProps<ProviderProps>>(null);

  const handleClose = () => setModal(null);

  return (
    <PageContent component={<Button onClick={() => setModal({ mode: ModalStateEnum.BOX })}>Agregar</Button>}>
      <ProvidersTable
        data={providers}
        loading={loadingProviders}
        onRecordAction={(mode, data) => setModal({ mode, data })}
        onReload={obtainProviders}
      />

      {modal?.mode === ModalStateEnum.BOX ? <ProvidersModal data={modal.data} handleReload={obtainProviders} handleClose={handleClose} /> : null}

      {modal?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/providers/${modal.data?.id}`} handleClose={handleClose} handleReload={obtainProviders} />
      ) : null}

      {modal?.mode === ModalStateEnum.DRAWER ? (
        <ContactsDrawer referenceId={modal.data?.id!} handleClose={handleClose} tipo={ContactTypeEnum.PROVEEDOR} />
      ) : null}
    </PageContent>
  );
};

export default Providers;
