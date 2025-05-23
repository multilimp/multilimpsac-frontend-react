import React, { useEffect, useState } from 'react';
import { Form, notification, Spin } from 'antd';
import { ProviderProps } from '@/services/providers/providers';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
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
    if (!data) return;

    form.setFieldsValue({
      ruc: data.ruc,
      razonSocial: data.razonSocial,
      telefono: data.telefono,
      email: data.email,
      departamentoComplete: data.departamento,
      departamento: data.departamento?.id,
      provinciaComplete: data.provincia,
      provincia: data.provincia?.id,
      distritoComplete: data.distrito,
      distrito: data.distrito?.id,
      direccion: data.direccion,
    });
  }, [data]);

  const handleSubmit = async (raw: Record<string, string>) => {
    try {
      setLoading(true);

      const body: Record<string, string | undefined> = {
        ...raw,
        departamento: raw.departamento ? JSON.stringify(raw.departamentoComplete) : undefined,
        provincia: raw.provincia ? JSON.stringify(raw.provinciaComplete) : undefined,
        distrito: raw.distrito ? JSON.stringify(raw.distritoComplete) : undefined,
      };

      delete body.departamentoComplete;
      delete body.provinciaComplete;
      delete body.distritoComplete;

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

  return (
    <Dialog open fullWidth maxWidth="md">
      <DialogTitle variant="h5" textAlign="center">
        {data ? 'Editar' : 'Agregar'} proveedor
      </DialogTitle>
      <DialogContent>
        <Spin spinning={loading}>
          <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: 8 }} autoComplete="off">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Form.Item
                  name="ruc"
                  rules={[
                    { required: true, message: 'El RUC es requerido' },
                    { len: 11, message: 'Ingrese un RUC válido' },
                  ]}
                >
                  <InputAntd label="RUC" />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Form.Item name="razonSocial" rules={[{ required: true, message: 'La razón social es requerida' }]}>
                  <InputAntd label="Razón social" />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Form.Item
                  name="telefono"
                  rules={[
                    { min: 6, max: 9, message: 'Ingrese un teléfeno o celular válido' },
                    { pattern: PHONE_PATTERN, message: 'Ingrese un teléfono o celular válido' },
                  ]}
                >
                  <InputAntd label="Tel / Cel" />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Form.Item name="email" rules={[{ pattern: EMAIL_PATTERN, message: 'Ingrese un correo electrónico válido' }]}>
                  <InputAntd label="Correo electrónico" />
                </Form.Item>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="departamentoComplete" noStyle />
                <Form.Item name="departamento">
                  <SelectRegions
                    label="Departamento"
                    onChange={(value, record: any) =>
                      form.setFieldsValue({
                        departamento: value,
                        departamentoComplete: record?.optiondata,
                        provincia: null,
                        provinciaComplete: null,
                        distrito: null,
                        distritoComplete: null,
                      })
                    }
                  />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="provinciaComplete" noStyle />
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => (
                    <Form.Item name="provincia">
                      <SelectProvinces
                        label="Provincia"
                        regionId={getFieldValue('departamento')}
                        onChange={(value, record: any) =>
                          form.setFieldsValue({
                            provincia: value,
                            provinciaComplete: record?.optiondata,
                            distrito: null,
                            distritoComplete: null,
                          })
                        }
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="distritoComplete" noStyle />
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => (
                    <Form.Item name="distrito">
                      <SelectDistricts
                        label="Distrito"
                        provinceId={getFieldValue('provincia')}
                        onChange={(value, record: any) =>
                          form.setFieldsValue({
                            distrito: value,
                            distritoComplete: record?.optiondata,
                          })
                        }
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
