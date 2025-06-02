import React, { useEffect, useState } from 'react';
import { Form, notification, Spin } from 'antd';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import InputAntd from '@/components/InputAntd';
import SubmitButton from '@/components/SubmitButton';
import { createCatalog, updateCatalog } from '@/services/catalogs/catalogs.requests';
import { CatalogProps } from '@/services/catalogs/catalogs';

interface CatalogsModalProps {
  data?: CatalogProps;
  handleClose: VoidFunction;
  handleReload: VoidFunction;
  companyId: number;
}

const CatalogsModal: React.FC<CatalogsModalProps> = ({ data, handleClose, handleReload, companyId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;

    form.setFieldsValue({
      nombre: data.nombre,
      descripcion: data.descripcion,
    });
  }, [data, form]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const catalogData = {
        ...values,
        empresaId: companyId,
      };

      if (data) {
        await updateCatalog(data.id, catalogData);
        notification.success({ message: 'Catálogo actualizado correctamente' });
      } else {
        await createCatalog(catalogData);
        notification.success({ message: 'Catálogo creado correctamente' });
      }

      handleClose();
      handleReload();
    } catch (error) {
      notification.error({
        message: 'Error al guardar el catálogo',
        description: `Detalles: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (    <Dialog 
      open 
      fullWidth 
      maxWidth="md"
      sx={{
        zIndex: 1300, // Más alto que el sidebar (1200)
        '& .MuiDialog-paper': {
          zIndex: 1300,
        },
        '& .MuiBackdrop-root': {
          zIndex: 1299,
        }
      }}
    >
      <DialogTitle>{data ? 'Editar' : 'Agregar'} Catálogo</DialogTitle>
      <DialogContent>
        <Spin spinning={loading}>
          <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: 16 }}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <Form.Item name="nombre" rules={[{ required: true, message: 'El nombre es requerido' }]}>
                  <InputAntd label="Nombre del Catálogo" />
                </Form.Item>
              </Grid>
              <Grid size={12}>
                <Form.Item name="descripcion" rules={[{ required: true, message: 'La descripción es requerida' }]}>
                  <InputAntd label="Descripción" type="textarea" />
                </Form.Item>
              </Grid>
            </Grid>
          </Form>
        </Spin>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <SubmitButton form={form} onClick={() => form.submit()} loading={loading}>
          {data ? 'Actualizar' : 'Guardar'} Catálogo
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
};

export default CatalogsModal;
