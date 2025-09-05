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
import ProviderSaldosDrawer from '@/components/ProviderSaldosDrawer';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';

const Providers = () => {
  const { providers, obtainProviders, loadingProviders } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateProps<ProviderProps>>(null);
  const [saldosDrawerData, setSaldosDrawerData] = useState<ProviderProps | null>(null);

  const handleClose = () => setModal(null);

  const handleRecordAction = (mode: ModalStateEnum | 'MANAGE_SALDOS', data: ProviderProps) => {
    if (mode === 'MANAGE_SALDOS') {
      // Abrir el drawer de saldos
      setSaldosDrawerData(data);
    } else {
      setModal({ mode, data });
    }
  };

  return (
    <PageContent component={<Button onClick={() => setModal({ mode: ModalStateEnum.BOX })}>Agregar</Button>}>
      <ProvidersTable
        data={providers}
        loading={loadingProviders}
        onRecordAction={handleRecordAction}
        onReload={obtainProviders}
      />

      {modal?.mode === ModalStateEnum.BOX ? <ProvidersModal data={modal.data} handleReload={obtainProviders} handleClose={handleClose} /> : null}

      {modal?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/providers/${modal.data?.id}`} handleClose={handleClose} handleReload={obtainProviders} />
      ) : null}

      {modal?.mode === ModalStateEnum.DRAWER ? (
        <ContactsDrawer referenceId={modal.data?.id!} handleClose={handleClose} tipo={ContactTypeEnum.PROVEEDOR} />
      ) : null}

      {/* Drawer de gestión de saldos */}
      {saldosDrawerData && (
        <ProviderSaldosDrawer
          providerId={saldosDrawerData.id}
          providerName={saldosDrawerData.razonSocial}
          handleClose={() => setSaldosDrawerData(null)}
          onSaldoUpdated={() => {
            // Aquí podrías recargar datos si es necesario
            console.log('Saldo actualizado para proveedor:', saldosDrawerData.id);
          }}
        />
      )}
    </PageContent>
  );
};

export default Providers;
