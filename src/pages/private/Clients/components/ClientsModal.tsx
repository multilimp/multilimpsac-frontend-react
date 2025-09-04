import { useEffect, useState } from 'react';
import { Form, notification, Spin } from 'antd';
import InputAntd from '@/components/InputAntd';
import SubmitButton from '@/components/SubmitButton';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Divider, Box } from '@mui/material';
import SelectRegions from '@/components/selects/SelectRegions';
import SelectProvinces from '@/components/selects/SelectProvinces';
import SelectDistricts from '@/components/selects/SelectDistricts';
import { postClient, putClient } from '@/services/clients/client.requests';
import { ClientProps } from '@/services/clients/clients';

interface ClientsModalProps {
  data?: ClientProps;
  handleClose: VoidFunction;
  handleReload: VoidFunction;
}

const ClientsModal = ({ data, handleClose, handleReload }: ClientsModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) {
      form.setFieldsValue({
        departamento: '',
        provincia: '',
        distrito: '',
        departamentoId: null,
        provinciaId: null,
        distritoId: null,
      });
      return;
    }
    form.setFieldsValue({
      ruc: data.ruc,
      razon_social: data.razonSocial,
      cod_unidad: data.codigoUnidadEjecutora,
      departamento: data.departamento || '', // Leer como string directo
      provincia: data.provincia || '',       // Leer como string directo
      distrito: data.distrito || '',         // Leer como string directo
      direccion: data.direccion,
      departamentoId: null, // No necesitamos IDs para guardar
      provinciaId: null,
      distritoId: null,
    });
  }, [data]);

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      setLoading(true);

      // Preparar datos para el backend con nombres de ubicación
      const body = {
        ruc: values.ruc,
        razon_social: values.razon_social,
        cod_unidad: values.cod_unidad,
        telefono: values.telefono,
        email: values.email,
        departamento: values.departamento, // Guardar el nombre, no el objeto
        provincia: values.provincia,       // Guardar el nombre, no el objeto
        distrito: values.distrito,         // Guardar el nombre, no el objeto
        direccion: values.direccion,
      };

      if (data) {
        await putClient(data.id, body);
      } else {
        await postClient(body);
      }

      notification.success({
        message: 'Cliente guardado',
        description: `El cliente se ${data ? 'actualizó' : 'creó'} correctamente.`,
      });

      handleClose();
      handleReload();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      notification.error({
        message: 'Error al guardar',
        description: 'No se pudo guardar la información del cliente.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (<Dialog
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
    <DialogTitle variant="h5" textAlign="center">
      {data ? 'Editar' : 'Agregar'} cliente
    </DialogTitle>
    <DialogContent sx={{ padding: 2 }}>
      <Spin spinning={loading}>
        <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: 8 }} autoComplete="off">

          {/* Sección: Información Básica */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
              📋 Información Básica
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item
                  name="ruc"
                  rules={[
                    { required: true, message: 'El RUC es requerido' },
                    { len: 11, message: 'Ingrese un RUC válido de 11 dígitos' },
                    { pattern: /^\d+$/, message: 'El RUC debe contener solo números' },
                  ]}
                >
                  <InputAntd label="RUC" />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="razon_social" rules={[{ required: true, message: 'La razón social es requerida' }]}>
                  <InputAntd label="Razón social" />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="cod_unidad" rules={[{ required: true, message: 'El código de unidad es requerido' }]}>
                  <InputAntd label="Código de unidad" />
                </Form.Item>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Sección: Ubicación */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
              📍 Ubicación
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="departamento">
                  <SelectRegions
                    label="Departamento"
                    onChange={(value, record: any) => {
                      const departamentoName = record?.optiondata?.name || '';
                      form.setFieldsValue({
                        departamento: departamentoName,
                        departamentoId: value,
                        provincia: null,
                        provinciaId: null,
                        distrito: null,
                        distritoId: null,
                      });
                    }}
                  />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => (
                    <Form.Item name="provincia">
                      <SelectProvinces
                        label="Provincia"
                        regionId={getFieldValue('departamentoId')}
                        onChange={(value, record: any) => {
                          const provinciaName = record?.optiondata?.name || '';
                          form.setFieldsValue({
                            provincia: provinciaName,
                            provinciaId: value,
                            distrito: null,
                            distritoId: null,
                          });
                        }}
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => (
                    <Form.Item name="distrito">
                      <SelectDistricts
                        label="Distrito"
                        provinceId={getFieldValue('provinciaId')}
                        onChange={(value, record: any) => {
                          const distritoName = record?.optiondata?.name || '';
                          form.setFieldsValue({
                            distrito: distritoName,
                            distritoId: value,
                          });
                        }}
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </Grid>
              <Grid size={12}>
                <Form.Item name="direccion" rules={[{ required: true, message: 'La dirección es requerida' }]}>
                  <InputAntd label="Dirección" />
                </Form.Item>
              </Grid>
            </Grid>
          </Box>

          {/* Campos ocultos para los IDs de ubicación */}
          <Form.Item name="departamentoId" noStyle />
          <Form.Item name="provinciaId" noStyle />
          <Form.Item name="distritoId" noStyle />

          <Button className="d-none" type="submit">
            SUBMIT
          </Button>
        </Form>
      </Spin>
    </DialogContent>
    <DialogActions>
      <Button variant="outlined" color="error" onClick={handleClose} disabled={loading}>
        Cancelar
      </Button>
      <SubmitButton form={form} onClick={() => form.submit()} loading={loading}>
        Guardar{data ? ' cambios' : ''}
      </SubmitButton>
    </DialogActions>
  </Dialog>
  );
};

export default ClientsModal;
