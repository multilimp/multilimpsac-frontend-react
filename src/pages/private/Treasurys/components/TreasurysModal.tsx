import { TreasurysProps } from '@/services/treasurys/treasurys';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface TreasurysModalProps {
  data?: TreasurysProps | null; // Hacer data opcional
  open: boolean;
  onClose: () => void;
}

const TreasurysModal = ({ data = null, open, onClose }: TreasurysModalProps) => {
  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>{data ? 'Editar' : 'Agregar'} registro de tesorería</DialogTitle>
      <DialogContent>
        Formulario para {data ? 'editar' : 'crear'} un registro
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary">
          Guardar{data ? ' cambios' : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TreasurysModal;