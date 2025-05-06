import { Form, notification, Spin } from 'antd';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import InputAntd from '@/components/InputAntd';
import SubmitButton from '@/components/SubmitButton';
import SelectRegions from '@/components/selects/SelectRegions';
import SelectProvinces from '@/components/selects/SelectProvinces';
import SelectDistricts from '@/components/selects/SelectDistricts';
import { ProviderProps } from '@/services/providers/providers';
import { createProvider, updateProvider } from '@/services/providers/providers.request';

interface ProviderModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  provider?: ProviderProps | null;
}

const ProviderModal = ({ visible, onCancel, onSuccess, provider }: ProviderModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!provider) return;
    form.setFieldsValue({
      ruc: provider.ruc,
      razon_social: provider.socialReason,
      departamento: provider.department,
      provincia: provider.province,
      distrito: provider.district,
      direccion: provider.address,
      contactos: provider.contacts?.join(', ')
    });
  }, [provider, form]);

  const handleSubmit = async (body: Record<string, any>) => {
    try {
      setLoading(true);

      // Preparar datos para la API - transformar nombres de campo
      const providerData = {
        ruc: body.ruc,
        socialReason: body.razon_social,
        department: body.departamento,
        province: body.provincia,
        district: body.distrito,
        address: body.direccion,
        // Si hay contactos como string, convertirlos a array
        contacts: body.contactos ? body.contactos.split(',').map((contact: string) => contact.trim()) : []
      };

      if (provider && provider.id) {
        await updateProvider(provider.id, providerData);
      } else {
        await createProvider(providerData as Omit<ProviderProps, 'id'>);
      }

      onSuccess();
      onCancel();
      notification.success({ 
        message: `Proveedor ${provider ? 'actualizado' : 'creado'} correctamente` 
      });
    } catch (error) {
      notification.error({ 
        message: 'No se logró guardar la información del proveedor', 
        description: String(error) 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={visible} fullWidth maxWidth="md">
      <DialogTitle variant="h5" textAlign="center">
        {provider ? 'Editar' : 'Agregar'} proveedor
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
              <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                <Form.Item name="razon_social" rules={[{ required: true, message: 'La razón social es requerida' }]}>
                  <InputAntd label="Razón social" />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                <Form.Item name="contactos">
                  <InputAntd label="Contactos (separados por coma)" />
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
          </Form>
        </Spin>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <SubmitButton form={form} onClick={() => form.submit()} loading={loading}>
          Guardar{provider ? ' cambios' : ''}
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
};

export default ProviderModal;