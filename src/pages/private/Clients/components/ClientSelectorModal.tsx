import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import ClientsTable from './ClientsTable';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import { ClientProps } from '@/services/clients/clients';

interface ClientSelectorModalProps {
  onSelected: (client: ClientProps) => void;
  onClose: VoidFunction;
}

const ClientSelectorModal = ({ onSelected, onClose }: ClientSelectorModalProps) => {
  const { clients, loadingClients } = useGlobalInformation();

  return (
    <Dialog
      open
      fullWidth
      maxWidth="lg"
      onClose={onClose} // Permite cerrar haciendo clic fuera del modal
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1
        }}
      >
        Seleccionar Cliente
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'grey.500',
            '&:hover': { color: 'grey.700' }
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: '8px !important' }}>
        <ClientsTable
          data={clients}
          loading={loadingClients}
          onRecordAction={(_, data) => {
            onSelected(data);
            onClose();
          }}
          hideActions
          modalMode // Nueva prop para indicar que está en modo modal
        />
      </DialogContent>
    </Dialog>
  );
};

export default ClientSelectorModal;
