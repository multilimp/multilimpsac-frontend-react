import { useEffect, useState } from 'react';
import { Form, notification, Spin } from 'antd';
import InputAntd from '@/components/InputAntd';
import SubmitButton from '@/components/SubmitButton';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import SelectRegions from '@/components/selects/SelectRegions';
import SelectProvinces from '@/components/selects/SelectProvinces';
import SelectDistricts from '@/components/selects/SelectDistricts';
import { ClientProps } from '@/services/clients/client';
import { postClient, putClient } from '@/services/clients/client.requests';

interface ClientsModalProps {
  data?: ClientProps;
  handleClose: VoidFunction;
  handleReload: VoidFunction;
}

const ClientsModal = ({ data, handleClose, handleReload }: ClientsModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    form.setFieldsValue({
      ruc: data.ruc,
      razon_social: data.razon_social,
      cod_unidad: data.cod_unidad,
      departamento: data.departamento,
      provincia: data.provincia,
      distrito: data.distrito,
      direccion: data.direccion,
    });
  }, [data]);

  const handleSubmit = async (body: Record<string, string>) => {
    try {
      setLoading(true);

      if (data) await putClient(data.id, body);
      else await postClient(body);

      handleClose();
      handleReload();
    } catch (error) {
      notification.error({ message: 'No se logró guardar la información del cliente', description: String(error) });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open fullWidth maxWidth="md">
      <DialogTitle variant="h5" textAlign="center">
        {data ? 'Editar' : 'Agregar'} cliente
      </DialogTitle>
      <DialogContent>
        <Spin spinning={loading}>
          <Form form={form} onFinish={handleSubmit} layout="vertical" style={{ marginTop: 8 }} autoComplete="off">
            <Grid container columnSpacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item name="departamento" rules={[{ required: true, message: 'El departamento es requerido' }]}>
                  <SelectRegions
                    label="Departamento"
                    onChange={(value) => form.setFieldsValue({ departamento: value, provincia: null, distrito: null })}
                  />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => (
                    <Form.Item name="provincia" rules={[{ required: true, message: 'La provincia es requerida' }]}>
                      <SelectProvinces
                        label="Provincia"
                        regionId={getFieldValue('departamento')}
                        onChange={(value) => form.setFieldsValue({ provincia: value, distrito: null })}
                      />
                    </Form.Item>
                  )}
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Form.Item noStyle shouldUpdate>
                  {({ getFieldValue }) => (
                    <Form.Item name="distrito" rules={[{ required: true, message: 'El distrito es requerido' }]}>
                      <SelectDistricts label="Distrito" provinceId={getFieldValue('provincia')} />
                    </Form.Item>
                  )}
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Form.Item name="direccion" rules={[{ required: true, message: 'La dirección es requerida' }]}>
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

export default ClientsModal;
