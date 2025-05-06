import { Form, notification, Spin, Select } from 'antd';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import InputAntd from '@/components/InputAntd';
import SubmitButton from '@/components/SubmitButton';
import SelectRegions from '@/components/selects/SelectRegions';
import SelectProvinces from '@/components/selects/SelectProvinces';
import SelectDistricts from '@/components/selects/SelectDistricts';
import { TransportProps } from '@/services/transports/transports';

const { Option } = Select;

interface TransportModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: TransportProps) => Promise<void>;
  transport?: TransportProps | null;
}

const coverageOptions: string[] = ['Nacional', 'Regional', 'Local', 'Internacional'];

const TransportModal = ({ visible, onCancel, onSave, transport }: TransportModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!transport) return;
    form.setFieldsValue({
      ruc: transport.ruc,
      razon_social: transport.socialReason,
      contactos: transport.contacts?.join(', '),
      cobertura: transport.coverage,
      departamento: transport.department,
      provincia: transport.province,
      distrito: transport.district,
      direccion: transport.address,
    });
  }, [transport, form]);

  const handleSubmit = async (body: Record<string, any>) => {
    try {
      setLoading(true);

      // Preparar datos para la API
      const transportData: TransportProps = {
        id: transport?.id || '',
        ruc: body.ruc,
        socialReason: body.razon_social,
        contacts: body.contactos ? body.contactos.split(',').map((contact: string) => contact.trim()) : [],
        coverage: body.cobertura || [],
        department: body.departamento,
        province: body.provincia,
        district: body.distrito,
        address: body.direccion,
      };

      await onSave(transportData);
      onCancel();
      notification.success({ 
        message: `Transporte ${transport ? 'actualizado' : 'creado'} correctamente` 
      });
    } catch (error) {
      notification.error({ 
        message: 'No se logró guardar la información del transporte', 
        description: String(error) 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={visible} fullWidth maxWidth="md">
      <DialogTitle variant="h5" textAlign="center">
        {transport ? 'Editar' : 'Agregar'} transporte
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
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Form.Item name="contactos" rules={[{ required: true, message: 'Al menos un contacto es requerido' }]}>
                  <InputAntd label="Contactos (separados por coma)" placeholder="ejemplo@correo.com, 999888777" />
                </Form.Item>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                <Form.Item name="cobertura" rules={[{ required: true, message: 'La cobertura es requerida' }]}>
                  <Select 
                    mode="multiple" 
                    placeholder="Seleccione cobertura"
                    style={{ width: '100%' }}
                  >
                    {coverageOptions.map((option: string) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                  </Select>
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
                  <InputAntd label="Dirección" multiline rows={3} />
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
          Guardar{transport ? ' cambios' : ''}
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
};

export default TransportModal;