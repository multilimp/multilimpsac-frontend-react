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
      departamento: data.departamento?.name || '',
      provincia: data.provincia?.name || '',
      distrito: data.distrito?.name || '',
      direccion: data.direccion,
      departamentoId: data.departamento?.id,
      provinciaId: data.provincia?.id,
      distritoId: data.distrito?.id,
    });
  }, [data]);

  const handleSubmit = async (raw: Record<string, string>) => {
    try {
      setLoading(true);

      const body: Record<string, string | undefined> = {
        ...raw,
        departamento: raw.departamentoId ? JSON.stringify({
          id: raw.departamentoId,
          name: raw.departamento
        }) : undefined,
        provincia: raw.provinciaId ? JSON.stringify({
          id: raw.provinciaId,
          name: raw.provincia
        }) : undefined,
        distrito: raw.distritoId ? JSON.stringify({
          id: raw.distritoId,
          name: raw.distrito
        }) : undefined,
      };

      delete body.departamentoId;
      delete body.provinciaId;
      delete body.distritoId;

      if (data) await updateProvider(data.id, body);
      else await createProvider(body);

      handleClose();
      handleReload();
    } catch (error) {
      notification.error({ message: 'No se logró guardar la información del proveedor', description: String(error) });
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
                <Form.Item name="departamentoId" noStyle />
                <Form.Item name="departamento">
                  <SelectRegions
                    label="Departamento"
                    onChange={(value, record: any) => {
                      const departamentoName = record?.optiondata?.name || '';
                      form.setFieldsValue({
                        departamento: departamentoName,
                        departamentoId: value,
                        provincia: '',
                        provinciaId: null,
                        distrito: '',
                        distritoId: null,
                      });
                    }}
                  />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="provinciaId" noStyle />
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
                            distrito: '',
                            distritoId: null,
                          });
                        }}
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="distritoId" noStyle />
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
