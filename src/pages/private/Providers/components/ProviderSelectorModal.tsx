import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import ProvidersTable from './ProvidersTable';
import { ProviderProps } from '@/services/providers/providers';

interface ProviderSelectorModalProps {
  onSelected: (client: ProviderProps) => void;
  onClose: VoidFunction;
}

const ProviderSelectorModal = ({ onSelected, onClose }: ProviderSelectorModalProps) => {
  const { providers, loadingProviders } = useGlobalInformation();

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
        Seleccionar Proveedor
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
        <ProvidersTable
          data={providers}
          loading={loadingProviders}
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

export default ProviderSelectorModal;
