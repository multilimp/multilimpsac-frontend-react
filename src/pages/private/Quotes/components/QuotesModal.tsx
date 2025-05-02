import { QuoteProps } from '@/services/quotes/quotes';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface QuotesModalProps {
  data: QuoteProps | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const QuotesModal = ({ data, open, onClose, onSuccess }: QuotesModalProps) => {
  const handleSave = () => {
    // Lógica para guardar
    onSuccess?.();
    onClose();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>{data ? 'Editar' : 'Agregar'} cotización</DialogTitle>
      <DialogContent>
        {/* Formulario de cotizaciones */}
        Formulario para {data ? 'editar' : 'crear'} una cotización
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

export default QuotesModal;