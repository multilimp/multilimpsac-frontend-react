import { SaleProps } from '@/services/sales/sales';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface SalesModalProps {
  data: SaleProps | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SalesModal = ({ data, open, onClose, onSuccess }: SalesModalProps) => {
  const handleSave = () => {
    // Lógica para guardar
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>{data ? 'Editar' : 'Agregar'} venta</DialogTitle>
      <DialogContent>
        {/* Formulario de ventas */}
        Formulario para {data ? 'editar' : 'crear'} una venta
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

export default SalesModal;