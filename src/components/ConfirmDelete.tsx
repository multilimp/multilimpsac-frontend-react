import { useState } from 'react';
import { Dialog, DialogTitle, Typography, DialogContent, DialogActions, FormHelperText, Divider, Button } from '@mui/material';
import { Close, Delete } from '@mui/icons-material';
import { notification } from 'antd';
import apiClient from '@/services/apiClient';

interface PropsModalConfirmDelete {
  handleClose: VoidFunction;
  endpoint: string;
  handleReload: VoidFunction;
  title?: string;
  subtitle?: string;
  content?: string;
}

const ConfirmDelete = ({ endpoint, handleClose, content, handleReload, subtitle, title }: PropsModalConfirmDelete) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);

      await apiClient.delete(endpoint);

      notification.success({ message: 'El registro se eliminó correctamente' });

      handleReload();
      handleClose();
    } catch (error: any) {
      const message = error.response?.data?.message;
      notification.error({
        message: 'No se pudo finalizar la transacción',
        description: message ?? `Ocurrió un error inesperado. ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open fullWidth maxWidth="xs">
      <DialogTitle>
        <Typography align="center" variant="h5" component="p" fontWeight={700}>
          {title ?? 'CONFIRMAR ELIMINACIÓN'}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom align="center">
          <b>{subtitle ?? '¿Seguro que desea eliminar este registro?'}</b>
        </Typography>

        <Typography variant="body2" color="text.secondary" align="justify">
          {content ?? 'Recuerda que después de realizar esta operación, el registro ya no estará disponible.'}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <FormHelperText sx={{ textAlign: 'justify' }}>
          Para continuar, dale click al botón CONFIRMAR para proceder con la eliminación. Para cancelar, dale click al botón CANCELAR o fuera de esta
          ventana.
        </FormHelperText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose} loading={loading} endIcon={<Close />}>
          CANCELAR
        </Button>
        <Button color="error" onClick={handleDelete} loading={loading} endIcon={<Delete />}>
          CONFIRMAR
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDelete;
