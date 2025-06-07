import { Dialog, DialogContent } from '@mui/material';
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
    <Dialog open fullWidth maxWidth="md">
      <DialogContent>
        <ClientsTable
          data={clients}
          loading={loadingClients}
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

export default ClientSelectorModal;
