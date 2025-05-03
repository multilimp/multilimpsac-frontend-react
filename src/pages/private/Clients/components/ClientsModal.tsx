import { ClientProps } from '@/services/clients/clients';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface ClientsModalProps {
  data: null | ClientProps;
  handleClose: VoidFunction;
}

const ClientsModal = ({ data, handleClose }: ClientsModalProps) => {
  return (
    <Dialog open fullWidth maxWidth="md" onClose={handleClose}>
      <DialogTitle>{data ? 'Editar' : 'Agregar'} cliente</DialogTitle>
      <DialogContent>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Pariatur, illum repellat esse dolor vitae eveniet tenetur officia, at natus aliquid
        architecto et. Doloremque magni commodi hic recusandae reiciendis possimus rerum?
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary">
          Guardar{data ? ' cambios' : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClientsModal;