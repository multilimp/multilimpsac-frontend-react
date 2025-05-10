
// src/pages/Orders/components/OrdersModal.tsx
import { useEffect, useState } from 'react';
import { Form, notification, Spin } from 'antd';
import InputAntd from '@/components/InputAntd';
import SubmitButton from '@/components/SubmitButton';
import { OrderProps } from '@/services/orders/orders';
import { createOrder, updateOrder } from '@/services/orders/orders.request'; // <–– orders.request.ts
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
} from '@mui/material';

interface OrdersModalProps {
  data: OrderProps | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const OrdersModal = ({ data, open, onClose, onSuccess }: OrdersModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        codigoVento: data.codigoVento,
        razonSocialCliente: data.razonSocialCliente,
        rucCliente: data.rucCliente,
        rucEmpresa: data.rucEmpresa,
        razonSocialEmpresa: data.razonSocialEmpresa,
        contacto: data.contacto,
        catalogo: data.catalogo,
        fechaRegistro: data.fechaRegistro,
        fechaMaximaEntrega: data.fechaMaximaEntrega,
        montoVenta: data.montoVenta,
        cue: data.cue,
        departamento: data.departamento,
        oce: data.oce,
        ocf: data.ocf,
        fechaEntregaOC: data.fechaEntregaOC,
      });
    } else {
      form.resetFields();
    }
  }, [data, form]);

  const handleSubmit = async (values: Record<string, any>) => {
    try {
      setLoading(true);
      if (data) {
        await updateOrder(data.id, values);
      } else {
        await createOrder(values as Omit<OrderProps, 'id'>);
      }
      notification.success({ message: 'Orden guardada correctamente' });
      onSuccess?.();
      onClose();
    } catch (error) {
      notification.error({
        message: 'No se pudo guardar la orden',
        description: String(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const required = (msg: string) => [{ required: true, message: msg }];

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>{data ? 'Editar' : 'Agregar'} orden</DialogTitle>
      <DialogContent>
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ marginTop: 8 }}
            autoComplete="off"
          >
            <Grid container spacing={2}>
              <Grid xs={12} sm={6} md={4}>
                <Form.Item name="codigoVento" rules={required('Ingrese Código Vento')}>
                  <InputAntd label="Código Vento" />
                </Form.Item>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Form.Item
                  name="razonSocialCliente"
                  rules={required('Ingrese razón social cliente')}
                >
                  <InputAntd label="Razón social cliente" />
                </Form.Item>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Form.Item name="rucCliente" rules={required('Ingrese RUC cliente')}>
                  <InputAntd label="RUC cliente" />
                </Form.Item>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Form.Item name="rucEmpresa" rules={required('Ingrese RUC empresa')}>
                  <InputAntd label="RUC empresa" />
                </Form.Item>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Form.Item
                  name="razonSocialEmpresa"
                  rules={required('Ingrese razón social empresa')}
                >
                  <InputAntd label="Razón social empresa" />
                </Form.Item>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Form.Item name="contacto" rules={required('Ingrese contacto')}>
                  <InputAntd label="Contacto" />
                </Form.Item>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Form.Item name="catalogo" rules={required('Ingrese catálogo')}>
                  <InputAntd label="Catálogo" />
                </Form.Item>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Form.Item
                  name="fechaRegistro"
                  rules={required('Seleccione fecha de registro')}
                >
                  <InputAntd label="Fecha registro" type="date" />
                </Form.Item>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Form.Item
                  name="fechaMaximaEntrega"
                  rules={required('Seleccione fecha máxima entrega')}
                >
                  <InputAntd label="Fecha máxima entrega" type="date" />
                </Form.Item>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Form.Item name="montoVenta" rules={required('Ingrese monto de venta')}>
                  <InputAntd label="Monto venta" type="number" />
                </Form.Item>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Form.Item name="cue" rules={required('Ingrese CUE')}>
                  <InputAntd label="CUE" />
                </Form.Item>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Form.Item name="departamento" rules={required('Ingrese departamento')}>
                  <InputAntd label="Departamento" />
                </Form.Item>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Form.Item name="oce" rules={required('Ingrese OCE')}>
                  <InputAntd label="OCE" />
                </Form.Item>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Form.Item name="ocf" rules={required('Ingrese OCF')}>
                  <InputAntd label="OCF" />
                </Form.Item>
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <Form.Item
                  name="fechaEntregaOC"
                  rules={required('Seleccione fecha de entrega OC')}
                >
                  <InputAntd label="Fecha entrega OC" type="date" />
                </Form.Item>
              </Grid>
            </Grid>
            {/* Hidden submit to allow Enter key */}
            <Button className="d-none" type="submit">
              Submit
            </Button>
          </Form>
        </Spin>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <SubmitButton form={form} onClick={() => form.submit()} loading={loading}>
          {data ? 'Guardar cambios' : 'Guardar'}
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
};

export default OrdersModal;
