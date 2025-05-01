import { OrderProps } from '@/services/orders/orders';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface OrdersModalProps {
  data: OrderProps | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const OrdersModal = ({ data, open, onClose, onSuccess }: OrdersModalProps) => {
  const handleSave = () => {
    // Lógica para guardar
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>{data ? 'Editar' : 'Agregar'} orden</DialogTitle>
      <DialogContent>
        {/* Formulario de órdenes */}
        Formulario para {data ? 'editar' : 'crear'} una orden
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Guardar{data ? ' cambios' : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrdersModal;