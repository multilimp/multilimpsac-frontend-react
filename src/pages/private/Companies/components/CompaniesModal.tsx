import { CompanyProps } from '@/services/companies/company';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

interface CompaniesModalProps {
  data: null | CompanyProps;
  handleClose: VoidFunction;
}

const CompaniesModal = ({ data, handleClose }: CompaniesModalProps) => {
  return (
    <Dialog open fullWidth maxWidth="md" onClose={handleClose}>
      <DialogTitle>{data ? 'Editar' : 'Agregar'} empresa</DialogTitle>
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

export default CompaniesModal;
