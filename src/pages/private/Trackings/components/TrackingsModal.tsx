import { TrackingProps } from '@/services/trackings/trackings.d';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DatePicker, Form, Input, InputNumber, Select, Switch } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

interface TrackingsModalProps {
  data?: TrackingProps | null;
  open: boolean;
  onClose: () => void;
}

const TrackingsModal = ({ data = null, open, onClose }: TrackingsModalProps) => {
  const [form] = Form.useForm();

  const initialValues = data ? {
    ...data,
    maxDeliveryDate: data.maxDeliveryDate ? dayjs(data.maxDeliveryDate) : null,
    peruPurchasesDate: data.peruPurchasesDate ? dayjs(data.peruPurchasesDate) : null,
    deliveryDateOC: data.deliveryDateOC ? dayjs(data.deliveryDateOC) : null
  } : {};

  return (
    <Dialog open={open} fullWidth maxWidth="xl" onClose={onClose}>
      <DialogTitle>{data ? 'Editar' : 'Agregar'} Seguimiento</DialogTitle>
      <DialogContent dividers>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <Form.Item name="saleId" label="ID Venta" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="clientRuc" label="RUC Cliente" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="companyRuc" label="RUC Empresa" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="companyBusinessName" label="Razón Social Empresa">
              <Input />
            </Form.Item>

            <Form.Item name="clientName" label="Cliente" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="maxDeliveryDate" label="Fecha Máx. Entrega" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="saleAmount" label="Monto Venta" rules={[{ required: true }]}>
              <InputNumber style={{ width: '100%' }} prefix="S/" />
            </Form.Item>

            <Form.Item name="cue" label="CUE">
              <Input />
            </Form.Item>

            <Form.Item name="department" label="Departamento">
              <Input />
            </Form.Item>

            <Form.Item name="oce" label="OCE">
              <Input />
            </Form.Item>

            <Form.Item name="ocf" label="OCF">
              <Input />
            </Form.Item>

            <Form.Item name="peruPurchases" label="Perú Compras" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item name="grr" label="GRR">
              <Input />
            </Form.Item>

            <Form.Item name="invoiceNumber" label="Factura">
              <Input />
            </Form.Item>

            <Form.Item name="isRefact" label="Refact" valuePropName="checked">
              <Switch />
            </Form.Item>

            <Form.Item name="peruPurchasesDate" label="Fecha Perú Compras">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="deliveryDateOC" label="Fecha Entrega OC">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="utility" label="Utilidad (%)">
              <InputNumber min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item name="status" label="Estado" rules={[{ required: true }]}>
              <Select>
                <Option value="pending">Pendiente</Option>
                <Option value="in_progress">En Progreso</Option>
                <Option value="delivered">Entregado</Option>
                <Option value="canceled">Cancelado</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => form.submit()}
        >
          Guardar{data ? ' cambios' : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrackingsModal;