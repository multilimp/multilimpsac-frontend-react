import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useGlobalInformation } from '@/context/GlobalInformationProvider';
import TransportsTable from './TransportsTable';
import { TransportProps } from '@/services/transports/transports';

interface TransportSelectorModalProps {
    onSelected: (transport: TransportProps) => void;
    onClose: VoidFunction;
}

const TransportSelectorModal = ({ onSelected, onClose }: TransportSelectorModalProps) => {
    const { transports, loadingTransports } = useGlobalInformation();

    return (
        <Dialog
            open
            fullWidth
            maxWidth="lg"
            onClose={onClose}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pb: 1
                }}
            >
                Seleccionar Empresa de Transporte
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
                <TransportsTable
                    data={transports}
                    loading={loadingTransports}
                    onRecordAction={(_, data) => {
                        onSelected(data);
                        onClose();
                    }}
                    hideActions
                    modalMode
                />
            </DialogContent>
        </Dialog>
    );
};

export default TransportSelectorModal;
