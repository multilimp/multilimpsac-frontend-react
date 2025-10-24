import { useState } from 'react';
import PageContent from '@/components/PageContent';
import { Button, Stack } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';
import ConfirmDelete from '@/components/ConfirmDelete';
import { ProviderProps } from '@/services/providers/providers';
import ProvidersTable from './components/ProvidersTable';
import ProvidersModal from './components/ProvidersModal';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import ContactsDrawer from '@/components/ContactsDrawer';
import PagosModal from '@/components/PagosModal';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';

const Providers = () => {
  const { providers, obtainProviders, loadingProviders } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateProps<ProviderProps>>(null);
  const [setSaldosDrawerData] = useState<ProviderProps | null>(null);
  const [pagosModalData, setPagosModalData] = useState<{ open: boolean; entidad: ProviderProps | null }>({
    open: false,
    entidad: null
  });

  const handleClose = () => setModal(null);

  const handleRecordAction = (mode: ModalStateEnum | 'MANAGE_SALDOS' | 'MANAGE_PAGOS', data: ProviderProps) => {
    if (mode === 'MANAGE_SALDOS') {
      // Abrir el drawer de saldos
      setSaldosDrawerData(data);
    } else if (mode === 'MANAGE_PAGOS') {
      // Abrir el modal de pagos
      setPagosModalData({ open: true, entidad: data });
    } else {
      setModal({ mode, data });
    }
  };

  return (
    <PageContent>
      <Stack direction="row" spacing={1} justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          onClick={() => setModal({ mode: ModalStateEnum.BOX })}
          sx={{
            backgroundColor: '#161e2a',
            '&:hover': {
              backgroundColor: '#1e2936'
            }
          }}
        >
          Agregar Proveedor
        </Button>
      </Stack>
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

      {/* Modal de pagos */}
      <PagosModal
        open={pagosModalData.open}
        onClose={() => setPagosModalData({ open: false, entidad: null })}
        entidadId={pagosModalData.entidad?.id || 0}
        tipoEntidad="PROVEEDOR"
        entidadNombre={pagosModalData.entidad?.razonSocial || ''}
        onSuccess={() => {
          // Aquí podrías recargar datos si es necesario
          console.log('Pago registrado para proveedor:', pagosModalData.entidad?.id);
        }}
      />
    </PageContent>
  );
};

export default Providers;
