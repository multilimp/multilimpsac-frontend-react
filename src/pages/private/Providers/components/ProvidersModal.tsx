import React, { useEffect, useState } from 'react';
import { Form, notification, Spin } from 'antd';
import { ProviderProps } from '@/services/providers/providers';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Typography, Divider, Box } from '@mui/material';
import { createProvider, updateProvider } from '@/services/providers/providers.request';
import InputAntd from '@/components/InputAntd';
import SelectRegions from '@/components/selects/SelectRegions';
import SelectProvinces from '@/components/selects/SelectProvinces';
import SelectDistricts from '@/components/selects/SelectDistricts';
import SubmitButton from '@/components/SubmitButton';
import { EMAIL_PATTERN, PHONE_PATTERN } from '@/utils/constants';

interface ProvidersModalProps {
  data?: ProviderProps;
  handleClose: VoidFunction;
  handleReload: VoidFunction;
}

const ProvidersModal: React.FC<ProvidersModalProps> = ({ data, handleClose, handleReload }) => {
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
      razonSocial: data.razonSocial,
      telefono: data.telefono,
      email: data.email,
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
        razonSocial: values.razonSocial,
        telefono: values.telefono,
        email: values.email,
        departamento: values.departamento, // Guardar el nombre, no el objeto
        provincia: values.provincia,       // Guardar el nombre, no el objeto
        distrito: values.distrito,         // Guardar el nombre, no el objeto
        direccion: values.direccion,
      };

      if (data) {
        await updateProvider(data.id, body);
      } else {
        await createProvider(body);
      }

      notification.success({
        message: 'Proveedor guardado',
        description: `El proveedor se ${data ? 'actualizó' : 'creó'} correctamente.`,
      });

      handleClose();
      handleReload();
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
      notification.error({
        message: 'Error al guardar',
        description: 'No se pudo guardar la información del proveedor.'
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
      {data ? 'Editar' : 'Agregar'} proveedor
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
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
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
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Form.Item name="razonSocial" rules={[{ required: true, message: 'La razón social es requerida' }]}>
                  <InputAntd label="Razón social" />
                </Form.Item>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Sección: Información de Contacto */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
              📞 Información de Contacto
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Form.Item
                  name="telefono"
                  rules={[
                    { min: 7, max: 15, message: 'Ingrese un teléfono o celular válido (7-15 dígitos)' },
                    { pattern: PHONE_PATTERN, message: 'Ingrese un teléfono o celular válido' },
                  ]}
                >
                  <InputAntd label="Tel / Cel" />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Form.Item name="email" rules={[{ pattern: EMAIL_PATTERN, message: 'Ingrese un correo electrónico válido' }]}>
                  <InputAntd label="Correo electrónico" />
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
                <Form.Item name="direccion">
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

export default ProvidersModal;
