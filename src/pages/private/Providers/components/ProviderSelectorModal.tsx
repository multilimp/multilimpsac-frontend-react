import { Dialog, DialogContent } from '@mui/material';
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
    <Dialog open fullWidth maxWidth="md">
      <DialogContent>
        <ProvidersTable
          data={providers}
          loading={loadingProviders}
          onRecordAction={(_, data) => {
            onSelected(data);
            onClose();
          }}
          hideActions
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProviderSelectorModal;
