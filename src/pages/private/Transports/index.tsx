import PageContent from '@/components/PageContent';
import { useState } from 'react';
import { Button, Drawer, Box, Stack } from '@mui/material';
import { ModalStateEnum } from '@/types/global.enum';
import { ModalStateProps } from '@/types/global';
import ConfirmDelete from '@/components/ConfirmDelete';
import TransportsTable from './components/TransportsTable';
import TransportsModal from './components/TransportsModal';
import { TransportProps } from '@/services/transports/transports';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import ContactsDrawer from '@/components/ContactsDrawer';
import PagosModal from '@/components/PagosModal';
import { ContactTypeEnum } from '@/services/contacts/contacts.enum';

const Transports = () => {
  const { transports, loadingTransports, obtainTransports } = useGlobalInformation();
  const [modal, setModal] = useState<ModalStateProps<TransportProps>>(null);
  const [pagosModalData, setPagosModalData] = useState<{ open: boolean; entidad: TransportProps | null }>({
    open: false,
    entidad: null
  });

  const handleClose = () => setModal(null);

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
          Agregar Transporte
        </Button>
      </Stack>
      <TransportsTable
        data={transports}
        loading={loadingTransports}
        onRecordAction={(mode, data) => {
          if (mode === 'MANAGE_PAGOS') {
            setPagosModalData({ open: true, entidad: data });
          } else {
            setModal({ mode, data });
          }
        }}
        onReload={obtainTransports}
      />

      {modal?.mode === ModalStateEnum.BOX ? <TransportsModal data={modal.data} handleReload={obtainTransports} handleClose={handleClose} /> : null}

      {modal?.mode === ModalStateEnum.DELETE ? (
        <ConfirmDelete endpoint={`/transports/${modal.data?.id}`} handleClose={handleClose} handleReload={obtainTransports} />
      ) : null}

      {modal?.mode === ModalStateEnum.DRAWER ? (
        <ContactsDrawer referenceId={modal.data?.id!} handleClose={handleClose} tipo={ContactTypeEnum.TRANSPORTE} />
      ) : null}

      {/* Modal de pagos */}
      <PagosModal
        open={pagosModalData.open}
        onClose={() => setPagosModalData({ open: false, entidad: null })}
        entidadId={pagosModalData.entidad?.id || 0}
        tipoEntidad="TRANSPORTE"
        entidadNombre={pagosModalData.entidad?.razonSocial || ''}
        onSuccess={() => {
          // Aquí podrías recargar datos si es necesario
          console.log('Pago registrado para transporte:', pagosModalData.entidad?.id);
        }}
      />
    </PageContent>
  );
};

export default Transports;
